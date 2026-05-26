export type AppointmentStatus = 'Pendiente' | 'Confirmada' | 'Completada' | 'Cancelada';

export interface Appointment {
  id: string;
  date: string; // Format: YYYY-MM-DD
  time: string; // Format: HH:MM
  serviceType: string; // Lavado de Salas, Sillas, etc. Or custom input
  clientPhone: string;
  clientName?: string;
  address: string;
  amount: number; // in MXN
  withTeflon: boolean;
  notes?: string;
  assignedEmployee?: string; // ID of the Employee
  status: AppointmentStatus;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}
