import React from 'react';
import { Sparkles } from 'lucide-react';

interface HeaderProps {
  title: string;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, rightAction }) => {
  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 z-30 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {/* Sleek dynamic logo badge */}
        <div className="p-2 rounded-xl bg-gradient-to-tr from-primary-500 to-primary-300 text-white shadow-sm flex items-center justify-center">
          <Sparkles size={16} className="animate-spin-slow" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold tracking-wider text-primary-500 uppercase leading-none">
            KeepitClean
          </span>
          <h1 className="text-sm font-bold text-slate-800 leading-tight">
            {title}
          </h1>
        </div>
      </div>
      
      {rightAction && <div className="flex items-center gap-2">{rightAction}</div>}
    </header>
  );
};

export default Header;
