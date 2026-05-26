import React, { useState } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { Input } from '../shared/Input';
import { Select } from '../shared/Select';
import { Button } from '../shared/Button';
import { Plus, Trash2, ToggleLeft, ToggleRight, Tag } from 'lucide-react';

export const ExpenseCategorySettings: React.FC = () => {
  const { 
    expenseCategories, 
    addExpenseCategory, 
    updateExpenseCategory, 
    deleteExpenseCategory, 
    isActionLoading 
  } = useSettings();

  const [newCatName, setNewCatName] = useState('');
  const [catScope, setCatScope] = useState<'employee' | 'company' | 'both'>('both');
  const [error, setError] = useState('');

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newCatName.trim()) {
      setError('El nombre de la categoría es obligatorio');
      return;
    }

    const success = await addExpenseCategory(newCatName.trim(), catScope);
    if (success) {
      setNewCatName('');
      setCatScope('both');
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    await updateExpenseCategory(id, { isActive: !currentStatus });
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar la categoría de gasto "${name}"? Esto no alterará los gastos ya registrados.`
    );
    if (confirmDelete) {
      await deleteExpenseCategory(id);
    }
  };

  const scopeLabels = {
    employee: 'Reembolsable Técnico',
    company: 'Directo Empresa',
    both: 'Empresa y Técnico'
  };

  const scopeStyles = {
    employee: 'bg-warning-50 text-warning-600 border-warning-100',
    company: 'bg-primary-50 text-primary-600 border-primary-100',
    both: 'bg-slate-50 text-slate-600 border-slate-100'
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col px-1">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
          Catálogos de Egresos
        </span>
        <h3 className="text-xs font-bold text-slate-800 mt-1">
          Categorías de Gastos
        </h3>
      </div>

      {/* Inline Create Form */}
      <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row gap-3 bg-white border border-slate-100 rounded-2xl p-4 shadow-premium">
        <div className="flex-1">
          <Input
            type="text"
            label="Nueva Categoría"
            placeholder="Ej. Publicidad Digital"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            error={error}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            label="Ámbito de Aplicación"
            options={[
              { value: 'both', label: 'Ambos (Empresa y Técnico)' },
              { value: 'company', label: 'Solo Gasto de Empresa' },
              { value: 'employee', label: 'Solo Reembolso Técnico' }
            ]}
            value={catScope}
            onChange={(e) => setCatScope(e.target.value as 'employee' | 'company' | 'both')}
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          isLoading={isActionLoading}
          leftIcon={<Plus size={14} />}
          className="h-[46px] rounded-xl px-4 mt-auto flex-shrink-0"
        >
          Agregar
        </Button>
      </form>

      {/* Categories List */}
      <div className="flex flex-col gap-2.5">
        {expenseCategories.map((cat) => (
          <div
            key={cat.id}
            className={`
              bg-white border rounded-2xl px-4 py-3 flex items-center justify-between gap-4 transition-all
              ${cat.isActive ? 'border-slate-100' : 'border-slate-200/60 opacity-60 bg-slate-50/50'}
            `}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Tag size={14} className={cat.isActive ? 'text-primary-500 flex-shrink-0' : 'text-slate-400 flex-shrink-0'} />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-slate-700 truncate leading-tight">
                  {cat.name}
                </span>
                <span className={`mt-1 self-start px-2 py-0.5 rounded-lg text-[8px] font-bold border ${scopeStyles[cat.type]}`}>
                  {scopeLabels[cat.type]}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                type="button"
                onClick={() => handleToggleActive(cat.id, cat.isActive)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-primary-500 hover:bg-slate-50 transition-colors"
                title={cat.isActive ? 'Desactivar categoría' : 'Activar categoría'}
              >
                {cat.isActive ? <ToggleRight size={18} className="text-primary-500" /> : <ToggleLeft size={18} />}
              </button>
              <button
                type="button"
                onClick={() => handleDeleteCategory(cat.id, cat.name)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-danger-500 hover:bg-slate-50 transition-colors"
                title="Eliminar categoría"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseCategorySettings;
