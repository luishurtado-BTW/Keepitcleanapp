import { dbService } from './firebase';
import { Expense } from '../types/expense';

const COLLECTION_NAME = 'expenses';

export const expenseService = {
  // Subscribe to all expenses
  subscribeExpenses(callback: (expenses: Expense[]) => void): () => void {
    return dbService.subscribe<Expense>(COLLECTION_NAME, (expenses) => {
      // Sort by date (latest first)
      const sorted = [...expenses].sort((a, b) => b.date.localeCompare(a.date));
      callback(sorted);
    });
  },

  // Add a new expense
  async addExpense(expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    return dbService.addDoc(COLLECTION_NAME, expense);
  },

  // Update an expense
  async updateExpense(expenseId: string, data: Partial<Expense>): Promise<void> {
    return dbService.updateDoc(COLLECTION_NAME, expenseId, data);
  },

  // Delete an expense
  async deleteExpense(expenseId: string): Promise<void> {
    return dbService.deleteDoc(COLLECTION_NAME, expenseId);
  },

  // Upload receipt file (image)
  async uploadReceipt(file: File): Promise<string> {
    return dbService.uploadReceipt(file);
  },

  // Toggle reimbursement status
  async markAsReimbursed(expenseId: string): Promise<void> {
    return dbService.updateDoc(COLLECTION_NAME, expenseId, { 
      reimbursementStatus: 'Reembolsado' 
    });
  }
};
