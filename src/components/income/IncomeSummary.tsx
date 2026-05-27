import React from 'react';
import { formatCurrency } from '../../utils/formatCurrency';
import { IncomeSummaryMonth } from '../../types/income';
import { 
  Building, 
  Users, 
  TrendingUp, 
  Percent, 
  DollarSign 
} from 'lucide-react';

interface IncomeSummaryProps {
  summary: IncomeSummaryMonth;
}

export const IncomeSummary: React.FC<IncomeSummaryProps> = ({ summary }) => {
  const {
    totalIncome,
    companyPercentage,
    companyShare,
    employeesPercentage,
    employeesShare,
    individualDistribution
  } = summary;

  const techIds = Object.keys(individualDistribution);

  return (
    <div className="flex flex-col gap-5">
      {/* 1. Main summary block: total monthly earnings */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-3xl p-6 shadow-premium relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-100">
          Ingreso Total Facturado
        </span>
        <h2 className="text-2xl font-black tracking-tight mt-1">
          {formatCurrency(totalIncome)}
        </h2>
        <span className="text-[10px] font-medium text-emerald-50 leading-none mt-4 inline-block">
          Exclusivo de citas marcadas como "Completada"
        </span>
      </div>

      {/* 2. Side-by-side distribution cards (Company vs. Technicians) */}
      <div className="grid grid-cols-2 gap-3">
        {/* Company Card */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-premium flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
              Empresa
            </span>
            <div className="p-1.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-500">
              <Building size={14} />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black text-slate-800">
              {formatCurrency(companyShare)}
            </span>
            <span className="text-[9px] font-bold text-slate-400 mt-1 leading-none">
              Porcentaje: {companyPercentage}%
            </span>
          </div>
        </div>

        {/* Technicians Card */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-premium flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
              Colaboradores
            </span>
            <div className="p-1.5 bg-emerald-50 border border-emerald-100 rounded-lg text-success-500">
              <Users size={14} />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black text-slate-800">
              {formatCurrency(employeesShare)}
            </span>
            <span className="text-[9px] font-bold text-success-500 mt-1 leading-none">
              Porcentaje: {employeesPercentage}%
            </span>
          </div>
        </div>
      </div>

      {/* 3. Detailed individual distribution split */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-premium flex flex-col gap-3">
        <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 pb-2.5 border-b border-slate-50">
          <Percent size={14} className="text-success-500" />
          Desglose Individual de Colaboradores
        </h3>

        {techIds.length > 0 ? (
          <div className="flex flex-col gap-3.5 mt-1">
            {techIds.map((id) => {
              const item = individualDistribution[id];
              // Calculate percentage of employee share
              return (
                <div key={id} className="flex justify-between items-center">
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-xs font-bold text-slate-700 truncate">
                      {item.name}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400">
                      Comisión: {item.percentage.toFixed(1)}% de la parte de colaboradores
                    </span>
                  </div>
                  <span className="text-xs font-extrabold text-slate-800 flex-shrink-0">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <span className="text-[10px] font-semibold text-slate-400 py-2 text-center">
            No hay colaboradores activos registrados para el reparto.
          </span>
        )}
      </div>
    </div>
  );
};

export default IncomeSummary;
