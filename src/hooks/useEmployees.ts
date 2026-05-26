import { useApp } from '../context/AppContext';
import { employeeService } from '../services/employeeService';
import { Employee } from '../types/employee';
import { useState } from 'react';

export const useEmployees = () => {
  const { employees, activeEmployees, activeTechnicians, showToast } = useApp();
  const [isActionLoading, setIsActionLoading] = useState(false);

  const addEmployee = async (employeeData: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsActionLoading(true);
    try {
      await employeeService.addEmployee(employeeData);
      showToast(`Empleado "${employeeData.name}" agregado con éxito.`, 'success');
      return true;
    } catch (err) {
      console.error(err);
      showToast('Error al agregar el empleado.', 'error');
      return false;
    } finally {
      setIsActionLoading(false);
    }
  };

  const updateEmployee = async (id: string, data: Partial<Employee>) => {
    setIsActionLoading(true);
    try {
      await employeeService.updateEmployee(id, data);
      showToast('Datos del empleado actualizados con éxito.', 'success');
      return true;
    } catch (err) {
      console.error(err);
      showToast('Error al actualizar el empleado.', 'error');
      return false;
    } finally {
      setIsActionLoading(false);
    }
  };

  const deactivateEmployee = async (id: string, name: string) => {
    setIsActionLoading(true);
    try {
      await employeeService.deactivateEmployee(id);
      showToast(`Empleado "${name}" desactivado con éxito para mantener su historial.`, 'success');
      return true;
    } catch (err) {
      console.error(err);
      showToast('Error al desactivar el empleado.', 'error');
      return false;
    } finally {
      setIsActionLoading(false);
    }
  };

  return {
    employees,
    activeEmployees,
    activeTechnicians,
    isActionLoading,
    addEmployee,
    updateEmployee,
    deactivateEmployee
  };
};
