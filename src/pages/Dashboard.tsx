import React, { useState } from 'react';
import Header from '../components/layout/Header';
import DashboardCards from '../components/dashboard/DashboardCards';
import UpcomingAppointments from '../components/dashboard/UpcomingAppointments';
import QuickActions from '../components/dashboard/QuickActions';
import Modal from '../components/shared/Modal';
import AppointmentForm from '../components/calendar/AppointmentForm';
import { useAppointments } from '../hooks/useAppointments';
import { useExpenses } from '../hooks/useExpenses';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import { Sparkles, CalendarRange } from 'lucide-react';
import { getSpanishMonths } from '../utils/formatDate';

export const Dashboard: React.FC = () => {
  const { appointments, isLoading: isAppLoading, addAppointment } = useAppointments();
  const { expenses, isLoading: isExpLoading } = useExpenses();
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);

  if (isAppLoading || isExpLoading) {
    return <LoadingSpinner fullPage />;
  }

  // 1. Calculate current month indicators (Format: YYYY-MM)
  const today = new Date();
  const currentMonthStr = today.toISOString().slice(0, 7); // e.g. "2026-05"
  
  const currentMonthName = getSpanishMonths().find(
    (m) => m.value === String(today.getMonth() + 1).padStart(2, '0')
  )?.label || 'Mes';

  // --- Calculations ---

  // Current month completed appointments income
  const currentMonthCompletedApps = appointments.filter(
    (app) => app.date.startsWith(currentMonthStr) && app.status === 'Completada'
  );
  const totalIncome = currentMonthCompletedApps.reduce((sum, app) => sum + app.amount, 0);

  // Current month company expenses (all expenses matching this month)
  const currentMonthExpenses = expenses.filter(
    (exp) => exp.date.startsWith(currentMonthStr)
  );
  const totalExpenses = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Month balance
  const monthBalance = totalIncome - totalExpenses;

  // Total pending employee reimbursements (across all time)
  const pendingReimbursements = expenses.filter(
    (exp) => exp.type === 'employee' && exp.reimbursementStatus === 'Pendiente de reembolso'
  ).reduce((sum, exp) => sum + exp.amount, 0);

  // Filter next 5 pending or confirmed appointments, sorted chronologically
  const upcomingAppointments = appointments
    .filter((app) => app.status === 'Pendiente' || app.status === 'Confirmada')
    .sort((a, b) => {
      const dtA = `${a.date}T${a.time}`;
      const dtB = `${b.date}T${b.time}`;
      return dtA.localeCompare(dtB);
    })
    .slice(0, 5);

  const handleFormSuccess = () => {
    setIsNewAppointmentOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-0">
      <Header 
        title="Panel Principal" 
        rightAction={
          <div className="flex items-center gap-1.5 px-3 py-1 bg-primary-50 rounded-full border border-primary-100 text-[10px] font-bold text-primary-600">
            <Sparkles size={12} className="text-primary-500 animate-pulse" />
            <span>{currentMonthName} {today.getFullYear()}</span>
          </div>
        }
      />

      {/* 1. Dashboard Cards */}
      <DashboardCards
        income={totalIncome}
        expenses={totalExpenses}
        balance={monthBalance}
        reimbursements={pendingReimbursements}
      />

      {/* 2. Upcoming Appointments */}
      <div className="mt-2">
        <UpcomingAppointments
          appointments={upcomingAppointments}
          onOpenForm={() => setIsNewAppointmentOpen(true)}
        />
      </div>

      {/* 3. FAB Float action button */}
      <QuickActions onOpenNewAppointment={() => setIsNewAppointmentOpen(true)} />

      {/* 4. Modal for Creating a New Appointment */}
      <Modal
        isOpen={isNewAppointmentOpen}
        onClose={() => setIsNewAppointmentOpen(false)}
        title="Agendar Cita de Limpieza"
      >
        <AppointmentForm 
          onSuccess={handleFormSuccess} 
          onCancel={() => setIsNewAppointmentOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;
