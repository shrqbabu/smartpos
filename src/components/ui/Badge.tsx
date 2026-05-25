import React from 'react';

type BadgeVariant = 'success' | 'danger' | 'warning' | 'info' | 'default' | 'purple';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  size?: 'sm' | 'md';
  dot?: boolean;
}

const variants: Record<BadgeVariant, string> = {
  success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  danger: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400',
  warning: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  info: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
  default: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  purple: 'bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400'
};

const dotColors: Record<BadgeVariant, string> = {
  success: 'bg-emerald-500',
  danger: 'bg-red-500',
  warning: 'bg-amber-500',
  info: 'bg-blue-500',
  default: 'bg-slate-400',
  purple: 'bg-purple-500'
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  children,
  size = 'sm',
  dot = false
}) => {
  return (
    <span className={`
      inline-flex items-center gap-1.5 font-medium rounded-full
      ${size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'}
      ${variants[variant]}
    `}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};

export default Badge;
