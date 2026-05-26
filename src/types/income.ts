export interface IncomeDetail {
  id: string; // matches appointmentId
  date: string; // YYYY-MM-DD
  serviceType: string;
  clientName: string;
  amount: number; // total appointment amount
  companyShare: number; // company percentage cut
  employeesShare: number; // total technicians cut
  individualDistribution: Record<string, number>; // employeeId -> individual cut
}

export interface IncomeSummaryMonth {
  totalIncome: number;
  companyPercentage: number;
  companyShare: number;
  employeesPercentage: number;
  employeesShare: number;
  individualDistribution: Record<string, { name: string; amount: number; percentage: number }>; // employeeId -> detail
}
