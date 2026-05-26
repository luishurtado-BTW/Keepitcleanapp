export type EmployeeRole = 'Técnico' | 'Secretaria' | 'Admin/Dueño';
export type EmployeeStatus = 'Activo' | 'Inactivo';

export interface Employee {
  id: string;
  name: string;
  role: EmployeeRole;
  phone: string;
  status: EmployeeStatus;
  createdAt: string; // ISO Date String
  updatedAt: string; // ISO Date String
}
