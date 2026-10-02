import React from 'react';
import { Map, MessageSquare, ShieldAlert, BookOpen, Settings } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

export type TabType = 'map' | 'ask' | 'safety' | 'research' | 'settings';

interface BottomTabBarProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  unreadAlert?: boolean;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onChangeTab,
  unreadAlert = false,
}) => {
  const { t } = useTranslation();

  const tabs: Array<{ id: TabType; label: string; icon: React.ReactNode }> = [
    { id: 'map', label: t.tabMap, icon: <Map className="w-5 h-5" /> },
    { id: 'ask', label: t.tabAsk, icon: <MessageSquare className="w-5 h-5" /> },
    {
      id: 'safety',
      label: t.tabSafety,
      icon: (
        <div className="relative">
          <ShieldAlert className="w-5 h-5" />
          {unreadAlert && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#ff3b30] ring-2 ring-white animate-pulse" />
          )}
        </div>
      ),
    },
    { id: 'research', label: t.tabResearch, icon: <BookOpen className="w-5 h-5" /> },
    { id: 'settings', label: t.tabSettings, icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <nav className="h-16 glass-tabbar px-1 flex items-stretch justify-around z-40 sticky bottom-0 left-0 right-0 w-full pb-safe shrink-0">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChangeTab(tab.id)}
            className={`
              relative flex flex-col items-center justify-center gap-0.5 flex-1 min-h-[48px] py-1 mx-0.5 rounded-2xl
              transition-all duration-200 select-none cursor-pointer
              ${isActive
                ? 'text-[#000000] bg-black/[0.07]'
                : 'text-[#8e8e93] hover:text-[#3a3a3c]'
              }
            `}
          >
            <div className={`transition-transform duration-150 ${isActive ? 'scale-105' : ''}`}>
              {tab.icon}
            </div>
            <span className={`text-[10px] tracking-tight leading-none ${isActive ? 'font-bold text-[#000000]' : 'font-medium'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
