import React, { useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { LatLng } from '../../domain/geo/geoMath';
import { INDIAN_PORTS, searchPorts } from '../../data/assets/gazetteer';
import { VesselClass, VESSEL_CONFIGS } from '../../core/config/safetyThresholds';
import { planSafeRoute, OptimizedRoute } from '../../domain/geo/routePlanner';
import { NavPillGroup } from '../../core/widgets/NavPillGroup';
import { BadgePill } from '../../core/widgets/BadgePill';
import { ButtonPrimary } from '../../core/widgets/ButtonPrimary';
import { ProductMockupCard } from '../../core/widgets/ProductMockupCard';
import { useTranslation } from '../../core/i18n/LanguageContext';

interface RoutePlannerScreenProps {
  userPos: LatLng;
  vessel: VesselClass;
  onSetRoute: (route: OptimizedRoute) => void;
  onJumpToMap: () => void;
}

type DepartureOption = 'now' | 'plus3' | 'plus6' | 'tomorrow';

export const RoutePlannerScreen: React.FC<RoutePlannerScreenProps> = ({
  userPos,
  vessel,
  onSetRoute,
  onJumpToMap,
}) => {
  const { t, getVesselName } = useTranslation();
  const [selectedPortId, setSelectedPortId] = useState<string>(INDIAN_PORTS[0].id);
  const [departure, setDeparture] = useState<DepartureOption>('now');
  const [calculatedRoute, setCalculatedRoute] = useState<OptimizedRoute | null>(null);

  const targetPort = INDIAN_PORTS.find((p) => p.id === selectedPortId) || INDIAN_PORTS[0];
  const specs = VESSEL_CONFIGS[vessel];

  const handleCalculateRoute = () => {
    const route = planSafeRoute(
      userPos,
      { lat: targetPort.lat, lng: targetPort.lng },
      vessel
    );
    setCalculatedRoute(route);
    onSetRoute(route);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#1c1c1e] tracking-tight">
          {t.routeTitle}
        </h1>
        <p className="text-xs text-[#8e8e93] mt-0.5 font-medium">
          {t.routeSubtitle} ({getVesselName(vessel)})
        </p>
      </div>

      {/* Configuration Card */}
      <ProductMockupCard title={t.passageParamsTitle}>
        <div className="space-y-4 text-xs">
          {/* Origin & Destination */}
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-bold text-[#8e8e93] uppercase tracking-wider">{t.originLabel}</label>
              <div className="p-3 bg-black/[0.03] border border-black/[0.04] rounded-2xl text-xs text-[#1c1c1e] font-semibold mt-1 flex items-center justify-between">
                <span>GPS ({userPos.lat.toFixed(3)}°N, {userPos.lng.toFixed(3)}°E)</span>
                <BadgePill label={t.activeBadge} variant="emerald" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#8e8e93] uppercase tracking-wider">{t.destinationLabel}</label>
              <select
                value={selectedPortId}
                onChange={(e) => setSelectedPortId(e.target.value)}
                className="w-full mt-1 p-3 bg-white/90 border border-black/10 rounded-2xl text-xs font-semibold text-[#1c1c1e] focus:outline-none focus:border-black"
              >
                {INDIAN_PORTS.map((port) => (
                  <option key={port.id} value={port.id}>
                    {port.name} ({port.state})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Departure Time Nav Pill */}
          <div>
            <label className="text-[11px] font-bold text-[#8e8e93] uppercase tracking-wider block mb-2">
              {t.departureLabel}
            </label>
            <NavPillGroup
              options={[
                { id: 'now', label: t.depNow },
                { id: 'plus3', label: t.dep3h },
                { id: 'plus6', label: t.dep6h },
                { id: 'tomorrow', label: t.depTomorrow },
              ]}
              selectedId={departure}
              onChange={(id) => setDeparture(id as DepartureOption)}
            />
          </div>

          <ButtonPrimary onClick={handleCalculateRoute} fullWidth className="rounded-2xl h-11 text-xs">
            {t.runOptimizationBtn}
          </ButtonPrimary>
        </div>
      </ProductMockupCard>

      {/* Calculated Route Results */}
      {calculatedRoute && (
        <ProductMockupCard
          title={t.calculatedPassageTitle}
          badge={
            <BadgePill
              label={calculatedRoute.overallSeverity.toUpperCase()}
              variant="severity"
              severity={calculatedRoute.overallSeverity}
            />
          }
        >
          <div className="space-y-4 text-xs">
            <p className="text-[#1c1c1e] leading-relaxed bg-black/[0.03] p-3.5 rounded-2xl border border-black/[0.04] font-medium">
              {calculatedRoute.explanation}
            </p>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3.5 bg-black/[0.03] border border-black/[0.04] rounded-2xl">
                <div className="text-[11px] text-[#8e8e93] font-medium">{t.totalDistanceLabel}</div>
                <div className="font-bold text-base text-[#1c1c1e] mt-0.5">
                  {calculatedRoute.totalDistanceKm} km
                </div>
              </div>

              <div className="p-3.5 bg-black/[0.03] border border-black/[0.04] rounded-2xl">
                <div className="text-[11px] text-[#8e8e93] font-medium">{t.estimatedEtaLabel}</div>
                <div className="font-bold text-base text-[#1c1c1e] mt-0.5">
                  {calculatedRoute.etaHours} hrs
                </div>
                <div className="text-[10px] text-[#8e8e93]">
                  @{specs.typicalSpeed} kn
                </div>
              </div>

              <div className="p-3.5 bg-black/[0.03] border border-black/[0.04] rounded-2xl">
                <div className="text-[11px] text-[#8e8e93] font-medium">{t.peakRouteWaveLabel}</div>
                <div className="font-bold text-base text-[#1c1c1e] mt-0.5">
                  {calculatedRoute.maxWaveHeightM} m
                </div>
                <div className="text-[10px] text-[#8e8e93]">
                  {t.limitText}: {specs.maxWaveHeight}m
                </div>
              </div>

              <div className="p-3.5 bg-black/[0.03] border border-black/[0.04] rounded-2xl">
                <div className="text-[11px] text-[#8e8e93] font-medium">{t.recheckLabel}</div>
                <div className="font-bold text-base text-[#1c1c1e] mt-0.5">
                  Every 30m
                </div>
              </div>
            </div>

            {/* Per-Leg Breakdown Table */}
            {calculatedRoute.legs.length > 0 && (
              <div className="border border-black/[0.06] rounded-2xl overflow-hidden">
                <div className="bg-black/[0.03] px-3.5 py-2.5 font-bold text-[11px] text-[#1c1c1e] border-b border-black/[0.04]">
                  {t.legBreakdownTitle} ({calculatedRoute.legs.length} Waypoints)
                </div>
                <div className="divide-y divide-black/[0.04] max-h-48 overflow-y-auto">
                  {calculatedRoute.legs.map((leg, idx) => (
                    <div
                      key={idx}
                      className="px-3.5 py-2 flex items-center justify-between text-[11px]"
                    >
                      <span className="text-[#3a3a3c] font-medium">
                        Leg {idx + 1} ({leg.distanceKm.toFixed(1)} km @ {leg.bearingDeg}°)
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{leg.waveHeightM}m</span>
                        <BadgePill
                          label={leg.severity.toUpperCase()}
                          variant="severity"
                          severity={leg.severity}
                          className="text-[9px] py-0 px-2"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={onJumpToMap}
              className="w-full py-3 px-4 bg-[#000000] hover:bg-[#1c1c1e] text-white text-xs font-semibold rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs active:scale-98"
            >
              <MapPin className="w-4 h-4" />
              <span>{t.plotOnMapBtn}</span>
            </button>
          </div>
        </ProductMockupCard>
      )}
    </div>
  );
};
