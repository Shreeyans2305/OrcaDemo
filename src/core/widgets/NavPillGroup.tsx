import React from 'react';

export interface PillOption<T extends string = string> {
  id: T;
  label: string;
  badge?: string;
}

interface NavPillGroupProps<T extends string = string> {
  options: PillOption<T>[];
  selectedId: T;
  onChange: (id: T) => void;
  className?: string;
  scrollable?: boolean;
}

export function NavPillGroup<T extends string = string>({
  options,
  selectedId,
  onChange,
  className = '',
  scrollable = false,
}: NavPillGroupProps<T>) {
  return (
    <div
      className={`
        inline-flex items-center gap-1 p-1 rounded-full
        glass-pill-container
        ${scrollable ? 'overflow-x-auto max-w-full no-scrollbar' : ''}
        ${className}
      `}
    >
      {options.map((opt) => {
        const isSelected = opt.id === selectedId;
        return (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={`
              inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full
              text-xs transition-all duration-200 cursor-pointer select-none whitespace-nowrap
              ${
                isSelected
                  ? 'glass-pill-active'
                  : 'text-[#8e8e93] hover:text-[#1c1c1e] bg-transparent'
              }
            `}
          >
            <span className={isSelected ? 'font-semibold' : 'font-medium'}>{opt.label}</span>
            {opt.badge && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-black/5 text-[#1c1c1e]' : 'bg-black/5 text-[#8e8e93]'}`}>
                {opt.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
