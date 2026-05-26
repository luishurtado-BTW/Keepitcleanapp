import React, { useState } from 'react';
import Header from '../components/layout/Header';
import CalendarView from '../components/calendar/CalendarView';
import AppointmentCard from '../components/calendar/AppointmentCard';
import AppointmentForm from '../components/calendar/AppointmentForm';
import Modal from '../components/shared/Modal';
import Button from '../components/shared/Button';
import EmptyState from '../components/shared/EmptyState';
import { useAppointments } from '../hooks/useAppointments';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import { Appointment } from '../types/appointment';
import { formatDate, formatHumanDate } from '../utils/formatDate';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';

type FilterStatus = 'Todas' | 'Pendiente' | 'Confirmada' | 'Completada' | 'Cancelada';

export const Calendar: React.FC = () => {
  const { appointments, isLoading, updateAppointment, deleteAppointment } = useAppointments();
  
  // Selected date state (defaults to today in YYYY-MM-DD format)
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  
  // Filters for appointments lists
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('Todas');

  // Modals state
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  if (isLoading) {
    return <LoadingSpinner fullPage />;
  }

  // --- Calculations & Filtering ---

  // 1. Get appointments scheduled for the selected day
  const dayAppointments = appointments.filter(app => app.date === selectedDate);

  // 2. Apply status filter
  const filteredAppointments = dayAppointments.filter(app => {
    if (activeFilter === 'Todas') return true;
    return app.status === activeFilter;
  });

  const handleEditClick = (app: Appointment) => {
    setEditingAppointment(app);
  };

  const handleDeleteClick = async (id: string) => {
    await deleteAppointment(id);
  };

  const handleFormSuccess = () => {
    setIsNewOpen(false);
    setEditingAppointment(null);
  };

  const filterTabs: FilterStatus[] = ['Todas', 'Pendiente', 'Confirmada', 'Completada', 'Cancelada'];

  return (
    <div className="flex flex-col gap-6 p-4 md:p-0">
      <Header 
        title="Calendario de Citas" 
        rightAction={
          <Button
            onClick={() => setIsNewOpen(true)}
            size="sm"
            leftIcon={<Plus size={14} />}
            className="rounded-full py-2"
          >
            Nueva Cita
          </Button>
        }
      />

      {/* 1. Monthly Calendar Grid */}
      <CalendarView
        appointments={appointments}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      {/* 2. Selected Day Header and Filters */}
      <div className="flex flex-col gap-4 mt-2">
        <div className="flex flex-col gap-1 px-1">
          <span className="text-[10px] font-bold text-primary-500 uppercase tracking-widest leading-none">
            Agenda del Día
          </span>
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 leading-tight mt-0.5">
            <CalendarIcon size={15} className="text-slate-400" />
            {formatHumanDate(selectedDate)}
          </h2>
        </div>

        {/* Scrollable Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`
                px-4 py-2 text-xs font-bold rounded-xl border flex-shrink-0 transition-all duration-200
                ${activeFilter === tab
                  ? 'bg-primary-500 text-white border-primary-500 shadow-sm'
                  : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-500'
                }
              `}
            >
              {tab === 'Todas' ? 'Todas' : tab} 
              {tab === 'Todas' && ` (${dayAppointments.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Daily Appointments List */}
      <div className="flex flex-col gap-4">
        {filteredAppointments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredAppointments.map((app) => (
              <AppointmentCard
                key={app.id}
                appointment={app}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title={
              activeFilter === 'Todas' 
                ? 'No hay citas para este día' 
                : `No hay citas ${activeFilter.toLowerCase()}s`
            }
            description={
              activeFilter === 'Todas'
                ? 'Presiona el botón de arriba para registrar tu primer servicio de limpieza en este día.'
                : `No tienes programaciones registradas en estado "${activeFilter}" para este día.`
            }
            actionLabel={activeFilter === 'Todas' ? 'Agendar Cita' : undefined}
            onAction={() => setIsNewOpen(true)}
          />
        )}
      </div>

      {/* 4. Modals */}
      
      {/* Create New Booking Modal */}
      <Modal
        isOpen={isNewOpen}
        onClose={() => setIsNewOpen(false)}
        title="Agendar Cita de Limpieza"
      >
        <AppointmentForm
          initialDate={selectedDate}
          onSuccess={handleFormSuccess}
          onCancel={() => setIsNewOpen(false)}
        />
      </Modal>

      {/* Edit Booking Modal */}
      <Modal
        isOpen={!!editingAppointment}
        onClose={() => setEditingAppointment(null)}
        title="Editar Cita de Limpieza"
      >
        {editingAppointment && (
          <AppointmentForm
            appointment={editingAppointment}
            onSuccess={handleFormSuccess}
            onCancel={() => setEditingAppointment(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default Calendar;
