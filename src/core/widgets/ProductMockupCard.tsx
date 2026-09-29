import React from 'react';

interface ProductMockupCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  badge?: React.ReactNode;
}

export const ProductMockupCard: React.FC<ProductMockupCardProps> = ({
  children,
  className = '',
  title,
  badge,
}) => {
  return (
    <div
      className={`
        glass-surface rounded-2xl p-5 md:p-6 transition-all duration-200
        ${className}
      `}
    >
      {(title || badge) && (
        <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-black/[0.06]">
          {title && (
            <h3 className="font-display text-sm md:text-base font-semibold text-[#1c1c1e] tracking-tight">
              {title}
            </h3>
          )}
          {badge && <div>{badge}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
