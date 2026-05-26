export type DistributionMode = 'equal' | 'custom';

export interface Settings {
  companyPercentage: number; // default: 30
  employeesPercentage: number; // default: 70
  distributionMode: DistributionMode; // 'equal' | 'custom'
  customDistribution: Record<string, number>; // key: employeeId, value: percentage (0-100)
}

export interface ServiceType {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string; // ISO string
}

export type ExpenseCategoryType = 'employee' | 'company' | 'both';

export interface ExpenseCategory {
  id: string;
  name: string;
  type: ExpenseCategoryType;
  isActive: boolean;
}
