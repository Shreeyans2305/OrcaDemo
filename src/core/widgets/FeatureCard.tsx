import React from 'react';

interface FeatureCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  tag?: string;
  onClick?: () => void;
  className?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  tag,
  onClick,
  className = '',
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-[#f5f5f5] rounded-xl p-5 md:p-6 text-left border border-transparent
        transition-all duration-150 select-none
        ${onClick ? 'cursor-pointer hover:border-[#e5e7eb] active:bg-[#eeeeee]' : ''}
        ${className}
      `}
    >
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2.5">
          {icon && <div className="text-[#111111]">{icon}</div>}
          <h4 className="font-display text-sm font-semibold text-[#111111] tracking-tight">
            {title}
          </h4>
        </div>
        {tag && (
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white border border-[#e5e7eb] text-[#374151]">
            {tag}
          </span>
        )}
      </div>
      <p className="text-xs text-[#6b7280] leading-relaxed">
        {description}
      </p>
    </div>
  );
};
