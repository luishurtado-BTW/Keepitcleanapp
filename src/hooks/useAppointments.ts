import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { appointmentService } from '../services/appointmentService';
import { Appointment } from '../types/appointment';

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const { showToast } = useApp();

  useEffect(() => {
    const unsub = appointmentService.subscribeAppointments((data) => {
      setAppointments(data);
      setIsLoading(false);
    });
    return () => unsub();
  }, []);

  const addAppointment = async (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsActionLoading(true);
    try {
      const id = await appointmentService.addAppointment(appointmentData);
      showToast('Cita agendada con éxito.', 'success');
      return id;
    } catch (err) {
      console.error(err);
      showToast('Error al agendar la cita.', 'error');
      return null;
    } finally {
      setIsActionLoading(false);
    }
  };

  const updateAppointment = async (id: string, data: Partial<Appointment>) => {
    setIsActionLoading(true);
    try {
      await appointmentService.updateAppointment(id, data);
      showToast('Cita modificada con éxito.', 'success');
      return true;
    } catch (err) {
      console.error(err);
      showToast('Error al actualizar la cita.', 'error');
      return false;
    } finally {
      setIsActionLoading(false);
    }
  };

  const deleteAppointment = async (id: string) => {
    setIsActionLoading(true);
    try {
      await appointmentService.deleteAppointment(id);
      showToast('Cita eliminada correctamente.', 'success');
      return true;
    } catch (err) {
      console.error(err);
      showToast('Error al eliminar la cita.', 'error');
      return false;
    } finally {
      setIsActionLoading(false);
    }
  };

  return {
    appointments,
    isLoading,
    isActionLoading,
    addAppointment,
    updateAppointment,
    deleteAppointment
  };
};
