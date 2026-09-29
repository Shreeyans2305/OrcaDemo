import React, { useState } from 'react';
import {
  Shield,
  X,
  Check,
  Compass,
  Thermometer,
  Waves,
  Fish,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { LanguageCode } from '../../domain/agents/orcaTypes';
import { VesselClass, VESSEL_CONFIGS, UnitSystem } from '../../core/config/safetyThresholds';
import { ButtonPrimary } from '../../core/widgets/ButtonPrimary';
import { DarkFooter } from '../../core/widgets/DarkFooter';
import { useTranslation } from '../../core/i18n/LanguageContext';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: LanguageCode;
  onChangeLanguage: (lang: LanguageCode) => void;
  currentVessel: VesselClass;
  onChangeVessel: (vessel: VesselClass) => void;
  units: UnitSystem;
  onChangeUnits: (units: UnitSystem) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onChangeLanguage,
  currentVessel,
  onChangeVessel,
}) => {
  const { t, languages, getVesselName, getVesselDesc } = useTranslation();
  const [activeTab, setActiveTab] = useState<'guide' | 'settings'>('guide');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="glass-surface rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col my-auto border border-white/40">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-black/[0.06] flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-display text-2xl font-bold text-[#000000] tracking-tight">
                orca
              </span>
              <span className="w-2 h-2 rounded-full bg-[#007aff] animate-pulse" />
              <span className="text-[10px] font-bold text-[#007aff] bg-[#007aff]/10 px-2 py-0.5 rounded-full border border-[#007aff]/20">
                Evaluator Guide
              </span>
            </div>
            <p className="text-xs text-[#8e8e93] font-medium">
              Marine Ecosystem Reasoning with Collaborative Agents
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#8e8e93] hover:text-[#000000] hover:bg-black/5 cursor-pointer transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Evaluator Guide vs Setup */}
        <div className="px-6 pt-4 flex gap-2">
          <button
            onClick={() => setActiveTab('guide')}
            className={`
              flex-1 py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5
              ${
                activeTab === 'guide'
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-black/5 text-[#8e8e93] hover:text-[#1c1c1e]'
              }
            `}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>30-Sec Judge Tour</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`
              flex-1 py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5
              ${
                activeTab === 'settings'
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-black/5 text-[#8e8e93] hover:text-[#1c1c1e]'
              }
            `}
          >
            <span>Vessel & Language</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs flex-1">
          {activeTab === 'guide' ? (
            /* Evaluator / Beginner Guide Tour */
            <div className="space-y-3.5">
              <div className="bg-blue-500/5 p-3.5 rounded-2xl border border-blue-500/10 space-y-1">
                <h3 className="font-display font-bold text-xs text-[#1c1c1e] flex items-center gap-1.5">
                  <span>How to test this prototype:</span>
                </h3>
                <p className="text-[11px] text-[#3a3a3c] leading-relaxed">
                  ORCA combines satellite oceanography (NOAA SST & Open-Meteo), geofencing, and <strong>Hack Club AI (GPT-4o-mini)</strong> to keep small-scale fishermen safe.
                </p>
              </div>

              {/* 4 Feature Test Cards */}
              <div className="space-y-2">
                <div className="p-3 rounded-2xl bg-white border border-black/5 shadow-2xs space-y-1">
                  <div className="font-bold text-xs text-[#1c1c1e] flex items-center gap-1.5">
                    <Thermometer className="w-3.5 h-3.5 text-orange-500" />
                    <span>1. SST Thermal & Potential Fishing Zones (PFZ)</span>
                  </div>
                  <p className="text-[11px] text-[#8e8e93] leading-relaxed">
                    Click the <strong>SST Thermal</strong> layer on the map to see satellite temperature gradients. Green/cyan zones mark upwelling where pelagic fish (sardines/mackerel) aggregate.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-black/5 shadow-2xs space-y-1">
                  <div className="font-bold text-xs text-[#1c1c1e] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span>2. Ask Hack Club AI (Regional Reasoning)</span>
                  </div>
                  <p className="text-[11px] text-[#8e8e93] leading-relaxed">
                    Go to the <strong>Ask tab</strong> and tap any sample prompt. Hack Club AI calculates live wave heights and explains decisions in English, Tamil, Hindi, or Marathi with numbers.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-black/5 shadow-2xs space-y-1">
                  <div className="font-bold text-xs text-[#1c1c1e] flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                    <span>3. Boundary Geofence Safety</span>
                  </div>
                  <p className="text-[11px] text-[#8e8e93] leading-relaxed">
                    The red dashed line marks the <strong>International Maritime Boundary Line (IMBL)</strong>. GPS alerts trigger within 10 km to prevent accidental detention in foreign waters.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-black/5 shadow-2xs space-y-1">
                  <div className="font-bold text-xs text-[#1c1c1e] flex items-center gap-1.5">
                    <Waves className="w-3.5 h-3.5 text-blue-500" />
                    <span>4. Vessel Limit Thresholds</span>
                  </div>
                  <p className="text-[11px] text-[#8e8e93] leading-relaxed">
                    Switch vessel classes in the top bar to see how safety dynamically scales (Artisanal: ≤1.5m waves vs Trawler: ≤3.5m waves).
                  </p>
                </div>
              </div>

              <ButtonPrimary onClick={onClose} fullWidth className="rounded-2xl h-11 text-xs font-bold mt-2">
                Start Testing Now &rarr;
              </ButtonPrimary>
            </div>
          ) : (
            /* Settings Tab */
            <div className="space-y-4">
              {/* 1. Language */}
              <div className="space-y-2">
                <label className="font-display font-bold text-xs text-[#1c1c1e] block">
                  {t.stepLanguage}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {languages.map((lang) => {
                    const isSelected = currentLanguage === lang.code;
                    return (
                      <button
                        key={lang.code}
                        onClick={() => onChangeLanguage(lang.code)}
                        className={`
                          p-2.5 rounded-2xl border text-left cursor-pointer transition-all flex items-center justify-between
                          ${
                            isSelected
                              ? 'border-black bg-[#000000] text-white font-bold shadow-xs'
                              : 'border-black/5 bg-white text-[#1c1c1e] hover:bg-neutral-50'
                          }
                        `}
                      >
                        <div>
                          <div className="text-xs">{lang.nativeName}</div>
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

              {/* 2. Vessel Class */}
              <div className="space-y-2">
                <label className="font-display font-bold text-xs text-[#1c1c1e] block">
                  {t.stepVessel}
                </label>
                <div className="space-y-2">
                  {(Object.keys(VESSEL_CONFIGS) as VesselClass[]).map((vKey) => {
                    const v = VESSEL_CONFIGS[vKey];
                    const isSelected = currentVessel === vKey;
                    return (
                      <div
                        key={vKey}
                        onClick={() => onChangeVessel(vKey)}
                        className={`
                          p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between
                          ${
                            isSelected
                              ? 'border-black bg-white ring-2 ring-black shadow-xs'
                              : 'border-black/5 bg-white text-[#1c1c1e] hover:bg-neutral-50'
                          }
                        `}
                      >
                        <div>
                          <div className="font-bold text-xs text-[#1c1c1e]">{getVesselName(vKey)}</div>
                          <div className="text-[10px] text-[#8e8e93] font-medium">{getVesselDesc(vKey)}</div>
                        </div>
                        <div className="text-xs font-bold text-[#1c1c1e] shrink-0">
                          &le;{v.maxWaveHeight}m
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <ButtonPrimary onClick={onClose} fullWidth className="rounded-2xl h-11 text-xs font-bold mt-2">
                Save & Continue
              </ButtonPrimary>
            </div>
          )}
        </div>

        <DarkFooter />
      </div>
    </div>
  );
};
