/**
 * Pure Deterministic Geospatial Math
 * Spherical geometry, geodesic distances, point-to-segment, Douglas-Peucker, ray-casting
 */

export interface LatLng {
  lat: number;
  lng: number;
}

const EARTH_RADIUS_KM = 6371.0088;
const TO_RAD = Math.PI / 180;
const TO_DEG = 180 / Math.PI;

/**
 * Great-circle distance between two points on a spherical Earth (in km)
 */
export function haversineDistanceKm(p1: LatLng, p2: LatLng): number {
  const dLat = (p2.lat - p1.lat) * TO_RAD;
  const dLng = (p2.lng - p1.lng) * TO_RAD;
  const lat1 = p1.lat * TO_RAD;
  const lat2 = p2.lat * TO_RAD;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

/**
 * Initial bearing from p1 to p2 in degrees (0 - 360)
 */
export function initialBearingDeg(p1: LatLng, p2: LatLng): number {
  const lat1 = p1.lat * TO_RAD;
  const lat2 = p2.lat * TO_RAD;
  const dLng = (p2.lng - p1.lng) * TO_RAD;

  const y = Math.sin(dLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  const brng = Math.atan2(y, x) * TO_DEG;
  return (brng + 360) % 360;
}

/**
 * Destination point given start, bearing (deg), and distance (km)
 */
export function destinationPoint(start: LatLng, bearingDeg: number, distanceKm: number): LatLng {
  const δ = distanceKm / EARTH_RADIUS_KM;
  const θ = bearingDeg * TO_RAD;
  const φ1 = start.lat * TO_RAD;
  const λ1 = start.lng * TO_RAD;

  const φ2 = Math.asin(
    Math.sin(φ1) * Math.cos(δ) + Math.cos(φ1) * Math.sin(δ) * Math.cos(θ)
  );
  const λ2 =
    λ1 +
    Math.atan2(
      Math.sin(θ) * Math.sin(δ) * Math.cos(φ1),
      Math.cos(δ) - Math.sin(φ1) * Math.sin(φ2)
    );

  return {
    lat: φ2 * TO_DEG,
    lng: ((λ2 * TO_DEG + 540) % 360) - 180,
  };
}

/**
 * Shortest geodesic distance from point P to segment [A, B] in km
 * Handles along-track clamping to segment endpoints.
 */
export function pointToSegmentDistanceKm(p: LatLng, a: LatLng, b: LatLng): {
  distanceKm: number;
  nearestPoint: LatLng;
  isEndpoint: boolean;
} {
  const distAB = haversineDistanceKm(a, b);
  if (distAB < 0.0001) {
    return { distanceKm: haversineDistanceKm(p, a), nearestPoint: a, isEndpoint: true };
  }

  // Angular distance from A to P
  const distAP = haversineDistanceKm(a, p);
  const brngAB = initialBearingDeg(a, b) * TO_RAD;
  const brngAP = initialBearingDeg(a, p) * TO_RAD;

  const δ13 = distAP / EARTH_RADIUS_KM;
  // Cross-track distance
  const dxt = Math.asin(Math.sin(δ13) * Math.sin(brngAP - brngAB));
  // Along-track distance
  const dat = Math.acos(Math.cos(δ13) / Math.cos(dxt));

  const alongTrackKm = dat * EARTH_RADIUS_KM;
  const cosDiff = Math.cos(brngAP - brngAB);

  // If projection falls before A
  if (cosDiff < 0) {
    return { distanceKm: haversineDistanceKm(p, a), nearestPoint: a, isEndpoint: true };
  }
  // If projection falls after B
  if (alongTrackKm > distAB) {
    return { distanceKm: haversineDistanceKm(p, b), nearestPoint: b, isEndpoint: true };
  }

  const crossTrackKm = Math.abs(dxt) * EARTH_RADIUS_KM;
  const projectedPt = destinationPoint(a, brngAB * TO_DEG, alongTrackKm);
  return { distanceKm: crossTrackKm, nearestPoint: projectedPt, isEndpoint: false };
}

/**
 * Point in polygon test using Ray Casting algorithm
 */
export function isPointInPolygon(point: LatLng, polygon: LatLng[]): boolean {
  let inside = false;
  const n = polygon.length;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = polygon[i].lng, yi = polygon[i].lat;
    const xj = polygon[j].lng, yj = polygon[j].lat;

    const intersect =
      yi > point.lat !== yj > point.lat &&
      point.lng < ((xj - xi) * (point.lat - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Douglas-Peucker Polyline Simplification
 */
export function simplifyPolyline(points: LatLng[], toleranceKm = 0.5): LatLng[] {
  if (points.length <= 2) return points;

  let maxDist = 0;
  let index = 0;
  const first = points[0];
  const last = points[points.length - 1];

  for (let i = 1; i < points.length - 1; i++) {
    const d = pointToSegmentDistanceKm(points[i], first, last).distanceKm;
    if (d > maxDist) {
      maxDist = d;
      index = i;
    }
  }

  if (maxDist > toleranceKm) {
    const recResults1 = simplifyPolyline(points.slice(0, index + 1), toleranceKm);
    const recResults2 = simplifyPolyline(points.slice(index), toleranceKm);
    return [...recResults1.slice(0, -1), ...recResults2];
  } else {
    return [first, last];
  }
}

/**
 * Unit conversions
 */
export function kmToNauticalMiles(km: number): number {
  return km * 0.539957;
}

export function nauticalMilesToKm(nm: number): number {
  return nm * 1.852;
}

export function knotsToKmh(kn: number): number {
  return kn * 1.852;
}

export function formatDistance(km: number, units: 'metric' | 'nautical' = 'metric'): string {
  if (units === 'nautical') {
    return `${kmToNauticalMiles(km).toFixed(1)} nm`;
  }
  return `${km.toFixed(1)} km`;
}

export function formatSpeed(knots: number, units: 'metric' | 'nautical' = 'nautical'): string {
  if (units === 'metric') {
    return `${knotsToKmh(knots).toFixed(1)} km/h`;
  }
  return `${knots.toFixed(1)} kn`;
}

/**
 * Bearing to compass rose description (e.g. 90 -> "E", 135 -> "SE")
 */
export function bearingToCardinal(deg: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(((deg % 360) / 22.5)) % 16;
  return directions[index];
}
