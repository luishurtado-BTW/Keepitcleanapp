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
