import React from 'react';
import { formatCurrency } from '../../utils/formatCurrency';
import { IncomeSummaryMonth } from '../../types/income';

interface DistributionCardProps {
  summary: IncomeSummaryMonth;
}

export const DistributionCard: React.FC<DistributionCardProps> = ({ summary }) => {
  const { totalIncome, companyShare, employeesShare, companyPercentage, employeesPercentage } = summary;

  if (totalIncome === 0) return null;

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-premium flex flex-col gap-4">
      <div className="flex flex-col gap-0.5">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
          Visualización del Reparto
        </span>
        <h3 className="text-xs font-bold text-slate-800 mt-1">
          Distribución de Comisiones
        </h3>
      </div>

      {/* 1. Stacked commission bar */}
      <div className="flex w-full h-4 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
        <div
          style={{ width: `${companyPercentage}%` }}
          className="bg-primary-500 transition-all duration-300"
          title={`Empresa (${companyPercentage}%)`}
        />
        <div
          style={{ width: `${employeesPercentage}%` }}
          className="bg-success-500 transition-all duration-300"
          title={`Técnicos (${employeesPercentage}%)`}
        />
      </div>

      {/* 2. Visual legend below the bar */}
      <div className="grid grid-cols-2 gap-4 text-[10px] font-bold mt-1">
        {/* Company Legend */}
        <div className="flex items-start gap-2 min-w-0">
          <span className="w-2.5 h-2.5 rounded bg-primary-500 mt-0.5 flex-shrink-0" />
          <div className="flex flex-col min-w-0 leading-none">
            <span className="text-slate-700 truncate">Empresa ({companyPercentage}%)</span>
            <span className="text-slate-400 font-semibold mt-1">{formatCurrency(companyShare)}</span>
          </div>
        </div>

        {/* Technicians Legend */}
        <div className="flex items-start gap-2 min-w-0">
          <span className="w-2.5 h-2.5 rounded bg-success-500 mt-0.5 flex-shrink-0" />
          <div className="flex flex-col min-w-0 leading-none">
            <span className="text-slate-700 truncate">Técnicos ({employeesPercentage}%)</span>
            <span className="text-slate-400 font-semibold mt-1">{formatCurrency(employeesShare)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributionCard;
