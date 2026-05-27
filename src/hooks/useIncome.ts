import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { incomeService } from '../services/incomeService';
import { Appointment } from '../types/appointment';
import { 
  calculateIncomeDistribution, 
  filterAppointmentsByMonth, 
  getDetailedIncomeList,
  getWeeklySplits
} from '../utils/calculations';

export const useIncome = (selectedYearMonth: string) => {
  const [completedAppointments, setCompletedAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { settings, activeEmployees } = useApp();

  useEffect(() => {
    const unsub = incomeService.subscribeCompletedAppointments((data) => {
      setCompletedAppointments(data);
      setIsLoading(false);
    });
    return () => unsub();
  }, []);

  // 1. Filter completed appointments for the selected year-month (YYYY-MM)
  const filteredAppointments = filterAppointmentsByMonth(completedAppointments, selectedYearMonth);

  // 2. Perform distribution calculations reactively
  const summary = settings
    ? calculateIncomeDistribution(filteredAppointments, activeEmployees, settings)
    : {
        totalIncome: 0,
        companyPercentage: 30,
        companyShare: 0,
        employeesPercentage: 70,
        employeesShare: 0,
        individualDistribution: {}
      };

  // 3. Get detailed individual appointments split logs
  const details = settings
    ? getDetailedIncomeList(filteredAppointments, activeEmployees, settings)
    : [];

  // 4. Get weekly distribution splits
  const weeklySplits = settings
    ? getWeeklySplits(filteredAppointments, activeEmployees, settings, selectedYearMonth)
    : [];

  return {
    allCompletedAppointments: completedAppointments,
    filteredAppointments,
    summary,
    details,
    weeklySplits,
    isLoading
  };
};
