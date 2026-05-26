import { dbService } from './firebase';

export const seedData = async (): Promise<void> => {
  // Clear any existing localStorage data if we are in mock mode
  if (dbService.isMock()) {
    localStorage.removeItem('keepitclean_employees');
    localStorage.removeItem('keepitclean_appointments');
    localStorage.removeItem('keepitclean_expenses');
    localStorage.removeItem('keepitclean_settings');
    localStorage.removeItem('keepitclean_serviceTypes');
    localStorage.removeItem('keepitclean_expenseCategories');
  }

  // 1. Seed settings
  const settings = {
    companyPercentage: 30,
    employeesPercentage: 70,
    distributionMode: 'equal' as const,
    customDistribution: {}
  };
  await dbService.setDoc('settings', 'global', settings);

  // 2. Seed standard service types
  const defaultServices = [
    { id: 's1', name: 'Lavado de Sillas', isActive: true },
    { id: 's2', name: 'Lavado de Colchones', isActive: true },
    { id: 's3', name: 'Lavado de Salas', isActive: true },
    { id: 's4', name: 'Lavado de Alfombras', isActive: true },
    { id: 's5', name: 'Lavado de Tapetes', isActive: true },
    { id: 's6', name: 'Lavado de Automóvil', isActive: true }
  ];
  for (const s of defaultServices) {
    await dbService.setDoc('serviceTypes', s.id, { name: s.name, isActive: s.isActive });
  }

  // 3. Seed expense categories
  const defaultCategories = [
    { id: 'c1', name: 'Gasolina', type: 'both' as const, isActive: true },
    { id: 'c2', name: 'Productos de limpieza', type: 'both' as const, isActive: true },
    { id: 'c3', name: 'Renta', type: 'company' as const, isActive: true },
    { id: 'c4', name: 'Publicidad', type: 'company' as const, isActive: true },
    { id: 'c5', name: 'Comida', type: 'employee' as const, isActive: true },
    { id: 'c6', name: 'Servicios', type: 'company' as const, isActive: true }
  ];
  for (const c of defaultCategories) {
    await dbService.setDoc('expenseCategories', c.id, { name: c.name, type: c.type, isActive: c.isActive });
  }

  // 4. Seed employees
  const employees = [
    { id: 'emp1', name: 'Juan Gómez', role: 'Técnico' as const, phone: '5512345678', status: 'Activo' as const },
    { id: 'emp2', name: 'Pedro Ramos', role: 'Técnico' as const, phone: '5587654321', status: 'Activo' as const },
    { id: 'emp3', name: 'Sofía Ruiz', role: 'Secretaria' as const, phone: '5533333333', status: 'Activo' as const },
    { id: 'emp4', name: 'Ricardo Pérez', role: 'Admin/Dueño' as const, phone: '5544444444', status: 'Activo' as const }
  ];
  for (const emp of employees) {
    await dbService.setDoc('employees', emp.id, emp);
  }

  // 5. Seed appointments (Completadas and Pendientes for the current month)
  const today = new Date();
  const yearMonth = today.toISOString().slice(0, 7); // e.g. "2026-05"
  
  const appointments = [
    {
      id: 'app1',
      date: `${yearMonth}-15`,
      time: '09:00',
      serviceType: 'Lavado de Salas',
      clientPhone: '5512345600',
      clientName: 'María López',
      address: 'Av. Paseo de la Reforma 250, CDMX',
      amount: 1500,
      withTeflon: true,
      status: 'Completada' as const,
      assignedEmployee: 'emp1',
      notes: 'Sillón de 3 plazas con manchas de café.'
    },
    {
      id: 'app2',
      date: `${yearMonth}-18`,
      time: '12:30',
      serviceType: 'Lavado de Colchones',
      clientPhone: '5598765400',
      clientName: 'Esteban Ortiz',
      address: 'Calle Presa Cutzamala 45, CDMX',
      amount: 800,
      withTeflon: false,
      status: 'Completada' as const,
      assignedEmployee: 'emp2',
      notes: 'Colchón matrimonial, desinfectar ácaros.'
    },
    {
      id: 'app3',
      date: `${yearMonth}-26`,
      time: '10:00',
      serviceType: 'Lavado de Sillas',
      clientPhone: '5577665544',
      clientName: 'Liliana Torres',
      address: 'Lomas de Chapultepec, CDMX',
      amount: 600,
      withTeflon: false,
      status: 'Pendiente' as const,
      assignedEmployee: 'emp1',
      notes: '6 sillas de comedor de tela beige.'
    },
    {
      id: 'app4',
      date: `${yearMonth}-28`,
      time: '15:00',
      serviceType: 'Lavado de Tapetes',
      clientPhone: '5533221100',
      clientName: 'Héctor González',
      address: 'Bosques de las Lomas, CDMX',
      amount: 1200,
      withTeflon: true,
      status: 'Confirmada' as const,
      assignedEmployee: 'emp2'
    }
  ];
  for (const app of appointments) {
    await dbService.setDoc('appointments', app.id, app);
  }

  // 6. Seed expenses
  const expenses = [
    {
      id: 'exp1',
      type: 'company' as const,
      category: 'Renta',
      amount: 2500,
      date: `${yearMonth}-01`,
      description: 'Pago de renta mensual del local'
    },
    {
      id: 'exp2',
      type: 'employee' as const,
      employeeId: 'emp1',
      category: 'Gasolina',
      amount: 300,
      date: `${yearMonth}-14`,
      description: 'Gasolina para camioneta de servicios',
      reimbursementStatus: 'Pendiente de reembolso' as const
    },
    {
      id: 'exp3',
      type: 'employee' as const,
      employeeId: 'emp2',
      category: 'Productos de limpieza',
      amount: 150,
      date: `${yearMonth}-17`,
      description: 'Compra de cepillos y jabón líquido',
      reimbursementStatus: 'Reembolsado' as const
    }
  ];
  for (const exp of expenses) {
    await dbService.setDoc('expenses', exp.id, exp);
  }
};
