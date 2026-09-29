import React from 'react';
import { ChevronDown, ChevronUp, Cpu, CheckCircle2 } from 'lucide-react';
import { TraceNodeLog } from '../../domain/agents/orcaTypes';
import { useTranslation } from '../i18n/LanguageContext';

interface AgentTraceSheetProps {
  traces: TraceNodeLog[];
  isOpen: boolean;
  onToggle: () => void;
}

export const AgentTraceSheet: React.FC<AgentTraceSheetProps> = ({
  traces,
  isOpen,
  onToggle,
}) => {
  const { t } = useTranslation();
  if (traces.length === 0) return null;

  const totalLatency = traces.reduce((sum, tr) => sum + tr.latencyMs, 0);

  return (
    <div className="border border-black/[0.06] rounded-2xl bg-black/[0.02] overflow-hidden my-3">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between text-left text-xs font-semibold text-[#1c1c1e] hover:bg-black/[0.04] transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#000000]" />
          <span>{t.agentTraceTitle} ({traces.length})</span>
          <span className="text-[11px] text-[#8e8e93]">
            {totalLatency}ms {t.totalLatency}
          </span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-[#8e8e93]" /> : <ChevronDown className="w-4 h-4 text-[#8e8e93]" />}
      </button>

      {isOpen && (
        <div className="px-4 pb-4 pt-1 space-y-2.5 border-t border-black/[0.06]">
          {traces.map((trace, idx) => (
            <div
              key={idx}
              className="glass-surface rounded-xl p-3.5 text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-[#000000] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#34c759]" />
                  <span>{trace.nodeName}</span>
                </div>
                <span className="text-[#8e8e93] font-medium">{trace.latencyMs}ms</span>
              </div>

              <div className="text-[11px] text-[#8e8e93]">
                Role: <span className="text-[#1c1c1e] font-semibold">{trace.agentRole}</span>
              </div>

              <div className="text-[11px] text-[#3a3a3c] bg-black/[0.03] p-2.5 rounded-xl space-y-1">
                <div><strong className="text-[#000000]">In:</strong> {trace.inputSummary}</div>
                <div><strong className="text-[#000000]">Out:</strong> {trace.outputSummary}</div>
              </div>

              {trace.toolCalls && trace.toolCalls.length > 0 && (
                <div className="pt-1 space-y-1">
                  {trace.toolCalls.map((tCall, tIdx) => (
                    <div
                      key={tIdx}
                      className="bg-black/[0.04] p-2.5 rounded-xl text-[11px] text-[#1c1c1e]"
                    >
                      <div className="text-[#007aff] font-bold">{tCall.toolName}()</div>
                      <div className="text-[#8e8e93] mt-0.5">{tCall.resultSummary}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
