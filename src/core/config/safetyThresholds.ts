/**
 * Safety Thresholds & Vessel Class Configurations
 * Validated against INCOIS / IMD marine advisory practices.
 */

export type VesselClass = 'artisanal' | 'mechanised' | 'trawler';
export type UnitSystem = 'metric' | 'nautical';
export type SeverityLevel = 'green' | 'yellow' | 'red';

export interface VesselSpecs {
  id: VesselClass;
  name: string;
  maxWaveHeight: number; // in meters
  maxWindGusts: number; // in knots
  typicalSpeed: number; // in knots
  description: string;
}

export const VESSEL_CONFIGS: Record<VesselClass, VesselSpecs> = {
  artisanal: {
    id: 'artisanal',
    name: 'Non-mechanised / Artisanal Boat',
    maxWaveHeight: 1.5,
    maxWindGusts: 22,
    typicalSpeed: 5,
    description: 'Traditional catamaran, dugout canoe, or small fiberglass craft with OBM (< 10 hp).'
  },
  mechanised: {
    id: 'mechanised',
    name: 'Mechanised Boat (Inboard Engine)',
    maxWaveHeight: 2.5,
    maxWindGusts: 30,
    typicalSpeed: 8,
    description: 'Gillnetter, ring seiner, or intermediate longliner (9 - 15 meters).'
  },
  trawler: {
    id: 'trawler',
    name: 'Commercial Trawler / Deep-Sea Vessel',
    maxWaveHeight: 3.5,
    maxWindGusts: 38,
    typicalSpeed: 10,
    description: 'Steel or wooden deep-sea bottom trawler (> 15 meters).'
  }
};

export const GEOFENCE_THRESHOLDS = {
  warningDistanceKm: 10.0,
  criticalDistanceKm: 5.0,
};

export const CYCLONE_HEURISTICS = {
  minGustKnots: 34,
  minPressureDrop12hHpa: 6.0,
};

/**
 * Calculates safety severity from wave height, gusts, pressure drop, and vessel specifications
 */
export function calculateSeverity(params: {
  maxWaveHeight: number;
  maxGusts: number;
  pressureDrop12h?: number;
  vessel: VesselClass;
}): {
  severity: SeverityLevel;
  waveRatio: number;
  reason: string;
  isCycloneAlert: boolean;
} {
  const specs = VESSEL_CONFIGS[params.vessel];
  const waveRatio = params.maxWaveHeight / specs.maxWaveHeight;
  
  const isCyclone = 
    params.maxGusts >= CYCLONE_HEURISTICS.minGustKnots &&
    (params.pressureDrop12h ?? 0) >= CYCLONE_HEURISTICS.minPressureDrop12hHpa;

  if (isCyclone) {
    return {
      severity: 'red',
      waveRatio,
      reason: `Possible cyclonic conditions detected (Gusts: ${params.maxGusts.toFixed(1)} kn, 12h pressure drop: ${params.pressureDrop12h?.toFixed(1) ?? 0} hPa). Extreme danger.`,
      isCycloneAlert: true
    };
  }

  if (waveRatio >= 1.0 || params.maxGusts >= 34) {
    return {
      severity: 'red',
      waveRatio,
      reason: `Significant wave height (${params.maxWaveHeight.toFixed(1)}m) exceeds vessel safe limit (${specs.maxWaveHeight}m) or gale gusts (${params.maxGusts.toFixed(1)} kn). Fishing strictly unsafe.`,
      isCycloneAlert: false
    };
  }

  if (waveRatio >= 0.6 || params.maxGusts >= 25) {
    return {
      severity: 'yellow',
      waveRatio,
      reason: `Moderate wave activity (${params.maxWaveHeight.toFixed(1)}m, ${(waveRatio * 100).toFixed(0)}% of limit) or squally wind gusts (${params.maxGusts.toFixed(1)} kn). Exercise caution.`,
      isCycloneAlert: false
    };
  }

  return {
    severity: 'green',
    waveRatio,
    reason: `Sea state is calm to slight (${params.maxWaveHeight.toFixed(1)}m, ${(waveRatio * 100).toFixed(0)}% of limit). Normal maritime operations permitted.`,
    isCycloneAlert: false
  };
}
