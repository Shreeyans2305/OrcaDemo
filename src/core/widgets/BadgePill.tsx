import React from 'react';
import { SeverityLevel } from '../config/safetyThresholds';

interface BadgePillProps {
  label: string;
  variant?: 'default' | 'severity' | 'orange' | 'pink' | 'violet' | 'emerald';
  severity?: SeverityLevel;
  className?: string;
}

export const BadgePill: React.FC<BadgePillProps> = ({
  label,
  variant = 'default',
  severity = 'green',
  className = '',
}) => {
  let styleClasses = 'bg-[#f5f5f5] text-[#111111] border border-[#e5e7eb]';

  if (variant === 'severity') {
    if (severity === 'red') {
      styleClasses = 'bg-[#fef2f2] text-[#ef4444] border border-[#fecaca] font-semibold';
    } else if (severity === 'yellow') {
      styleClasses = 'bg-[#fffbeb] text-[#d97706] border border-[#fde68a] font-semibold';
    } else {
      styleClasses = 'bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0] font-semibold';
    }
  } else if (variant === 'orange') {
    styleClasses = 'bg-[#fff7ed] text-[#c2410c] border border-[#fed7aa]';
  } else if (variant === 'pink') {
    styleClasses = 'bg-[#fdf2f8] text-[#be185d] border border-[#fbcfe8]';
  } else if (variant === 'violet') {
    styleClasses = 'bg-[#f5f3ff] text-[#6d28d9] border border-[#ddd6fe]';
  } else if (variant === 'emerald') {
    styleClasses = 'bg-[#ecfdf5] text-[#047857] border border-[#a7f3d0]';
  }

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-3 py-1 rounded-full
        text-xs font-medium tracking-tight whitespace-nowrap
        ${styleClasses}
        ${className}
      `}
    >
      {variant === 'severity' && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            severity === 'red'
              ? 'bg-[#ef4444]'
              : severity === 'yellow'
              ? 'bg-[#f59e0b]'
              : 'bg-[#10b981]'
          }`}
        />
      )}
      {label}
    </span>
  );
};
