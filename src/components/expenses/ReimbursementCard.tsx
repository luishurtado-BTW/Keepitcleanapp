import React from 'react';
import { formatCurrency } from '../../utils/formatCurrency';
import { Employee } from '../../types/employee';
import { Expense } from '../../types/expense';
import { Button } from '../shared/Button';
import { Check, Clock, User, Wallet } from 'lucide-react';

interface ReimbursementCardProps {
  employee: Employee;
  expenses: Expense[];
  onReimburseAll: (employeeId: string) => Promise<void>;
  isActionLoading: boolean;
}

export const ReimbursementCard: React.FC<ReimbursementCardProps> = ({
  employee,
  expenses,
  onReimburseAll,
  isActionLoading
}) => {
  // Filter expenses for this employee
  const employeeExpenses = expenses.filter(exp => exp.employeeId === employee.id);

  // Computations
  const totalSpent = employeeExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  const totalReimbursed = employeeExpenses
    .filter(exp => exp.reimbursementStatus === 'Reembolsado')
    .reduce((sum, exp) => sum + exp.amount, 0);

  const totalPending = employeeExpenses
    .filter(exp => exp.reimbursementStatus === 'Pendiente de reembolso')
    .reduce((sum, exp) => sum + exp.amount, 0);

  const pendingList = employeeExpenses.filter(exp => exp.reimbursementStatus === 'Pendiente de reembolso');

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-premium flex flex-col gap-4">
      {/* 1. Header: Employee Info */}
      <div className="flex items-center gap-3 border-b border-slate-50 pb-3">
        <div className="p-2.5 bg-primary-50 rounded-xl text-primary-500">
          <User size={18} />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold text-slate-800 truncate leading-tight">
            {employee.name}
          </span>
          <span className="text-[9px] font-bold text-slate-400 mt-0.5 leading-none">
            {employee.role} • {employee.phone}
          </span>
        </div>
      </div>

      {/* 2. Math Aggregates Grid */}
      <div className="grid grid-cols-3 gap-2.5 text-center">
        {/* Total Spent */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-2.5 flex flex-col gap-0.5">
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider">
            Total Gastado
          </span>
          <span className="text-[10px] font-bold text-slate-700 truncate mt-1">
            {formatCurrency(totalSpent)}
          </span>
        </div>

        {/* Reimbursed */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-2.5 flex flex-col gap-0.5">
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider">
            Reembolsado
          </span>
          <span className="text-[10px] font-bold text-success-600 truncate mt-1">
            {formatCurrency(totalReimbursed)}
          </span>
        </div>

        {/* Pending */}
        <div className="bg-warning-50 border border-warning-100 rounded-2xl p-2.5 flex flex-col gap-0.5">
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider">
            Pendiente
          </span>
          <span className="text-[10px] font-bold text-warning-600 truncate mt-1">
            {formatCurrency(totalPending)}
          </span>
        </div>
      </div>

      {/* 3. Action Block: Mark all as Reimbursed */}
      {totalPending > 0 ? (
        <div className="flex flex-col gap-3 mt-1 pt-2 border-t border-slate-50">
          {/* Summary mini breakdown of pending ticket items */}
          <div className="flex flex-col gap-1.5 pl-0.5">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Clock size={10} className="text-warning-500" />
              Gastos por liquidar ({pendingList.length})
            </span>
            <div className="max-h-20 overflow-y-auto scrollbar-thin flex flex-col gap-1">
              {pendingList.map(item => (
                <div key={item.id} className="flex justify-between items-center text-[9px] font-semibold text-slate-500 leading-none py-0.5">
                  <span className="truncate max-w-[150px]">{item.category} - {item.description || 'Sin nota'}</span>
                  <span className="font-extrabold text-slate-700">{formatCurrency(item.amount)}</span>
                </div>
              ))}
            </div>
          </div>
          
          <Button
            type="button"
            variant="secondary"
            size="sm"
            isLoading={isActionLoading}
            leftIcon={<Check size={14} />}
            onClick={() => onReimburseAll(employee.id)}
            className="w-full text-[10px] font-black py-2 rounded-xl mt-1"
          >
            Reembolsar {formatCurrency(totalPending)}
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-1.5 p-2 bg-slate-50 rounded-2xl text-[9px] font-bold text-slate-400 mt-1 border border-slate-100">
          <Check size={12} className="text-success-500" />
          <span>¡Todos los reembolsos liquidados!</span>
        </div>
      )}
    </div>
  );
};

export default ReimbursementCard;
