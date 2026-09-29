/**
 * ORCA Multi-Agent Orchestration Types
 * State, nodes, evidence items, trace logs, tool declarations
 */

import { LatLng } from '../geo/geoMath';
import { VesselClass, SeverityLevel } from '../../core/config/safetyThresholds';

export type LanguageCode =
  | 'en' // English
  | 'hi' // Hindi
  | 'mr' // Marathi
  | 'gu' // Gujarati
  | 'ta' // Tamil
  | 'te' // Telugu
  | 'ml' // Malayalam
  | 'kn' // Kannada
  | 'bn' // Bengali
  | 'or'; // Odia

export interface SupportedLanguage {
  code: LanguageCode;
  name: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
];

export interface EvidenceItem {
  label: string;
  value: string | number;
  unit: string;
  threshold?: string | number;
  source: string;
  timestamp: string;
  severity?: SeverityLevel;
}

export interface TraceNodeLog {
  nodeName: string;
  agentRole: string;
  latencyMs: number;
  status: 'success' | 'warning' | 'skipped' | 'fallback';
  inputSummary: string;
  outputSummary: string;
  toolCalls?: Array<{
    toolName: string;
    arguments: Record<string, unknown>;
    resultSummary: string;
  }>;
}

export interface AgentQueryResult {
  queryId: string;
  originalQuery: string;
  detectedLanguage: LanguageCode;
  translatedEnglishQuery: string;
  summary: string;
  nativeSummary: string;
  severity: SeverityLevel;
  evidence: EvidenceItem[];
  chainOfReasoning: string[];
  followUpSuggestions: string[];
  activeLayers: string[]; // e.g. ['waves', 'pfz', 'route', 'boundaries']
  traceLogs: TraceNodeLog[];
  provenance: {
    source: string;
    isLive: boolean;
    isDemo: boolean;
    generatedAt: string;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'agent';
  text: string;
  nativeText?: string;
  language: LanguageCode;
  timestamp: string;
  result?: AgentQueryResult;
  isAudioOrigin?: boolean;
}
