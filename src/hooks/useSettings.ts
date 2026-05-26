import { useApp } from '../context/AppContext';
import { settingsService } from '../services/settingsService';
import { Settings, ServiceType, ExpenseCategory } from '../types/settings';
import { useState } from 'react';

export const useSettings = () => {
  const { 
    settings, 
    serviceTypes, 
    activeServiceTypes, 
    expenseCategories, 
    activeExpenseCategories, 
    showToast,
    refreshSettings
  } = useApp();
  
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Update percentages split or distribution mode
  const updateSettings = async (data: Partial<Settings>) => {
    setIsActionLoading(true);
    try {
      await settingsService.updateSettings(data);
      await refreshSettings(); // Force context update
      showToast('Configuración de distribución guardada.', 'success');
      return true;
    } catch (err) {
      console.error(err);
      showToast('Error al guardar la configuración.', 'error');
      return false;
    } finally {
      setIsActionLoading(false);
    }
  };

  // --- Service Types CRUD ---
  
  const addServiceType = async (name: string) => {
    setIsActionLoading(true);
    try {
      await settingsService.addServiceType(name);
      showToast(`Tipo de servicio "${name}" agregado con éxito.`, 'success');
      return true;
    } catch (err) {
      console.error(err);
      showToast('Error al agregar el tipo de servicio.', 'error');
      return false;
    } finally {
      setIsActionLoading(false);
    }
  };

  const updateServiceType = async (id: string, data: Partial<ServiceType>) => {
    setIsActionLoading(true);
    try {
      await settingsService.updateServiceType(id, data);
      showToast('Tipo de servicio actualizado.', 'success');
      return true;
    } catch (err) {
      console.error(err);
      showToast('Error al actualizar el tipo de servicio.', 'error');
      return false;
    } finally {
      setIsActionLoading(false);
    }
  };

  const deleteServiceType = async (id: string) => {
    setIsActionLoading(true);
    try {
      await settingsService.deleteServiceType(id);
      showToast('Tipo de servicio eliminado.', 'success');
      return true;
    } catch (err) {
      console.error(err);
      showToast('Error al eliminar el tipo de servicio.', 'error');
      return false;
    } finally {
      setIsActionLoading(false);
    }
  };

  // --- Expense Categories CRUD ---
  
  const addExpenseCategory = async (name: string, type: 'employee' | 'company' | 'both') => {
    setIsActionLoading(true);
    try {
      await settingsService.addExpenseCategory(name, type);
      showToast(`Categoría de gasto "${name}" agregada con éxito.`, 'success');
      return true;
    } catch (err) {
      console.error(err);
      showToast('Error al agregar la categoría.', 'error');
      return false;
    } finally {
      setIsActionLoading(false);
    }
  };

  const updateExpenseCategory = async (id: string, data: Partial<ExpenseCategory>) => {
    setIsActionLoading(true);
    try {
      await settingsService.updateExpenseCategory(id, data);
      showToast('Categoría de gasto actualizada.', 'success');
      return true;
    } catch (err) {
      console.error(err);
      showToast('Error al actualizar la categoría.', 'error');
      return false;
    } finally {
      setIsActionLoading(false);
    }
  };

  const deleteExpenseCategory = async (id: string) => {
    setIsActionLoading(true);
    try {
      await settingsService.deleteExpenseCategory(id);
      showToast('Categoría de gasto eliminada.', 'success');
      return true;
    } catch (err) {
      console.error(err);
      showToast('Error al eliminar la categoría.', 'error');
      return false;
    } finally {
      setIsActionLoading(false);
    }
  };

  return {
    settings,
    serviceTypes,
    activeServiceTypes,
    expenseCategories,
    activeExpenseCategories,
    isActionLoading,
    updateSettings,
    addServiceType,
    updateServiceType,
    deleteServiceType,
    addExpenseCategory,
    updateExpenseCategory,
    deleteExpenseCategory
  };
};
