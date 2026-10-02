import React, { useState } from 'react';
import {
  Shield,
  ShieldAlert,
  Compass,
  Waves,
  Wind,
  Gauge,
  Clock,
  Radio,
} from 'lucide-react';
import { LatLng, bearingToCardinal } from '../../domain/geo/geoMath';
import { VesselClass, VESSEL_CONFIGS, calculateSeverity } from '../../core/config/safetyThresholds';
import { checkBoundaryProximity } from '../../data/assets/boundaries';
import { MarineSummary } from '../../data/sources/openMeteoService';
import { BadgePill } from '../../core/widgets/BadgePill';
import { DarkFooter } from '../../core/widgets/DarkFooter';
import { useTranslation } from '../../core/i18n/LanguageContext';

interface SafetyScreenProps {
  userPos: LatLng;
  vessel: VesselClass;
  marineSummary: MarineSummary | null;
  onSimulateCriticalAlert: () => void;
  isSimulatedAlert: boolean;
  onResetAlert: () => void;
}

export const SafetyScreen: React.FC<SafetyScreenProps> = ({
  userPos,
  vessel,
  marineSummary,
  onSimulateCriticalAlert,
  isSimulatedAlert,
  onResetAlert,
}) => {
  const { t, getVesselName } = useTranslation();
  const specs = VESSEL_CONFIGS[vessel];
  const [selectedTimelineIndex, setSelectedTimelineIndex] = useState(0);

  const boundary = checkBoundaryProximity(userPos);

  const maxWave = marineSummary?.maxWaveHeight24h ?? 1.2;
  const maxGust = marineSummary?.maxWindGusts24h ?? 16;
  const pressDrop = marineSummary?.pressureDrop12h ?? 1.8;

  const severityData = isSimulatedAlert
    ? {
        severity: 'red' as const,
        waveRatio: 1.4,
        reason: 'CRITICAL ALERT: Vessel is 3.2 km from International Maritime Boundary Line (IMBL) with gale gusts of 36 kn.',
        isCycloneAlert: false,
      }
    : calculateSeverity({
        maxWaveHeight: maxWave,
        maxGusts: maxGust,
        pressureDrop12h: pressDrop,
        vessel,
      });

  const timeline = marineSummary?.hourlyTimeline ?? [];
  const selectedPoint = timeline[selectedTimelineIndex] || {
    time: 'Now',
    waveHeight: marineSummary?.currentWaveHeight ?? 0.9,
    swellHeight: marineSummary?.currentSwellHeight ?? 0.6,
    windSpeedKnots: marineSummary?.currentWindSpeedKnots ?? 12,
    windGustsKnots: maxGust,
    pressureHpa: marineSummary?.currentPressureHpa ?? 1012,
    sst: marineSummary?.currentSst ?? 28.5,
  };

  return (
    <div className="w-full bg-[#f2f2f7] pb-6">
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Title Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#1c1c1e] tracking-tight">
              {t.safetyTitle}
            </h1>
            <p className="text-xs text-[#8e8e93] mt-0.5 font-medium">
              {t.safetySubtitle} ({getVesselName(vessel)})
            </p>
          </div>

          <BadgePill
            label={severityData.severity.toUpperCase()}
            variant="severity"
            severity={severityData.severity}
          />
        </div>

        {/* ONE Dark Critical Alert Card (Active when Red Severity or Simulated) */}
        {severityData.severity === 'red' && (
          <div className="glass-dark rounded-3xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#ff3b30] text-white flex items-center justify-center animate-pulse shrink-0 shadow-lg">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-display text-base font-bold tracking-tight text-white uppercase">
                    {t.criticalAlertTitle}
                  </div>
                  <div className="text-xs text-[#aeaeb2] font-medium">
                    {t.criticalAlertSubtitle}
                  </div>
                </div>
              </div>

              {isSimulatedAlert && (
                <button
                  onClick={onResetAlert}
                  className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs text-white border border-white/15 cursor-pointer font-semibold transition-all"
                >
                  {t.clearSimulation}
                </button>
              )}
            </div>

            <p className="text-xs text-[#ff453a] font-medium leading-relaxed bg-white/5 p-3.5 rounded-2xl border border-white/10">
              {severityData.reason}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10">
                <div className="text-[11px] text-[#aeaeb2] font-medium">{t.nearestBoundaryLabel}</div>
                <div className="text-base font-bold text-white mt-1">
                  {isSimulatedAlert ? '3.20 km' : `${boundary.distanceKm} km`}
                </div>
                <div className="text-[10px] text-[#ff453a] mt-0.5 font-semibold">Critical &lt; 5.0 km</div>
              </div>

              <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10">
                <div className="text-[11px] text-[#aeaeb2] font-medium">{t.safeHeadingAwayLabel}</div>
                <div className="text-base font-bold text-[#34c759] mt-1">
                  {boundary.recommendedHeadingAwayDeg}° ({bearingToCardinal(boundary.recommendedHeadingAwayDeg)})
                </div>
                <div className="text-[10px] text-[#aeaeb2] mt-0.5">Direct safe bearing</div>
              </div>

              <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 col-span-2 sm:col-span-1">
                <div className="text-[11px] text-[#aeaeb2] font-medium">{t.maxWaveLabel} / {t.limitText}</div>
                <div className="text-base font-bold text-[#ff453a] mt-1">
                  {maxWave}m / {specs.maxWaveHeight}m
                </div>
                <div className="text-[10px] text-[#aeaeb2] mt-0.5 font-medium">
                  {((maxWave / specs.maxWaveHeight) * 100).toFixed(0)}% of ceiling
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Current Risk Summary Card */}
        <div className="glass-surface rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-black/[0.05] pb-3.5">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#000000]" />
              <h2 className="font-display text-sm font-bold text-[#1c1c1e]">
                {t.vesselRiskTitle} ({getVesselName(vessel)})
              </h2>
            </div>
            <span className="text-[11px] text-[#8e8e93] font-semibold">
              {t.liveEvaluated}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-black/[0.03] border border-black/[0.04]">
              <div className="flex items-center gap-1.5 text-xs text-[#8e8e93] font-medium">
                <Waves className="w-3.5 h-3.5 text-[#007aff]" />
                <span>{t.maxWaveLabel}</span>
              </div>
              <div className="text-lg font-bold text-[#1c1c1e] mt-1">
                {maxWave} <span className="text-xs font-normal text-[#8e8e93]">m</span>
              </div>
              <div className="text-[10px] text-[#8e8e93] mt-0.5">
                {t.limitText}: {specs.maxWaveHeight}m
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/[0.03] border border-black/[0.04]">
              <div className="flex items-center gap-1.5 text-xs text-[#8e8e93] font-medium">
                <Wind className="w-3.5 h-3.5 text-[#007aff]" />
                <span>{t.maxGustsLabel}</span>
              </div>
              <div className="text-lg font-bold text-[#1c1c1e] mt-1">
                {maxGust} <span className="text-xs font-normal text-[#8e8e93]">kn</span>
              </div>
              <div className="text-[10px] text-[#8e8e93] mt-0.5">
                Gale: &ge;34 kn
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/[0.03] border border-black/[0.04]">
              <div className="flex items-center gap-1.5 text-xs text-[#8e8e93] font-medium">
                <Gauge className="w-3.5 h-3.5 text-[#007aff]" />
                <span>{t.pressure12hLabel}</span>
              </div>
              <div className="text-lg font-bold text-[#1c1c1e] mt-1">
                -{pressDrop} <span className="text-xs font-normal text-[#8e8e93]">hPa</span>
              </div>
              <div className="text-[10px] text-[#8e8e93] mt-0.5">
                Drop: &le;6.0 hPa
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/[0.03] border border-black/[0.04]">
              <div className="flex items-center gap-1.5 text-xs text-[#8e8e93] font-medium">
                <Radio className="w-3.5 h-3.5 text-[#007aff]" />
                <span>{t.imblDistanceLabel}</span>
              </div>
              <div className="text-lg font-bold text-[#1c1c1e] mt-1">
                {boundary.distanceKm} <span className="text-xs font-normal text-[#8e8e93]">km</span>
              </div>
              <div className="text-[10px] text-[#8e8e93] mt-0.5">
                Warn: &le;10 km
              </div>
            </div>
          </div>

          <div className="text-xs text-[#1c1c1e] leading-relaxed bg-black/[0.03] p-3.5 rounded-2xl border border-black/[0.04] font-medium">
            <strong>{t.assessmentLabel}:</strong> {severityData.reason}
          </div>
        </div>

        {/* 72-Hour Metocean Timeline Scrubber */}
        <div className="glass-surface rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-black/[0.05] pb-3.5">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#000000]" />
              <h2 className="font-display text-sm font-bold text-[#1c1c1e]">
                {t.timelineTitle}
              </h2>
            </div>
            <span className="text-xs text-[#000000] font-bold">
              +{selectedTimelineIndex} {t.hoursSuffix}
            </span>
          </div>

          {/* Time Scrubber Slider (Apple Style) */}
          <div className="space-y-2">
            <input
              type="range"
              min={0}
              max={Math.max(0, timeline.length - 1)}
              value={selectedTimelineIndex}
              onChange={(e) => setSelectedTimelineIndex(Number(e.target.value))}
              className="w-full accent-[#000000] cursor-pointer h-2 bg-neutral-200 rounded-lg appearance-none"
            />
            <div className="flex justify-between text-[10px] text-[#8e8e93] font-semibold">
              <span>Now</span>
              <span>+24h</span>
              <span>+48h</span>
              <span>+72h</span>
            </div>
          </div>

          {/* Timeline Selected Point Metrics */}
          <div className="grid grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3.5 rounded-2xl bg-black/[0.03] border border-black/[0.04] text-center">
              <div className="text-[11px] text-[#8e8e93] font-medium">{t.forecastWaveLabel}</div>
              <div className="text-base font-bold text-[#1c1c1e] mt-1">
                {selectedPoint.waveHeight} m
              </div>
              <div className="text-[10px] text-[#8e8e93]">
                Swell: {selectedPoint.swellHeight}m
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/[0.03] border border-black/[0.04] text-center">
              <div className="text-[11px] text-[#8e8e93] font-medium">{t.windGustsLabel}</div>
              <div className="text-base font-bold text-[#1c1c1e] mt-1">
                {selectedPoint.windSpeedKnots} kn
              </div>
              <div className="text-[10px] text-[#8e8e93]">
                Gusts: {selectedPoint.windGustsKnots} kn
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/[0.03] border border-black/[0.04] text-center">
              <div className="text-[11px] text-[#8e8e93] font-medium">{t.barometerSstLabel}</div>
              <div className="text-base font-bold text-[#1c1c1e] mt-1">
                {selectedPoint.pressureHpa} hPa
              </div>
              <div className="text-[10px] text-[#8e8e93]">
                SST: {selectedPoint.sst}°C
              </div>
            </div>
          </div>
        </div>

        {/* Geofence & Boundary Proximity Card */}
        <div className="glass-surface rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-black/[0.05] pb-3.5">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#000000]" />
              <h2 className="font-display text-sm font-bold text-[#1c1c1e]">
                {t.geofenceNavTitle}
              </h2>
            </div>
            <BadgePill
              label={boundary.status.toUpperCase()}
              variant="severity"
              severity={boundary.status === 'critical' ? 'red' : boundary.status === 'warning' ? 'yellow' : 'green'}
            />
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1.5 border-b border-black/[0.04]">
              <span className="text-[#8e8e93] font-medium">{t.nearestBoundaryLabel}</span>
              <span className="font-bold text-[#1c1c1e] text-right">{boundary.boundary.name}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-black/[0.04]">
              <span className="text-[#8e8e93] font-medium">{t.geodesicDistanceLabel}</span>
              <span className="font-bold text-[#1c1c1e]">{boundary.distanceKm} km</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-black/[0.04]">
              <span className="text-[#8e8e93] font-medium">{t.bearingLabel}</span>
              <span className="font-bold text-[#1c1c1e]">{boundary.bearingDeg}° ({bearingToCardinal(boundary.bearingDeg)})</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-[#8e8e93] font-medium">{t.safeHeadingAwayLabel}</span>
              <span className="font-bold text-[#34c759]">{boundary.recommendedHeadingAwayDeg}° ({bearingToCardinal(boundary.recommendedHeadingAwayDeg)})</span>
            </div>
          </div>

          <div className="pt-2 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-[#8e8e93]">
              <span className="font-semibold text-[#007aff] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#007aff]" />
                Demo Action:
              </span>
              <span>Triggers full red alert HUD</span>
            </div>
            <button
              onClick={onSimulateCriticalAlert}
              className="w-full py-3 px-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 border border-rose-500/20 text-xs font-semibold transition-all cursor-pointer text-center"
            >
              {t.simulateBoundaryBtn}
            </button>
          </div>
        </div>
      </div>

      <DarkFooter />
    </div>
  );
};
