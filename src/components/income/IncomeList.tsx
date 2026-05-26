import React from 'react';
import { Appointment } from '../../types/appointment';
import { formatDate } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import { Calendar, User, Tag, ArrowRight } from 'lucide-react';
import { EmptyState } from '../shared/EmptyState';

interface IncomeListProps {
  appointments: Appointment[];
}

export const IncomeList: React.FC<IncomeListProps> = ({ appointments }) => {
  if (appointments.length === 0) {
    return (
      <EmptyState
        title="No hay ingresos registrados"
        description="Los ingresos se autogeneran a partir de citas de limpieza marcadas como 'Completada'. Cambia el estado de una cita en tu Calendario."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
        Detalle de Servicios Realizados ({appointments.length})
      </h3>

      {/* 1. Mobile Stack View (Hidden on Tablet/Desktop) */}
      <div className="flex flex-col gap-3 md:hidden">
        {appointments.map((app) => (
          <div
            key={app.id}
            className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-premium"
          >
            <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Tag size={16} />
            </div>
            
            <div className="flex-1 flex flex-col min-w-0">
              <span className="text-xs font-bold text-slate-800 truncate">
                {app.serviceType}
              </span>
              <div className="flex items-center gap-3 text-[9px] font-semibold text-slate-400 mt-1">
                <span className="flex items-center gap-1 flex-shrink-0">
                  <Calendar size={10} />
                  {formatDate(app.date)}
                </span>
                <span className="flex items-center gap-1 truncate">
                  <User size={10} />
                  {app.clientName || 'Cliente No Registrado'}
                </span>
              </div>
            </div>

            <span className="text-xs font-black text-slate-800 flex-shrink-0">
              {formatCurrency(app.amount)}
            </span>
          </div>
        ))}
      </div>

      {/* 2. Desktop Table View (Hidden on Mobile) */}
      <div className="hidden md:block overflow-hidden bg-white border border-slate-100 rounded-2xl shadow-premium">
        <table className="w-full border-collapse text-left text-xs text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-6 py-4">Fecha</th>
              <th className="px-6 py-4">Servicio</th>
              <th className="px-6 py-4">Cliente</th>
              <th className="px-6 py-4 text-right">Monto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
            {appointments.map((app) => (
              <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">{formatDate(app.date)}</td>
                <td className="px-6 py-4 font-bold text-slate-800">{app.serviceType}</td>
                <td className="px-6 py-4">{app.clientName || 'Cliente No Registrado'}</td>
                <td className="px-6 py-4 text-right font-black text-slate-800">
                  {formatCurrency(app.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IncomeList;
