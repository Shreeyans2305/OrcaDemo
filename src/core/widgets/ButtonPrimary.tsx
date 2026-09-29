import React from 'react';

interface ButtonPrimaryProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  fullWidth?: boolean;
}

export const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({
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
        transition-colors duration-150 select-none
        ${
          disabled
            ? 'bg-[#e5e7eb] text-[#6b7280] cursor-not-allowed'
            : 'bg-[#111111] text-white hover:bg-[#242424] active:bg-[#242424] cursor-pointer shadow-sm'
        }
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};
