import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useExpenses } from '../../hooks/useExpenses';
import { Expense } from '../../types/expense';
import { ReimbursementCard } from './ReimbursementCard';
import { formatDate } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import { EmptyState } from '../shared/EmptyState';
import { Button } from '../shared/Button';
import { 
  Calendar, 
  User, 
  Tag, 
  Edit, 
  Trash2, 
  Check, 
  Eye,
  SlidersHorizontal,
  X
} from 'lucide-react';

interface EmployeeExpensesProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export const EmployeeExpenses: React.FC<EmployeeExpensesProps> = ({
  expenses,
  onEdit,
  onDelete
}) => {
  const { activeEmployees, employees } = useApp();
  const { markAsReimbursed, isActionLoading } = useExpenses();

  // Filters State
  const [statusFilter, setStatusFilter] = useState<'Todos' | 'Pendiente' | 'Reembolsado'>('Todos');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('Todos');

  // Lightbox modal state
  const [lightboxURL, setLightboxURL] = useState<string | null>(null);

  // Bulk action: Mark all pending expenses of employee as Reimbursed
  const handleReimburseAll = async (empId: string) => {
    const pendings = expenses.filter(
      (exp) => exp.type === 'employee' && exp.employeeId === empId && exp.reimbursementStatus === 'Pendiente de reembolso'
    );
    for (const exp of pendings) {
      await markAsReimbursed(exp.id);
    }
  };

  // --- Filtering ---
  
  // 1. Filter only employee expenses
  const employeeExpenses = expenses.filter((exp) => exp.type === 'employee');

  // 2. Filter by status
  const statusFiltered = employeeExpenses.filter((exp) => {
    if (statusFilter === 'Todos') return true;
    if (statusFilter === 'Pendiente') return exp.reimbursementStatus === 'Pendiente de reembolso';
    return exp.reimbursementStatus === 'Reembolsado';
  });

  // 3. Filter by employee ID
  const finalFilteredExpenses = statusFiltered.filter((exp) => {
    if (selectedEmployeeId === 'Todos') return true;
    return exp.employeeId === selectedEmployeeId;
  });

  // Resolve employee name
  const getEmployeeName = (id?: string) => {
    if (!id) return 'Empleado Desconocido';
    return employees.find((e) => e.id === id)?.name || 'Empleado Desconocido';
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Reimbursements Summary Cards Row */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
          Estado de Reembolsos por Empleado
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {activeEmployees.map((emp) => (
            <ReimbursementCard
              key={emp.id}
              employee={emp}
              expenses={employeeExpenses}
              onReimburseAll={handleReimburseAll}
              isActionLoading={isActionLoading}
            />
          ))}
          {activeEmployees.length === 0 && (
            <span className="text-[10px] text-slate-400 font-semibold text-center py-4 bg-white border rounded-3xl border-dashed">
              No hay empleados activos registrados. Regístralos en Configuración.
            </span>
          )}
        </div>
      </div>

      {/* 2. List of Expenses with filters */}
      <div className="flex flex-col gap-4 mt-2">
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1 flex items-center gap-1.5">
            <SlidersHorizontal size={14} className="text-slate-400" />
            Historial de Gastos Reembolsables
          </h3>
          
          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2.5">
            {/* Status Filter buttons */}
            <div className="flex bg-slate-100 border border-slate-200 rounded-xl p-0.5 text-[10px] font-bold">
              <button
                onClick={() => setStatusFilter('Todos')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${statusFilter === 'Todos' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'}`}
              >
                Todos
              </button>
              <button
                onClick={() => setStatusFilter('Pendiente')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${statusFilter === 'Pendiente' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'}`}
              >
                Pendientes
              </button>
              <button
                onClick={() => setStatusFilter('Reembolsado')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${statusFilter === 'Reembolsado' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'}`}
              >
                Reembolsados
              </button>
            </div>

            {/* Employee Filter selector */}
            <select
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-[10px] font-bold text-slate-600 outline-none"
            >
              <option value="Todos">Todos los Empleados</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Expenses List */}
        {finalFilteredExpenses.length > 0 ? (
          <div className="flex flex-col gap-3">
            {finalFilteredExpenses.map((exp) => (
              <div
                key={exp.id}
                className="
                  bg-white border border-slate-100 rounded-2xl p-4 shadow-premium flex flex-col gap-2.5 transition-all
                  hover:scale-[1.005] hover:border-primary-100
                "
              >
                {/* Header: Category & status */}
                <div className="flex justify-between items-start gap-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800 leading-tight">
                      {exp.category}
                    </span>
                    <span className="text-[9px] font-semibold text-slate-400 flex items-center gap-1 mt-0.5">
                      <User size={10} />
                      {getEmployeeName(exp.employeeId)}
                    </span>
                  </div>

                  <span
                    className={`
                      px-2 py-0.5 rounded-lg text-[9px] font-bold border leading-none flex items-center gap-1
                      ${exp.reimbursementStatus === 'Reembolsado'
                        ? 'bg-success-50 text-success-600 border-success-100'
                        : 'bg-warning-50 text-warning-600 border-warning-100'
                      }
                    `}
                  >
                    {exp.reimbursementStatus === 'Reembolsado' ? (
                      <>
                        <Check size={10} />
                        Reembolsado
                      </>
                    ) : (
                      'Pendiente de reembolso'
                    )}
                  </span>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 text-[9px] font-semibold text-slate-500 mt-0.5 border-t border-b border-slate-50 py-2">
                  <div className="flex items-center gap-1">
                    <Calendar size={11} className="text-slate-400" />
                    <span>{formatDate(exp.date)}</span>
                  </div>
                  {exp.description && (
                    <div className="flex items-center gap-1 truncate col-span-2">
                      <Tag size={11} className="text-slate-400 flex-shrink-0" />
                      <span className="truncate">{exp.description}</span>
                    </div>
                  )}
                </div>

                {/* Bottom Row: Amount & Actions */}
                <div className="flex justify-between items-center mt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-800">
                      {formatCurrency(exp.amount)}
                    </span>
                    {exp.receiptURL && (
                      <button
                        type="button"
                        onClick={() => setLightboxURL(exp.receiptURL || null)}
                        className="px-2 py-0.5 bg-primary-50 text-primary-600 border border-primary-100 rounded-md text-[8px] font-bold uppercase tracking-wider flex items-center gap-0.5 hover:bg-primary-100 transition-colors"
                      >
                        <Eye size={10} />
                        Ver Recibo
                      </button>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-0.5">
                    {exp.reimbursementStatus === 'Pendiente de reembolso' && (
                      <button
                        onClick={() => markAsReimbursed(exp.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-success-600 hover:bg-slate-50 transition-colors"
                        title="Marcar como Reembolsado"
                      >
                        <Check size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => onEdit(exp)}
                      className="p-1 rounded-lg text-slate-400 hover:text-primary-500 hover:bg-slate-50 transition-colors"
                      title="Editar gasto"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => onDelete(exp.id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-danger-500 hover:bg-slate-50 transition-colors"
                      title="Eliminar gasto"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No hay gastos registrados"
            description="No se encontraron registros de gastos que coincidan con los filtros activos."
          />
        )}
      </div>

      {/* 3. Lightbox Overly Modal for receipt viewing */}
      {lightboxURL && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[99999] flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxURL(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X size={20} />
          </button>
          <img
            src={lightboxURL}
            alt="Ticket Lightbox"
            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl animate-zoom-in"
          />
        </div>
      )}
    </div>
  );
};

export default EmployeeExpenses;
