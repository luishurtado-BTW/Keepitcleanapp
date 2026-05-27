import React, { useState } from 'react';
import { formatCurrency } from '../../utils/formatCurrency';
import { CalendarDays, ChevronDown, ChevronUp, Users, Building, Coins } from 'lucide-react';

interface WeeklySplitItem {
  weekIndex: number;
  label: string;
  startDate: string;
  endDate: string;
  totalIncome: number;
  companyShare: number;
  employeesShare: number;
  appointmentsCount: number;
  individualDistribution: Record<string, {
    name: string;
    amount: number;
    percentage: number;
  }>;
}

interface WeeklyBreakdownProps {
  splits: WeeklySplitItem[];
}

export const WeeklyBreakdown: React.FC<WeeklyBreakdownProps> = ({ splits }) => {
  // Track which weeks are expanded (default: first week open)
  const [expandedWeek, setExpandedWeek] = useState<number | null>(1);

  const toggleWeek = (index: number) => {
    setExpandedWeek(expandedWeek === index ? null : index);
  };

  if (splits.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col px-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
          Control de Nómina
        </span>
        <h3 className="text-xs font-bold text-slate-800 mt-1 flex items-center gap-1.5">
          <CalendarDays size={14} className="text-primary-500" />
          Distribución de Pagos por Semana
        </h3>
      </div>

      <div className="flex flex-col gap-3">
        {splits.map((week) => {
          const isExpanded = expandedWeek === week.weekIndex;
          const employeeIds = Object.keys(week.individualDistribution);

          return (
            <div
              key={week.weekIndex}
              className={`
                bg-white border border-slate-100 rounded-3xl shadow-premium overflow-hidden transition-all duration-200
                ${isExpanded ? 'ring-1 ring-primary-100/50' : ''}
              `}
            >
              {/* Accordion Header */}
              <button
                type="button"
                onClick={() => toggleWeek(week.weekIndex)}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors text-left"
              >
                <div className="flex flex-col gap-1 min-w-0 pr-2">
                  <span className="text-xs font-extrabold text-slate-800 leading-tight">
                    {week.label}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 leading-none">
                    {week.appointmentsCount === 1 
                      ? '1 servicio completado' 
                      : `${week.appointmentsCount} servicios completados`}
                  </span>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="flex flex-col items-end leading-none">
                    <span className="text-xs font-black text-slate-800">
                      {formatCurrency(week.totalIncome)}
                    </span>
                    <span className="text-[8px] font-extrabold text-success-500 mt-1 uppercase tracking-wider">
                      Por pagar: {formatCurrency(week.employeesShare)}
                    </span>
                  </div>
                  <div className="text-slate-400">
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>
              </button>

              {/* Accordion Body */}
              {isExpanded && (
                <div className="border-t border-slate-50 bg-slate-50/30 p-4 flex flex-col gap-4 animate-slide-down">
                  {/* Financial Splits summary */}
                  <div className="grid grid-cols-2 gap-3.5">
                    {/* Company block */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-3 flex flex-col gap-1 shadow-xs">
                      <div className="flex items-center gap-1.5 text-slate-400 text-[8px] font-bold uppercase tracking-wider">
                        <Building size={10} />
                        Empresa
                      </div>
                      <span className="text-xs font-black text-slate-800 mt-0.5">
                        {formatCurrency(week.companyShare)}
                      </span>
                    </div>

                    {/* Employees collective block */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-3 flex flex-col gap-1 shadow-xs">
                      <div className="flex items-center gap-1.5 text-success-500 text-[8px] font-bold uppercase tracking-wider">
                        <Users size={10} />
                        Fondo Nómina
                      </div>
                      <span className="text-xs font-black text-slate-800 mt-0.5">
                        {formatCurrency(week.employeesShare)}
                      </span>
                    </div>
                  </div>

                  {/* Individual payees breakdown list */}
                  <div className="flex flex-col gap-2.5">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block px-0.5">
                      Desglose de Nómina Individual
                    </span>

                    <div className="flex flex-col bg-white border border-slate-100 rounded-2xl p-3.5 shadow-xs gap-3">
                      {employeeIds.length > 0 ? (
                        employeeIds.map((id) => {
                          const item = week.individualDistribution[id];
                          if (item.amount === 0) {
                            return (
                              <div key={id} className="flex justify-between items-center opacity-40">
                                <span className="text-xs font-semibold text-slate-500 truncate">
                                  {item.name}
                                </span>
                                <span className="text-xs font-bold text-slate-400">
                                  $0.00 MXN
                                </span>
                              </div>
                            );
                          }
                          return (
                            <div key={id} className="flex justify-between items-center">
                              <div className="flex flex-col min-w-0 pr-2">
                                <span className="text-xs font-bold text-slate-700 truncate">
                                  {item.name}
                                </span>
                                <span className="text-[8px] font-bold text-slate-400 leading-none mt-0.5">
                                  Comisión: {item.percentage.toFixed(1)}%
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                <Coins size={10} className="text-amber-500" />
                                <span className="text-xs font-black text-slate-800">
                                  {formatCurrency(item.amount)}
                                </span>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <span className="text-[9px] font-semibold text-slate-400 py-1 text-center">
                          No hay colaboradores activos en este período.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyBreakdown;
