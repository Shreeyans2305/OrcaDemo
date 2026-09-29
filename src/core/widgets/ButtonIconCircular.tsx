import React from 'react';

interface ButtonIconCircularProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  size?: number;
  label: string;
}

export const ButtonIconCircular: React.FC<ButtonIconCircularProps> = ({
  icon,
  size = 36,
  label,
  className = '',
  ...props
}) => {
  return (
    <button
      aria-label={label}
      title={label}
      style={{ width: `${size}px`, height: `${size}px` }}
      className={`
        relative inline-flex items-center justify-center rounded-full
        bg-white text-[#111111] border border-[#e5e7eb]
        hover:bg-[#f8f9fa] active:bg-[#f3f4f6]
        transition-colors duration-150 cursor-pointer shadow-sm
        after:content-[''] after:absolute after:-inset-1.5
        ${className}
      `}
      {...props}
    >
      {icon}
    </button>
  );
};
