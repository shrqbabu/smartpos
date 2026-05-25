import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
  helperText?: string;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  suffix,
  helperText,
  fullWidth = true,
  className = '',
  ...props
}) => {
  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        <input
          {...props}
          className={`
            w-full bg-white dark:bg-slate-800 border rounded-xl text-sm
            text-slate-900 dark:text-white placeholder:text-slate-400
            transition-all duration-200 outline-none
            ${icon ? 'pl-10' : 'pl-3.5'}
            ${suffix ? 'pr-10' : 'pr-3.5'}
            py-2.5
            ${error
              ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
              : 'border-slate-200 dark:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
            }
            disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50 dark:disabled:bg-slate-900
            ${className}
          `}
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            {suffix}
          </div>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
      {helperText && !error && <p className="mt-1.5 text-xs text-slate-400">{helperText}</p>}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  helperText?: string;
}

export const Select: React.FC<SelectProps> = ({ label, error, options, helperText, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          {label}
        </label>
      )}
      <select
        {...props}
        className={`
          w-full bg-white dark:bg-slate-800 border rounded-xl text-sm px-3.5 py-2.5
          text-slate-900 dark:text-white transition-all duration-200 outline-none
          ${error
            ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
            : 'border-slate-200 dark:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
      {helperText && !error && <p className="mt-1.5 text-xs text-slate-400">{helperText}</p>}
    </div>
  );
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          {label}
        </label>
      )}
      <textarea
        {...props}
        className={`
          w-full bg-white dark:bg-slate-800 border rounded-xl text-sm px-3.5 py-2.5
          text-slate-900 dark:text-white placeholder:text-slate-400 transition-all duration-200 outline-none resize-none
          ${error
            ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
            : 'border-slate-200 dark:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
          }
          ${className}
        `}
      />
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
