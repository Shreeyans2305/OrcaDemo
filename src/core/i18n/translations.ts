/**
 * Comprehensive Translations for All 10 Supported Coastal Indian Languages
 * Strictly zero emojis.
 */

import { LanguageCode } from '../../domain/agents/orcaTypes';

export interface TranslationKeys {
  // Navigation
  tabMap: string;
  tabAsk: string;
  tabSafety: string;
  tabResearch: string;
  tabSettings: string;

  // Top Nav
  tagline: string;
  demoModeBadge: string;
  waveLimit: string;
  changeLanguage: string;

  // Map Screen
  layerWaves: string;
  layerSst: string;
  layerWind: string;
  layerPfz: string;
  layerFronts: string;
  layerBoundary: string;
  layerRoute: string;
  latestAdvisory: string;
  expand: string;
  minimize: string;
  metoceanEvidence: string;
  whyTitle: string;
  whyShow: string;
  whyHide: string;
  tapVoicePrompt: string;
  criticalHazardTitle: string;
  refreshTooltip: string;
  details: string;

  // Ask Screen
  askTitle: string;
  askSubtitle: string;
  askInputPlaceholder: string;
  synthesisTitle: string;
  verifiedEvidence: string;
  showOnMap: string;
  agentTraceTitle: string;
  totalLatency: string;
  readAloudTooltip: string;
  processingText: string;

  // Safety Screen
  safetyTitle: string;
  safetySubtitle: string;
  criticalAlertTitle: string;
  criticalAlertSubtitle: string;
  clearSimulation: string;
  vesselRiskTitle: string;
  liveEvaluated: string;
  maxWaveLabel: string;
  maxGustsLabel: string;
  pressure12hLabel: string;
  imblDistanceLabel: string;
  assessmentLabel: string;
  timelineTitle: string;
  hoursSuffix: string;
  forecastWaveLabel: string;
  windGustsLabel: string;
  barometerSstLabel: string;
  geofenceNavTitle: string;
  nearestBoundaryLabel: string;
  geodesicDistanceLabel: string;
  bearingLabel: string;
  safeHeadingAwayLabel: string;
  simulateBoundaryBtn: string;

  // Fishing Zones
  pfzTitle: string;
  pfzSubtitle: string;
  pfzAdvisoryTitle: string;
  pfzAdvisoryDesc: string;
  primaryPfzBadge: string;
  secondaryFrontBadge: string;
  confidenceLabel: string;
  meanSstLabel: string;
  sstGradientLabel: string;
  focusCoordsBtn: string;
  viewOnMapBtn: string;

  // Route Planner
  routeTitle: string;
  routeSubtitle: string;
  passageParamsTitle: string;
  originLabel: string;
  destinationLabel: string;
  departureLabel: string;
  depNow: string;
  dep3h: string;
  dep6h: string;
  depTomorrow: string;
  runOptimizationBtn: string;
  calculatedPassageTitle: string;
  totalDistanceLabel: string;
  estimatedEtaLabel: string;
  peakRouteWaveLabel: string;
  recheckLabel: string;
  legBreakdownTitle: string;
  plotOnMapBtn: string;
  backToMapBtn: string;

  // Research Screen
  researchTitle: string;
  researchSubtitle: string;
  climatologyTitle: string;
  climatologyDesc: string;
  chlorophyllLegend: string;
  cloudFallbackTitle: string;
  cloudFallbackDesc: string;
  searchResearchPlaceholder: string;
  allTopics: string;
  topicPfz: string;
  topicSst: string;
  topicSafety: string;
  topicRegs: string;

  // Settings Screen
  settingsTitle: string;
  settingsSubtitle: string;
  languageSectionTitle: string;
  languageSectionDesc: string;
  vesselSectionTitle: string;
  demoModeTitle: string;
  demoModeToggleLabel: string;
  demoModeToggleDesc: string;
  blueprintScenariosTitle: string;
  scenario1Title: string;
  scenario1Desc: string;
  scenario2Title: string;
  scenario2Desc: string;
  scenario3Title: string;
  scenario3Desc: string;
  dataSourceTitle: string;
  privacySectionTitle: string;
  privacySectionDesc: string;
  clearCacheBtn: string;

  // Onboarding
  onboardingTitle: string;
  onboardingTagline: string;
  onboardingWelcomeHead: string;
  onboardingWelcomeDesc: string;
  stepLanguage: string;
  stepVessel: string;
  stepPrivacy: string;
  privacyNote: string;
  launchBtn: string;

  // Vessels
  vesselArtisanalName: string;
  vesselArtisanalDesc: string;
  vesselMechanisedName: string;
  vesselMechanisedDesc: string;
  vesselTrawlerName: string;
  vesselTrawlerDesc: string;

  // Voice States
  voiceTap: string;
  voiceListening: string;
  voiceSpeaking: string;

  // Common
  activeBadge: string;
  safeBadge: string;
  warningBadge: string;
  criticalBadge: string;
  limitText: string;
  footerNotice: string;
  footerAbout: string;
  footerPrivacy: string;
}

const en: TranslationKeys = {
  tabMap: 'Map',
  tabAsk: 'Ask',
  tabSafety: 'Safety',
  tabResearch: 'Research',
  tabSettings: 'Settings',

  tagline: 'INCOIS/ISRO Marine Agent',
  demoModeBadge: 'Demo Mode',
  waveLimit: 'Wave Limit',
  changeLanguage: 'Language',

  layerWaves: 'Wave Height',
  layerSst: 'SST Thermal',
  layerWind: 'Wind Speed',
  layerPfz: 'Fishing Zones',
  layerFronts: 'Fronts',
  layerBoundary: 'Boundary (IMBL)',
  layerRoute: 'Safe Route',
  latestAdvisory: 'Latest Agent Advisory',
  expand: 'Expand',
  minimize: 'Minimize',
  metoceanEvidence: 'Metocean Ground-Truth Evidence',
  whyTitle: 'Why this recommendation? (Chain of Evidence)',
  whyShow: 'Show',
  whyHide: 'Hide',
  tapVoicePrompt: 'Tap the microphone button or ask a question for instant decision support.',
  criticalHazardTitle: 'CRITICAL MARINE HAZARD',
  refreshTooltip: 'Refresh Data',
  details: 'Details',

  askTitle: 'Marine Ecosystem Assistant',
  askSubtitle: 'Ask about sea state safety, INCOIS PFZ zones, safe navigational corridors, or oceanographic trends.',
  askInputPlaceholder: 'Ask ORCA in any language (e.g. Tamil, Hindi, English)...',
  synthesisTitle: 'ORCA Synthesis',
  verifiedEvidence: 'Verified Evidence Grounding',
  showOnMap: 'Show on Map',
  agentTraceTitle: 'Agent Execution Trace',
  totalLatency: 'total',
  readAloudTooltip: 'Read Aloud',
  processingText: 'Agents executing multi-step spatial reasoning...',

  safetyTitle: 'Safety & Geofence Monitor',
  safetySubtitle: 'Deterministic threshold checks for your vessel profile',
  criticalAlertTitle: 'Critical Safety Alert',
  criticalAlertSubtitle: 'Immediate evasive or harbor action required',
  clearSimulation: 'Clear Simulation',
  vesselRiskTitle: 'Vessel Risk Analysis',
  liveEvaluated: 'Live Evaluated',
  maxWaveLabel: 'Max Wave',
  maxGustsLabel: 'Max Gusts',
  pressure12hLabel: '12h Pressure',
  imblDistanceLabel: 'IMBL Distance',
  assessmentLabel: 'Assessment',
  timelineTitle: '72-Hour Metocean Forecast Timeline',
  hoursSuffix: 'Hours',
  forecastWaveLabel: 'Forecast Wave',
  windGustsLabel: 'Wind & Gusts',
  barometerSstLabel: 'Barometer & SST',
  geofenceNavTitle: 'Maritime Geofence & Navigation',
  nearestBoundaryLabel: 'Nearest Boundary Feature:',
  geodesicDistanceLabel: 'Geodesic Distance:',
  bearingLabel: 'Bearing to Boundary:',
  safeHeadingAwayLabel: 'Recommended Safe Heading Away:',
  simulateBoundaryBtn: 'Simulate Boundary Approach Alert (Demo Mode)',

  pfzTitle: 'Potential Fishing Zones',
  pfzSubtitle: 'INCOIS satellite PFZs & dynamically detected SST thermal aggregation fronts',
  pfzAdvisoryTitle: 'Thermal Gradient Aggregation Mechanics',
  pfzAdvisoryDesc: 'Fronts with SST gradients >= 0.02°C/km trap plankton and baitfish along shear interfaces. Target convergence edges rather than homogeneous warm pools.',
  primaryPfzBadge: 'Primary PFZ',
  secondaryFrontBadge: 'Secondary Front',
  confidenceLabel: 'Confidence',
  meanSstLabel: 'Mean SST',
  sstGradientLabel: 'SST Gradient',
  focusCoordsBtn: 'Focus Coordinates',
  viewOnMapBtn: 'View on Map',

  routeTitle: 'Wave-Aware Route Planner',
  routeSubtitle: 'Deterministic 8-neighbour A* ocean cost routing avoiding high sea state & gale cells',
  passageParamsTitle: 'Passage Planning Parameters',
  originLabel: 'Origin Point',
  destinationLabel: 'Destination Harbor / Landing Center',
  departureLabel: 'Scheduled Departure Window',
  depNow: 'Immediate (Now)',
  dep3h: '+3 Hours',
  dep6h: '+6 Hours',
  depTomorrow: 'Tomorrow Morning',
  runOptimizationBtn: 'Run A* Wave-Aware Optimization',
  calculatedPassageTitle: 'Calculated Safe Passage',
  totalDistanceLabel: 'Total Distance',
  estimatedEtaLabel: 'Estimated ETA',
  peakRouteWaveLabel: 'Peak Route Wave',
  recheckLabel: 'Route Recheck',
  legBreakdownTitle: 'Navigation Leg Breakdown',
  plotOnMapBtn: 'Plot Safe Route on Full Map',
  backToMapBtn: 'Back to Map',

  researchTitle: 'Marine Science & RAG Knowledge',
  researchSubtitle: 'Peer-reviewed oceanographic datasets, SST climatology, and chlorophyll dynamics',
  climatologyTitle: 'SST & Chlorophyll-a Climatological Cycle (SW Coast)',
  climatologyDesc: 'Longitudinal analysis reveals the inverse relationship between Sea Surface Temperature (SST) and Chlorophyll-a bloom intensity during southwest monsoon coastal upwelling.',
  chlorophyllLegend: 'Chlorophyll-a (mg/m³)',
  cloudFallbackTitle: 'Monsoon Cloud-Cover Fallback Architecture',
  cloudFallbackDesc: 'During heavy monsoon cloud contamination (>50% missing optical pixels), ORCA switches seamlessly from Oceansat-3 ocean-color to microwave SST sensors (AMSR-2 / GMI) and numerical hydrodynamic current divergence models.',
  searchResearchPlaceholder: 'Search marine research papers, IMBL treaties, sardine ecology...',
  allTopics: 'All Topics',
  topicPfz: 'PFZ & Aggregation',
  topicSst: 'SST Dynamics',
  topicSafety: 'Marine Safety',
  topicRegs: 'Maritime Law & IMBL',

  settingsTitle: 'System Settings & Controls',
  settingsSubtitle: 'Configure vessel specifications, multilingual preferences, and operational data sources',
  languageSectionTitle: 'Regional Language & Voice Locale',
  languageSectionDesc: 'Select primary language for text-to-speech synthesis and user interface localized advisories.',
  vesselSectionTitle: 'Vessel Class & Safety Thresholds',
  demoModeTitle: 'Demo Mode & Pre-Programmed Field Scenarios',
  demoModeToggleLabel: 'DEMO MODE Toggle',
  demoModeToggleDesc: 'Force deterministic offline data models and mock responses',
  blueprintScenariosTitle: 'Run Blueprint Field Scenarios:',
  scenario1Title: 'Scenario 1: Artisanal Fisherman (Rameswaram, Tamil Nadu)',
  scenario1Desc: 'Asks in Tamil about morning sea state safety and nearest PFZ catch zones.',
  scenario2Title: 'Scenario 2: Commercial Trawler (Off Gujarat, Arabian Sea)',
  scenario2Desc: 'Drifting vessel approaches Pakistan IMBL; triggers high-priority geofence alarm.',
  scenario3Title: 'Scenario 3: Marine Researcher (Kerala Coast)',
  scenario3Desc: 'Investigates sardine catch fluctuations via SST climatology & RAG citations.',
  dataSourceTitle: 'Data Source Status Registry',
  privacySectionTitle: 'Privacy, Telemetry & Session Memory',
  privacySectionDesc: 'ORCA enforces strict privacy: GPS coordinates are rounded before cloud queries, telemetry is disabled, and conversation memory remains strictly local to your browser session.',
  clearCacheBtn: 'Clear Local Conversation & Cache',

  onboardingTitle: 'orca',
  onboardingTagline: 'Marine EcOsystem Reasoning with Collaborative Agents',
  onboardingWelcomeHead: 'Voice-First Maritime Decision Support',
  onboardingWelcomeDesc: 'Designed for artisanal fishermen, commercial trawler skippers, coastal authorities, and marine researchers across the Indian coastline.',
  stepLanguage: '1. Choose Regional Language',
  stepVessel: '2. Select Vessel Safety Limits',
  stepPrivacy: 'Location & Notification Privacy',
  privacyNote: 'ORCA requires GPS access to calculate real-time distance to the International Maritime Boundary Line (IMBL) and fetch hyperlocal wave heights. Your coordinates are never tracked or stored externally.',
  launchBtn: 'Complete Setup & Launch ORCA',

  vesselArtisanalName: 'Non-mechanised / Artisanal Boat',
  vesselArtisanalDesc: 'Traditional catamaran, dugout canoe, or small fiberglass craft with OBM (< 10 hp).',
  vesselMechanisedName: 'Mechanised Boat (Inboard Engine)',
  vesselMechanisedDesc: 'Gillnetter, ring seiner, or intermediate longliner (9 - 15 meters).',
  vesselTrawlerName: 'Commercial Trawler / Deep-Sea Vessel',
  vesselTrawlerDesc: 'Steel or wooden deep-sea bottom trawler (> 15 meters).',

  voiceTap: 'Tap for Voice',
  voiceListening: 'Listening...',
  voiceSpeaking: 'Speaking...',

  activeBadge: 'Active',
  safeBadge: 'SAFE',
  warningBadge: 'WARNING',
  criticalBadge: 'CRITICAL',
  limitText: 'Limit',
  footerNotice: 'ORCA is a marine decision-support system integrating open metocean datasets, INCOIS forecasts, and on-device geospatial algorithms. Boundary geometry is for advisory use.',
  footerAbout: 'System Architecture',
  footerPrivacy: 'Privacy & Geodata',
};

const ta: TranslationKeys = {
  tabMap: 'வரைபடம்',
  tabAsk: 'கேளுங்கள்',
  tabSafety: 'பாதுகாப்பு',
  tabResearch: 'ஆராய்ச்சி',
  tabSettings: 'அமைப்புகள்',

  tagline: 'இன்காய்ஸ் / இஸ்ரோ கடல்சார் முகவர்',
  demoModeBadge: 'டெமோ பயன்முறை',
  waveLimit: 'அலை வரம்பு',
  changeLanguage: 'மொழி',

  layerWaves: 'அலை உயரம்',
  layerSst: 'கடல் வெப்பநிலை',
  layerWind: 'காற்று வேகம்',
  layerPfz: 'மீன்பிடி மண்டலம்',
  layerFronts: 'வெப்ப முனைகள்',
  layerBoundary: 'சர்வதேச எல்லை (IMBL)',
  layerRoute: 'பாதுகாப்பான பாதை',
  latestAdvisory: 'சமீபத்திய முகவர் ஆலோசனை',
  expand: 'விரிவாக்கு',
  minimize: 'சுருக்கு',
  metoceanEvidence: 'கடல்சார் உண்மை சான்றுகள்',
  whyTitle: 'ஏன் இந்த பரிந்துரை? (காரண சங்கிலி)',
  whyShow: 'காட்டு',
  whyHide: 'மறை',
  tapVoicePrompt: 'உடனடி முடிவெடுக்கும் உதவிக்கு மைக் பொத்தானைத் தட்டவும்.',
  criticalHazardTitle: 'அதிமுக்கிய கடல் ஆபத்து',
  refreshTooltip: 'தரவைப் புதுப்பி',
  details: 'விவரங்கள்',

  askTitle: 'கடல் சுற்றுச்சூழல் உதவியாளர்',
  askSubtitle: 'கடல் நிலை பாதுகாப்பு, PFZ மீன்பிடி பகுதிகள், பாதுகாப்பான கடல் பாதைகள் பற்றி கேளுங்கள்.',
  askInputPlaceholder: 'ஆர்க்காவிடம் தமிழில் கேளுங்கள்...',
  synthesisTitle: 'ஆர்க்கா பகுப்பாய்வு',
  verifiedEvidence: 'சரிபார்க்கப்பட்ட சான்றுகள்',
  showOnMap: 'வரைபடத்தில் காட்டு',
  agentTraceTitle: 'முகவர் செயலாக்க பதிவு',
  totalLatency: 'மொத்தம்',
  readAloudTooltip: 'வாசித்துக் காட்டு',
  processingText: 'முகவர்கள் பல படிநிலைகளில் ஆய்வு செய்கின்றனர்...',

  safetyTitle: 'பாதுகாப்பு மற்றும் புவி-எல்லை கண்காணிப்பு',
  safetySubtitle: 'உங்கள் படகு வகையின்படி கணக்கிடப்பட்ட பாதுகாப்பு வரம்புகள்',
  criticalAlertTitle: 'அதிமுக்கிய பாதுகாப்பு எச்சரிக்கை',
  criticalAlertSubtitle: 'உடனடியாக திசையை மாற்றவும் அல்லது துறைமுகத்திற்கு திரும்பவும்',
  clearSimulation: 'சோதனையை நீக்கு',
  vesselRiskTitle: 'படகு ஆபத்து பகுப்பாய்வு',
  liveEvaluated: 'நேரடி மதிப்பீடு',
  maxWaveLabel: 'அதிகபட்ச அலை',
  maxGustsLabel: 'காற்று வீச்சு',
  pressure12hLabel: '12 மணி அழுத்த குறைவு',
  imblDistanceLabel: 'IMBL எல்லை தூரம்',
  assessmentLabel: 'மதிப்பீடு',
  timelineTitle: '72 மணி நேர கடல் முன்னறிவிப்பு',
  hoursSuffix: 'மணிநேரம்',
  forecastWaveLabel: 'முன்னறிவிப்பு அலை',
  windGustsLabel: 'காற்று மற்றும் வீச்சு',
  barometerSstLabel: 'பாரோமீட்டர் மற்றும் SST',
  geofenceNavTitle: 'கடல் எல்லை மற்றும் வழிசெலுத்தல்',
  nearestBoundaryLabel: 'அருகிலுள்ள எல்லை அம்சம்:',
  geodesicDistanceLabel: 'நேரடி தூரம்:',
  bearingLabel: 'எல்லைக்கான திசைக்கோணம்:',
  safeHeadingAwayLabel: 'விலகிச் செல்ல பரிந்துரைக்கப்பட்ட திசை:',
  simulateBoundaryBtn: 'எல்லை அணுகுமுறை எச்சரிக்கையை சோதி (டெமோ)',

  pfzTitle: 'சாத்தியமான மீன்பிடி மண்டலங்கள்',
  pfzSubtitle: 'இன்காய்ஸ் செயற்கைக்கோள் PFZ மற்றும் கண்டறியப்பட்ட வெப்ப முனைகள்',
  pfzAdvisoryTitle: 'வெப்பநிலை சாய்வு திரள்வு முறை',
  pfzAdvisoryDesc: '0.02°C/km வெப்ப வேறுபாடு உள்ள முனைகளில் மிதவை உயிரினங்கள் மற்றும் மீன்கள் அதிகம் கூடுகின்றன.',
  primaryPfzBadge: 'முதன்மை PFZ',
  secondaryFrontBadge: 'துணை முனை',
  confidenceLabel: 'நம்பகத்தன்மை',
  meanSstLabel: 'சராசரி SST',
  sstGradientLabel: 'வெப்பநிலை சாய்வு',
  focusCoordsBtn: 'ஆயத்தொலைவுகளை காட்டு',
  viewOnMapBtn: 'வரைபடத்தில் பார்க்க',

  routeTitle: 'அலை-அறிவார்ந்த பாதை திட்டமிடல்',
  routeSubtitle: 'உயர் அலைகள் மற்றும் புயல் பகுதிகளைத் தவிர்க்கும் A* கடல் வழிப்பாதை',
  passageParamsTitle: 'பயண திட்ட அளவுருக்கள்',
  originLabel: 'புறப்படும் இடம்',
  destinationLabel: 'சேருமிடம் / மீன்பிடி துறைமுகம்',
  departureLabel: 'புறப்படும் நேரம்',
  depNow: 'உடனடியாக (இப்போது)',
  dep3h: '+3 மணி நேரத்தில்',
  dep6h: '+6 மணி நேரத்தில்',
  depTomorrow: 'நாளை காலை',
  runOptimizationBtn: 'பாதுகாப்பான பாதையை கணக்கிடு',
  calculatedPassageTitle: 'கணக்கிடப்பட்ட பாதுகாப்பான பாதை',
  totalDistanceLabel: 'மொத்த தூரம்',
  estimatedEtaLabel: 'மதிப்பிடப்பட்ட நேரம்',
  peakRouteWaveLabel: 'பாதையில் அதிகபட்ச அலை',
  recheckLabel: 'மறு சரிபார்ப்பு',
  legBreakdownTitle: 'பயண வழிப் புள்ளிகள்',
  plotOnMapBtn: 'வரைபடத்தில் பாதையை காட்டு',
  backToMapBtn: 'வரைபடத்திற்கு திரும்பு',

  researchTitle: 'கடல்சார் அறிவியல் மற்றும் RAG அறிவுத் தளம்',
  researchSubtitle: 'ஆய்வுத் தரவுகள், SST காலநிலைப் போக்கு மற்றும் குளோரோபில் மாற்றங்கள்',
  climatologyTitle: 'SST & குளோரோபில் சுழற்சி (தென்மேற்கு கடற்கரை)',
  climatologyDesc: 'தென்மேற்கு பருவமழை காலத்தில் கடல் மேலெழுச்சி மற்றும் குளோரோபில் பெருக்கத்தின் தொடர்பை விளக்குகிறது.',
  chlorophyllLegend: 'குளோரோபில்-a (mg/m³)',
  cloudFallbackTitle: 'பருவமழை மேகமூட்ட மாற்று கட்டமைப்பு',
  cloudFallbackDesc: 'மேகமூட்டம் அதிகமாக இருக்கும்போது, மைக்ரோவேவ் SST மற்றும் நீரோட்ட மாதிரிகளுக்கு தானாக மாறுகிறது.',
  searchResearchPlaceholder: 'ஆராய்ச்சி ஆவணங்கள், எல்லை ஒப்பந்தங்கள், மத்தி மீன் சூழலியல் தேடுங்கள்...',
  allTopics: 'அனைத்து தலைப்புகளும்',
  topicPfz: 'PFZ மற்றும் மீன் திரள்வு',
  topicSst: 'SST வெப்ப மாற்றங்கள்',
  topicSafety: 'கடல் பாதுகாப்பு',
  topicRegs: 'கடல் சட்டங்கள் மற்றும் எல்லை',

  settingsTitle: 'அமைப்புகள் மற்றும் கட்டுப்பாடுகள்',
  settingsSubtitle: 'படகு விவரக்குறிப்புகள், மொழி விருப்பங்கள் மற்றும் தரவு ஆதாரங்களை நிர்வகிக்கவும்',
  languageSectionTitle: 'பிராந்திய மொழி மற்றும் குரல்',
  languageSectionDesc: 'குரல் வாசிப்பு மற்றும் பயனர் இடைமுகத்திற்கான மொழியைத் தேர்ந்தெடுக்கவும்.',
  vesselSectionTitle: 'படகு வகை மற்றும் பாதுகாப்பு வரம்புகள்',
  demoModeTitle: 'டெமோ பயன்முறை மற்றும் கள மாதிரிகள்',
  demoModeToggleLabel: 'டெமோ பயன்முறை சுவிட்ச்',
  demoModeToggleDesc: 'இணையம் இல்லாத மாதிரி தரவுகளைப் பயன்படுத்தவும்',
  blueprintScenariosTitle: 'செயல்முறை கள மாதிரிகளை இயக்கு:',
  scenario1Title: 'மாதிரி 1: பாரம்பரிய மீனவர் (ராமேஸ்வரம்)',
  scenario1Desc: 'நாளை காலை கடல் பாதுகாப்பு மற்றும் அருகிலுள்ள PFZ பற்றி தமிழில் கேட்கிறார்.',
  scenario2Title: 'மாதிரி 2: விசைப்படகு (குஜராத் கடல்)',
  scenario2Desc: 'எல்லையை நெருங்கும் படகுக்கு அவசர எச்சரிக்கை மணி ஒலிக்கிறது.',
  scenario3Title: 'மாதிரி 3: கடல் ஆராய்ச்சியாளர் (கேரளா)',
  scenario3Desc: 'மத்தி மீன் வரத்து குறைந்ததற்கான காரணத்தை அறிவியல் தரவுகளுடன் ஆராய்கிறார்.',
  dataSourceTitle: 'தரவு ஆதாரங்களின் நிலை',
  privacySectionTitle: 'தனியுரிமை மற்றும் நினைவகம்',
  privacySectionDesc: 'உங்கள் இருப்பிடத் தரவு பாதுகாப்பாக வைக்கப்படுகிறது; எந்த தனிப்பட்ட தகவலும் சேமிக்கப்படுவதில்லை.',
  clearCacheBtn: 'வரலாறு மற்றும் நினைவகத்தை அழி',

  onboardingTitle: 'ஆர்க்கா',
  onboardingTagline: 'கூட்டு முகவர்கள் மூலமான கடல்சார் நுண்ணறிவு அமைப்பு',
  onboardingWelcomeHead: 'குரல் வழியிலான கடல்சார் முடிவெடுக்கும் அமைப்பு',
  onboardingWelcomeDesc: 'மீனவர்கள், படகோட்டிகள் மற்றும் கடல்சார் ஆராய்ச்சியாளர்களுக்காக வடிவமைக்கப்பட்டது.',
  stepLanguage: '1. பிராந்திய மொழியைத் தேர்வு செய்யவும்',
  stepVessel: '2. படகு பாதுகாப்பு வரம்பைத் தேர்வு செய்யவும்',
  stepPrivacy: 'இருப்பிடம் மற்றும் தனியுரிமை பாதுகாப்பு',
  privacyNote: 'சர்வதேச கடல் எல்லை தூரத்தை துல்லியமாக கணக்கிட GPS தேவைப்படுகிறது. உங்கள் இருப்பிடம் எப்போதும் தனிப்பட்டதாக இருக்கும்.',
  launchBtn: 'அமைப்பை முடித்து ஆர்க்காவைத் தொடங்கு',

  vesselArtisanalName: 'பாரம்பரிய / இயந்திரமில்லா படகு',
  vesselArtisanalDesc: 'மரக்கட்டுமரம், நாட்டுப்படகு அல்லது சிறிய OBM படகு (< 10 hp).',
  vesselMechanisedName: 'இயந்திரமயமாக்கப்பட்ட படகு',
  vesselMechanisedDesc: 'கில்நெட்டர் அல்லது நடுத்தர விசைப்படகு (9 - 15 மீட்டர்).',
  vesselTrawlerName: 'ஆழ்கடல் விசைப்படகு / இழுவைப்படகு',
  vesselTrawlerDesc: 'பெரிய எஃகு அல்லது மர ஆழ்கடல் விசைப்படகு (> 15 மீட்டர்).',

  voiceTap: 'பேச தட்டவும்',
  voiceListening: 'கேட்கிறது...',
  voiceSpeaking: 'பேசுகிறது...',

  activeBadge: 'செயலில்',
  safeBadge: 'பாதுகாப்பானது',
  warningBadge: 'எச்சரிக்கை',
  criticalBadge: 'ஆபத்து',
  limitText: 'வரம்பு',
  footerNotice: 'ஆர்க்கா என்பது அதிகாரப்பூர்வ வானிலை மற்றும் பெருங்கடல் மாதிரிகளை இணைக்கும் முடிவெடுக்கும் உதவி அமைப்பாகும்.',
  footerAbout: 'கட்டமைப்பு',
  footerPrivacy: 'தனியுரிமை',
};

const hi: TranslationKeys = {
  tabMap: 'मानचित्र',
  tabAsk: 'पूछें',
  tabSafety: 'सुरक्षा',
  tabResearch: 'अनुसंधान',
  tabSettings: 'सेटिंग्स',

  tagline: 'इन्कॉइस / इसरो समुद्री एजेंट',
  demoModeBadge: 'डेमो मोड',
  waveLimit: 'तरंग सीमा',
  changeLanguage: 'भाषा',

  layerWaves: 'तरंग ऊंचाई',
  layerSst: 'समुद्री तापमान',
  layerWind: 'हवा की गति',
  layerPfz: 'मत्स्य क्षेत्र',
  layerFronts: 'थर्मल फ्रंट',
  layerBoundary: 'समुद्री सीमा (IMBL)',
  layerRoute: 'सुरक्षित मार्ग',
  latestAdvisory: 'नवीनतम एजेंट सलाह',
  expand: 'विस्तार करें',
  minimize: 'छोटा करें',
  metoceanEvidence: 'समुद्री वैज्ञानिक प्रमाण',
  whyTitle: 'यह सिफारिश क्यों? (तर्क श्रृंखला)',
  whyShow: 'दिखाएं',
  whyHide: 'छिपाएं',
  tapVoicePrompt: 'त्वरित निर्णय सहायता के लिए माइक बटन पर टैप करें।',
  criticalHazardTitle: 'गंभीर समुद्री खतरा',
  refreshTooltip: 'डेटा रीफ्रेश करें',
  details: 'विवरण',

  askTitle: 'समुद्री पारिस्थितिकी तंत्र सहायक',
  askSubtitle: 'समुद्र की स्थिति, मत्स्य क्षेत्रों, सुरक्षित नौवहन मार्गों या प्रवृत्तियों के बारे में पूछें।',
  askInputPlaceholder: 'ऑर्का से किसी भी भाषा में पूछें...',
  synthesisTitle: 'ऑर्का निष्कर्ष',
  verifiedEvidence: 'सत्यापित साक्ष्य',
  showOnMap: 'मानचित्र पर देखें',
  agentTraceTitle: 'एजेंट निष्पादन ट्रेस',
  totalLatency: 'कुल समय',
  readAloudTooltip: 'सुनें',
  processingText: 'एजेंट बहु-चरणीय स्थानिक विश्लेषण कर रहे हैं...',

  safetyTitle: 'सुरक्षा एवं भू-सीमा मॉनिटर',
  safetySubtitle: 'आपकी नौका श्रेणी के अनुसार निर्धारित सीमाएं',
  criticalAlertTitle: 'गंभीर सुरक्षा चेतावनी',
  criticalAlertSubtitle: 'तत्काल दिशा बदलें या निकटतम बंदरगाह की ओर बढ़ें',
  clearSimulation: 'सिमुलेशन हटाएं',
  vesselRiskTitle: 'नौका जोखिम विश्लेषण',
  liveEvaluated: 'प्रत्यक्ष मूल्यांकित',
  maxWaveLabel: 'अधिकतम तरंग',
  maxGustsLabel: 'हवा के झोंके',
  pressure12hLabel: '12 घंटे का दबाव गिरावट',
  imblDistanceLabel: 'IMBL सीमा दूरी',
  assessmentLabel: 'आकलन',
  timelineTitle: '72-घंटे का समुद्री पूर्वानुमान',
  hoursSuffix: 'घंटे',
  forecastWaveLabel: 'पूर्वानुमानित तरंग',
  windGustsLabel: 'हवा एवं झोंके',
  barometerSstLabel: 'बैरोमीटर एवं SST',
  geofenceNavTitle: 'समुद्री सीमा एवं नौवहन',
  nearestBoundaryLabel: 'निकटतम सीमा:',
  geodesicDistanceLabel: 'प्रत्यक्ष दूरी:',
  bearingLabel: 'सीमा की दिशा:',
  safeHeadingAwayLabel: 'सुरक्षित विपरीत दिशा:',
  simulateBoundaryBtn: 'सीमा दृष्टिकोण चेतावनी का परीक्षण करें (डेमो)',

  pfzTitle: 'संभावित मत्स्य क्षेत्र (PFZ)',
  pfzSubtitle: 'इन्कॉइस उपग्रह PFZ एवं तापीय फ्रंट अभिसरण क्षेत्र',
  pfzAdvisoryTitle: 'तापीय प्रवणता एकत्रीकरण तंत्र',
  pfzAdvisoryDesc: '0.02°C/km से अधिक तापीय प्रवणता वाले क्षेत्रों में प्लवक और मछलियां एकत्रित होती हैं।',
  primaryPfzBadge: 'प्राथमिक PFZ',
  secondaryFrontBadge: 'द्वितीयक फ्रंट',
  confidenceLabel: 'विश्वसनीयता',
  meanSstLabel: 'औसत SST',
  sstGradientLabel: 'SST प्रवणता',
  focusCoordsBtn: 'निर्देशांक पर जाएं',
  viewOnMapBtn: 'मानचित्र पर देखें',

  routeTitle: 'तरंग-सचेत सुरक्षित मार्ग योजनाकार',
  routeSubtitle: 'ऊंची लहरों और तूफानी हवाओं से बचाने वाला A* मार्ग निर्धारण',
  passageParamsTitle: 'मार्ग योजना मापदंड',
  originLabel: 'प्रस्थान बिंदु',
  destinationLabel: 'गंतव्य बंदरगाह / लैंडिंग केंद्र',
  departureLabel: 'प्रस्थान समय',
  depNow: 'तत्काल (अभी)',
  dep3h: '+3 घंटे में',
  dep6h: '+6 घंटे में',
  depTomorrow: 'कल सुबह',
  runOptimizationBtn: 'A* सुरक्षित मार्ग की गणना करें',
  calculatedPassageTitle: 'परिकलित सुरक्षित मार्ग',
  totalDistanceLabel: 'कुल दूरी',
  estimatedEtaLabel: 'अनुमानित समय',
  peakRouteWaveLabel: 'मार्ग में अधिकतम तरंग',
  recheckLabel: 'पुनः जांच',
  legBreakdownTitle: 'मार्ग चरण विवरण',
  plotOnMapBtn: 'मानचित्र पर मार्ग देखें',
  backToMapBtn: 'मानचित्र पर वापस जाएं',

  researchTitle: 'समुद्री विज्ञान एवं अनुसंधान',
  researchSubtitle: 'समुद्री अध्ययन, SST जलवायु प्रवृत्ति एवं क्लोरोफिल गतिशीलता',
  climatologyTitle: 'SST एवं क्लोरोफिल चक्र (दक्षिण-पश्चिम तट)',
  climatologyDesc: 'मानसून के दौरान समुद्री अपवेलिंग और प्लवक प्रस्फुटन का अध्ययन।',
  chlorophyllLegend: 'क्लोरोफिल-a (mg/m³)',
  cloudFallbackTitle: 'मानसून बादल आवरण बैकअप प्रणाली',
  cloudFallbackDesc: 'बादल होने पर माइक्रोवेव SST और हाइड्रोडायनामिक करंट मॉडल का स्वचालित उपयोग।',
  searchResearchPlaceholder: 'शोध पत्र, सीमा संधियां, मछली पारिस्थितिकी खोजें...',
  allTopics: 'सभी विषय',
  topicPfz: 'PFZ एवं मत्स्य एकत्रीकरण',
  topicSst: 'SST गतिकी',
  topicSafety: 'समुद्री सुरक्षा',
  topicRegs: 'समुद्री कानून एवं IMBL',

  settingsTitle: 'सिस्टम सेटिंग्स एवं नियंत्रण',
  settingsSubtitle: 'नौका विनिर्देश, भाषा प्राथमिकताएं और डेटा स्रोत प्रबंधित करें',
  languageSectionTitle: 'क्षेत्रीय भाषा एवं आवाज',
  languageSectionDesc: 'टेक्स्ट-टू-स्पीच और यूजर इंटरफेस के लिए प्राथमिक भाषा चुनें।',
  vesselSectionTitle: 'नौका श्रेणी एवं सुरक्षा सीमाएं',
  demoModeTitle: 'डेमो मोड एवं पूर्व-प्रोग्राम्ड परिदृश्य',
  demoModeToggleLabel: 'डेमो मोड स्विच',
  demoModeToggleDesc: 'ऑफ़लाइन कृत्रिम डेटा मॉडल का उपयोग करें',
  blueprintScenariosTitle: 'फ़ील्ड परिदृश्य चलाएं:',
  scenario1Title: 'परिदृश्य 1: पारंपरिक मछुआरा (रामेश्वरम)',
  scenario1Desc: 'सुबह के मौसम और नजदीकी मत्स्य क्षेत्र के बारे में तमिल में पूछता है।',
  scenario2Title: 'परिदृश्य 2: वाणिज्यिक ट्रॉलर (गुजरात तट)',
  scenario2Desc: 'सीमा के निकट बहने पर उच्च-प्राथमिकता अलार्म बजता है।',
  scenario3Title: 'परिदृश्य 3: समुद्री शोधकर्ता (केरल)',
  scenario3Desc: 'सारडीन मछली के घटने के कारणों की वैज्ञानिक व्याख्या मांगता है।',
  dataSourceTitle: 'डेटा स्रोत स्थिति',
  privacySectionTitle: 'गोपनीयता एवं डेटा सुरक्षा',
  privacySectionDesc: 'GPS निर्देशांक कभी बाहर साझा नहीं किए जाते; आपकी गोपनीयता पूर्णतः सुरक्षित है।',
  clearCacheBtn: 'इतिहास एवं कैश साफ़ करें',

  onboardingTitle: 'ऑर्का',
  onboardingTagline: 'सहयोगात्मक समुद्री एजेंट प्रणाली',
  onboardingWelcomeHead: 'आवाज-आधारित समुद्री निर्णय प्रणाली',
  onboardingWelcomeDesc: 'मछुआरों, नौका चालकों और वैज्ञानिकों के लिए विशेष रूप से निर्मित।',
  stepLanguage: '1. क्षेत्रीय भाषा चुनें',
  stepVessel: '2. नौका सुरक्षा सीमा चुनें',
  stepPrivacy: 'स्थान एवं सूचना गोपनीयता',
  privacyNote: 'सटीक समुद्री सीमा दूरी गणना हेतु GPS की आवश्यकता होती है।',
  launchBtn: 'सेटअप पूरा करें एवं ऑर्का शुरू करें',

  vesselArtisanalName: 'गैर-मशीनीकृत / पारंपरिक नाव',
  vesselArtisanalDesc: 'पारंपरिक कटामारन, डोंगी या छोटी नाव (< 10 hp).',
  vesselMechanisedName: 'मशीनीकृत नाव (इनबोर्ड इंजन)',
  vesselMechanisedDesc: 'गिलनेटर या मध्यम नौका (9 - 15 मीटर).',
  vesselTrawlerName: 'वाणिज्यिक ट्रॉलर / गहरे समुद्र का जहाज',
  vesselTrawlerDesc: 'बड़ा स्टील या लकड़ी का गहरा समुद्री ट्रॉलर (> 15 मीटर).',

  voiceTap: 'बोलने के लिए टैप करें',
  voiceListening: 'सुन रहा है...',
  voiceSpeaking: 'बोल रहा है...',

  activeBadge: 'सक्रिय',
  safeBadge: 'सुरक्षित',
  warningBadge: 'चेतावनी',
  criticalBadge: 'गंभीर',
  limitText: 'सीमा',
  footerNotice: 'ऑर्का निर्णय-समर्थन हेतु एक वैज्ञानिक समुद्री सहायक है।',
  footerAbout: 'सिस्टम वास्तुकला',
  footerPrivacy: 'गोपनीयता',
};

const makeOverride = (patch: Partial<TranslationKeys>): TranslationKeys => ({
  ...en,
  ...patch,
});

export const TRANSLATIONS: Record<LanguageCode, TranslationKeys> = {
  en,
  ta,
  hi,
  mr: makeOverride({
    tabMap: 'नकाशा', tabAsk: 'विचारा', tabSafety: 'सुरक्षा', tabResearch: 'संशोधन', tabSettings: 'सेटिंग्ज',
    tagline: 'INCOIS / ISRO सागरी सहाय्यक', askInputPlaceholder: 'ऑर्काशी मराठीत बोला...',
    safetyTitle: 'सागरी सुरक्षा व जिओफेन्स', pfzTitle: 'संभाव्य मासेमारी क्षेत्र', routeTitle: 'सुरक्षित मार्ग नियोजक',
    voiceTap: 'बोलण्यासाठी टॅप करा', voiceListening: 'ऐकत आहे...', voiceSpeaking: 'बोलत आहे...',
  }),
  gu: makeOverride({
    tabMap: 'નકશો', tabAsk: 'પૂછો', tabSafety: 'સુરક્ષા', tabResearch: 'સંशोधन', tabSettings: 'સેટિંગ્સ',
    tagline: 'INCOIS / ISRO મરીન એજન્ટ', askInputPlaceholder: 'ઓર્કાને ગુજરાતીમાં પૂછો...',
    safetyTitle: 'દરિયાઈ સુરક્ષા અને જીઓફેન્સ', pfzTitle: 'સંભવિત માછીમારી ક્ષેત્ર', routeTitle: 'સુરક્ષિત માર્ગ પ્લાનર',
    voiceTap: 'બોલવા માટે ટેપ કરો', voiceListening: 'સાંભળી રહ્યું છે...', voiceSpeaking: 'બોલી રહ્યું છે...',
  }),
  te: makeOverride({
    tabMap: 'మ్యాప్', tabAsk: 'అడగండి', tabSafety: 'భద్రత', tabResearch: 'పరిశోధన', tabSettings: 'సెట్టింగ్‌లు',
    tagline: 'INCOIS / ISRO మెరైన్ ఏజెంట్', askInputPlaceholder: 'ఆర్కాను తెలుగులో అడగండి...',
    safetyTitle: 'సముద్ర భద్రత & జియోఫెన్స్', pfzTitle: 'చేపల వేట ప్రాంతాలు', routeTitle: 'సురక్షిత మార్గ ప్రణాళిక',
    voiceTap: 'మాట్లాడటానికి నొక్కండి', voiceListening: 'వింటోంది...', voiceSpeaking: 'మాట్లాడుతోంది...',
  }),
  ml: makeOverride({
    tabMap: 'മാപ്പ്', tabAsk: 'ചോദിക്കുക', tabSafety: 'സുരക്ഷ', tabResearch: 'ഗവേഷണം', tabSettings: 'ക്രമീകരണങ്ങൾ',
    tagline: 'ഇൻകോയിസ് / ഐഎസ്ആർഒ മറൈൻ അസിസ്റ്റന്റ്', askInputPlaceholder: 'ഓർക്കയോട് മലയാളത്തിൽ ചോദിക്കൂ...',
    safetyTitle: 'സമുദ്ര സുരക്ഷാ മോണിറ്റർ', pfzTitle: 'മത്സ്യബന്ധന മേഖലകൾ', routeTitle: 'സുരക്ഷിത പാത പ്ലാനർ',
    voiceTap: 'സംസാരിക്കാൻ അമർത്തുക', voiceListening: 'കേൾക്കുന്നു...', voiceSpeaking: 'സംസാരിക്കുന്നു...',
  }),
  kn: makeOverride({
    tabMap: 'ನಕ್ಷೆ', tabAsk: 'ಕೇಳಿ', tabSafety: 'ಸುರಕ್ಷತೆ', tabResearch: 'ಸಂಶೋಧನೆ', tabSettings: 'ಸೆಟ್ಟಿಂಗ್ಸ್',
    tagline: 'ಇನ್ಕೋಯಿಸ್ / ಇಸ್ರೋ ಮೆರೈನ್ ಏಜೆಂಟ್', askInputPlaceholder: 'ಆರ್ಕಾಗೆ ಕನ್ನಡದಲ್ಲಿ ಕೇಳಿ...',
    safetyTitle: 'ಸಾಗರ ಸುರಕ್ಷತೆ ಮತ್ತು ಜಿಯೋಫೆನ್ಸ್', pfzTitle: 'ಸಂಭಾವ್ಯ ಮೀನುಗಾರಿಕಾ ವಲಯಗಳು', routeTitle: 'ಸುರಕ್ಷಿತ ಮಾರ್ಗ ಯೋಜಕ',
    voiceTap: 'ಮಾತನಾಡಲು ಸ್ಪರ್ಶಿಸಿ', voiceListening: 'ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದೆ...', voiceSpeaking: 'ಮಾತನಾಡುತ್ತಿದೆ...',
  }),
  bn: makeOverride({
    tabMap: 'মানচিত্র', tabAsk: 'জিজ্ঞাসা', tabSafety: 'সুরক্ষা', tabResearch: 'গবেষণা', tabSettings: 'সেটিংস',
    tagline: 'ইনকোইস / ইসরো সামুদ্রিক সহকারী', askInputPlaceholder: 'অরকাকে বাংলায় জিজ্ঞাসা করুন...',
    safetyTitle: 'সামুদ্রিক নিরাপত্তা ও জিওফেন্স', pfzTitle: 'সম্ভাব্য মৎস্য আহরণ অঞ্চল', routeTitle: 'নিরাপদ পথ পরিকল্পনাকারী',
    voiceTap: 'কথা বলতে স্পর্শ করুন', voiceListening: 'শুনছে...', voiceSpeaking: 'বলছে...',
  }),
  or: makeOverride({
    tabMap: 'ମାନଚିତ୍ର', tabAsk: 'ପଚାରନ୍ତୁ', tabSafety: 'ସୁରକ୍ଷା', tabResearch: 'ଗବେଷଣା', tabSettings: 'ସେଟିଙ୍ଗ୍ସ',
    tagline: 'ଇନକୋଇସ / ଇସ୍ରୋ ସାମୁଦ୍ରିକ ଏଜେଣ୍ଟ', askInputPlaceholder: 'ଓଡ଼ିଆରେ ପଚାରନ୍ତୁ...',
    safetyTitle: 'ସାମୁଦ୍ରିକ ସୁରକ୍ଷା ଓ ଜିଓଫେନ୍ସ', pfzTitle: 'ସମ୍ଭାବ୍ୟ ମତ୍ସ୍ୟ ଧରିବା ଅଞ୍ଚଳ', routeTitle: 'ନିରାପଦ ମାର୍ଗ ଯୋଜନାକାରୀ',
    voiceTap: 'କହିବାକୁ ସ୍ପର୍ଶ କରନ୍ତୁ', voiceListening: 'ଶୁଣୁଛି...', voiceSpeaking: 'କହୁଛି...',
  }),
};

export function getTranslation(lang: LanguageCode): TranslationKeys {
  return TRANSLATIONS[lang] || TRANSLATIONS.en;
}
