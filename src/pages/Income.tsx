import React, { useState } from 'react';
import Header from '../components/layout/Header';
import IncomeSummary from '../components/income/IncomeSummary';
import IncomeList from '../components/income/IncomeList';
import DistributionCard from '../components/income/DistributionCard';
import { useIncome } from '../hooks/useIncome';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import { CalendarRange, Sparkles } from 'lucide-react';
import { formatMonthYear } from '../utils/formatDate';
import { Modal } from '../components/shared/Modal';
import { AppointmentForm } from '../components/calendar/AppointmentForm';
import { Appointment } from '../types/appointment';

export const Income: React.FC = () => {
  // Initialize to current month (Format: YYYY-MM)
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );

  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  const { filteredAppointments, summary, isLoading } = useIncome(selectedMonth);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-0">
      <Header 
        title="Control de Ingresos" 
        rightAction={
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-xs focus-within:ring-2 focus-within:ring-primary-100 focus-within:border-primary-400">
            <CalendarRange size={14} className="text-slate-400" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="text-xs font-bold text-slate-700 bg-transparent outline-none cursor-pointer border-none p-0"
            />
          </div>
        }
      />

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Section Description */}
          <div className="px-1 flex flex-col">
            <span className="text-[10px] font-bold text-primary-500 uppercase tracking-widest leading-none">
              Resumen Financiero
            </span>
            <h2 className="text-sm font-bold text-slate-800 leading-tight mt-0.5 flex items-center gap-1.5">
              <Sparkles size={14} className="text-emerald-500" />
              Período: {formatMonthYear(selectedMonth)}
            </h2>
          </div>

          {/* 1. Commission Split summary cards */}
          <IncomeSummary summary={summary} />

          {/* 2. Visual CSS Commission Split progress bar */}
          <DistributionCard summary={summary} />

          {/* 3. Transaction list for completed bookings */}
          <div className="mt-2">
            <IncomeList appointments={filteredAppointments} onEdit={setEditingAppointment} />
          </div>
        </>
      )}

      {/* Editing Appointment Modal */}
      <Modal
        isOpen={!!editingAppointment}
        onClose={() => setEditingAppointment(null)}
        title="Editar Servicio Realizado"
      >
        {editingAppointment && (
          <AppointmentForm
            appointment={editingAppointment}
            onSuccess={() => setEditingAppointment(null)}
            onCancel={() => setEditingAppointment(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default Income;
