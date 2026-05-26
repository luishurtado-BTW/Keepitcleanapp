import React, { useState } from 'react';
import { Appointment } from '../../types/appointment';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Sparkles, 
  UserCheck, 
  Edit, 
  Trash2, 
  CheckCircle 
} from 'lucide-react';
import { Button } from '../shared/Button';

interface AppointmentCardProps {
  appointment: Appointment;
  onEdit: (appointment: Appointment) => void;
  onDelete: (id: string) => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onEdit,
  onDelete
}) => {
  const { employees } = useApp();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // Status-colored card borders and tags
  const statusStyles = {
    Pendiente: {
      tag: 'bg-warning-50 text-warning-600 border-warning-100',
      border: 'border-l-4 border-l-warning-500',
      dot: 'bg-warning-500'
    },
    Confirmada: {
      tag: 'bg-info-50 text-info-600 border-info-100',
      border: 'border-l-4 border-l-info-500',
      dot: 'bg-info-500'
    },
    Completada: {
      tag: 'bg-success-50 text-success-600 border-success-100',
      border: 'border-l-4 border-l-success-500',
      dot: 'bg-success-500'
    },
    Cancelada: {
      tag: 'bg-danger-50 text-danger-600 border-danger-100',
      border: 'border-l-4 border-l-danger-500',
      dot: 'bg-danger-500'
    }
  };

  const activeStyle = statusStyles[appointment.status] || statusStyles.Pendiente;

  // Resolve assigned technician name
  const assignedTech = employees.find(e => e.id === appointment.assignedEmployee);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(appointment.id);
    setShowConfirmDelete(false);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirmDelete(false);
  };

  return (
    <div
      className={`
        bg-white border border-slate-100 rounded-2xl p-5 shadow-premium flex flex-col gap-3 transition-all duration-200
        ${activeStyle.border} hover:shadow-premium-hover hover:scale-[1.005]
      `}
    >
      {/* 1. Header: Client & Status */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-black text-slate-800 truncate">
            {appointment.clientName || 'Cliente Genérico'}
          </span>
          <span className="text-[10px] font-bold text-slate-400 mt-0.5">
            {appointment.serviceType}
          </span>
        </div>
        <span
          className={`
            px-3 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1.5 leading-none
            ${activeStyle.tag}
          `}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${activeStyle.dot}`} />
          {appointment.status}
        </span>
      </div>

      {/* 2. Middle Row: Date, Time & Phone */}
      <div className="grid grid-cols-2 gap-y-2 gap-x-3 text-[10px] font-semibold text-slate-500 py-3 border-t border-b border-slate-50 mt-1">
        <div className="flex items-center gap-1.5">
          <Clock size={13} className="text-slate-400" />
          <span>{appointment.time} hs</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar size={13} className="text-slate-400" />
          <span>{formatDate(appointment.date)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Phone size={13} className="text-slate-400" />
          <span>{appointment.clientPhone}</span>
        </div>
        {assignedTech && (
          <div className="flex items-center gap-1.5 min-w-0">
            <UserCheck size={13} className="text-primary-500 flex-shrink-0" />
            <span className="truncate text-primary-600 font-bold">{assignedTech.name}</span>
          </div>
        )}
      </div>

      {/* 3. Address */}
      <div className="flex items-start gap-1.5 text-[10px] text-slate-500 font-semibold leading-normal min-w-0">
        <MapPin size={13} className="text-slate-400 mt-0.5 flex-shrink-0" />
        <span className="line-clamp-2">{appointment.address}</span>
      </div>

      {/* 4. Notes if available */}
      {appointment.notes && (
        <div className="p-2.5 bg-slate-50 rounded-xl text-[9px] text-slate-500 leading-normal font-medium mt-1">
          <span className="font-bold block text-slate-400 mb-0.5 uppercase tracking-wider text-[8px]">
            Notas:
          </span>
          {appointment.notes}
        </div>
      )}

      {/* 5. Bottom Row: Price, Teflon Badge, Actions */}
      <div className="flex justify-between items-center mt-2.5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-black text-slate-800">
            {formatCurrency(appointment.amount)}
          </span>
          {appointment.withTeflon && (
            <span className="px-2 py-0.5 bg-primary-50 text-primary-500 border border-primary-100 rounded-lg text-[8px] font-black uppercase tracking-wider flex items-center gap-0.5">
              <Sparkles size={8} className="text-primary-500 fill-current" />
              Teflón
            </span>
          )}
        </div>

        {/* Action buttons */}
        {!showConfirmDelete ? (
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(appointment);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-primary-500 hover:bg-slate-50 transition-colors"
              title="Editar cita"
            >
              <Edit size={14} />
            </button>
            <button
              onClick={handleDeleteClick}
              className="p-1.5 rounded-lg text-slate-400 hover:text-danger-500 hover:bg-slate-50 transition-colors"
              title="Eliminar cita"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 animate-slide-left">
            <span className="text-[9px] font-bold text-danger-500 mr-1">¿Eliminar?</span>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={handleConfirmDelete}
              className="py-1 px-2.5 rounded-lg text-[9px] font-bold"
            >
              Sí
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancelDelete}
              className="py-1 px-2.5 rounded-lg text-[9px] font-bold"
            >
              No
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;
