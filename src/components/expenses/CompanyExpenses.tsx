import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Expense } from '../../types/expense';
import { formatDate } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import { EmptyState } from '../shared/EmptyState';
import { 
  Calendar, 
  Tag, 
  Edit, 
  Trash2, 
  Eye,
  SlidersHorizontal,
  PieChart,
  X
} from 'lucide-react';

interface CompanyExpensesProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export const CompanyExpenses: React.FC<CompanyExpensesProps> = ({
  expenses,
  onEdit,
  onDelete
}) => {
  const { activeExpenseCategories } = useApp();
  
  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  // Lightbox modal state
  const [lightboxURL, setLightboxURL] = useState<string | null>(null);

  // --- Filtering ---
  
  // 1. Filter only company expenses
  const companyExpenses = expenses.filter((exp) => exp.type === 'company');

  // 2. Filter by category
  const finalFilteredExpenses = companyExpenses.filter((exp) => {
    if (selectedCategory === 'Todos') return true;
    return exp.category === selectedCategory;
  });

  // Calculate sum totals
  const totalCompanyExpenses = companyExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Calculate category breakdown
  const categoryBreakdown = activeExpenseCategories
    .map((cat) => {
      const catExpenses = companyExpenses.filter((exp) => exp.category === cat.name);
      const amount = catExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      const percentage = totalCompanyExpenses > 0 ? (amount / totalCompanyExpenses) * 100 : 0;
      return {
        name: cat.name,
        amount,
        percentage
      };
    })
    .filter((cat) => cat.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Category Chart / Breakdown Progress bars */}
      {categoryBreakdown.length > 0 && (
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-premium flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-slate-50 pb-2.5">
            <PieChart size={15} className="text-primary-500" />
            <h3 className="text-xs font-bold text-slate-800">
              Distribución de Gastos por Categoría
            </h3>
          </div>

          <div className="flex flex-col gap-3">
            {categoryBreakdown.map((cat, idx) => (
              <div key={idx} className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-[9px] font-bold">
                  <span className="text-slate-600">{cat.name}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 font-semibold">{cat.percentage.toFixed(1)}%</span>
                    <span className="text-slate-800">{formatCurrency(cat.amount)}</span>
                  </div>
                </div>
                {/* Visual horizontal CSS progress bar */}
                <div className="w-full h-2 rounded-full bg-slate-50 border border-slate-100 overflow-hidden">
                  <div
                    style={{ width: `${cat.percentage}%` }}
                    className="bg-primary-500 h-full rounded-full transition-all duration-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Expenses List with filter */}
      <div className="flex flex-col gap-4 mt-2">
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1 flex items-center gap-1.5">
            <SlidersHorizontal size={14} className="text-slate-400" />
            Historial de Gastos de la Empresa
          </h3>

          <div className="flex flex-wrap gap-2.5">
            {/* Category Filter Selector */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-[10px] font-bold text-slate-600 outline-none"
            >
              <option value="Todos">Todas las Categorías</option>
              {activeExpenseCategories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
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
                {/* Header */}
                <div className="flex justify-between items-start gap-4">
                  <span className="text-xs font-bold text-slate-800 leading-tight">
                    {exp.category}
                  </span>
                  <span className="text-[9px] font-bold text-primary-500 bg-primary-50 border border-primary-100 rounded-lg px-2.5 py-0.5 leading-none">
                    Gasto de Empresa
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

                {/* Bottom Row */}
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
            title="No hay gastos de empresa"
            description="No se encontraron registros de gastos directos de la empresa que coincidan con los filtros activos."
          />
        )}
      </div>

      {/* Lightbox Overly Modal for receipt viewing */}
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

export default CompanyExpenses;
