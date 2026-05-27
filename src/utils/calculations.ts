import { Appointment } from '../types/appointment';
import { Employee } from '../types/employee';
import { Settings } from '../types/settings';
import { IncomeSummaryMonth, IncomeDetail } from '../types/income';

/**
 * Calculates the total income and commission distribution split for a list of completed appointments.
 * @param appointments List of completed appointments
 * @param activeTechnicians List of currently active technicians
 * @param settings Settings configurations
 */
export const calculateIncomeDistribution = (
  appointments: Appointment[],
  activeTechnicians: Employee[],
  settings: Settings
): IncomeSummaryMonth => {
  const totalIncome = appointments.reduce((sum, app) => sum + app.amount, 0);
  
  const companyPercentage = settings.companyPercentage;
  const employeesPercentage = settings.employeesPercentage;
  
  const companyShare = totalIncome * (companyPercentage / 100);
  const employeesShare = totalIncome * (employeesPercentage / 100);
  
  const individualDistribution: IncomeSummaryMonth['individualDistribution'] = {};
  
  // Initialize all active technicians with zero
  activeTechnicians.forEach(tech => {
    individualDistribution[tech.id] = {
      name: tech.name,
      amount: 0,
      percentage: 0
    };
  });

  const numTechs = activeTechnicians.length;
  
  if (numTechs > 0) {
    if (settings.distributionMode === 'equal') {
      const equalPercentage = 100 / numTechs;
      const equalAmount = employeesShare / numTechs;
      
      activeTechnicians.forEach(tech => {
        individualDistribution[tech.id] = {
          name: tech.name,
          amount: equalAmount,
          percentage: equalPercentage
        };
      });
    } else {
      // Custom mode
      activeTechnicians.forEach(tech => {
        const customPctOfEmployeesShare = settings.customDistribution[tech.id] || 0;
        const finalAmount = employeesShare * (customPctOfEmployeesShare / 100);
        
        individualDistribution[tech.id] = {
          name: tech.name,
          amount: finalAmount,
          percentage: customPctOfEmployeesShare
        };
      });
    }
  }

  return {
    totalIncome,
    companyPercentage,
    companyShare,
    employeesPercentage,
    employeesShare,
    individualDistribution
  };
};

/**
 * Groups and filters appointments by month and year.
 * @param appointments List of all appointments
 * @param yearMonth Format "YYYY-MM"
 */
export const filterAppointmentsByMonth = (
  appointments: Appointment[],
  yearMonth: string
): Appointment[] => {
  if (!yearMonth) return appointments;
  return appointments.filter(app => app.date.startsWith(yearMonth));
};

/**
 * Formats appointments into a detailed income list.
 */
export const getDetailedIncomeList = (
  appointments: Appointment[],
  activeTechnicians: Employee[],
  settings: Settings
): IncomeDetail[] => {
  const companyPercentage = settings.companyPercentage;
  const employeesPercentage = settings.employeesPercentage;
  const numTechs = activeTechnicians.length;

  return appointments.map(app => {
    const amount = app.amount;
    const companyShare = amount * (companyPercentage / 100);
    const employeesShare = amount * (employeesPercentage / 100);
    const individualDistribution: Record<string, number> = {};

    activeTechnicians.forEach(tech => {
      individualDistribution[tech.id] = 0;
    });

    if (numTechs > 0) {
      if (settings.distributionMode === 'equal') {
        const equalAmount = employeesShare / numTechs;
        activeTechnicians.forEach(tech => {
          individualDistribution[tech.id] = equalAmount;
        });
      } else {
        activeTechnicians.forEach(tech => {
          const pct = settings.customDistribution[tech.id] || 0;
          individualDistribution[tech.id] = employeesShare * (pct / 100);
        });
      }
    }

    return {
      id: app.id,
      date: app.date,
      serviceType: app.serviceType,
      clientName: app.clientName || 'Cliente Genérico',
      amount,
      companyShare,
      employeesShare,
      individualDistribution
    };
  });
};

/**
 * Calculates dynamic calendar week breakdowns and commission allocations for a selected month.
 */
export const getWeeklySplits = (
  appointments: Appointment[],
  activeEmployees: Employee[],
  settings: Settings,
  yearMonth: string
) => {
  if (!yearMonth) return [];
  
  // Parse year and month
  const [yearStr, monthStr] = yearMonth.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1; // 0-indexed month
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  const weeks: Array<{
    startDate: string; // YYYY-MM-DD
    endDate: string; // YYYY-MM-DD
    label: string; // "Semana 1 (1 al 7 de may)"
    appointments: Appointment[];
  }> = [];
  
  let currentStart = new Date(firstDay);
  
  while (currentStart <= lastDay) {
    // Find the end of the current week (Sunday)
    // getDay(): 0 is Sunday, 1 is Monday ... 6 is Saturday
    const dayOfWeek = currentStart.getDay();
    const daysTillSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
    
    let currentEnd = new Date(currentStart);
    currentEnd.setDate(currentStart.getDate() + daysTillSunday);
    
    if (currentEnd > lastDay) {
      currentEnd = new Date(lastDay);
    }
    
    // Format dates
    const startStr = currentStart.toISOString().slice(0, 10);
    const endStr = currentEnd.toISOString().slice(0, 10);
    
    const weekNum = weeks.length + 1;
    // Format month short label
    const monthLabel = currentStart.toLocaleDateString('es-ES', { month: 'short' });
    const label = `Semana ${weekNum} (${currentStart.getDate()} al ${currentEnd.getDate()} de ${monthLabel})`;
    
    weeks.push({
      startDate: startStr,
      endDate: endStr,
      label,
      appointments: []
    });
    
    // Advance currentStart to next Monday
    currentStart = new Date(currentEnd);
    currentStart.setDate(currentEnd.getDate() + 1);
  }
  
  // Allocate appointments to weeks
  appointments.forEach(app => {
    const appDateStr = app.date; // YYYY-MM-DD
    const week = weeks.find(w => appDateStr >= w.startDate && appDateStr <= w.endDate);
    if (week) {
      week.appointments.push(app);
    }
  });
  
  // Compute distribution for each week
  return weeks.map((w, idx) => {
    const weeklyIncome = w.appointments.reduce((sum, app) => sum + app.amount, 0);
    const companyShare = weeklyIncome * (settings.companyPercentage / 100);
    const employeesShare = weeklyIncome * (settings.employeesPercentage / 100);
    
    const individualDistribution: Record<string, { name: string; amount: number; percentage: number }> = {};
    
    activeEmployees.forEach(emp => {
      individualDistribution[emp.id] = {
        name: emp.name,
        amount: 0,
        percentage: settings.distributionMode === 'equal' 
          ? (100 / activeEmployees.length) 
          : (settings.customDistribution[emp.id] || 0)
      };
    });
    
    if (activeEmployees.length > 0) {
      if (settings.distributionMode === 'equal') {
        const equalAmount = employeesShare / activeEmployees.length;
        activeEmployees.forEach(emp => {
          individualDistribution[emp.id].amount = equalAmount;
        });
      } else {
        activeEmployees.forEach(emp => {
          const pct = settings.customDistribution[emp.id] || 0;
          individualDistribution[emp.id].amount = employeesShare * (pct / 100);
        });
      }
    }
    
    return {
      weekIndex: idx + 1,
      label: w.label,
      startDate: w.startDate,
      endDate: w.endDate,
      totalIncome: weeklyIncome,
      companyShare,
      employeesShare,
      individualDistribution,
      appointmentsCount: w.appointments.length
    };
  });
};
