import React, { useState, useEffect } from 'react';
import { LatLng } from './domain/geo/geoMath';
import { VesselClass, UnitSystem } from './core/config/safetyThresholds';
import { LanguageCode, AgentQueryResult, ChatMessage } from './domain/agents/orcaTypes';
import { MarineSummary, fetchLiveMarineSummary, buildSstGridForBbox } from './data/sources/openMeteoService';
import { detectThermalFronts, AggregationZone } from './domain/geo/frontDetection';
import { OptimizedRoute } from './domain/geo/routePlanner';
import { runOrcaAgentGraph } from './domain/agents/agentEngine';
import { TopNav } from './core/widgets/TopNav';
import { BottomTabBar, TabType } from './core/widgets/BottomTabBar';
import { QuickGuideBar } from './core/widgets/QuickGuideBar';
import { MapScreen, MapLayer } from './features/map/MapScreen';
import { AskScreen } from './features/ask/AskScreen';
import { SafetyScreen } from './features/safety/SafetyScreen';
import { FishingZonesScreen } from './features/fishing/FishingZonesScreen';
import { RoutePlannerScreen } from './features/route/RoutePlannerScreen';
import { ResearchScreen } from './features/research/ResearchScreen';
import { SettingsScreen } from './features/settings/SettingsScreen';
import { OnboardingModal } from './features/onboarding/OnboardingModal';
import { LanguageProvider, useTranslation } from './core/i18n/LanguageContext';
import { Smartphone, Monitor } from 'lucide-react';

// Default Location: Rameswaram Fishing Harbor (Palk Strait)
const DEFAULT_LOCATION: LatLng = { lat: 9.2876, lng: 79.3129 };

function OrcaAppContent() {
  const { language, setLanguage, t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('map');
  const [subView, setSubView] = useState<'none' | 'fishing' | 'route'>('none');
  const [selectedMapLayer, setSelectedMapLayer] = useState<MapLayer>('waves');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);

  // View Mode: Mobile Phone Frame vs Desktop Full-Bleed
  const [isPhoneMode, setIsPhoneMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('orca_view_mode');
    return saved !== 'desktop';
  });

  const handleToggleViewMode = () => {
    setIsPhoneMode((prev) => {
      const next = !prev;
      localStorage.setItem('orca_view_mode', next ? 'phone' : 'desktop');
      return next;
    });
  };

  // User Settings State
  const [vessel, setVessel] = useState<VesselClass>('artisanal');
  const [units, setUnits] = useState<UnitSystem>('metric');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  // Geolocation & Metocean State
  const [userPos, setUserPos] = useState<LatLng>(DEFAULT_LOCATION);
  const [marineSummary, setMarineSummary] = useState<MarineSummary | null>(null);
  const [fronts, setFronts] = useState<AggregationZone[]>([]);
  const [activeRoute, setActiveRoute] = useState<OptimizedRoute | null>(null);

  // Agent Conversation & Result State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [latestResult, setLatestResult] = useState<AgentQueryResult | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Simulated Alert State
  const [isSimulatedAlert, setIsSimulatedAlert] = useState<boolean>(false);

  // 1. Initial Load & Geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          if (lat >= 5 && lat <= 35 && lng >= 65 && lng <= 95) {
            setUserPos({ lat, lng });
          }
        },
        (err) => {
          console.warn('Geolocation fallback to Rameswaram Harbor:', err.message);
        },
        { timeout: 5000 }
      );
    }

    // Check first-run onboarding
    const seenOnboarding = localStorage.getItem('orca_seen_onboarding');
    if (!seenOnboarding) {
      setIsOnboardingOpen(true);
      localStorage.setItem('orca_seen_onboarding', 'true');
    }
  }, []);

  // 2. Fetch Live Marine Metocean Data & Detect Thermal Fronts
  const loadMarineData = async (pos: LatLng, forceDemo = false) => {
    try {
      const summary = await fetchLiveMarineSummary(pos, forceDemo);
      setMarineSummary(summary);

      // Build SST Grid & Detect Fronts
      const sstGrid = buildSstGridForBbox(pos);
      const detected = detectThermalFronts(sstGrid, pos);
      setFronts(detected);

      // Run initial advisory synthesis if not yet present
      if (!latestResult) {
        const initialQuery = 'Analyze current marine conditions and safety limits.';
        const result = await runOrcaAgentGraph({
          query: initialQuery,
          userPos: pos,
          vessel,
          language,
          forceDemo,
        });
        setLatestResult(result);
      }
    } catch (err) {
      console.error('Failed loading marine data:', err);
    }
  };

  useEffect(() => {
    loadMarineData(userPos, isDemoMode);
  }, [userPos, vessel, language, isDemoMode]);

  // 3. Handle User Message (Chat & AI Synthesis)
  const handleUserMessage = async (queryText: string) => {
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: queryText,
      language,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);

    try {
      const result = await runOrcaAgentGraph({
        query: queryText,
        userPos,
        vessel,
        language,
        sessionHistory: messages.map((m) => ({ role: m.role, text: m.text })),
        forceDemo: isDemoMode,
      });

      setLatestResult(result);

      const agentMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        role: 'agent',
        text: result.summary,
        nativeText: result.nativeSummary,
        language,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        result,
      };

      setMessages((prev) => [...prev, agentMsg]);
    } catch (error) {
      console.error('Agent query error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // 4. Pre-Programmed Blueprint Demo Scenarios
  const handleRunDemoScenario = async (scenarioIndex: number) => {
    setIsDemoMode(true);
    if (scenarioIndex === 1) {
      setUserPos({ lat: 9.2876, lng: 79.3129 });
      setVessel('artisanal');
      setLanguage('ta');
      setActiveTab('ask');
      await handleUserMessage('நாளை காலை மீன்பிடிக்க செல்வது பாதுகாப்பானதா? மற்றும் மீன்பிடி மண்டலம் எங்கே உள்ளது?');
    } else if (scenarioIndex === 2) {
      setUserPos({ lat: 15.4989, lng: 73.8278 }); // Goa coast
      setVessel('mechanised');
      setLanguage('hi');
      setActiveTab('safety');
    } else if (scenarioIndex === 3) {
      setUserPos({ lat: 9.9312, lng: 76.2673 }); // Kochi coast
      setVessel('trawler');
      setLanguage('en');
      setActiveTab('research');
      await handleUserMessage('Why did oil sardine catch decline along the Kerala coast this season?');
    }
  };

  const handleSelectMapLayer = (layer: MapLayer) => {
    setSelectedMapLayer(layer);
    setSubView('none');
    setActiveTab('map');
  };

  return (
    <div
      className={`h-screen w-screen bg-[#0e0e11] md:bg-[#18181c] flex flex-col items-center justify-center overflow-hidden select-none relative ${
        isPhoneMode ? 'p-0 md:p-4' : 'p-0'
      }`}
    >
      {/* Floating Desktop / Phone Mode Segmented Control on Desktop Viewports */}
      <div className="hidden md:flex absolute top-3 right-4 z-50 items-center gap-1 p-1 bg-[#1c1c1e] text-white rounded-full border border-black/20 shadow-2xl pointer-events-auto">
        <button
          onClick={() => {
            setIsPhoneMode(true);
            localStorage.setItem('orca_view_mode', 'phone');
          }}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all text-xs font-bold cursor-pointer ${
            isPhoneMode
              ? 'bg-white text-[#1c1c1e] shadow-md'
              : 'text-[#8e8e93] hover:text-white'
          }`}
          title="Mobile Phone Prototype View"
        >
          <Smartphone className={`w-3.5 h-3.5 ${isPhoneMode ? 'text-[#007aff]' : 'text-[#8e8e93]'}`} />
          <span>Phone</span>
        </button>
        <button
          onClick={() => {
            setIsPhoneMode(false);
            localStorage.setItem('orca_view_mode', 'desktop');
          }}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all text-xs font-bold cursor-pointer ${
            !isPhoneMode
              ? 'bg-[#007aff] text-white shadow-md'
              : 'text-[#8e8e93] hover:text-white'
          }`}
          title="Full Desktop Web View"
        >
          <Monitor className="w-3.5 h-3.5 text-white" />
          <span>Desktop</span>
        </button>
      </div>

      {/* App Canvas: Mobile Device Container in Phone Mode; Full-Bleed in Desktop Mode */}
      <div
        className={`w-full bg-[#f2f2f7] text-[#1c1c1e] flex flex-col overflow-hidden relative transition-all duration-300 ${
          isPhoneMode
            ? 'max-w-[420px] h-full md:h-[860px] md:max-h-[96vh] md:rounded-[44px] md:shadow-[0_25px_70px_-15px_rgba(0,0,0,0.6)] md:border-[8px] md:border-[#202024] ring-1 ring-white/10'
            : 'h-full max-w-none rounded-none border-none shadow-none'
        }`}
      >
        {/* Top Navigation Bar with Interactive Metocean & SST Ticker */}
        <TopNav
          vessel={vessel}
          onChangeVessel={setVessel}
          marineSummary={marineSummary}
          frontsCount={fronts.length}
          isDemoMode={isDemoMode}
          isPhoneMode={isPhoneMode}
          onTogglePhoneMode={handleToggleViewMode}
          onSelectMapLayer={handleSelectMapLayer}
          onOpenSettings={() => {
            setSubView('none');
            setActiveTab('settings');
          }}
          onOpenOnboarding={() => setIsOnboardingOpen(true)}
        />

        {/* 1-Tap Evaluator & Beginner Quick Guide Bar */}
        <QuickGuideBar
          onSelectFeature={(tab, layer) => {
            if (layer) setSelectedMapLayer(layer);
            setSubView('none');
            setActiveTab(tab);
          }}
        />

        {/* Sub-navigation views if Fishing or Route subview active */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
          {subView === 'fishing' ? (
            <div className="flex-1 overflow-y-auto pb-4">
              <div className="max-w-3xl mx-auto px-4 pt-3.5 pb-1 flex items-center justify-between">
                <button
                  onClick={() => setSubView('none')}
                  className="text-xs font-bold text-[#000000] hover:underline cursor-pointer"
                >
                  &larr; {t.backToMapBtn}
                </button>
              </div>
              <FishingZonesScreen
                userPos={userPos}
                fronts={fronts}
                onSelectZone={(zone) => {
                  setUserPos(zone.center);
                  setSubView('none');
                  setActiveTab('map');
                }}
                onJumpToMap={() => {
                  setSubView('none');
                  setActiveTab('map');
                }}
              />
            </div>
          ) : subView === 'route' ? (
            <div className="flex-1 overflow-y-auto pb-4">
              <div className="max-w-3xl mx-auto px-4 pt-3.5 pb-1 flex items-center justify-between">
                <button
                  onClick={() => setSubView('none')}
                  className="text-xs font-bold text-[#000000] hover:underline cursor-pointer"
                >
                  &larr; {t.backToMapBtn}
                </button>
              </div>
              <RoutePlannerScreen
                userPos={userPos}
                vessel={vessel}
                onSetRoute={(route) => setActiveRoute(route)}
                onJumpToMap={() => {
                  setSubView('none');
                  setActiveTab('map');
                }}
              />
            </div>
          ) : (
            /* Main Tabs */
            <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
              {activeTab === 'map' && (
                <MapScreen
                  userPos={userPos}
                  vessel={vessel}
                  marineSummary={marineSummary}
                  fronts={fronts}
                  activeRoute={activeRoute}
                  latestAgentResult={latestResult}
                  selectedLayer={selectedMapLayer}
                  onLayerChange={(layer) => setSelectedMapLayer(layer)}
                  onOpenAskTab={() => setActiveTab('ask')}
                  onRefreshData={() => loadMarineData(userPos, isDemoMode)}
                />
              )}

              {activeTab === 'ask' && (
                <AskScreen
                  messages={messages}
                  onSendMessage={handleUserMessage}
                  isProcessing={isProcessing}
                  onFocusMap={() => setActiveTab('map')}
                  vessel={vessel}
                  currentLanguage={language}
                />
              )}

              {activeTab === 'safety' && (
                <div className="flex-1 overflow-y-auto">
                  <SafetyScreen
                    userPos={userPos}
                    vessel={vessel}
                    marineSummary={marineSummary}
                    onSimulateCriticalAlert={() => setIsSimulatedAlert(true)}
                    isSimulatedAlert={isSimulatedAlert}
                    onResetAlert={() => setIsSimulatedAlert(false)}
                  />
                </div>
              )}

              {activeTab === 'research' && (
                <div className="flex-1 overflow-y-auto">
                  <ResearchScreen />
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="flex-1 overflow-y-auto">
                  <SettingsScreen
                    currentLanguage={language}
                    onChangeLanguage={setLanguage}
                    currentVessel={vessel}
                    onChangeVessel={setVessel}
                    units={units}
                    onChangeUnits={setUnits}
                    isDemoMode={isDemoMode}
                    onToggleDemoMode={setIsDemoMode}
                    onRunDemoScenario={handleRunDemoScenario}
                    onSimulateBoundaryAlarm={() => {
                      setIsSimulatedAlert(true);
                      setActiveTab('safety');
                    }}
                    onClearHistory={() => {
                      setMessages([]);
                      setLatestResult(null);
                      localStorage.clear();
                    }}
                  />
                </div>
              )}
            </main>
          )}
        </div>

        {/* Persistent Bottom Tab Bar */}
        <BottomTabBar
          activeTab={activeTab}
          onChangeTab={(tab) => {
            setSubView('none');
            setActiveTab(tab);
          }}
          unreadAlert={isSimulatedAlert || latestResult?.severity === 'red'}
        />

        {/* First-Run Onboarding Modal */}
        <OnboardingModal
          isOpen={isOnboardingOpen}
          onClose={() => setIsOnboardingOpen(false)}
          currentLanguage={language}
          onChangeLanguage={setLanguage}
          currentVessel={vessel}
          onChangeVessel={setVessel}
          units={units}
          onChangeUnits={setUnits}
        />

        {/* iOS Home Indicator Bar (Desktop Phone Mode Decorator) */}
        {isPhoneMode && (
          <div className="hidden md:flex h-3 bg-[#f2f2f7] items-center justify-center shrink-0 z-30">
            <div className="w-28 h-1 bg-[#1c1c1e]/25 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <OrcaAppContent />
    </LanguageProvider>
  );
}
