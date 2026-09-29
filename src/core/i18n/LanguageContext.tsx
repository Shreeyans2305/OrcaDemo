import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageCode, SUPPORTED_LANGUAGES, SupportedLanguage } from '../../domain/agents/orcaTypes';
import { getTranslation, TranslationKeys } from './translations';
import { VesselClass, VESSEL_CONFIGS } from '../config/safetyThresholds';

interface LanguageContextValue {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: TranslationKeys;
  languages: SupportedLanguage[];
  getVesselName: (vessel: VesselClass) => string;
  getVesselDesc: (vessel: VesselClass) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider: React.FC<{
  children: React.ReactNode;
  initialLanguage?: LanguageCode;
  onLanguageChange?: (lang: LanguageCode) => void;
}> = ({ children, initialLanguage = 'en', onLanguageChange }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    return (localStorage.getItem('orca_lang') as LanguageCode) || initialLanguage;
  });

  const setLanguage = (newLang: LanguageCode) => {
    setLanguageState(newLang);
    localStorage.setItem('orca_lang', newLang);
    onLanguageChange?.(newLang);
  };

  const t = getTranslation(language);

  const getVesselName = (vessel: VesselClass): string => {
    if (vessel === 'artisanal') return t.vesselArtisanalName;
    if (vessel === 'mechanised') return t.vesselMechanisedName;
    return t.vesselTrawlerName;
  };

  const getVesselDesc = (vessel: VesselClass): string => {
    if (vessel === 'artisanal') return t.vesselArtisanalDesc;
    if (vessel === 'mechanised') return t.vesselMechanisedDesc;
    return t.vesselTrawlerDesc;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        languages: SUPPORTED_LANGUAGES,
        getVesselName,
        getVesselDesc,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = (): LanguageContextValue => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return ctx;
};
