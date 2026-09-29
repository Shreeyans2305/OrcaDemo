import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  MapPin,
  Sparkles,
  Compass,
  Waves,
  Fish,
} from 'lucide-react';
import { BadgePill } from '../../core/widgets/BadgePill';
import { EvidenceRow } from '../../core/widgets/EvidenceRow';
import { AgentTraceSheet } from '../../core/widgets/AgentTraceSheet';
import { ChatMessage, LanguageCode } from '../../domain/agents/orcaTypes';
import { VesselClass } from '../../core/config/safetyThresholds';
import { useTranslation } from '../../core/i18n/LanguageContext';

interface AskScreenProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isProcessing: boolean;
  onFocusMap: () => void;
  vessel: VesselClass;
  currentLanguage: LanguageCode;
}

export const AskScreen: React.FC<AskScreenProps> = ({
  messages,
  onSendMessage,
  isProcessing,
  onFocusMap,
}) => {
  const { t, language } = useTranslation();
  const [inputText, setInputText] = useState('');
  const [openTraceId, setOpenTraceId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Structured prompt presets with category tags
  const promptPresets = [
    {
      category: 'Weather & Vessel Limit',
      icon: <Waves className="w-3.5 h-3.5 text-blue-500" />,
      text:
        language === 'ta'
          ? 'நாளை காலை மீன்பிடிக்க செல்வது பாதுகாப்பானதா?'
          : language === 'hi'
          ? 'क्या कल सुबह मछली पकड़ने जाना सुरक्षित है?'
          : 'Is it safe to go fishing tomorrow morning?',
    },
    {
      category: 'SST & Fish Zones (PFZ)',
      icon: <Fish className="w-3.5 h-3.5 text-emerald-500" />,
      text:
        language === 'ta'
          ? 'எனக்கு அருகிலுள்ள சாத்தியமான மீன்பிடி மண்டலங்கள் எங்கே உள்ளன?'
          : language === 'hi'
          ? 'मेरे निकटतम मत्स्य क्षेत्र कहाँ हैं?'
          : 'Where are potential fishing zones near me?',
    },
    {
      category: 'Navigation & Port Route',
      icon: <Compass className="w-3.5 h-3.5 text-purple-500" />,
      text:
        language === 'ta'
          ? 'துறைமுகத்திற்கு செல்லும் பாதுகாப்பான பாதை எது?'
          : language === 'hi'
          ? 'निकटतम बंदरगाह का सबसे सुरक्षित मार्ग क्या है?'
          : 'What is the safest route to port?',
    },
    {
      category: 'Ecosystem Reasoning & RAG',
      icon: <Sparkles className="w-3.5 h-3.5 text-amber-500" />,
      text:
        language === 'ta'
          ? 'இந்த பருவத்தில் மத்தி மீன் வரத்து ஏன் குறைந்தது?'
          : language === 'hi'
          ? 'इस मौसम में सारडीन मछली का उत्पादन क्यों घटा?'
          : 'Why did sardine catch decline this season?',
    },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isProcessing) return;
    const text = inputText;
    setInputText('');
    await onSendMessage(text);
  };

  const handlePresetClick = (presetText: string) => {
    setInputText(presetText);
    onSendMessage(presetText);
  };

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 max-w-3xl mx-auto w-full bg-[#f2f2f7]">
      {/* Conversation Thread */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="py-6 text-center space-y-3.5">
            <div className="w-13 h-13 rounded-full bg-[#000000] text-white flex items-center justify-center mx-auto shadow-lg ring-4 ring-black/5">
              <span className="font-display font-bold text-lg tracking-tight">orca</span>
            </div>
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-[11px] font-semibold border border-emerald-500/20">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>Powered by Hack Club AI (GPT-4o-mini)</span>
              </div>
              <h2 className="font-display text-lg font-bold text-[#1c1c1e] tracking-tight">
                {t.askTitle}
              </h2>
              <p className="text-xs text-[#8e8e93] max-w-sm mx-auto font-medium">
                Tap any test question below to evaluate live multi-agent maritime reasoning:
              </p>
            </div>

            {/* Structured Suggestion Cards with Category Badges for Beginners */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg mx-auto text-left">
              {promptPresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePresetClick(preset.text)}
                  className="p-3 rounded-2xl glass-surface hover:bg-white active:scale-98 transition-all cursor-pointer shadow-xs border border-black/5 space-y-1 group"
                >
                  <div className="flex items-center gap-1.5">
                    {preset.icon}
                    <span className="text-[10px] font-bold text-[#8e8e93] uppercase tracking-wider group-hover:text-[#1c1c1e] transition-colors">
                      {preset.category}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-[#1c1c1e] leading-snug">
                    {preset.text}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="space-y-2">
              {msg.role === 'user' ? (
                /* User Bubble (Frosted Apple Bubble) */
                <div className="flex justify-end">
                  <div className="glass-surface bg-white/90 text-[#1c1c1e] rounded-2xl rounded-tr-xs px-4 py-3 max-w-[85%] text-xs font-semibold shadow-xs">
                    <p className="leading-relaxed">{msg.text}</p>
                    <div className="text-[10px] text-[#8e8e93] mt-1 text-right font-medium">
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              ) : (
                /* Agent Response (Frosted Apple Card) */
                <div className="flex justify-start">
                  <div className="glass-surface rounded-2xl rounded-tl-xs p-4 md:p-5 max-w-[95%] w-full shadow-sm space-y-3">
                    {/* Header: Title + Severity Badge + Speaker */}
                    <div className="flex items-center justify-between gap-2 border-b border-black/[0.05] pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-xs text-[#1c1c1e]">
                          {t.synthesisTitle}
                        </span>
                        {msg.result && (
                          <BadgePill
                            label={msg.result.severity.toUpperCase()}
                            variant="severity"
                            severity={msg.result.severity}
                          />
                        )}
                      </div>
                    </div>

                    {/* Summary text */}
                    <div className="text-xs text-[#1c1c1e] font-medium leading-relaxed">
                      {language !== 'en' && msg.nativeText ? msg.nativeText : msg.text}
                    </div>

                    {/* Secondary translation if English was requested or present */}
                    {msg.nativeText && msg.nativeText !== msg.text && language === 'en' && (
                      <div className="text-xs text-[#3a3a3c] bg-black/[0.03] p-3 rounded-xl border border-black/[0.04] leading-relaxed">
                        {msg.nativeText}
                      </div>
                    )}

                    {/* Evidence Rows if Result present */}
                    {msg.result && msg.result.evidence.length > 0 && (
                      <div className="border border-black/[0.06] rounded-xl p-3 bg-white/70 space-y-1">
                        <div className="font-bold text-[11px] text-[#1c1c1e] mb-1 flex items-center justify-between">
                          <span>{t.verifiedEvidence}</span>
                          <span className="text-[10px] text-[#8e8e93] font-medium">
                            {msg.result.provenance.source}
                          </span>
                        </div>
                        {msg.result.evidence.slice(0, 4).map((item, idx) => (
                          <EvidenceRow key={idx} item={item} />
                        ))}
                      </div>
                    )}

                    {/* Action Row: Show on Map + Trace Toggle */}
                    <div className="flex items-center justify-between pt-1 gap-2">
                      <button
                        onClick={onFocusMap}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#000000] text-white hover:bg-[#1c1c1e] text-xs font-semibold cursor-pointer transition-all shadow-xs"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{t.showOnMap}</span>
                      </button>

                      <span className="text-[10px] text-[#8e8e93] font-medium">
                        {msg.timestamp}
                      </span>
                    </div>

                    {/* Expandable Agent Trace Sheet */}
                    {msg.result && msg.result.traceLogs && (
                      <AgentTraceSheet
                        traces={msg.result.traceLogs}
                        isOpen={openTraceId === msg.id}
                        onToggle={() =>
                          setOpenTraceId(openTraceId === msg.id ? null : msg.id)
                        }
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}

        {/* Loading Skeleton */}
        {isProcessing && (
          <div className="glass-surface rounded-2xl p-4 max-w-sm space-y-2 animate-pulse">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-black/10" />
              <div className="h-3 bg-black/10 rounded w-28" />
            </div>
            <div className="h-3 bg-black/5 rounded w-full" />
            <div className="h-3 bg-black/5 rounded w-4/5" />
            <div className="text-[10px] text-[#8e8e93] font-semibold">
              {t.processingText}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Frosted Input Bar */}
      <div className="p-3 glass-tabbar sticky bottom-0">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          {/* Text Input with AI indicator */}
          <div className="relative flex-1 flex items-center">
            <Sparkles className="w-4 h-4 text-[#007aff] absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t.askInputPlaceholder || "Ask ORCA Marine AI (e.g. Is it safe to sail today?)..."}
              className="w-full h-11 pl-10 pr-4 glass-input rounded-full text-xs text-[#1c1c1e] placeholder:text-[#8e8e93] focus:outline-none shadow-xs font-medium"
            />
          </div>

          {/* Primary Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isProcessing}
            className={`
              w-11 h-11 rounded-full flex items-center justify-center shrink-0
              transition-all
              ${
                !inputText.trim() || isProcessing
                  ? 'bg-black/10 text-[#8e8e93] cursor-not-allowed'
                  : 'bg-[#000000] text-white hover:bg-[#1c1c1e] cursor-pointer shadow-md active:scale-95'
              }
            `}
            title="Send Message"
            aria-label="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
