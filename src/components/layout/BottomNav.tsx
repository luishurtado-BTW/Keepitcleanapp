import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  TrendingUp, 
  Receipt, 
  Settings 
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const tabs = [
    { to: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { to: '/calendar', label: 'Calendario', icon: <Calendar size={20} /> },
    { to: '/income', label: 'Ingresos', icon: <TrendingUp size={20} /> },
    { to: '/expenses', label: 'Gastos', icon: <Receipt size={20} /> },
    { to: '/settings', label: 'Configuración', icon: <Settings size={20} /> }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 shadow-bottom-nav z-40 px-2 pb-safe-bottom">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) => `
              flex flex-col items-center justify-center flex-1 h-full py-1 gap-1 text-[10px] font-semibold transition-all duration-200
              ${isActive 
                ? 'text-primary-500 scale-105' 
                : 'text-slate-400 hover:text-slate-600'
              }
            `}
          >
            <div className="flex items-center justify-center p-1 rounded-xl">
              {tab.icon}
            </div>
            <span>{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
