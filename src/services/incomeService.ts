import { dbService } from './firebase';
import { Appointment } from '../types/appointment';

const COLLECTION_NAME = 'appointments';

export const incomeService = {
  // Subscribe to all completed appointments
  subscribeCompletedAppointments(callback: (appointments: Appointment[]) => void): () => void {
    return dbService.subscribe<Appointment>(COLLECTION_NAME, (appointments) => {
      // Filter for completed appointments and sort by date descending
      const completed = appointments
        .filter(app => app.status === 'Completada')
        .sort((a, b) => b.date.localeCompare(a.date));
      callback(completed);
    });
  }
};
