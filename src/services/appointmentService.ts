import { dbService } from './firebase';
import { Appointment } from '../types/appointment';

const COLLECTION_NAME = 'appointments';

export const appointmentService = {
  // Subscribe to all appointments
  subscribeAppointments(callback: (appointments: Appointment[]) => void): () => void {
    return dbService.subscribe<Appointment>(COLLECTION_NAME, (appointments) => {
      // Sort appointments: latest first or chronologically by date and time
      const sorted = [...appointments].sort((a, b) => {
        const dateTimeA = `${a.date}T${a.time}`;
        const dateTimeB = `${b.date}T${b.time}`;
        return dateTimeA.localeCompare(dateTimeB); // Chronological sorting
      });
      callback(sorted);
    });
  },

  // Add a new appointment
  async addAppointment(appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    return dbService.addDoc(COLLECTION_NAME, appointment);
  },

  // Update appointment details or status
  async updateAppointment(appointmentId: string, data: Partial<Appointment>): Promise<void> {
    return dbService.updateDoc(COLLECTION_NAME, appointmentId, data);
  },

  // Delete appointment
  async deleteAppointment(appointmentId: string): Promise<void> {
    return dbService.deleteDoc(COLLECTION_NAME, appointmentId);
  }
};
