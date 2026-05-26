import React from 'react';
import { Calendar, MapPin, Clock, Phone, ArrowRight } from 'lucide-react';
import { Appointment } from '../../types/appointment';
import { formatDate } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import { EmptyState } from '../shared/EmptyState';
import { useNavigate } from 'react-router-dom';

interface UpcomingAppointmentsProps {
  appointments: Appointment[];
  onOpenForm: () => void;
}

export const UpcomingAppointments: React.FC<UpcomingAppointmentsProps> = ({
  appointments,
  onOpenForm
}) => {
  const navigate = useNavigate();

  // Status tag colors
  const statusStyles = {
    Pendiente: 'bg-warning-50 text-warning-600 border-warning-100',
    Confirmada: 'bg-info-50 text-info-600 border-info-100',
    Completada: 'bg-success-50 text-success-600 border-success-100',
    Cancelada: 'bg-danger-50 text-danger-600 border-danger-100',
  };

  if (appointments.length === 0) {
    return (
      <EmptyState
        title="No hay citas próximas agendadas"
        description="Todas las citas programadas se han completado o no se han agendado citas recientes."
        actionLabel="Agendar Nueva Cita"
        onAction={onOpenForm}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Calendar size={16} className="text-primary-500" />
          Próximas Citas Programadas
        </h3>
        <button
          onClick={() => navigate('/calendar')}
          className="text-xs font-semibold text-primary-500 hover:text-primary-600 flex items-center gap-1 transition-colors"
        >
          Ver Calendario
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {appointments.map((app) => (
          <div
            key={app.id}
            onClick={() => navigate('/calendar')}
            className="
              flex flex-col p-4 bg-white border border-slate-100 rounded-2xl shadow-premium
              hover:border-primary-100 hover:scale-[1.005] active:scale-[0.99] transition-all duration-200 cursor-pointer gap-2
            "
          >
            {/* Header: Service & Status */}
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-800 leading-tight">
                  {app.serviceType}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold mt-0.5">
                  {app.clientName || 'Cliente No Registrado'}
                </span>
              </div>
              <span
                className={`
                  px-2.5 py-1 rounded-full text-[10px] font-bold border leading-none
                  ${statusStyles[app.status] || statusStyles.Pendiente}
                `}
              >
                {app.status}
              </span>
            </div>

            {/* Details: Date, Time, Phone */}
            <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 text-[10px] font-semibold text-slate-500 mt-1 border-t border-b border-slate-50 py-2">
              <div className="flex items-center gap-1.5">
                <Clock size={12} className="text-slate-400" />
                <span>{app.time} hs</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={12} className="text-slate-400" />
                <span>{formatDate(app.date)}</span>
              </div>
              <div className="flex items-center gap-1.5 col-span-2">
                <Phone size={12} className="text-slate-400" />
                <span>{app.clientPhone}</span>
              </div>
            </div>

            {/* Bottom: Address & Amount */}
            <div className="flex justify-between items-center text-[10px] mt-1 gap-4">
              <div className="flex items-center gap-1.5 text-slate-500 font-semibold min-w-0 flex-1">
                <MapPin size={12} className="text-slate-400 flex-shrink-0" />
                <span className="truncate">{app.address}</span>
              </div>
              <span className="text-xs font-black text-slate-800 flex-shrink-0">
                {formatCurrency(app.amount)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingAppointments;
