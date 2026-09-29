/**
 * Ocean Front Detection (Cayula-Cornillon / Otsu SST Histogram Splitting)
 * Detects thermal fronts from SST grids and identifies probable aggregation zones.
 */

import { LatLng, haversineDistanceKm, initialBearingDeg } from './geoMath';

export interface FrontCell {
  lat: number;
  lng: number;
  sst: number;
  gradientCPerKm: number;
  confidence: number; // 0 to 1
  label: string;
}

export interface AggregationZone {
  id: string;
  center: LatLng;
  gradient: number; // deg C / km
  meanSst: number;
  distanceKm: number;
  bearingDeg: number;
  confidence: number;
  coordinates: LatLng[];
  provenance: string;
}

/**
 * Otsu's thresholding on a 1D array of SST values
 */
function otsuSplit(values: number[]): { threshold: number; separation: number } {
  if (values.length < 4) return { threshold: 0, separation: 0 };
  const sorted = [...values].sort((a, b) => a - b);
  const total = sorted.length;
  const meanTotal = sorted.reduce((sum, v) => sum + v, 0) / total;
  const totalVar = sorted.reduce((sum, v) => sum + Math.pow(v - meanTotal, 2), 0) / total;

  if (totalVar < 0.001) return { threshold: meanTotal, separation: 0 };

  let maxBetweenVar = 0;
  let bestThreshold = sorted[0];

  for (let i = 1; i < total; i++) {
    const left = sorted.slice(0, i);
    const right = sorted.slice(i);

    const w0 = left.length / total;
    const w1 = right.length / total;

    const m0 = left.reduce((s, v) => s + v, 0) / left.length;
    const m1 = right.reduce((s, v) => s + v, 0) / right.length;

    const betweenVar = w0 * w1 * Math.pow(m0 - m1, 2);
    if (betweenVar > maxBetweenVar) {
      maxBetweenVar = betweenVar;
      bestThreshold = (sorted[i - 1] + sorted[i]) / 2;
    }
  }

  const separation = totalVar > 0 ? maxBetweenVar / totalVar : 0;
  return { threshold: bestThreshold, separation };
}

/**
 * Detects thermal fronts across an SST grid matrix
 */
export function detectThermalFronts(
  grid: { lats: number[]; lngs: number[]; sstMatrix: number[][] },
  userPos: LatLng,
  separationThreshold = 0.55
): AggregationZone[] {
  const { lats, lngs, sstMatrix } = grid;
  const frontCells: FrontCell[] = [];

  const rows = lats.length;
  const cols = lngs.length;

  for (let r = 1; r < rows - 1; r++) {
    for (let c = 1; c < cols - 1; c++) {
      // 3x3 window around (r, c)
      const windowVals: number[] = [];
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const val = sstMatrix[r + dr]?.[c + dc];
          if (val != null && !isNaN(val)) {
            windowVals.push(val);
          }
        }
      }

      if (windowVals.length >= 6) {
        const { separation } = otsuSplit(windowVals);

        // Sobel filter for SST gradient
        const dz_dx = (
          (sstMatrix[r - 1]?.[c + 1] ?? 0) + 2 * (sstMatrix[r]?.[c + 1] ?? 0) + (sstMatrix[r + 1]?.[c + 1] ?? 0) -
          ((sstMatrix[r - 1]?.[c - 1] ?? 0) + 2 * (sstMatrix[r]?.[c - 1] ?? 0) + (sstMatrix[r + 1]?.[c - 1] ?? 0))
        ) / 8;

        const dz_dy = (
          (sstMatrix[r + 1]?.[c - 1] ?? 0) + 2 * (sstMatrix[r + 1]?.[c] ?? 0) + (sstMatrix[r + 1]?.[c + 1] ?? 0) -
          ((sstMatrix[r - 1]?.[c - 1] ?? 0) + 2 * (sstMatrix[r - 1]?.[c] ?? 0) + (sstMatrix[r - 1]?.[c + 1] ?? 0))
        ) / 8;

        const dxKm = haversineDistanceKm({ lat: lats[r], lng: lngs[c - 1] }, { lat: lats[r], lng: lngs[c + 1] }) / 2;
        const dyKm = haversineDistanceKm({ lat: lats[r - 1], lng: lngs[c] }, { lat: lats[r + 1], lng: lngs[c] }) / 2;

        const gradX = dxKm > 0 ? dz_dx / dxKm : 0;
        const gradY = dyKm > 0 ? dz_dy / dyKm : 0;
        const gradMagnitude = Math.sqrt(gradX * gradX + gradY * gradY); // deg C / km

        if (separation >= separationThreshold && gradMagnitude >= 0.015) {
          frontCells.push({
            lat: lats[r],
            lng: lngs[c],
            sst: sstMatrix[r][c],
            gradientCPerKm: gradMagnitude,
            confidence: Math.min(1.0, separation * 0.7 + gradMagnitude * 10),
            label: 'Thermal Front Boundary'
          });
        }
      }
    }
  }

  // Cluster nearby front cells into distinct aggregation zones
  const zones: AggregationZone[] = [];
  const visited = new Set<number>();

  for (let i = 0; i < frontCells.length; i++) {
    if (visited.has(i)) continue;
    const cluster: FrontCell[] = [frontCells[i]];
    visited.add(i);

    for (let j = i + 1; j < frontCells.length; j++) {
      if (visited.has(j)) continue;
      const d = haversineDistanceKm(frontCells[i], frontCells[j]);
      if (d < 35) { // within 35 km
        cluster.push(frontCells[j]);
        visited.add(j);
      }
    }

    const centerLat = cluster.reduce((sum, p) => sum + p.lat, 0) / cluster.length;
    const centerLng = cluster.reduce((sum, p) => sum + p.lng, 0) / cluster.length;
    const centerPos = { lat: centerLat, lng: centerLng };
    const avgGrad = cluster.reduce((sum, p) => sum + p.gradientCPerKm, 0) / cluster.length;
    const avgSst = cluster.reduce((sum, p) => sum + p.sst, 0) / cluster.length;
    const avgConf = cluster.reduce((sum, p) => sum + p.confidence, 0) / cluster.length;

    zones.push({
      id: `front-${zones.length + 1}`,
      center: centerPos,
      gradient: Number(avgGrad.toFixed(3)),
      meanSst: Number(avgSst.toFixed(1)),
      distanceKm: haversineDistanceKm(userPos, centerPos),
      bearingDeg: initialBearingDeg(userPos, centerPos),
      confidence: Number(avgConf.toFixed(2)),
      coordinates: cluster.map(c => ({ lat: c.lat, lng: c.lng })),
      provenance: 'Detected from SST Grid (Cayula-Cornillon algorithm)'
    });
  }

  return zones.sort((a, b) => a.distanceKm - b.distanceKm);
}
