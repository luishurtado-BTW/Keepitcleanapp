import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useExpenses } from '../../hooks/useExpenses';
import { Expense, ExpenseType, ReimbursementStatus } from '../../types/expense';
import { Input } from '../shared/Input';
import { Select } from '../shared/Select';
import { Button } from '../shared/Button';
import { Camera, Image as ImageIcon, X } from 'lucide-react';

interface ExpenseFormProps {
  forcedType?: ExpenseType;
  expense?: Expense;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  forcedType,
  expense,
  onSuccess,
  onCancel
}) => {
  const { activeEmployees, activeExpenseCategories } = useApp();
  const { addExpense, updateExpense, uploadReceipt, isActionLoading } = useExpenses();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [type, setType] = useState<ExpenseType>('company');
  const [employeeId, setEmployeeId] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [receiptURL, setReceiptURL] = useState('');
  const [reimbursementStatus, setReimbursementStatus] = useState<ReimbursementStatus>('Pendiente de reembolso');

  // File Upload states
  const [isUploading, setIsUploading] = useState(false);

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (expense) {
      setType(expense.type);
      setEmployeeId(expense.employeeId || '');
      setCategory(expense.category);
      setAmount(String(expense.amount));
      setDate(expense.date);
      setDescription(expense.description || '');
      setReceiptURL(expense.receiptURL || '');
      setReimbursementStatus(expense.reimbursementStatus || 'Pendiente de reembolso');
    } else {
      setType(forcedType || 'company');
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [expense, forcedType]);

  // Dynamic category options based on active expense type
  const filteredCategories = activeExpenseCategories.filter(
    (cat) => cat.type === 'both' || cat.type === type
  );

  useEffect(() => {
    // Set default category when type or category list changes
    if (filteredCategories.length > 0 && !expense) {
      setCategory(filteredCategories[0].name);
    }
  }, [type, activeExpenseCategories]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadReceipt(file);
      if (url) {
        setReceiptURL(url);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeReceipt = () => {
    setReceiptURL('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (type === 'employee' && !employeeId) {
      newErrors.employeeId = 'Debes seleccionar el empleado que pagó el gasto';
    }
    if (!category) newErrors.category = 'La categoría es obligatoria';
    if (!amount || Number(amount) <= 0) {
      newErrors.amount = 'El monto debe ser un valor positivo';
    }
    if (!date) newErrors.date = 'La fecha del gasto es obligatoria';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const data = {
      type,
      employeeId: type === 'employee' ? employeeId : undefined,
      category,
      amount: Number(amount),
      date,
      description: description.trim() || undefined,
      receiptURL: receiptURL || undefined,
      reimbursementStatus: type === 'employee' ? reimbursementStatus : undefined
    };

    let result = false;
    if (expense) {
      result = await updateExpense(expense.id, data);
    } else {
      const newId = await addExpense(data);
      result = !!newId;
    }

    if (result) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Expense Type Selector (only shown if not forced) */}
      {!forcedType && !expense && (
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-slate-600 px-0.5">Tipo de Gasto</span>
          <div className="flex bg-slate-50 border border-slate-200 rounded-xl p-1 h-[46px]">
            <button
              type="button"
              onClick={() => setType('company')}
              className={`
                flex-1 rounded-lg text-xs font-bold transition-all duration-150
                ${type === 'company' ? 'bg-primary-500 text-white shadow-sm' : 'text-slate-500'}
              `}
            >
              Gasto de la Empresa
            </button>
            <button
              type="button"
              onClick={() => setType('employee')}
              className={`
                flex-1 rounded-lg text-xs font-bold transition-all duration-150
                ${type === 'employee' ? 'bg-primary-500 text-white shadow-sm' : 'text-slate-500'}
              `}
            >
              Gasto Reembolsable
            </button>
          </div>
        </div>
      )}

      {/* Employee Selector (Employee type only) */}
      {type === 'employee' && (
        <Select
          label="Empleado que realizó el gasto"
          options={[
            { value: '', label: 'Seleccionar Empleado' },
            ...activeEmployees.map((e) => ({ value: e.id, label: e.name }))
          ]}
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          error={errors.employeeId}
          required
        />
      )}

      {/* Category Selection */}
      <Select
        label="Categoría del Gasto"
        options={filteredCategories.map((c) => c.name)}
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        error={errors.category}
        required
      />

      {/* Amount & Date */}
      <div className="grid grid-cols-2 gap-3">
        <Input
          type="number"
          label="Monto del Gasto (MXN)"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          error={errors.amount}
          required
        />
        <Input
          type="date"
          label="Fecha del Gasto"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          error={errors.date}
          required
        />
      </div>

      {/* Reimbursement Status (Employee type only) */}
      {type === 'employee' && (
        <Select
          label="Estado del Reembolso"
          options={[
            { value: 'Pendiente de reembolso', label: 'Pendiente de reembolso' },
            { value: 'Reembolsado', label: 'Reembolsado' }
          ]}
          value={reimbursementStatus}
          onChange={(e) => setReimbursementStatus(e.target.value as ReimbursementStatus)}
          required
        />
      )}

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-600 px-0.5">
          Descripción o Nota (Opcional)
        </label>
        <textarea
          className="w-full px-4 py-3 rounded-xl border bg-slate-50 border-slate-200 text-sm text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-400 h-20 resize-none"
          placeholder="Ej. Compra de cepillo manual o carga de gasolina para servicio Polanco..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Receipt upload photo block */}
      <div className="flex flex-col gap-1.5 mt-1">
        <span className="text-xs font-semibold text-slate-600 px-0.5">
          Foto del Comprobante (Opcional)
        </span>
        
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        {!receiptURL ? (
          <button
            type="button"
            onClick={triggerFileInput}
            disabled={isUploading}
            className="
              flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-primary-400 hover:bg-slate-50/50 
              rounded-xl p-5 gap-2 transition-all duration-200 active:scale-[0.98] text-slate-400 hover:text-primary-500
            "
          >
            {isUploading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-500 border-t-transparent" />
            ) : (
              <Camera size={22} className="text-slate-400" />
            )}
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {isUploading ? 'Subiendo archivo...' : 'Cargar foto de recibo'}
            </span>
          </button>
        ) : (
          <div className="relative rounded-2xl border border-slate-100 overflow-hidden bg-slate-50 p-2 group flex items-center justify-center max-h-48">
            <img
              src={receiptURL}
              alt="Comprobante de gasto"
              className="max-h-40 rounded-xl object-contain shadow-sm"
            />
            <button
              type="button"
              onClick={removeReceipt}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/80 hover:bg-slate-950 text-white shadow-md transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-3 mt-4">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isActionLoading || isUploading}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" isLoading={isActionLoading || isUploading}>
          {expense ? 'Guardar Cambios' : 'Registrar Gasto'}
        </Button>
      </div>
    </form>
  );
};

export default ExpenseForm;
