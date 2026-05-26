import { dbService } from './firebase';
import { Employee, EmployeeRole, EmployeeStatus } from '../types/employee';

const COLLECTION_NAME = 'employees';

export const employeeService = {
  // Subscribe to all employees
  subscribeEmployees(callback: (employees: Employee[]) => void): () => void {
    return dbService.subscribe<Employee>(COLLECTION_NAME, (employees) => {
      // Sort alphabetically by name
      const sorted = [...employees].sort((a, b) => a.name.localeCompare(b.name));
      callback(sorted);
    });
  },

  // Get active employees
  async getActiveEmployees(): Promise<Employee[]> {
    const list = await dbService.getList<Employee>(COLLECTION_NAME);
    return list
      .filter(emp => emp.status === 'Activo')
      .sort((a, b) => a.name.localeCompare(b.name));
  },

  // Add new employee
  async addEmployee(employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    return dbService.addDoc(COLLECTION_NAME, employee);
  },

  // Update existing employee
  async updateEmployee(employeeId: string, data: Partial<Employee>): Promise<void> {
    return dbService.updateDoc(COLLECTION_NAME, employeeId, data);
  },

  // Deactivate an employee (change status to Inactivo)
  async deactivateEmployee(employeeId: string): Promise<void> {
    return dbService.updateDoc(COLLECTION_NAME, employeeId, { status: 'Inactivo' });
  },

  // Delete an employee (used for testing or cleanups if needed, though deactivation is preferred)
  async deleteEmployee(employeeId: string): Promise<void> {
    return dbService.deleteDoc(COLLECTION_NAME, employeeId);
  }
};
