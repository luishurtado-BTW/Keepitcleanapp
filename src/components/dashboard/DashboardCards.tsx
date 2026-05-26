import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  CreditCard, 
  Wallet, 
  Users 
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

interface DashboardCardsProps {
  income: number;
  expenses: number;
  balance: number;
  reimbursements: number;
}

export const DashboardCards: React.FC<DashboardCardsProps> = ({
  income,
  expenses,
  balance,
  reimbursements
}) => {
  const navigate = useNavigate();

  const cards = [
    {
      title: 'Ingresos del Mes',
      value: formatCurrency(income),
      icon: <TrendingUp size={22} className="text-success-500" />,
      bg: 'from-success-50/50 to-white hover:border-success-100',
      action: () => navigate('/income'),
      badge: 'Citas completadas'
    },
    {
      title: 'Gastos del Mes',
      value: formatCurrency(expenses),
      icon: <CreditCard size={22} className="text-danger-500" />,
      bg: 'from-danger-50/50 to-white hover:border-danger-100',
      action: () => navigate('/expenses?tab=company'),
      badge: 'Gastos generales'
    },
    {
      title: 'Balance del Mes',
      value: formatCurrency(balance),
      icon: <Wallet size={22} className={balance >= 0 ? 'text-primary-500' : 'text-danger-500'} />,
      bg: 'from-primary-50/50 to-white hover:border-primary-100',
      action: () => navigate('/income'),
      badge: 'Ingresos menos gastos'
    },
    {
      title: 'Reembolsos Pendientes',
      value: formatCurrency(reimbursements),
      icon: <Users size={22} className="text-warning-500" />,
      bg: 'from-warning-50/50 to-white hover:border-warning-100',
      action: () => navigate('/expenses?tab=employees'),
      badge: 'Obleas de técnicos'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {cards.map((card, idx) => (
        <button
          key={idx}
          onClick={card.action}
          className={`
            flex items-start justify-between p-5 bg-gradient-to-br rounded-2xl border border-slate-100/80 text-left
            shadow-premium hover:shadow-premium-hover hover:scale-[1.01] active:scale-95 transition-all duration-200
            ${card.bg}
          `}
        >
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {card.title}
            </span>
            <span className="text-lg font-black text-slate-800 tracking-tight leading-none mt-1">
              {card.value}
            </span>
            <span className="text-[10px] font-medium text-slate-400 leading-relaxed mt-2.5 inline-block">
              {card.badge}
            </span>
          </div>
          <div className="p-3 bg-white border border-slate-50 shadow-xs rounded-xl flex items-center justify-center">
            {card.icon}
          </div>
        </button>
      ))}
    </div>
  );
};

export default DashboardCards;
