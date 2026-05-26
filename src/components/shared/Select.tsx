import React, { forwardRef } from 'react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Array<SelectOption | string>;
  error?: string;
  helperText?: string;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', label, options, error, helperText, placeholder, id, ...props }, ref) => {
    const selectId = id || Math.random().toString(36).substring(2, 9);
    
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-semibold text-slate-600 px-0.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={`
              w-full px-4 py-3 rounded-xl border bg-slate-50 border-slate-200 text-sm text-slate-800 
              appearance-none transition-all duration-200 focus:outline-none focus:bg-white focus:ring-2 
              ${error 
                ? 'border-danger-400 focus:ring-danger-200 focus:border-danger-500' 
                : 'focus:ring-primary-100 focus:border-primary-400'
              }
              ${className}
            `}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt, idx) => {
              if (typeof opt === 'string') {
                return (
                  <option key={idx} value={opt}>
                    {opt}
                  </option>
                );
              }
              return (
                <option key={idx} value={opt.value}>
                  {opt.label}
                </option>
              );
            })}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
        {error && (
          <span className="text-xs font-medium text-danger-500 px-1">
            {error}
          </span>
        )}
        {!error && helperText && (
          <span className="text-xs text-slate-400 px-1">
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
