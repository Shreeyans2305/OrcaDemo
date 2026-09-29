import React from 'react';

interface ButtonSecondaryProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  fullWidth?: boolean;
}

export const ButtonSecondary: React.FC<ButtonSecondaryProps> = ({
  children,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <button
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2
        h-10 px-5 text-sm font-semibold rounded-lg
        bg-white text-[#111111] border border-[#e5e7eb]
        hover:bg-[#f8f9fa] active:bg-[#f3f4f6]
        transition-colors duration-150 select-none shadow-sm
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};
