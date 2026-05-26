export type ExpenseType = 'employee' | 'company';
export type ReimbursementStatus = 'Pendiente de reembolso' | 'Reembolsado';

export interface Expense {
  id: string;
  type: ExpenseType;
  employeeId?: string; // Applies only if type === 'employee'
  category: string;
  amount: number; // in MXN
  date: string; // Format: YYYY-MM-DD
  description?: string;
  receiptURL?: string; // Optional image URL (Storage or Base64)
  reimbursementStatus?: ReimbursementStatus; // Applies only if type === 'employee'
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}
