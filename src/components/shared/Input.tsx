import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, helperText, id, type = 'text', ...props }, ref) => {
    const inputId = id || Math.random().toString(36).substring(2, 9);
    
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-slate-600 px-0.5"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          ref={ref}
          className={`
            w-full px-4 py-3 rounded-xl border bg-slate-50 border-slate-200 text-sm text-slate-800 
            transition-all duration-200 focus:outline-none focus:bg-white focus:ring-2 
            ${error 
              ? 'border-danger-400 focus:ring-danger-200 focus:border-danger-500' 
              : 'focus:ring-primary-100 focus:border-primary-400'
            }
            ${className}
          `}
          {...props}
        />
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

Input.displayName = 'Input';
export default Input;
