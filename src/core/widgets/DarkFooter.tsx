import React from 'react';
import { useTranslation } from '../i18n/LanguageContext';

interface DarkFooterProps {
  onOpenPrivacy?: () => void;
  onOpenAbout?: () => void;
}

export const DarkFooter: React.FC<DarkFooterProps> = ({
  onOpenPrivacy,
  onOpenAbout,
}) => {
  const { t } = useTranslation();

  return (
    <footer className="glass-dark px-6 py-10 mt-12 text-xs">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-2">
            <span className="font-display text-xl font-bold text-white tracking-tight">
              orca
            </span>
            <span className="w-2 h-2 rounded-full bg-white" />
            <span className="text-[11px] text-[#aeaeb2] ml-2 font-medium">
              v1.0 Operational
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-[#aeaeb2]">
            <button onClick={onOpenAbout} className="hover:text-white transition-colors cursor-pointer">
              {t.footerAbout}
            </button>
            <span>•</span>
            <button onClick={onOpenPrivacy} className="hover:text-white transition-colors cursor-pointer">
              {t.footerPrivacy}
            </button>
          </div>
        </div>

        <div className="space-y-3 text-[11px] text-[#aeaeb2] leading-relaxed">
          <p>{t.footerNotice}</p>
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#8e8e93] pt-2 font-medium">
          <span>{t.tagline}</span>
          <span>Zero Telemetry • TLS Only</span>
        </div>
      </div>
    </footer>
  );
};
