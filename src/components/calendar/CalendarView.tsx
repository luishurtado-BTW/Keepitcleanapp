import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Appointment } from '../../types/appointment';

interface CalendarViewProps {
  appointments: Appointment[];
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (dateStr: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  appointments,
  selectedDate,
  onSelectDate
}) => {
  const [currentDate, setCurrentDate] = useState(new Date(selectedDate || new Date()));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get name of current month
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Month navigation
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Get details for grid rendering
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Day of week for 1st of month (0 = Sun, 1 = Mon, ..., 6 = Sat)
  // Convert Sun=0 to 6, Mon=1 to 0, Tue=2 to 1, ..., Sat=6 to 5 for Monday-start grid
  let firstDayOfWeek = new Date(year, month, 1).getDay();
  firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  const handleDaySelect = (dayNum: number) => {
    const paddedMonth = String(month + 1).padStart(2, '0');
    const paddedDay = String(dayNum).padStart(2, '0');
    onSelectDate(`${year}-${paddedMonth}-${paddedDay}`);
  };

  // Check if a specific date has appointments
  const getAppointmentsForDay = (dayNum: number): Appointment[] => {
    const paddedMonth = String(month + 1).padStart(2, '0');
    const paddedDay = String(dayNum).padStart(2, '0');
    const dateStr = `${year}-${paddedMonth}-${paddedDay}`;
    return appointments.filter((app) => app.date === dateStr);
  };

  const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  // Status dot indicators
  const statusDots: Record<string, string> = {
    Pendiente: 'bg-warning-400',
    Confirmada: 'bg-info-400',
    Completada: 'bg-success-400',
    Cancelada: 'bg-danger-400'
  };

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-premium w-full flex flex-col gap-4">
      {/* 1. Header: Month name & navigation */}
      <div className="flex items-center justify-between border-b border-slate-50 pb-3">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
          <Sparkles size={14} className="text-primary-500" />
          {monthNames[month]} {year}
        </h3>
        
        <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 rounded-xl p-0.5">
          <button
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 active:scale-90 transition-all"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 active:scale-90 transition-all"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* 2. Weekdays Names */}
      <div className="grid grid-cols-7 text-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
        {daysOfWeek.map((day) => (
          <div key={day} className="py-1">
            {day}
          </div>
        ))}
      </div>

      {/* 3. Calendar Grid */}
      <div className="grid grid-cols-7 gap-1.5 text-center mt-1">
        {/* Fillers for empty days at start */}
        {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
          <div key={`empty-${idx}`} className="aspect-square" />
        ))}

        {/* Calendar days */}
        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const dayNum = idx + 1;
          const paddedMonth = String(month + 1).padStart(2, '0');
          const paddedDay = String(dayNum).padStart(2, '0');
          const fullDateStr = `${year}-${paddedMonth}-${paddedDay}`;
          const isSelected = selectedDate === fullDateStr;
          
          const dayAppointments = getAppointmentsForDay(dayNum);
          
          // Is today?
          const localTodayStr = new Date().toISOString().split('T')[0];
          const isToday = localTodayStr === fullDateStr;

          return (
            <button
              key={dayNum}
              type="button"
              onClick={() => handleDaySelect(dayNum)}
              className={`
                aspect-square flex flex-col items-center justify-between py-1.5 relative rounded-2xl text-[11px] font-bold transition-all duration-200 active:scale-90
                ${isSelected 
                  ? 'bg-primary-500 text-white shadow-premium scale-105 border border-primary-400' 
                  : isToday
                    ? 'bg-slate-100 border border-slate-200 text-primary-600'
                    : 'bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                }
              `}
            >
              <span>{dayNum}</span>

              {/* Status dots row */}
              <div className="flex gap-0.5 justify-center items-center h-1.5 overflow-hidden w-full px-1">
                {dayAppointments.slice(0, 3).map((app) => (
                  <span
                    key={app.id}
                    className={`
                      w-1 h-1 rounded-full flex-shrink-0
                      ${isSelected ? 'bg-white' : (statusDots[app.status] || 'bg-slate-400')}
                    `}
                  />
                ))}
                {dayAppointments.length > 3 && (
                  <span className={`text-[6px] font-black leading-none ${isSelected ? 'text-white' : 'text-slate-400'}`}>+</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
