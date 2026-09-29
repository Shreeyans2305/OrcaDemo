import React from 'react';
import { AlertTriangle, ShieldCheck, AlertOctagon, X } from 'lucide-react';
import { SeverityLevel } from '../config/safetyThresholds';

interface SeverityBannerProps {
  severity: SeverityLevel;
  title: string;
  message: string;
  onDismiss?: () => void;
  actionButton?: React.ReactNode;
  className?: string;
}

export const SeverityBanner: React.FC<SeverityBannerProps> = ({
  severity,
  title,
  message,
  onDismiss,
  actionButton,
  className = '',
}) => {
  if (severity === 'green') {
    return (
      <div
        className={`bg-[#34c759]/10 backdrop-blur-md border-b border-[#34c759]/20 px-4 py-2.5 text-xs text-[#248a3d] flex items-center justify-between gap-3 ${className}`}
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#34c759] shrink-0" />
          <span className="font-bold text-[#248a3d]">{title}:</span>
          <span className="text-[#248a3d]/90 font-medium">{message}</span>
        </div>
        {actionButton}
      </div>
    );
  }

  if (severity === 'yellow') {
    return (
      <div
        className={`bg-[#ff9500]/10 backdrop-blur-md border-b border-[#ff9500]/20 px-4 py-3 text-xs text-[#b26a00] flex items-start justify-between gap-3 ${className}`}
      >
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-[#ff9500] shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-[#8a5200]">{title}</div>
            <div className="text-[#b26a00] mt-0.5 leading-relaxed font-medium">{message}</div>
          </div>
        </div>
        {actionButton}
      </div>
    );
  }

  // Red Critical Alert
  return (
    <div
      className={`bg-[#ff3b30] text-white px-4 py-3.5 text-xs flex items-start justify-between gap-3 shadow-lg ${className}`}
    >
      <div className="flex items-start gap-3">
        <AlertOctagon className="w-5 h-5 text-white shrink-0 mt-0.5 animate-pulse" />
        <div>
          <div className="font-display font-bold text-sm tracking-tight text-white uppercase">
            {title}
          </div>
          <div className="text-white/90 mt-1 leading-relaxed text-xs font-medium">
            {message}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {actionButton}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1 text-white/80 hover:text-white cursor-pointer"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
