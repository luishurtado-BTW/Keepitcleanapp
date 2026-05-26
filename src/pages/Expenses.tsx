import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import EmployeeExpenses from '../components/expenses/EmployeeExpenses';
import CompanyExpenses from '../components/expenses/CompanyExpenses';
import ExpenseForm from '../components/expenses/ExpenseForm';
import Modal from '../components/shared/Modal';
import Button from '../components/shared/Button';
import { useExpenses } from '../hooks/useExpenses';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import { Expense, ExpenseType } from '../types/expense';
import { formatMonthYear } from '../utils/formatDate';
import { CalendarRange, Plus, Sparkles } from 'lucide-react';

export const Expenses: React.FC = () => {
  const { expenses, isLoading, deleteExpense } = useExpenses();
  const [searchParams, setSearchParams] = useSearchParams();

  // Selected Month (Format: YYYY-MM)
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );

  // Active sub-tab state (defaults to 'company')
  const [activeTab, setActiveTab] = useState<ExpenseType>('company');

  // Modals state
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Sync tab with URL search parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'employees') {
      setActiveTab('employee');
    } else if (tabParam === 'company') {
      setActiveTab('company');
    }
  }, [searchParams]);

  const handleTabChange = (tab: ExpenseType) => {
    setActiveTab(tab);
    setSearchParams({ tab: tab === 'employee' ? 'employees' : 'company' });
  };

  const handleEditClick = (expense: Expense) => {
    setEditingExpense(expense);
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este registro de gasto?')) {
      await deleteExpense(id);
    }
  };

  const handleFormSuccess = () => {
    setIsNewOpen(false);
    setEditingExpense(null);
  };

  // --- Filtering ---

  // Filter expenses by selected YYYY-MM month
  const monthlyExpenses = expenses.filter((exp) => exp.date.startsWith(selectedMonth));

  return (
    <div className="flex flex-col gap-6 p-4 md:p-0">
      <Header 
        title="Control de Gastos" 
        rightAction={
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsNewOpen(true)}
              size="sm"
              leftIcon={<Plus size={14} />}
              className="rounded-full py-2 flex-shrink-0"
            >
              Registrar Gasto
            </Button>
          </div>
        }
      />

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Top Month Filter & Segmented Pill Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-100 rounded-3xl p-4 shadow-premium">
            {/* Segmented sub-tab selectors */}
            <div className="flex bg-slate-100 border border-slate-200/60 rounded-2xl p-1 text-[11px] font-bold sm:w-80">
              <button
                type="button"
                onClick={() => handleTabChange('company')}
                className={`
                  flex-1 py-2 rounded-xl transition-all duration-150
                  ${activeTab === 'company' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}
                `}
              >
                Gastos de Empresa
              </button>
              <button
                type="button"
                onClick={() => handleTabChange('employee')}
                className={`
                  flex-1 py-2 rounded-xl transition-all duration-150
                  ${activeTab === 'employee' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}
                `}
              >
                Reembolsos Técnicos
              </button>
            </div>

            {/* Native month picker */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-2xl px-3 py-2 shadow-xs focus-within:ring-2 focus-within:ring-primary-100 focus-within:border-primary-400 self-end sm:self-auto">
              <CalendarRange size={14} className="text-slate-400" />
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="text-xs font-bold text-slate-700 bg-transparent outline-none cursor-pointer border-none p-0"
              />
            </div>
          </div>

          {/* Section Indicator label */}
          <div className="px-1 flex flex-col">
            <span className="text-[10px] font-bold text-primary-500 uppercase tracking-widest leading-none">
              {activeTab === 'company' ? 'Ledger de Empresa' : 'Reembolsos Pendientes'}
            </span>
            <h2 className="text-sm font-bold text-slate-800 leading-tight mt-0.5 flex items-center gap-1.5">
              <Sparkles size={14} className="text-primary-500" />
              Período: {formatMonthYear(selectedMonth)}
            </h2>
          </div>

          {/* Sub-tab viewport */}
          {activeTab === 'company' ? (
            <CompanyExpenses
              expenses={monthlyExpenses}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ) : (
            <EmployeeExpenses
              expenses={monthlyExpenses}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          )}
        </>
      )}

      {/* --- Forms Modals --- */}

      {/* Create New Expense Modal */}
      <Modal
        isOpen={isNewOpen}
        onClose={() => setIsNewOpen(false)}
        title="Registrar Nuevo Gasto"
      >
        <ExpenseForm
          forcedType={activeTab}
          onSuccess={handleFormSuccess}
          onCancel={() => setIsNewOpen(false)}
        />
      </Modal>

      {/* Edit Expense Modal */}
      <Modal
        isOpen={!!editingExpense}
        onClose={() => setEditingExpense(null)}
        title="Editar Registro de Gasto"
      >
        {editingExpense && (
          <ExpenseForm
            expense={editingExpense}
            onSuccess={handleFormSuccess}
            onCancel={() => setEditingExpense(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default Expenses;
