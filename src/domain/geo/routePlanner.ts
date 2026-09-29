/**
 * Wave-Aware A* Maritime Route Optimization
 * Computes optimal, hazard-avoiding ocean path considering wave height cost surface
 */

import { LatLng, haversineDistanceKm, simplifyPolyline, initialBearingDeg } from './geoMath';
import { VESSEL_CONFIGS, VesselClass, SeverityLevel } from '../../core/config/safetyThresholds';

export interface RouteLeg {
  from: LatLng;
  to: LatLng;
  distanceKm: number;
  waveHeightM: number;
  gustsKnots: number;
  severity: SeverityLevel;
  bearingDeg: number;
}

export interface OptimizedRoute {
  path: LatLng[];
  totalDistanceKm: number;
  etaHours: number;
  maxWaveHeightM: number;
  maxGustsKnots: number;
  overallSeverity: SeverityLevel;
  legs: RouteLeg[];
  isPossible: boolean;
  explanation: string;
  recheckIntervalMinutes: number;
}

interface GridNode {
  r: number;
  c: number;
  lat: number;
  lng: number;
  wave: number; // meters
  isBlocked: boolean;
  g: number;
  h: number;
  f: number;
  parent?: GridNode;
}

/**
 * Plans a wave-aware safe route from origin to destination
 */
export function planSafeRoute(
  origin: LatLng,
  destination: LatLng,
  vessel: VesselClass,
  waveFieldResolver?: (lat: number, lng: number) => { wave: number; gusts: number; isLand?: boolean }
): OptimizedRoute {
  const specs = VESSEL_CONFIGS[vessel];
  const directDist = haversineDistanceKm(origin, destination);

  if (directDist < 0.1) {
    return {
      path: [origin, destination],
      totalDistanceKm: 0,
      etaHours: 0,
      maxWaveHeightM: 0.5,
      maxGustsKnots: 10,
      overallSeverity: 'green',
      legs: [],
      isPossible: true,
      explanation: 'Origin and destination are identical.',
      recheckIntervalMinutes: 30,
    };
  }

  // Build a discrete bounding grid between origin and destination with padding
  const minLat = Math.min(origin.lat, destination.lat) - 0.4;
  const maxLat = Math.max(origin.lat, destination.lat) + 0.4;
  const minLng = Math.min(origin.lng, destination.lng) - 0.4;
  const maxLng = Math.max(origin.lng, destination.lng) + 0.4;

  const resolution = Math.max(0.04, Math.min(0.1, directDist / 400));
  const latSteps = Math.ceil((maxLat - minLat) / resolution);
  const lngSteps = Math.ceil((maxLng - minLng) / resolution);

  const grid: GridNode[][] = [];

  for (let r = 0; r <= latSteps; r++) {
    grid[r] = [];
    const curLat = minLat + r * resolution;
    for (let c = 0; c <= lngSteps; c++) {
      const curLng = minLng + c * resolution;

      let wave = 1.0;
      let gusts = 14;
      let isLand = false;

      if (waveFieldResolver) {
        const field = waveFieldResolver(curLat, curLng);
        wave = field.wave;
        gusts = field.gusts;
        isLand = field.isLand || false;
      } else {
        // Deterministic synthetic wave field based on coordinates
        const distFromCenter = Math.sin(curLat * 3) * Math.cos(curLng * 2);
        wave = 0.8 + Math.abs(distFromCenter) * 1.5;
        gusts = 12 + wave * 6;
      }

      const isBlocked = isLand || wave >= specs.maxWaveHeight || gusts >= specs.maxWindGusts;

      grid[r][c] = {
        r,
        c,
        lat: curLat,
        lng: curLng,
        wave,
        isBlocked,
        g: Infinity,
        h: 0,
        f: Infinity,
      };
    }
  }

  // Find start and target grid cells
  const startR = Math.round((origin.lat - minLat) / resolution);
  const startC = Math.round((origin.lng - minLng) / resolution);
  const targetR = Math.round((destination.lat - minLat) / resolution);
  const targetC = Math.round((destination.lng - minLng) / resolution);

  const clampedStartR = Math.max(0, Math.min(latSteps, startR));
  const clampedStartC = Math.max(0, Math.min(lngSteps, startC));
  const clampedTargetR = Math.max(0, Math.min(latSteps, targetR));
  const clampedTargetC = Math.max(0, Math.min(lngSteps, targetC));

  const startNode = grid[clampedStartR][clampedStartC];
  const targetNode = grid[clampedTargetR][clampedTargetC];

  startNode.isBlocked = false;
  targetNode.isBlocked = false;
  startNode.g = 0;
  startNode.h = haversineDistanceKm(origin, destination);
  startNode.f = startNode.h;

  const openSet: GridNode[] = [startNode];
  const closedSet = new Set<string>();

  let foundNode: GridNode | null = null;
  const neighbors = [
    [-1, 0], [1, 0], [0, -1], [0, 1],
    [-1, -1], [-1, 1], [1, -1], [1, 1]
  ];

  while (openSet.length > 0) {
    // Pick lowest f
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift()!;

    if (current.r === clampedTargetR && current.c === clampedTargetC) {
      foundNode = current;
      break;
    }

    const key = `${current.r},${current.c}`;
    closedSet.add(key);

    for (const [dr, dc] of neighbors) {
      const nr = current.r + dr;
      const nc = current.c + dc;

      if (nr < 0 || nr > latSteps || nc < 0 || nc > lngSteps) continue;
      const neighbor = grid[nr][nc];

      if (neighbor.isBlocked || closedSet.has(`${nr},${nc}`)) continue;

      const stepDist = haversineDistanceKm(
        { lat: current.lat, lng: current.lng },
        { lat: neighbor.lat, lng: neighbor.lng }
      );

      // Cost penalty: distance * (1 + (wave / limit)^2)
      const penalty = 1 + Math.pow(neighbor.wave / specs.maxWaveHeight, 2) * 2;
      const tentativeG = current.g + stepDist * penalty;

      if (tentativeG < neighbor.g) {
        neighbor.parent = current;
        neighbor.g = tentativeG;
        neighbor.h = haversineDistanceKm({ lat: neighbor.lat, lng: neighbor.lng }, destination);
        neighbor.f = neighbor.g + neighbor.h;

        if (!openSet.some(n => n.r === nr && n.c === nc)) {
          openSet.push(neighbor);
        }
      }
    }
  }

  if (!foundNode) {
    // Fallback: direct line with alert that sea conditions exceed vessel safe limits
    return {
      path: [origin, destination],
      totalDistanceKm: directDist,
      etaHours: directDist / (specs.typicalSpeed * 1.852),
      maxWaveHeightM: specs.maxWaveHeight + 0.6,
      maxGustsKnots: specs.maxWindGusts + 4,
      overallSeverity: 'red',
      legs: [],
      isPossible: false,
      explanation: `No safe route found for ${specs.name}. Significant wave heights or gale winds on this corridor exceed the vessel maximum safety limit (${specs.maxWaveHeight}m). Recommend postponing departure.`,
      recheckIntervalMinutes: 15,
    };
  }

  // Reconstruct path
  const rawPath: LatLng[] = [destination];
  let curr: GridNode | undefined = foundNode;
  while (curr) {
    rawPath.unshift({ lat: curr.lat, lng: curr.lng });
    curr = curr.parent;
  }
  rawPath[0] = origin;

  const simplifiedPath = simplifyPolyline(rawPath, 0.4);

  // Build legs and metrics
  const legs: RouteLeg[] = [];
  let totalDistKm = 0;
  let maxWave = 0;
  let maxGust = 0;

  for (let i = 0; i < simplifiedPath.length - 1; i++) {
    const p1 = simplifiedPath[i];
    const p2 = simplifiedPath[i + 1];
    const legDist = haversineDistanceKm(p1, p2);
    totalDistKm += legDist;

    let legWave = 1.1;
    let legGust = 15;
    if (waveFieldResolver) {
      const midLat = (p1.lat + p2.lat) / 2;
      const midLng = (p1.lng + p2.lng) / 2;
      const field = waveFieldResolver(midLat, midLng);
      legWave = field.wave;
      legGust = field.gusts;
    }

    if (legWave > maxWave) maxWave = legWave;
    if (legGust > maxGust) maxGust = legGust;

    const legSev: SeverityLevel =
      legWave >= specs.maxWaveHeight || legGust >= 34
        ? 'red'
        : legWave >= specs.maxWaveHeight * 0.6 || legGust >= 24
        ? 'yellow'
        : 'green';

    legs.push({
      from: p1,
      to: p2,
      distanceKm: legDist,
      waveHeightM: Number(legWave.toFixed(1)),
      gustsKnots: Number(legGust.toFixed(1)),
      severity: legSev,
      bearingDeg: Math.round(initialBearingDeg(p1, p2)),
    });
  }

  const speedKmh = specs.typicalSpeed * 1.852;
  const etaHours = totalDistKm / speedKmh;

  const overallSeverity: SeverityLevel =
    maxWave >= specs.maxWaveHeight
      ? 'red'
      : maxWave >= specs.maxWaveHeight * 0.6
      ? 'yellow'
      : 'green';

  const explanation =
    overallSeverity === 'green'
      ? `Clear route calculated via A* optimization. Peak wave height along route is ${maxWave.toFixed(1)}m (well below ${specs.name} limit of ${specs.maxWaveHeight}m). Estimated time of arrival: ${etaHours.toFixed(1)} hours.`
      : overallSeverity === 'yellow'
      ? `Route calculated with moderate swell warnings. Peak wave height reaches ${maxWave.toFixed(1)}m. Keep vigilant watch on open-water legs.`
      : `High wave corridor encountered. Maximum waves of ${maxWave.toFixed(1)}m exceed normal operating margin.`;

  return {
    path: simplifiedPath,
    totalDistanceKm: Number(totalDistKm.toFixed(1)),
    etaHours: Number(etaHours.toFixed(1)),
    maxWaveHeightM: Number(maxWave.toFixed(1)),
    maxGustsKnots: Number(maxGust.toFixed(1)),
    overallSeverity,
    legs,
    isPossible: true,
    explanation,
    recheckIntervalMinutes: 30,
  };
}
