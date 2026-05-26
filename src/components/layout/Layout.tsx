import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { BottomNav } from './BottomNav';
import { ToastContainer } from '../shared/Toast';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { 
  LayoutDashboard, 
  Calendar, 
  TrendingUp, 
  Receipt, 
  Settings,
  Sparkles
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { toasts, removeToast, isLoading } = useApp();

  const sidebarLinks = [
    { to: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { to: '/calendar', label: 'Calendario', icon: <Calendar size={20} /> },
    { to: '/income', label: 'Ingresos', icon: <TrendingUp size={20} /> },
    { to: '/expenses', label: 'Gastos', icon: <Receipt size={20} /> },
    { to: '/settings', label: 'Configuración', icon: <Settings size={20} /> }
  ];

  if (isLoading) {
    return <LoadingSpinner fullPage />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-800 font-sans antialiased">
      {/* 1. Global Toast Notifications Overlay */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* 2. Desktop left Sidebar Navigation (hidden on mobile) */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-100 flex-shrink-0 h-screen sticky top-0 py-6 px-4">
        {/* Brand Block */}
        <div className="flex items-center gap-3 px-3 mb-8">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-primary-500 to-primary-300 text-white shadow-md flex items-center justify-center">
            <Sparkles size={20} className="animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black tracking-widest text-primary-500 uppercase leading-none">
              KeepitClean
            </span>
            <span className="text-xs text-slate-400 font-semibold leading-relaxed mt-0.5">
              Administración PWA
            </span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 flex flex-col gap-1 px-1">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200
                ${isActive 
                  ? 'bg-primary-50 text-primary-600 shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }
              `}
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer Block */}
        <div className="px-3 pt-4 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="block text-[10px] font-black text-slate-400 tracking-wider uppercase">
              Uso Interno
            </span>
            <span className="block text-[10px] font-bold text-slate-500 mt-0.5">
              Admin & Secretaria
            </span>
            <span className="block text-[9px] text-slate-400 font-medium mt-1 leading-none">
              v1.0.0 (Sin Claves)
            </span>
          </div>
        </div>
      </aside>

      {/* 3. Main content area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden pb-20 md:pb-0">
        <div className="flex-1 flex flex-col w-full max-w-5xl mx-auto md:px-6 md:py-8">
          {children}
        </div>
      </main>

      {/* 4. Mobile Bottom tab navigation (hidden on desktop) */}
      <BottomNav />
    </div>
  );
};

export default Layout;
