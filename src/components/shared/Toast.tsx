import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { ToastMessage } from '../../context/AppContext';

interface ToastItemProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

export const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
  const { id, type, message } = toast;

  const styles = {
    success: {
      bg: 'bg-emerald-50 border-emerald-100',
      text: 'text-emerald-800',
      icon: <CheckCircle className="text-emerald-500" size={18} />
    },
    error: {
      bg: 'bg-red-50 border-red-100',
      text: 'text-red-800',
      icon: <AlertCircle className="text-red-500" size={18} />
    },
    info: {
      bg: 'bg-blue-50 border-blue-100',
      text: 'text-blue-800',
      icon: <Info className="text-blue-500" size={18} />
    }
  };

  const currentStyle = styles[type] || styles.info;

  return (
    <div
      className={`
        flex items-start gap-3 p-4 rounded-2xl border ${currentStyle.bg} ${currentStyle.text}
        shadow-premium backdrop-blur-md animate-slide-down w-full max-w-sm pointer-events-auto
      `}
    >
      <div className="flex-shrink-0 mt-0.5">{currentStyle.icon}</div>
      <div className="flex-1 text-xs font-semibold leading-normal">{message}</div>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 p-0.5 rounded-lg hover:bg-black/5 text-slate-400 hover:text-slate-600 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed top-4 left-4 right-4 z-[9999] flex flex-col gap-2.5 items-center pointer-events-none md:left-auto md:right-4 md:w-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={onRemove} />
      ))}
    </div>
  );
};

export default ToastContainer;
