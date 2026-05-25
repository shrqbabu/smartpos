import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const variants = {
  primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200 dark:shadow-none',
  secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200',
  danger: 'bg-red-500 hover:bg-red-600 text-white shadow-sm shadow-red-200 dark:shadow-none',
  ghost: 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400',
  outline: 'border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300',
  success: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm shadow-emerald-200 dark:shadow-none'
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-4 py-2 text-sm rounded-xl gap-2',
  lg: 'px-5 py-2.5 text-sm rounded-xl gap-2',
  xl: 'px-6 py-3 text-base rounded-xl gap-2'
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  children,
  disabled,
  className = '',
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center font-medium transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed active:scale-95
        ${variants[variant]} ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
      {children}
    </button>
  );
};

export default Button;
