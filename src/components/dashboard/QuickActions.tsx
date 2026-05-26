import React from 'react';
import { Plus } from 'lucide-react';

interface QuickActionsProps {
  onOpenNewAppointment: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onOpenNewAppointment }) => {
  return (
    <div className="fixed bottom-20 right-4 z-40 md:bottom-6 md:right-6 animate-bounce-slow">
      <button
        onClick={onOpenNewAppointment}
        className="
          flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700
          text-white font-bold text-sm px-5 py-3.5 rounded-full shadow-2xl hover:scale-105 active:scale-95
          transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary-200 border border-primary-400/20
        "
      >
        <Plus size={18} className="stroke-[3]" />
        <span>Agendar Cita</span>
      </button>
    </div>
  );
};

export default QuickActions;
