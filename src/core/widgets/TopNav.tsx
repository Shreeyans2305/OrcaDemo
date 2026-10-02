import React, { useState, useRef, useLayoutEffect } from 'react';
import {
  Shield,
  Globe,
  ChevronDown,
  Check,
  Thermometer,
  Waves,
  Wind,
  Compass,
  Fish,
  Sparkles,
  Info,
  X,
  Smartphone,
  Monitor,
} from 'lucide-react';
import { BadgePill } from './BadgePill';
import { VesselClass, VESSEL_CONFIGS } from '../config/safetyThresholds';
import { useTranslation } from '../i18n/LanguageContext';
import { MarineSummary } from '../../data/sources/openMeteoService';

interface TopNavProps {
  vessel: VesselClass;
  onChangeVessel?: (v: VesselClass) => void;
  marineSummary?: MarineSummary | null;
  frontsCount?: number;
  isDemoMode: boolean;
  isPhoneMode?: boolean;
  onTogglePhoneMode?: () => void;
  onSelectMapLayer?: (layer: 'waves' | 'sst' | 'wind' | 'pfz' | 'fronts' | 'boundary' | 'route') => void;
  onOpenSettings?: () => void;
  onOpenOnboarding?: () => void;
}

interface DropdownPos {
  top: number;
  right: number;
}

export const TopNav: React.FC<TopNavProps> = ({
  vessel,
  onChangeVessel,
  marineSummary,
  frontsCount = 0,
  isDemoMode,
  isPhoneMode = false,
  onTogglePhoneMode,
  onSelectMapLayer,
  onOpenSettings,
  onOpenOnboarding,
}) => {
  const { language, setLanguage, t, languages, getVesselName } = useTranslation();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isTelemetryOpen, setIsTelemetryOpen] = useState(false);
  const [isVesselMenuOpen, setIsVesselMenuOpen] = useState(false);
  const [langDropPos, setLangDropPos] = useState<DropdownPos>({ top: 56, right: 12 });
  const [vesselDropPos, setVesselDropPos] = useState<DropdownPos>({ top: 56, right: 12 });

  const langBtnRef = useRef<HTMLButtonElement>(null);
  const vesselBtnRef = useRef<HTMLButtonElement>(null);

  const specs = VESSEL_CONFIGS[vessel];
  const currentLangObj = languages.find((l) => l.code === language) || languages[0];

  const sstVal = marineSummary?.currentSst ?? 28.2;
  const waveVal = marineSummary?.currentWaveHeight ?? 1.1;

  const openLangMenu = () => {
    if (langBtnRef.current) {
      const rect = langBtnRef.current.getBoundingClientRect();
      setLangDropPos({
        top: rect.bottom + 6,
        right: Math.max(8, window.innerWidth - rect.right),
      });
    }
    setIsLangMenuOpen(true);
    setIsVesselMenuOpen(false);
  };

  const openVesselMenu = () => {
    if (vesselBtnRef.current) {
      const rect = vesselBtnRef.current.getBoundingClientRect();
      setVesselDropPos({
        top: rect.bottom + 6,
        right: Math.max(8, window.innerWidth - rect.right),
      });
    }
    setIsVesselMenuOpen(true);
    setIsLangMenuOpen(false);
  };

  return (
    <header className="h-14 glass-nav px-3 sm:px-4 flex items-center justify-between z-30 sticky top-0 shrink-0 w-full select-none relative">
      {/* Left: Brand Logo & Guide Button */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onOpenOnboarding}
          className="flex items-center gap-1.5 focus:outline-none cursor-pointer group text-left"
          title="About ORCA"
        >
          <span className="font-display text-lg tracking-tighter text-[#000000] font-bold">
            orca
          </span>
          <span className="w-2 h-2 rounded-full bg-[#007aff]" />
        </button>

        {!isPhoneMode && (
          <span className="hidden lg:inline-block text-xs text-[#8e8e93] border-l border-black/10 pl-3 font-medium truncate max-w-[200px]">
            {t.tagline}
          </span>
        )}

        {/* 1-Tap Guide Button for Judges & Beginners */}
        <button
          onClick={onOpenOnboarding}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#007aff]/10 hover:bg-[#007aff]/20 text-[#007aff] text-[11px] font-bold transition cursor-pointer active:scale-95 border border-[#007aff]/20 shrink-0"
          title="Open Evaluator Guide & 30-Second Walkthrough"
        >
          <Sparkles className="w-3 h-3 text-[#007aff]" />
          <span>Guide</span>
        </button>
      </div>

      {/* Center: Live Metocean Interactive Telemetry Badges */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* SST Thermal Quick Pill */}
        <button
          onClick={() => {
            if (onSelectMapLayer) onSelectMapLayer('sst');
            setIsTelemetryOpen(true);
          }}
          className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-[#1c1c1e] hover:bg-orange-500/20 active:scale-95 transition-all cursor-pointer shadow-xs shrink-0"
          title="Click to view SST Thermal Heatmap & Telemetry"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
          <Thermometer className="w-3 h-3 text-orange-600 shrink-0" />
          <span className="text-[11px] font-bold text-[#1c1c1e]">{sstVal}°C</span>
          {!isPhoneMode && (
            <span className="text-[10px] text-orange-700 font-semibold uppercase tracking-wider">
              SST
            </span>
          )}
        </button>

        {/* Wave Metric Quick Pill (Shown in Desktop Mode) */}
        {!isPhoneMode && (
          <button
            onClick={() => {
              if (onSelectMapLayer) onSelectMapLayer('waves');
            }}
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#1c1c1e] hover:bg-blue-500/20 active:scale-95 transition-all cursor-pointer shadow-xs shrink-0"
            title="Click to view Live Wave Field"
          >
            <Waves className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-[11px] font-bold text-[#1c1c1e]">{waveVal}m</span>
          </button>
        )}

        {/* PFZ Thermal Fronts Pill (Shown in Desktop Mode) */}
        {!isPhoneMode && frontsCount > 0 && (
          <button
            onClick={() => {
              if (onSelectMapLayer) onSelectMapLayer('pfz');
            }}
            className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 hover:bg-emerald-500/20 active:scale-95 transition-all cursor-pointer shadow-xs shrink-0"
            title="Potential Fishing Zones"
          >
            <Fish className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[11px] font-bold">{frontsCount} PFZs</span>
          </button>
        )}
      </div>

      {/* Right Controls: Language Selector & Vessel Profile */}
      <div className={`flex items-center gap-1 shrink-0 ${!isPhoneMode ? 'md:pr-28' : ''}`}>
        {/* Language Selector Dropdown — uses fixed positioning to escape overflow:hidden */}
        <div className="relative">
          <button
            ref={langBtnRef}
            onClick={openLangMenu}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-black/5 hover:bg-black/10 text-xs font-semibold text-[#1c1c1e] transition-all cursor-pointer select-none shrink-0"
            aria-label="Change Language"
          >
            <Globe className="w-3 h-3 text-[#000000]" />
            <span className="text-[11px] uppercase font-bold">{currentLangObj.code}</span>
            <ChevronDown className="w-2.5 h-2.5 text-[#8e8e93]" />
          </button>

          {isLangMenuOpen && (
            <>
              {/* Full-screen fixed backdrop */}
              <div
                className="fixed inset-0 z-[9998]"
                onClick={() => setIsLangMenuOpen(false)}
              />
              {/* Fixed-position dropdown — escapes all overflow:hidden parents */}
              <div
                style={{ top: langDropPos.top, right: langDropPos.right }}
                className="fixed w-44 glass-surface rounded-2xl p-1.5 shadow-2xl z-[9999] animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#8e8e93]">
                  {t.changeLanguage}
                </div>
                <div className="max-h-52 overflow-y-auto space-y-0.5">
                  {languages.map((lang) => {
                    const isSelected = lang.code === language;
                    return (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangMenuOpen(false);
                        }}
                        className={`
                          w-full px-2.5 py-1.5 rounded-xl flex items-center justify-between text-xs text-left transition-colors cursor-pointer
                          ${
                            isSelected
                              ? 'bg-black text-white font-semibold'
                              : 'text-[#1c1c1e] hover:bg-black/5'
                          }
                        `}
                      >
                        <div>
                          <div>{lang.nativeName}</div>
                          <div className={`text-[10px] ${isSelected ? 'text-white/70' : 'text-[#8e8e93]'}`}>
                            {lang.name}
                          </div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Vessel safety class badge & Quick Switch — fixed positioning dropdown */}
        <div className="relative">
          <button
            ref={vesselBtnRef}
            onClick={() => {
              if (onChangeVessel) {
                openVesselMenu();
              } else if (onOpenSettings) {
                onOpenSettings();
              }
            }}
            className="inline-flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1 rounded-full bg-white border border-black/10 shadow-xs hover:bg-neutral-50 text-xs text-[#1c1c1e] font-medium transition-all cursor-pointer shrink-0"
            title={`Vessel Safety Class: ${getVesselName(vessel)} (Limit: ≤${specs.maxWaveHeight}m)`}
            aria-label="Vessel Safety Class"
          >
            <Shield className="w-3.5 h-3.5 text-[#007aff]" />
            {!isPhoneMode && (
              <>
                <span className="text-[11px] font-semibold">{getVesselName(vessel).split(' ')[0]}</span>
                <span className="text-[10px] text-[#8e8e93]">≤{specs.maxWaveHeight}m</span>
              </>
            )}
          </button>

          {isVesselMenuOpen && onChangeVessel && (
            <>
              <div
                className="fixed inset-0 z-[9998]"
                onClick={() => setIsVesselMenuOpen(false)}
              />
              <div
                style={{ top: vesselDropPos.top, right: vesselDropPos.right }}
                className="fixed w-52 glass-surface rounded-2xl p-2 shadow-2xl z-[9999] animate-in fade-in zoom-in-95 duration-150 space-y-1"
              >
                <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#8e8e93]">
                  Select Vessel Class
                </div>
                {(Object.keys(VESSEL_CONFIGS) as VesselClass[]).map((vKey) => {
                  const isSel = vessel === vKey;
                  const cfg = VESSEL_CONFIGS[vKey];
                  return (
                    <button
                      key={vKey}
                      onClick={() => {
                        onChangeVessel(vKey);
                        setIsVesselMenuOpen(false);
                      }}
                      className={`
                        w-full p-2 rounded-xl flex items-center justify-between text-xs text-left transition cursor-pointer
                        ${isSel ? 'bg-black text-white font-semibold' : 'hover:bg-black/5 text-[#1c1c1e]'}
                      `}
                    >
                      <div>
                        <div className="font-bold">{getVesselName(vKey)}</div>
                        <div className={`text-[10px] ${isSel ? 'text-white/70' : 'text-[#8e8e93]'}`}>
                          Max Wave: {cfg.maxWaveHeight}m • {cfg.typicalSpeed}kn
                        </div>
                      </div>
                      {isSel && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Interactive Telemetry Dropdown Drawer — fixed to viewport */}
      {isTelemetryOpen && (
        <>
          <div
            className="fixed inset-0 z-[9998] bg-black/20 backdrop-blur-[2px]"
            onClick={() => setIsTelemetryOpen(false)}
          />
          <div className="fixed top-14 left-3 right-3 sm:left-auto sm:right-4 sm:w-80 glass-surface rounded-2xl p-4 shadow-2xl z-[9999] animate-in fade-in zoom-in-95 duration-200 space-y-3 border border-black/10">
            <div className="flex items-center justify-between border-b border-black/5 pb-2">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-orange-500" />
                <span className="font-display font-bold text-xs text-[#1c1c1e]">
                  Live Ocean Metocean Telemetry
                </span>
              </div>
              <button
                onClick={() => setIsTelemetryOpen(false)}
                className="p-1 rounded-full hover:bg-black/5 text-[#8e8e93] hover:text-[#1c1c1e] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-orange-500/5 border border-orange-500/10">
                <div className="text-[10px] text-orange-600 font-bold uppercase tracking-wider">
                  Sea Surface Temp
                </div>
                <div className="font-display text-base font-bold text-[#1c1c1e]">
                  {sstVal}°C
                </div>
                <div className="text-[10px] text-[#8e8e93]">NOAA / AVHRR Blended</div>
              </div>

              <div className="p-2.5 rounded-xl bg-blue-500/5 border border-blue-500/10">
                <div className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">
                  Significant Waves
                </div>
                <div className="font-display text-base font-bold text-[#1c1c1e]">
                  {waveVal}m
                </div>
                <div className="text-[10px] text-[#8e8e93]">Max 24h: {marineSummary?.maxWaveHeight24h ?? 1.5}m</div>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                  Thermal Fronts (PFZ)
                </div>
                <div className="font-display text-base font-bold text-[#1c1c1e]">
                  {frontsCount} Zones
                </div>
                <div className="text-[10px] text-[#8e8e93]">Pelagic Concentration</div>
              </div>

              <div className="p-2.5 rounded-xl bg-purple-500/5 border border-purple-500/10">
                <div className="text-[10px] text-purple-600 font-bold uppercase tracking-wider">
                  Ocean Currents
                </div>
                <div className="font-display text-base font-bold text-[#1c1c1e]">
                  {marineSummary?.currentCurrentVelocityKnots ?? 0.8} kn
                </div>
                <div className="text-[10px] text-[#8e8e93]">Bearing: {marineSummary?.currentCurrentDirectionDeg ?? 45}°</div>
              </div>
            </div>

            <div className="pt-1 flex items-center gap-2">
              <button
                onClick={() => {
                  if (onSelectMapLayer) onSelectMapLayer('sst');
                  setIsTelemetryOpen(false);
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-[#000000] text-white text-xs font-semibold hover:bg-[#1c1c1e] text-center cursor-pointer shadow-xs active:scale-95 transition"
              >
                Inspect SST Thermal Layer
              </button>
            </div>
          </div>
        </>
      )}
    </header>
  );
};
