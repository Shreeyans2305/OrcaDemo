import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { AggregationZone } from '../../domain/geo/frontDetection';
import { LatLng, bearingToCardinal } from '../../domain/geo/geoMath';
import { BadgePill } from '../../core/widgets/BadgePill';
import { ProductMockupCard } from '../../core/widgets/ProductMockupCard';
import { useTranslation } from '../../core/i18n/LanguageContext';

interface FishingZonesScreenProps {
  userPos: LatLng;
  fronts: AggregationZone[];
  onSelectZone: (zone: AggregationZone) => void;
  onJumpToMap: () => void;
}

export const FishingZonesScreen: React.FC<FishingZonesScreenProps> = ({
  userPos,
  fronts,
  onSelectZone,
  onJumpToMap,
}) => {
  const { t } = useTranslation();

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#1c1c1e] tracking-tight">
            {t.pfzTitle}
          </h1>
          <p className="text-xs text-[#8e8e93] mt-0.5 font-medium">
            {t.pfzSubtitle}
          </p>
        </div>

        <button
          onClick={onJumpToMap}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#000000] text-white text-xs font-semibold hover:bg-[#1c1c1e] cursor-pointer transition-all shadow-xs"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>{t.viewOnMapBtn}</span>
        </button>
      </div>

      {/* Advisory Banner */}
      <div className="bg-[#34c759]/10 border border-[#34c759]/20 rounded-2xl p-4 text-xs text-[#248a3d] space-y-1 backdrop-blur-md">
        <div className="font-bold text-[#1b6b2f]">
          {t.pfzAdvisoryTitle}
        </div>
        <p className="leading-relaxed font-medium">
          {t.pfzAdvisoryDesc}
        </p>
      </div>

      {/* Zone Cards List */}
      <div className="space-y-4">
        {fronts.map((zone, idx) => (
          <ProductMockupCard
            key={zone.id}
            className="hover:border-black/20 cursor-pointer shadow-sm"
            title={`${t.pfzTitle} #${idx + 1}`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <BadgePill
                    label={idx === 0 ? t.primaryPfzBadge : t.secondaryFrontBadge}
                    variant={idx === 0 ? 'emerald' : 'default'}
                  />
                  <span className="text-[11px] text-[#8e8e93] font-medium">
                    {t.confidenceLabel}: {(zone.confidence * 100).toFixed(0)}%
                  </span>
                </div>

                <span className="text-[10px] text-[#8e8e93] font-medium">
                  {zone.provenance}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs">
                <div className="bg-black/[0.03] p-3 rounded-2xl border border-black/[0.04]">
                  <div className="text-[11px] text-[#8e8e93] font-medium">Distance</div>
                  <div className="font-bold text-base text-[#1c1c1e] mt-0.5">
                    {zone.distanceKm.toFixed(1)} km
                  </div>
                </div>

                <div className="bg-black/[0.03] p-3 rounded-2xl border border-black/[0.04]">
                  <div className="text-[11px] text-[#8e8e93] font-medium">Bearing</div>
                  <div className="font-bold text-base text-[#1c1c1e] mt-0.5">
                    {Math.round(zone.bearingDeg)}° ({bearingToCardinal(zone.bearingDeg)})
                  </div>
                </div>

                <div className="bg-black/[0.03] p-3 rounded-2xl border border-black/[0.04]">
                  <div className="text-[11px] text-[#8e8e93] font-medium">{t.meanSstLabel}</div>
                  <div className="font-bold text-base text-[#1c1c1e] mt-0.5">
                    {zone.meanSst}°C
                  </div>
                </div>

                <div className="bg-black/[0.03] p-3 rounded-2xl border border-black/[0.04]">
                  <div className="text-[11px] text-[#8e8e93] font-medium">{t.sstGradientLabel}</div>
                  <div className="font-bold text-base text-[#1c1c1e] mt-0.5">
                    {zone.gradient}°C/km
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-black/[0.04]">
                <div className="text-[11px] text-[#8e8e93] font-medium">
                  Lat: {zone.center.lat.toFixed(3)}°, Lng: {zone.center.lng.toFixed(3)}°
                </div>

                <button
                  onClick={() => {
                    onSelectZone(zone);
                    onJumpToMap();
                  }}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#000000] hover:text-[#007aff] transition-colors cursor-pointer"
                >
                  <span>{t.focusCoordsBtn}</span>
                  <Navigation className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </ProductMockupCard>
        ))}
      </div>
    </div>
  );
};
