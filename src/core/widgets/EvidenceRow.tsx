import React from 'react';
import { EvidenceItem } from '../../domain/agents/orcaTypes';
import { useTranslation } from '../i18n/LanguageContext';

interface EvidenceRowProps {
  item: EvidenceItem;
}

export const EvidenceRow: React.FC<EvidenceRowProps> = ({ item }) => {
  const { t } = useTranslation();

  return (
    <div className="py-2.5 border-b border-black/[0.04] last:border-0 flex items-center justify-between gap-3 text-xs">
      <div className="flex-1 min-w-0">
        <div className="text-[#1c1c1e] font-semibold truncate">{item.label}</div>
        <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-[#8e8e93] font-medium">
          <span>{item.source}</span>
          <span>•</span>
          <span>{item.timestamp}</span>
        </div>
      </div>

      <div className="text-right shrink-0">
        <div className="font-semibold text-sm text-[#000000] tracking-tight">
          {item.value} <span className="text-xs font-normal text-[#8e8e93]">{item.unit}</span>
        </div>
        {item.threshold !== undefined && (
          <div className="text-[10px] text-[#8e8e93]">
            {t.limitText}: {item.threshold} {item.unit}
          </div>
        )}
      </div>
    </div>
  );
};
