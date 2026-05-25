import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = true,
  hover = false,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm
        ${padding ? 'p-5' : ''}
        ${hover ? 'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  iconBg: string;
  trend?: { value: number; label: string };
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title, value, subtitle, icon, iconBg, trend, className = ''
}) => {
  return (
    <Card className={`${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white truncate">{value}</p>
          {subtitle && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{subtitle}</p>}
          {trend && (
            <div className={`inline-flex items-center gap-1 mt-2 text-xs font-medium px-2 py-0.5 rounded-full
              ${trend.value >= 0
                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
              }`}>
              <span>{trend.value >= 0 ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-slate-400 font-normal">{trend.label}</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default Card;
