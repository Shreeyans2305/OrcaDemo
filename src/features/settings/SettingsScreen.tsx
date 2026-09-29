import React from 'react';
import {
  Globe,
  Trash2,
  Play,
  Check,
} from 'lucide-react';
import { LanguageCode } from '../../domain/agents/orcaTypes';
import { VesselClass, VESSEL_CONFIGS, UnitSystem } from '../../core/config/safetyThresholds';
import { ProductMockupCard } from '../../core/widgets/ProductMockupCard';
import { BadgePill } from '../../core/widgets/BadgePill';
import { DarkFooter } from '../../core/widgets/DarkFooter';
import { useTranslation } from '../../core/i18n/LanguageContext';

interface SettingsScreenProps {
  currentLanguage: LanguageCode;
  onChangeLanguage: (lang: LanguageCode) => void;
  currentVessel: VesselClass;
  onChangeVessel: (vessel: VesselClass) => void;
  units: UnitSystem;
  onChangeUnits: (units: UnitSystem) => void;
  isDemoMode: boolean;
  onToggleDemoMode: (val: boolean) => void;
  onRunDemoScenario: (scenarioIndex: number) => void;
  onSimulateBoundaryAlarm: () => void;
  onClearHistory: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  currentLanguage,
  onChangeLanguage,
  currentVessel,
  onChangeVessel,
  units,
  onChangeUnits,
  isDemoMode,
  onToggleDemoMode,
  onRunDemoScenario,
  onClearHistory,
}) => {
  const { t, languages, getVesselName, getVesselDesc } = useTranslation();

  const dataSources = [
    {
      name: 'Open-Meteo High-Res Marine API',
      type: 'Real-time Forecast',
      status: isDemoMode ? 'Demo' : 'Live',
      latency: isDemoMode ? '0ms' : '142ms',
    },
    {
      name: 'INCOIS ERDDAP Marine Server',
      type: 'Ocean State & PFZ',
      status: isDemoMode ? 'Demo' : 'Live (Discovery Mode)',
      latency: '85ms',
    },
    {
      name: 'Hack Club AI Proxy (GPT-4o-mini)',
      type: 'LLM Orchestrator & Multilingual Reasoning API',
      status: 'Live (Proxy)',
      latency: '240ms',
    },
    {
      name: 'Local Geospatial Vector DB & Gazetteer',
      type: 'Deterministic Spatial Math',
      status: 'Live (On-Device)',
      latency: '2ms',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-3.5rem-4rem)] md:min-h-[calc(100vh-4rem-4rem)] bg-[#f2f2f7] pb-16">
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#1c1c1e] tracking-tight">
            {t.settingsTitle}
          </h1>
          <p className="text-xs text-[#8e8e93] mt-0.5 font-medium">
            {t.settingsSubtitle}
          </p>
        </div>

        {/* 1. Language Configuration */}
        <ProductMockupCard title={t.languageSectionTitle}>
          <div className="space-y-3 text-xs">
            <p className="text-[#8e8e93] font-medium">
              {t.languageSectionDesc}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
              {languages.map((lang) => {
                const isSelected = currentLanguage === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => onChangeLanguage(lang.code)}
                    className={`
                      p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between
                      ${
                        isSelected
                          ? 'border-black bg-[#000000] text-white shadow-sm font-semibold'
                          : 'border-black/5 bg-black/[0.02] text-[#1c1c1e] hover:bg-black/[0.05]'
                      }
                    `}
                  >
                    <div>
                      <div className="font-bold text-xs">{lang.nativeName}</div>
                      <div className={`text-[10px] ${isSelected ? 'text-white/70' : 'text-[#8e8e93]'}`}>
                        {lang.name}
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>
        </ProductMockupCard>

        {/* 2. Vessel Safety Class */}
        <ProductMockupCard title={t.vesselSectionTitle}>
          <div className="space-y-3 text-xs">
            <div className="space-y-2">
              {(Object.keys(VESSEL_CONFIGS) as VesselClass[]).map((vKey) => {
                const v = VESSEL_CONFIGS[vKey];
                const isSelected = currentVessel === vKey;
                return (
                  <div
                    key={vKey}
                    onClick={() => onChangeVessel(vKey)}
                    className={`
                      p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3
                      ${
                        isSelected
                          ? 'border-black bg-white shadow-md ring-2 ring-black'
                          : 'border-black/5 bg-black/[0.02] hover:bg-white text-[#1c1c1e]'
                      }
                    `}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-xs text-[#1c1c1e]">
                          {getVesselName(vKey)}
                        </span>
                        {isSelected && <BadgePill label={t.activeBadge} variant="emerald" />}
                      </div>
                      <p className="text-[11px] text-[#8e8e93] font-medium">{getVesselDesc(vKey)}</p>
                    </div>

                    <div className="text-right shrink-0 text-[11px]">
                      <div className="font-bold text-[#1c1c1e]">{t.limitText}: {v.maxWaveHeight}m</div>
                      <div className="text-[#8e8e93] font-medium">Speed: {v.typicalSpeed} kn</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ProductMockupCard>

        {/* 3. Demo Mode & Three Real-World Scenarios */}
        <ProductMockupCard title={t.demoModeTitle}>
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3.5 bg-black/[0.03] border border-black/[0.04] rounded-2xl">
              <div>
                <div className="font-bold text-[#1c1c1e]">{t.demoModeToggleLabel}</div>
                <div className="text-[11px] text-[#8e8e93] font-medium">
                  {t.demoModeToggleDesc}
                </div>
              </div>

              <input
                type="checkbox"
                checked={isDemoMode}
                onChange={(e) => onToggleDemoMode(e.target.checked)}
                className="w-5 h-5 accent-[#000000] cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="text-[11px] font-bold text-[#8e8e93] uppercase tracking-wider">
                {t.blueprintScenariosTitle}
              </div>

              {/* Scenario 1 */}
              <div
                onClick={() => onRunDemoScenario(1)}
                className="p-3.5 bg-white border border-black/5 hover:border-black/20 rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-3 shadow-xs"
              >
                <div>
                  <div className="font-bold text-xs text-[#1c1c1e]">
                    {t.scenario1Title}
                  </div>
                  <div className="text-[11px] text-[#8e8e93] font-medium">
                    {t.scenario1Desc}
                  </div>
                </div>
                <Play className="w-4 h-4 text-[#000000] shrink-0" />
              </div>

              {/* Scenario 2 */}
              <div
                onClick={() => onRunDemoScenario(2)}
                className="p-3.5 bg-white border border-black/5 hover:border-black/20 rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-3 shadow-xs"
              >
                <div>
                  <div className="font-bold text-xs text-[#1c1c1e]">
                    {t.scenario2Title}
                  </div>
                  <div className="text-[11px] text-[#8e8e93] font-medium">
                    {t.scenario2Desc}
                  </div>
                </div>
                <Play className="w-4 h-4 text-[#000000] shrink-0" />
              </div>

              {/* Scenario 3 */}
              <div
                onClick={() => onRunDemoScenario(3)}
                className="p-3.5 bg-white border border-black/5 hover:border-black/20 rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-3 shadow-xs"
              >
                <div>
                  <div className="font-bold text-xs text-[#1c1c1e]">
                    {t.scenario3Title}
                  </div>
                  <div className="text-[11px] text-[#8e8e93] font-medium">
                    {t.scenario3Desc}
                  </div>
                </div>
                <Play className="w-4 h-4 text-[#000000] shrink-0" />
              </div>
            </div>
          </div>
        </ProductMockupCard>

        {/* 4. Data Source Status Registry */}
        <ProductMockupCard title={t.dataSourceTitle}>
          <div className="divide-y divide-black/[0.04] text-xs">
            {dataSources.map((ds, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-[#1c1c1e]">{ds.name}</div>
                  <div className="text-[11px] text-[#8e8e93]">
                    {ds.type} • {ds.latency}
                  </div>
                </div>

                <BadgePill
                  label={ds.status}
                  variant={ds.status.includes('Live') ? 'emerald' : 'orange'}
                />
              </div>
            ))}
          </div>
        </ProductMockupCard>

        {/* 5. Privacy & Storage */}
        <ProductMockupCard title={t.privacySectionTitle}>
          <div className="space-y-3 text-xs">
            <p className="text-[#8e8e93] leading-relaxed font-medium">
              {t.privacySectionDesc}
            </p>

            <button
              onClick={onClearHistory}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-[#ff3b30]/30 text-[#ff3b30] hover:bg-[#ff3b30]/10 text-xs font-bold transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.clearCacheBtn}</span>
            </button>
          </div>
        </ProductMockupCard>
      </div>

      <DarkFooter />
    </div>
  );
};
