import React from 'react';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  className = '',
  size = 'md',
  fullPage = false
}) => {
  const sizeClasses = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4'
  };

  const spinner = (
    <div
      className={`
        animate-spin rounded-full border-t-primary-500 border-r-transparent border-b-transparent border-l-transparent 
        border-slate-200 ${sizeClasses[size]} ${className}
      `}
      role="status"
    >
      <span className="sr-only">Cargando...</span>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50/80 backdrop-blur-xs">
        {spinner}
      </div>
    );
  }

  return <div className="flex items-center justify-center p-6">{spinner}</div>;
};

// 1. Sleek Card Skeleton Loader
export const CardSkeleton: React.FC = () => {
  return (
    <div className="w-full p-5 bg-white border border-slate-100 rounded-2xl shadow-premium animate-pulse flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="h-4 bg-slate-200 rounded-full w-2/5" />
        <div className="h-6 bg-slate-200 rounded-lg w-1/5" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-3 bg-slate-200 rounded-full w-4/5" />
        <div className="h-3 bg-slate-200 rounded-full w-3/5" />
      </div>
      <div className="h-8 bg-slate-200 rounded-xl w-full mt-2" />
    </div>
  );
};

// 2. Sleek List Item Skeleton Loader
export const ListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="flex flex-col gap-3 w-full">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="flex items-center gap-4 p-4 bg-white border border-slate-50 rounded-xl shadow-xs animate-pulse"
        >
          <div className="h-10 w-10 bg-slate-200 rounded-xl flex-shrink-0" />
          <div className="flex-1 flex flex-col gap-2">
            <div className="h-3.5 bg-slate-200 rounded-full w-1/3" />
            <div className="h-2.5 bg-slate-200 rounded-full w-1/2" />
          </div>
          <div className="h-4 bg-slate-200 rounded-full w-12" />
        </div>
      ))}
    </div>
  );
};

export default LoadingSpinner;
