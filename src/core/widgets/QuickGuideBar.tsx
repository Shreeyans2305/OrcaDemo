import React, { useState } from 'react';
import {
  Compass,
  Thermometer,
  Waves,
  Fish,
  MessageSquare,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  X,
  Sparkles,
} from 'lucide-react';
import { TabType } from './BottomTabBar';
import { MapLayer } from '../../features/map/MapScreen';

interface QuickGuideBarProps {
  onSelectFeature: (tab: TabType, layer?: MapLayer) => void;
}

export const QuickGuideBar: React.FC<QuickGuideBarProps> = ({ onSelectFeature }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  if (isDismissed) return null;

  return (
    <div className="px-3 sm:px-4 pt-2 pb-1 z-20 pointer-events-auto select-none">
      <div className="glass-surface rounded-2xl p-2 sm:p-2.5 shadow-sm border border-black/10 transition-all">
        {/* Header row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#007aff]" />
            <span className="font-display font-bold text-xs text-[#1c1c1e]">
              Evaluator & Judge Guide
            </span>
            <span className="text-[10px] text-[#8e8e93] font-medium hidden sm:inline">
              • 1-Click Feature Tour
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-2 py-0.5 rounded-lg hover:bg-black/5 text-[#8e8e93] hover:text-[#1c1c1e] text-[11px] font-semibold flex items-center gap-0.5 cursor-pointer"
            >
              <span>{isExpanded ? 'Hide' : 'Show Guides'}</span>
              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              className="p-1 rounded-lg hover:bg-black/5 text-[#8e8e93] hover:text-[#1c1c1e] cursor-pointer"
              title="Dismiss Guide"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 1-Tap Feature Test Chips */}
        {isExpanded && (
          <div className="pt-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => onSelectFeature('map', 'waves')}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 text-[11px] font-bold border border-blue-500/20 whitespace-nowrap active:scale-95 transition cursor-pointer"
            >
              <Waves className="w-3 h-3 text-blue-600" />
              <span>1. Live Waves & Limits</span>
            </button>

            <button
              onClick={() => onSelectFeature('map', 'sst')}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-800 text-[11px] font-bold border border-orange-500/20 whitespace-nowrap active:scale-95 transition cursor-pointer"
            >
              <Thermometer className="w-3 h-3 text-orange-600" />
              <span>2. SST Thermal Fronts</span>
            </button>

            <button
              onClick={() => onSelectFeature('map', 'pfz')}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-800 text-[11px] font-bold border border-emerald-500/20 whitespace-nowrap active:scale-95 transition cursor-pointer"
            >
              <Fish className="w-3 h-3 text-emerald-600" />
              <span>3. Fish Zones (PFZ)</span>
            </button>

            <button
              onClick={() => onSelectFeature('ask')}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-800 text-[11px] font-bold border border-purple-500/20 whitespace-nowrap active:scale-95 transition cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-purple-600" />
              <span>4. Ask Hack Club AI</span>
            </button>

            <button
              onClick={() => onSelectFeature('safety')}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-800 text-[11px] font-bold border border-rose-500/20 whitespace-nowrap active:scale-95 transition cursor-pointer"
            >
              <ShieldAlert className="w-3 h-3 text-rose-600" />
              <span>5. IMBL Geofence Alert</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
