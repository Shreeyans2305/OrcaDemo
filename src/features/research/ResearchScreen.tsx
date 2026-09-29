import React, { useState } from 'react';
import { Search, Droplet, FileText } from 'lucide-react';
import { searchKnowledgeBase } from '../../data/assets/knowledgeChunks';
import { ProductMockupCard } from '../../core/widgets/ProductMockupCard';
import { BadgePill } from '../../core/widgets/BadgePill';
import { DarkFooter } from '../../core/widgets/DarkFooter';
import { useTranslation } from '../../core/i18n/LanguageContext';

export const ResearchScreen: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');

  const filteredChunks = searchKnowledgeBase(searchQuery, 10).filter(
    (c) => selectedTopic === 'all' || c.topic === selectedTopic
  );

  const monthlyTrends = [
    { month: 'Jan', sst: 28.1, chlorophyll: 1.2 },
    { month: 'Feb', sst: 28.6, chlorophyll: 1.0 },
    { month: 'Mar', sst: 29.4, chlorophyll: 0.8 },
    { month: 'Apr', sst: 30.1, chlorophyll: 0.6 },
    { month: 'May', sst: 29.8, chlorophyll: 0.9 },
    { month: 'Jun', sst: 27.5, chlorophyll: 3.4 },
    { month: 'Jul', sst: 26.8, chlorophyll: 4.8 },
    { month: 'Aug', sst: 26.5, chlorophyll: 5.2 },
    { month: 'Sep', sst: 27.2, chlorophyll: 3.8 },
    { month: 'Oct', sst: 28.0, chlorophyll: 2.1 },
    { month: 'Nov', sst: 28.3, chlorophyll: 1.5 },
    { month: 'Dec', sst: 28.0, chlorophyll: 1.3 },
  ];

  return (
    <div className="min-h-[calc(100vh-3.5rem-4rem)] md:min-h-[calc(100vh-4rem-4rem)] bg-[#f2f2f7] pb-16">
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#1c1c1e] tracking-tight">
            {t.researchTitle}
          </h1>
          <p className="text-xs text-[#8e8e93] mt-0.5 font-medium">
            {t.researchSubtitle}
          </p>
        </div>

        {/* 12-Month Climatology Trend Card */}
        <ProductMockupCard title={t.climatologyTitle}>
          <div className="space-y-4 text-xs">
            <p className="text-[#3a3a3c] leading-relaxed font-medium">
              {t.climatologyDesc}
            </p>

            {/* Monthly Trend Visual Bars */}
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 pt-2">
              {monthlyTrends.map((m) => (
                <div
                  key={m.month}
                  className="bg-black/[0.03] border border-black/[0.04] rounded-2xl p-2 flex flex-col items-center justify-between text-center min-h-[92px]"
                >
                  <span className="font-bold text-[10px] text-[#1c1c1e]">{m.month}</span>
                  <div className="w-full flex flex-col items-center gap-1 my-1">
                    <div
                      style={{ height: `${(m.chlorophyll / 5.2) * 28 + 6}px` }}
                      className="w-2.5 bg-[#34c759] rounded-t-sm"
                      title={`Chlorophyll: ${m.chlorophyll} mg/m³`}
                    />
                  </div>
                  <span className="text-[10px] text-[#8e8e93] font-semibold">{m.sst}°C</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#8e8e93] pt-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#34c759] rounded-xs" />
                <span className="font-medium">{t.chlorophyllLegend}</span>
              </div>
              <span className="font-semibold">Baseline: CMFRI / INCOIS Reanalysis</span>
            </div>
          </div>
        </ProductMockupCard>

        {/* Cloud Cover Fallback Strategy Card */}
        <div className="bg-[#007aff]/10 border border-[#007aff]/20 rounded-3xl p-4.5 text-xs text-[#0051a8] space-y-1.5 backdrop-blur-md">
          <div className="font-bold text-[#004085] flex items-center gap-2">
            <Droplet className="w-4 h-4 text-[#007aff]" />
            <span>{t.cloudFallbackTitle}</span>
          </div>
          <p className="leading-relaxed font-medium">
            {t.cloudFallbackDesc}
          </p>
        </div>

        {/* Semantic Knowledge Base Search */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8e8e93] absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchResearchPlaceholder}
                className="w-full h-10 pl-9 pr-3.5 glass-input rounded-full text-xs text-[#1c1c1e] focus:outline-none"
              />
            </div>

            {/* Filter Tabs */}
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="h-10 px-4 glass-input rounded-full text-xs font-semibold text-[#1c1c1e] focus:outline-none"
            >
              <option value="all">{t.allTopics}</option>
              <option value="pfz">{t.topicPfz}</option>
              <option value="sst_dynamics">{t.topicSst}</option>
              <option value="safety">{t.topicSafety}</option>
              <option value="regulations">{t.topicRegs}</option>
            </select>
          </div>

          {/* Passage Cards */}
          <div className="space-y-3">
            {filteredChunks.map((chunk) => (
              <ProductMockupCard key={chunk.id}>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display font-bold text-sm text-[#1c1c1e]">
                      {chunk.title}
                    </h3>
                    <BadgePill label={chunk.topic.toUpperCase()} variant="violet" />
                  </div>

                  <p className="text-[#3a3a3c] leading-relaxed font-medium">
                    {chunk.content}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-black/[0.04] text-[11px] text-[#8e8e93]">
                    <div className="flex items-center gap-1.5 font-semibold text-[#1c1c1e]">
                      <FileText className="w-3.5 h-3.5" />
                      <span>{chunk.source}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span>Pub: {chunk.published}</span>
                    </div>
                  </div>
                </div>
              </ProductMockupCard>
            ))}
          </div>
        </div>
      </div>

      <DarkFooter />
    </div>
  );
};
