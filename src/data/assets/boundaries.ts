/**
 * Maritime Boundary Lines (IMBL), EEZ, and Marine Protected Areas (MPAs)
 * 
 * LEGAL NOTICE: Simplified demo geometry for decision-support prototyping.
 * Always rely on official Survey of India / Ministry of External Affairs coordinates for legal navigation.
 */

import { LatLng, pointToSegmentDistanceKm, initialBearingDeg } from '../../domain/geo/geoMath';

export interface BoundaryFeature {
  id: string;
  name: string;
  type: 'imbl' | 'mpa' | 'eez';
  countryPair?: string;
  coordinates: LatLng[];
  description: string;
  provenance: string;
}

export const MARITIME_BOUNDARIES: BoundaryFeature[] = [
  {
    id: 'imbl-in-sl-palk',
    name: 'India - Sri Lanka IMBL (Palk Strait & Gulf of Mannar)',
    type: 'imbl',
    countryPair: 'India - Sri Lanka',
    coordinates: [
      { lat: 10.0833, lng: 79.8667 },
      { lat: 9.9500, lng: 79.7500 },
      { lat: 9.7500, lng: 79.5833 },
      { lat: 9.5333, lng: 79.5333 },
      { lat: 9.3639, lng: 79.4667 }, // Near Kachchatheevu
      { lat: 9.2167, lng: 79.5333 },
      { lat: 9.0333, lng: 79.6167 },
      { lat: 8.8333, lng: 79.7000 },
      { lat: 8.5000, lng: 79.7500 },
      { lat: 8.0000, lng: 79.5000 },
    ],
    description: 'Delimited maritime boundary line under the 1974 & 1976 bilateral agreements.',
    provenance: 'Simplified demo geometry (Survey of India / MEA public treaties)'
  },
  {
    id: 'imbl-in-pk-arabian',
    name: 'India - Pakistan Maritime Boundary (Sir Creek / Arabian Sea)',
    type: 'imbl',
    countryPair: 'India - Pakistan',
    coordinates: [
      { lat: 23.6333, lng: 68.1000 },
      { lat: 23.5000, lng: 67.9000 },
      { lat: 23.3000, lng: 67.6000 },
      { lat: 23.0000, lng: 67.2000 },
      { lat: 22.5000, lng: 66.5000 },
      { lat: 21.8000, lng: 65.8000 },
    ],
    description: 'High-risk maritime proximity corridor off the Kutch and Saurashtra coasts.',
    provenance: 'Simplified demo geometry'
  },
  {
    id: 'mpa-gulf-mannar',
    name: 'Gulf of Mannar Marine National Park (Core Biosphere Reserve)',
    type: 'mpa',
    coordinates: [
      { lat: 9.2500, lng: 79.1500 },
      { lat: 9.3000, lng: 79.3500 },
      { lat: 9.1500, lng: 79.3000 },
      { lat: 9.1000, lng: 79.1000 },
      { lat: 9.2500, lng: 79.1500 },
    ],
    description: 'Strictly protected coral reef and seagrass sanctuary. Commercial trawling prohibited.',
    provenance: 'Ministry of Environment, Forest and Climate Change (MoEFCC)'
  }
];

export interface BoundaryProximityResult {
  boundary: BoundaryFeature;
  distanceKm: number;
  nearestPoint: LatLng;
  bearingDeg: number;
  recommendedHeadingAwayDeg: number;
  isInsideOrViolated: boolean;
  status: 'safe' | 'warning' | 'critical';
}

/**
 * Finds the nearest maritime boundary or MPA from the user's coordinates
 */
export function checkBoundaryProximity(userPos: LatLng): BoundaryProximityResult {
  let closestBoundary = MARITIME_BOUNDARIES[0];
  let minDistance = Infinity;
  let closestPoint: LatLng = MARITIME_BOUNDARIES[0].coordinates[0];

  for (const b of MARITIME_BOUNDARIES) {
    for (let i = 0; i < b.coordinates.length - 1; i++) {
      const p1 = b.coordinates[i];
      const p2 = b.coordinates[i + 1];
      const result = pointToSegmentDistanceKm(userPos, p1, p2);

      if (result.distanceKm < minDistance) {
        minDistance = result.distanceKm;
        closestBoundary = b;
        closestPoint = result.nearestPoint;
      }
    }
  }

  const bearingToBoundary = Math.round(initialBearingDeg(userPos, closestPoint));
  // Recommended safe heading is 180 degrees opposite
  const recommendedHeadingAway = (bearingToBoundary + 180) % 360;

  const status =
    minDistance <= 5.0 ? 'critical' : minDistance <= 10.0 ? 'warning' : 'safe';

  return {
    boundary: closestBoundary,
    distanceKm: Number(minDistance.toFixed(2)),
    nearestPoint: closestPoint,
    bearingDeg: bearingToBoundary,
    recommendedHeadingAwayDeg: recommendedHeadingAway,
    isInsideOrViolated: minDistance < 0.2,
    status
  };
}
