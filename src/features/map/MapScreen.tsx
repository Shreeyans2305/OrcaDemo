import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Waves,
  Thermometer,
  Wind,
  Navigation,
  Compass,
  Fish,
  Shield,
  Layers,
  ChevronUp,
  LocateFixed,
  Sparkles,
  Target,
  Maximize2,
  X,
} from 'lucide-react';
import { LatLng } from '../../domain/geo/geoMath';
import { VesselClass } from '../../core/config/safetyThresholds';
import { NavPillGroup, PillOption } from '../../core/widgets/NavPillGroup';
import { BadgePill } from '../../core/widgets/BadgePill';
import { SeverityBanner } from '../../core/widgets/SeverityBanner';
import { EvidenceRow } from '../../core/widgets/EvidenceRow';
import { MARITIME_BOUNDARIES } from '../../data/assets/boundaries';
import { AggregationZone } from '../../domain/geo/frontDetection';
import { OptimizedRoute } from '../../domain/geo/routePlanner';
import { AgentQueryResult } from '../../domain/agents/orcaTypes';
import { MarineSummary, buildSstGridForBbox } from '../../data/sources/openMeteoService';
import { useTranslation } from '../../core/i18n/LanguageContext';

export type MapLayer = 'waves' | 'sst' | 'wind' | 'pfz' | 'fronts' | 'boundary' | 'route';

interface MapScreenProps {
  userPos: LatLng;
  vessel: VesselClass;
  marineSummary: MarineSummary | null;
  fronts: AggregationZone[];
  activeRoute: OptimizedRoute | null;
  latestAgentResult: AgentQueryResult | null;
  selectedLayer?: MapLayer;
  onLayerChange?: (layer: MapLayer) => void;
  onSelectFront?: (front: AggregationZone) => void;
  onOpenAskTab?: () => void;
  onRefreshData?: () => void;
}

export const MapScreen: React.FC<MapScreenProps> = ({
  userPos,
  vessel,
  marineSummary,
  fronts,
  activeRoute,
  latestAgentResult,
  selectedLayer,
  onLayerChange,
  onSelectFront,
  onOpenAskTab,
  onRefreshData,
}) => {
  const { t, language } = useTranslation();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const [activeLayer, setActiveLayer] = useState<MapLayer>(selectedLayer || 'waves');
  const [sheetExpanded, setSheetExpanded] = useState<boolean>(false);
  const [showWhy, setShowWhy] = useState<boolean>(false);
  const [highlightFrontId, setHighlightFrontId] = useState<string | null>(null);
  const [showLayerCue, setShowLayerCue] = useState<boolean>(true);

  const getLayerExplanation = (layer: MapLayer): string => {
    switch (layer) {
      case 'sst':
        return 'SST Thermal Heatmap: Green & cyan indicate cool nutrient-rich upwelling. Pelagic fish aggregate along thermal boundaries.';
      case 'fronts':
      case 'pfz':
        return 'Potential Fishing Zones: Green markers (PFZ 1, 2) represent detected thermal front shear lines with high fish school density.';
      case 'wind':
        return `Wind Forecast: Wind gusts above 25 knots trigger small-craft advisories (Current max: ${marineSummary?.maxWindGusts24h ?? 21} kn).`;
      case 'boundary':
        return 'Maritime Boundary Geofence: Red dashed line is the IMBL. GPS alerts trigger within 10 km to prevent cross-border straying.';
      case 'route':
        return 'Safe Passage Corridor: A* algorithm plots navigation waypoints avoiding heavy swell and restricted marine zones.';
      case 'waves':
      default:
        return `Wave Safety: Waves under 1.5m are safe for artisanal craft. Blue is calm, orange is caution, red exceeds boat limits.`;
    }
  };

  // Sync external selectedLayer if provided
  useEffect(() => {
    if (selectedLayer && selectedLayer !== activeLayer) {
      setActiveLayer(selectedLayer);
    }
  }, [selectedLayer]);

  const handleLayerSwitch = (layer: MapLayer) => {
    setActiveLayer(layer);
    if (onLayerChange) onLayerChange(layer);
  };

  const layerOptions: PillOption<MapLayer>[] = [
    { id: 'waves', label: t.layerWaves },
    { id: 'sst', label: 'SST Thermal', badge: `${marineSummary?.currentSst ?? 28}°C` },
    { id: 'fronts', label: 'Thermal Fronts', badge: `${fronts.length}` },
    { id: 'pfz', label: 'PFZ Fish Zones', badge: 'High' },
    { id: 'wind', label: t.layerWind },
    { id: 'boundary', label: t.layerBoundary },
    { id: 'route', label: t.layerRoute },
  ];

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [userPos.lat, userPos.lng],
      zoom: 9,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
    layerGroupRef.current = layerGroup;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Recenter map on user location
  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([userPos.lat, userPos.lng], 10, { duration: 0.8 });
    }
  };

  // Fly to specific front
  const handleFlyToFront = (front: AggregationZone) => {
    if (mapInstanceRef.current) {
      setHighlightFrontId(front.id);
      mapInstanceRef.current.flyTo([front.center.lat, front.center.lng], 11, { duration: 1.0 });
    }
  };

  // Update Layers & Overlays on state change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = layerGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    // 1. User Vessel Position Marker
    const userIcon = L.divIcon({
      className: 'custom-user-icon',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="w-7 h-7 rounded-full bg-[#000000] border-2 border-white shadow-xl flex items-center justify-center">
            <div class="w-3 h-3 rounded-full bg-[#007aff]"></div>
          </div>
          <div class="absolute w-12 h-12 rounded-full bg-[#007aff]/25 animate-ping pointer-events-none"></div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    L.marker([userPos.lat, userPos.lng], { icon: userIcon })
      .bindPopup(
        `<div class="text-xs p-1 space-y-1">
          <div class="font-bold text-[#1c1c1e] text-sm">Your Vessel GPS</div>
          <div class="text-[#8e8e93]">Lat: ${userPos.lat.toFixed(3)}, Lng: ${userPos.lng.toFixed(3)}</div>
          <div class="text-xs font-semibold text-[#007aff]">Class: ${vessel.toUpperCase()}</div>
        </div>`
      )
      .addTo(group);

    // 2. Maritime Boundary Lines & MPAs
    MARITIME_BOUNDARIES.forEach((b) => {
      const latlngs = b.coordinates.map((c) => [c.lat, c.lng] as [number, number]);
      if (b.type === 'imbl') {
        L.polyline(latlngs, {
          color: '#ff3b30',
          weight: 3.5,
          dashArray: '6, 6',
          opacity: 0.9,
        })
          .bindPopup(`<div class="text-xs"><strong>${b.name}</strong><br/>${b.description}</div>`)
          .addTo(group);
      } else if (b.type === 'mpa') {
        L.polygon(latlngs, {
          color: '#af52de',
          weight: 2,
          fillColor: '#af52de',
          fillOpacity: 0.18,
        })
          .bindPopup(`<div class="text-xs"><strong>${b.name}</strong><br/>Restricted marine sanctuary area.</div>`)
          .addTo(group);
      }
    });

    // 3. SST THERMAL HEATMAP RASTER LAYER
    if (activeLayer === 'sst' || activeLayer === 'fronts' || activeLayer === 'pfz') {
      const sstGrid = buildSstGridForBbox(userPos, 0.7, 0.7, 10);
      const latHalfStep = Math.abs(sstGrid.lats[1] - sstGrid.lats[0]) / 2;
      const lngHalfStep = Math.abs(sstGrid.lngs[1] - sstGrid.lngs[0]) / 2;

      sstGrid.lats.forEach((lat, r) => {
        sstGrid.lngs.forEach((lng, c) => {
          const sst = sstGrid.sstMatrix[r]?.[c];
          if (sst == null || isNaN(sst)) return;

          // Oceanographic thermal gradient mapping
          let color = '#34c759';
          let label = 'Optimum Pelagic Shelf';
          if (sst < 27.2) {
            color = '#007aff';
            label = 'Deep Coastal Upwelling (Nutrient Dense)';
          } else if (sst < 27.8) {
            color = '#00c7be';
            label = 'Upwelling Boundary (High Chlorophyll)';
          } else if (sst < 28.5) {
            color = '#34c759';
            label = 'Optimum Pelagic Aggregation (Sardines / Mackerel)';
          } else if (sst < 29.1) {
            color = '#ff9500';
            label = 'Warm Surface Layer';
          } else {
            color = '#ff3b30';
            label = 'Tropical Warm Stratified Layer';
          }

          const bounds: L.LatLngBoundsExpression = [
            [lat - latHalfStep, lng - lngHalfStep],
            [lat + latHalfStep, lng + lngHalfStep],
          ];

          L.rectangle(bounds, {
            color: color,
            weight: 0.4,
            fillColor: color,
            fillOpacity: activeLayer === 'sst' ? 0.35 : 0.18,
          })
            .bindPopup(
              `<div class="text-xs space-y-1 p-1">
                <div class="font-bold text-[#1c1c1e] flex items-center justify-between gap-3">
                  <span>Sea Surface Temp</span>
                  <span class="px-2 py-0.5 rounded-full text-white font-bold text-[11px]" style="background:${color}">${sst}°C</span>
                </div>
                <div class="text-[11px] text-[#3a3a3c] font-medium">${label}</div>
                <div class="text-[10px] text-[#8e8e93] border-t border-black/5 pt-1">
                  NOAA AVHRR Satellite Multi-Sensor Blend
                </div>
              </div>`
            )
            .addTo(group);
        });
      });
    }

    // 4. Potential Fishing Zones (PFZ) & Thermal Front Markers
    fronts.forEach((front, index) => {
      const isSelected = highlightFrontId === front.id;
      const frontIcon = L.divIcon({
        className: 'custom-front-icon',
        html: `
          <div class="px-2.5 py-1 ${isSelected ? 'bg-black text-white ring-4 ring-emerald-400' : 'bg-[#34c759] text-white'} text-[11px] font-bold rounded-full shadow-lg border border-white whitespace-nowrap flex items-center gap-1 cursor-pointer transition-transform hover:scale-110">
            <span>PFZ ${index + 1}</span>
            <span class="opacity-90 font-normal">(${front.meanSst}°C)</span>
          </div>
        `,
        iconSize: [80, 24],
        iconAnchor: [40, 12],
      });

      L.marker([front.center.lat, front.center.lng], { icon: frontIcon })
        .bindPopup(
          `<div class="text-xs space-y-1.5 p-1">
            <div class="font-bold text-[#1c1c1e] text-sm flex items-center justify-between">
              <span>Potential Fishing Zone #${index + 1}</span>
              <span class="text-emerald-600 font-bold">${(front.confidence * 100).toFixed(0)}% Conf</span>
            </div>
            <div class="text-[#3a3a3c] text-[11px]">
              Thermal Front Gradient: <strong>${front.gradient}°C/km</strong><br/>
              Mean SST: <strong>${front.meanSst}°C</strong><br/>
              Distance from Vessel: <strong>${front.distanceKm.toFixed(1)} km</strong> (Bearing ${Math.round(front.bearingDeg)}°)
            </div>
            <div class="text-[10px] text-[#8e8e93]">Target Species: Indian Oil Sardine, Mackerel, Anchovy</div>
          </div>`
        )
        .addTo(group);

      // Glowing zone radius
      L.circle([front.center.lat, front.center.lng], {
        radius: 3800,
        color: '#34c759',
        weight: isSelected ? 3 : 1.5,
        fillColor: '#34c759',
        fillOpacity: isSelected ? 0.35 : 0.2,
      }).addTo(group);
    });

    // 5. Connect Thermal Front Convergence Shear Line
    if ((activeLayer === 'fronts' || activeLayer === 'sst') && fronts.length >= 2) {
      const frontPoints = fronts.map((f) => [f.center.lat, f.center.lng] as [number, number]);
      L.polyline(frontPoints, {
        color: '#00c7be',
        weight: 3,
        dashArray: '8, 8',
        opacity: 0.85,
      })
        .bindPopup(`<div class="text-xs"><strong>Thermal Front Convergence Line</strong><br/>High probability zone for pelagic fish school aggregation.</div>`)
        .addTo(group);
    }

    // 6. Wave Field Simulation Polygons
    if (activeLayer === 'waves' && marineSummary) {
      const wave = marineSummary.currentWaveHeight;
      const color = wave >= 2.5 ? '#ff3b30' : wave >= 1.5 ? '#ff9500' : '#007aff';
      L.circle([userPos.lat, userPos.lng], {
        radius: 14000,
        color,
        weight: 2,
        fillColor: color,
        fillOpacity: 0.15,
      })
        .bindPopup(`<div class="text-xs font-semibold">Significant Wave Height: ${wave}m (Swell: ${marineSummary.currentSwellHeight}m)</div>`)
        .addTo(group);
    }

    // 7. Active A* Safe Route
    if (activeRoute && activeRoute.path.length > 0) {
      const routePoints = activeRoute.path.map((p) => [p.lat, p.lng] as [number, number]);
      L.polyline(routePoints, {
        color: activeRoute.overallSeverity === 'red' ? '#ff3b30' : '#000000',
        weight: 4.5,
        opacity: 0.95,
      })
        .bindPopup(
          `<div class="text-xs">
            <strong>Optimized Safe Maritime Corridor</strong><br/>
            Total: ${activeRoute.totalDistanceKm} km | ETA: ${activeRoute.etaHours} hrs<br/>
            Max Wave along track: ${activeRoute.maxWaveHeightM}m
          </div>`
        )
        .addTo(group);
    }
  }, [userPos, fronts, activeLayer, marineSummary, activeRoute, highlightFrontId]);

  const hasHighRisk = latestAgentResult?.severity === 'red';
  const nearestFront = fronts[0];

  return (
    <div className="relative w-full flex-1 min-h-0 flex flex-col overflow-hidden bg-[#f2f2f7]">
      {/* Persistent Hazard Banner if Red Risk */}
      {hasHighRisk && (
        <SeverityBanner
          severity="red"
          title={t.criticalHazardTitle}
          message={latestAgentResult.summary}
          className="z-20 relative"
          actionButton={
            <button
              onClick={onOpenAskTab}
              className="px-3 py-1 rounded-full bg-white text-[#ff3b30] font-bold text-xs cursor-pointer shadow-xs"
            >
              {t.details}
            </button>
          }
        />
      )}

      {/* Layer Selector Frosted Pill Bar */}
      <div className="absolute top-3 left-3 right-3 z-10 pointer-events-none">
        <div className="pointer-events-auto overflow-x-auto no-scrollbar w-full">
          <NavPillGroup
            options={layerOptions}
            selectedId={activeLayer}
            onChange={(id) => handleLayerSwitch(id as MapLayer)}
            scrollable
          />
        </div>
      </div>

      {/* Contextual Nav Cue for Beginners & Evaluators */}
      {showLayerCue && (
        <div className="absolute top-14 left-3 right-3 z-10 pointer-events-auto">
          <div className="glass-surface rounded-2xl px-3 py-1.5 shadow-md border border-black/10 flex items-center justify-between gap-2 text-[11px] animate-in fade-in duration-150">
            <div className="flex items-center gap-1.5 text-[#1c1c1e] font-medium leading-tight">
              <span className="w-1.5 h-1.5 rounded-full bg-[#007aff] shrink-0" />
              <span className="text-[#007aff] font-bold">Guide:</span>
              <span>{getLayerExplanation(activeLayer)}</span>
            </div>
            <button
              onClick={() => setShowLayerCue(false)}
              className="text-[#8e8e93] hover:text-[#1c1c1e] p-0.5 cursor-pointer shrink-0"
              title="Hide cue"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Full-bleed Leaflet Map */}
      <div ref={mapContainerRef} className="w-full h-full flex-1" />

      {/* Floating Center on Vessel Button */}
      <div className="absolute bottom-24 right-3.5 z-20 flex flex-col gap-2">
        <button
          onClick={handleRecenter}
          className="w-11 h-11 rounded-full glass-surface text-[#000000] hover:bg-white active:scale-95 transition-all flex items-center justify-center shadow-lg border border-black/10 cursor-pointer"
          title="Recenter on My Vessel GPS"
          aria-label="Recenter on My Vessel GPS"
        >
          <LocateFixed className="w-5 h-5 text-[#007aff]" />
        </button>
      </div>

      {/* SST Thermal HUD Telemetry Card (Shown when SST or Fronts are selected) */}
      {(activeLayer === 'sst' || activeLayer === 'fronts' || activeLayer === 'pfz') && (
        <div
          className={`absolute left-3 z-10 max-w-[calc(100%-24px)] sm:max-w-[280px] glass-surface rounded-2xl p-3 shadow-xl border border-black/10 text-xs space-y-2 animate-in fade-in duration-200 pointer-events-auto transition-all ${
            showLayerCue ? 'top-[96px]' : 'top-14'
          }`}
        >
          <div className="flex items-center justify-between border-b border-black/5 pb-1.5">
            <div className="flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-orange-500" />
              <span className="font-display font-bold text-xs text-[#1c1c1e]">
                SST Thermal Telemetry
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
              LIVE
            </span>
          </div>

          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-[#8e8e93]">Vessel SST:</span>
              <span className="font-bold text-[#1c1c1e]">{marineSummary?.currentSst ?? 28.2}°C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8e8e93]">Thermal Gradient:</span>
              <span className="font-bold text-orange-600">{nearestFront?.gradient ?? 0.029}°C/km</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8e8e93]">Nearest Front:</span>
              <span className="font-bold text-emerald-700">
                {nearestFront ? `${nearestFront.distanceKm.toFixed(1)} km (${Math.round(nearestFront.bearingDeg)}°)` : 'None'}
              </span>
            </div>
          </div>

          {/* Quick Front Focus Button */}
          {nearestFront && (
            <button
              onClick={() => handleFlyToFront(nearestFront)}
              className="w-full py-1.5 px-2.5 rounded-xl bg-[#000000] text-white text-[11px] font-semibold flex items-center justify-center gap-1 hover:bg-[#1c1c1e] active:scale-95 transition cursor-pointer shadow-xs"
            >
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              <span>Fly to PFZ #1 Front</span>
            </button>
          )}

          {/* SST Colorbar Gradient Legend */}
          <div className="pt-1 border-t border-black/5 space-y-1">
            <div className="h-2 rounded-full w-full bg-gradient-to-r from-[#007aff] via-[#34c759] to-[#ff3b30]" />
            <div className="flex justify-between text-[9px] text-[#8e8e93] font-semibold">
              <span>26.5°C (Upwelling)</span>
              <span>28.0°C (PFZ)</span>
              <span>29.5°C (Warm)</span>
            </div>
          </div>
        </div>
      )}

      {/* Frosted Glass Draggable Bottom Sheet with Latest Agent Decision */}
      <div
        className={`
          absolute bottom-0 left-0 right-0 z-20
          glass-surface rounded-t-3xl shadow-2xl
          transition-all duration-300 max-h-[55vh] flex flex-col
          ${sheetExpanded ? 'translate-y-0' : 'translate-y-[calc(100%-52px)]'}
        `}
      >
        {/* Sheet Header Handle */}
        <button
          onClick={() => setSheetExpanded(!sheetExpanded)}
          className="w-full pt-3 pb-2.5 px-4 flex flex-col items-center justify-center cursor-pointer select-none focus:outline-none"
        >
          <div className="w-10 h-1.2 rounded-full bg-black/20 mb-2" />
          <div className="w-full flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-[#1c1c1e] text-sm">
                {t.latestAdvisory}
              </span>
              {latestAgentResult && (
                <BadgePill
                  label={latestAgentResult.severity.toUpperCase()}
                  variant="severity"
                  severity={latestAgentResult.severity}
                />
              )}
            </div>
            <div className="flex items-center gap-1 text-[#8e8e93]">
              <span className="text-[11px] font-medium">
                {sheetExpanded ? t.minimize : t.expand}
              </span>
              <ChevronUp
                className={`w-4 h-4 transition-transform duration-200 ${
                  sheetExpanded ? 'rotate-180' : ''
                }`}
              />
            </div>
          </div>
        </button>

        {/* Sheet Content */}
        <div className="px-4 pb-5 overflow-y-auto space-y-3 text-xs">
          {latestAgentResult ? (
            <>
              <p className="text-[#1c1c1e] leading-relaxed font-medium bg-black/[0.03] p-3.5 rounded-2xl border border-black/[0.04]">
                {language !== 'en' && latestAgentResult.nativeSummary
                  ? latestAgentResult.nativeSummary
                  : latestAgentResult.summary}
              </p>

              {/* Evidence Metrics Rows */}
              <div className="border border-black/[0.06] rounded-2xl p-3.5 bg-white/70 space-y-1">
                <div className="font-bold text-[#1c1c1e] text-xs mb-1.5 flex items-center justify-between">
                  <span>{t.metoceanEvidence}</span>
                  <span className="text-[10px] text-[#8e8e93] font-medium">
                    {latestAgentResult.provenance.source}
                  </span>
                </div>
                {latestAgentResult.evidence.slice(0, 4).map((item, idx) => (
                  <EvidenceRow key={idx} item={item} />
                ))}
              </div>

              {/* "Why?" Explainer Accordion */}
              <div className="border border-black/[0.06] rounded-2xl overflow-hidden bg-white/60">
                <button
                  onClick={() => setShowWhy(!showWhy)}
                  className="w-full px-3.5 py-2.5 flex items-center justify-between font-semibold text-[#1c1c1e] hover:bg-black/[0.03] cursor-pointer"
                >
                  <span>{t.whyTitle}</span>
                  <span className="text-[#007aff] text-xs font-semibold">
                    {showWhy ? t.whyHide : t.whyShow}
                  </span>
                </button>
                {showWhy && (
                  <div className="px-3.5 pb-3.5 pt-1 text-[11px] text-[#3a3a3c] space-y-1.5 border-t border-black/[0.04]">
                    {latestAgentResult.chainOfReasoning.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-[#8e8e93] font-bold shrink-0">
                          {idx + 1}.
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="py-4 text-center text-[#8e8e93] font-medium">
              Loading real-time marine advisory...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
