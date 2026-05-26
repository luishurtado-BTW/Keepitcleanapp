import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { expenseService } from '../services/expenseService';
import { Expense } from '../types/expense';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const { showToast } = useApp();

  useEffect(() => {
    const unsub = expenseService.subscribeExpenses((data) => {
      setExpenses(data);
      setIsLoading(false);
    });
    return () => unsub();
  }, []);

  const addExpense = async (expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsActionLoading(true);
    try {
      const id = await expenseService.addExpense(expenseData);
      showToast('Gasto registrado con éxito.', 'success');
      return id;
    } catch (err) {
      console.error(err);
      showToast('Error al registrar el gasto.', 'error');
      return null;
    } finally {
      setIsActionLoading(false);
    }
  };

  const updateExpense = async (id: string, data: Partial<Expense>) => {
    setIsActionLoading(true);
    try {
      await expenseService.updateExpense(id, data);
      showToast('Gasto modificado con éxito.', 'success');
      return true;
    } catch (err) {
      console.error(err);
      showToast('Error al actualizar el gasto.', 'error');
      return false;
    } finally {
      setIsActionLoading(false);
    }
  };

  const deleteExpense = async (id: string) => {
    setIsActionLoading(true);
    try {
      await expenseService.deleteExpense(id);
      showToast('Gasto eliminado correctamente.', 'success');
      return true;
    } catch (err) {
      console.error(err);
      showToast('Error al eliminar el gasto.', 'error');
      return false;
    } finally {
      setIsActionLoading(false);
    }
  };

  const uploadReceipt = async (file: File): Promise<string | null> => {
    setIsActionLoading(true);
    try {
      const url = await expenseService.uploadReceipt(file);
      showToast('Comprobante subido con éxito.', 'success');
      return url;
    } catch (err) {
      console.error(err);
      showToast('Error al subir el comprobante.', 'error');
      return null;
    } finally {
      setIsActionLoading(false);
    }
  };

  const markAsReimbursed = async (id: string) => {
    setIsActionLoading(true);
    try {
      await expenseService.markAsReimbursed(id);
      showToast('Gasto marcado como Reembolsado.', 'success');
      return true;
    } catch (err) {
      console.error(err);
      showToast('Error al registrar el reembolso.', 'error');
      return false;
    } finally {
      setIsActionLoading(false);
    }
  };

  return {
    expenses,
    isLoading,
    isActionLoading,
    addExpense,
    updateExpense,
    deleteExpense,
    uploadReceipt,
    markAsReimbursed
  };
};
