import { dbService } from '../services/firebase';

export const seedAllData = async (): Promise<void> => {
  console.log('🌱 Seeding database...');

  // 1. Seed Config Settings
  await dbService.setDoc('settings', 'config', {
    companyPercentage: 30,
    employeesPercentage: 70,
    distributionMode: 'equal',
    customDistribution: {}
  });

  // 2. Seed Employees
  const employeeData = [
    { name: 'Laura Torres', role: 'Admin/Dueño', phone: '5534567890', status: 'Activo' },
    { name: 'Sofía Ruiz', role: 'Secretaria', phone: '5523456789', status: 'Activo' },
    { name: 'Carlos Mendoza', role: 'Técnico', phone: '5512345678', status: 'Activo' },
    { name: 'Juan Gómez', role: 'Técnico', phone: '5545678901', status: 'Activo' },
    { name: 'Marcos Díaz', role: 'Técnico', phone: '5556789012', status: 'Activo' },
    { name: 'Andrés López', role: 'Técnico', phone: '5567890123', status: 'Inactivo' } // Past technician
  ];

  const employeeIds: string[] = [];
  // Clear existing first in mock
  if (dbService.isMock()) {
    localStorage.removeItem('keepitclean_employees');
  }
  for (const emp of employeeData) {
    const id = await dbService.addDoc('employees', emp);
    if (emp.status === 'Activo' && emp.role === 'Técnico') {
      employeeIds.push(id);
    }
  }

  // 3. Seed Service Types
  const serviceTypes = [
    'Lavado de Sillas',
    'Lavado de Colchones',
    'Lavado de Salas',
    'Lavado de Alfombras',
    'Lavado de Tapetes',
    'Lavado de Automóvil',
    'Otro'
  ];
  if (dbService.isMock()) {
    localStorage.removeItem('keepitclean_serviceTypes');
  }
  for (const st of serviceTypes) {
    await dbService.addDoc('serviceTypes', { name: st, isActive: true });
  }

  // 4. Seed Expense Categories
  const expenseCategories = [
    { name: 'Gasolina', type: 'both', isActive: true },
    { name: 'Productos de limpieza', type: 'both', isActive: true },
    { name: 'Equipo de limpieza', type: 'both', isActive: true },
    { name: 'Herramientas', type: 'both', isActive: true },
    { name: 'Comida', type: 'employee', isActive: true },
    { name: 'Transporte', type: 'employee', isActive: true },
    { name: 'Mantenimiento de vehículo', type: 'company', isActive: true },
    { name: 'Publicidad', type: 'company', isActive: true },
    { name: 'Renta', type: 'company', isActive: true },
    { name: 'Servicios (luz, agua, internet)', type: 'company', isActive: true },
    { name: 'Otro', type: 'both', isActive: true }
  ];
  if (dbService.isMock()) {
    localStorage.removeItem('keepitclean_expenseCategories');
  }
  for (const ec of expenseCategories) {
    await dbService.addDoc('expenseCategories', ec);
  }

  // 5. Seed Appointments (Dates relative to current time)
  // Let's get current date info
  const today = new Date();
  
  const formatDateString = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getRelativeDate = (daysOffset: number) => {
    const d = new Date();
    d.setDate(today.getDate() + daysOffset);
    return formatDateString(d);
  };

  // Create appointments from previous month and current month
  const appointmentsData = [
    // Completed Appointments (Income)
    {
      date: getRelativeDate(-25),
      time: '10:00',
      serviceType: 'Lavado de Salas',
      clientPhone: '5561234567',
      clientName: 'Fernando Ramos',
      address: 'Av. Revolución 1420, Col. Centro',
      amount: 1850,
      withTeflon: true,
      notes: 'Sala de 3 piezas y cojines extra.',
      assignedEmployee: employeeIds[0], // Carlos
      status: 'Completada'
    },
    {
      date: getRelativeDate(-20),
      time: '14:30',
      serviceType: 'Lavado de Colchones',
      clientPhone: '5572345678',
      clientName: 'María Elena Ortiz',
      address: 'Paseo de la Reforma 402, Depto 4B',
      amount: 1200,
      withTeflon: false,
      notes: 'Colchón King Size, manchas de café.',
      assignedEmployee: employeeIds[1], // Juan
      status: 'Completada'
    },
    {
      date: getRelativeDate(-15),
      time: '09:00',
      serviceType: 'Lavado de Tapetes',
      clientPhone: '5583456789',
      clientName: 'Roberto Gómez',
      address: 'Calle 10 #245, Col. San Pedro',
      amount: 950,
      withTeflon: true,
      notes: 'Tapete persa de lana.',
      assignedEmployee: employeeIds[2], // Marcos
      status: 'Completada'
    },
    {
      date: getRelativeDate(-8),
      time: '11:00',
      serviceType: 'Lavado de Automóvil',
      clientPhone: '5594567890',
      clientName: 'Alejandro Ruiz',
      address: 'Blvd. Adolfo López Mateos 88',
      amount: 1500,
      withTeflon: false,
      notes: 'Lavado de vestiduras completas e interiores.',
      assignedEmployee: employeeIds[0], // Carlos
      status: 'Completada'
    },
    {
      date: getRelativeDate(-3),
      time: '16:00',
      serviceType: 'Lavado de Sillas',
      clientPhone: '5511223344',
      clientName: 'Restaurante El Sazón',
      address: 'Calle Madero 45, Centro Histórico',
      amount: 2400,
      withTeflon: false,
      notes: '24 sillas de comedor de tela.',
      assignedEmployee: employeeIds[1], // Juan
      status: 'Completada'
    },
    // Active Appointments (Pending, Confirmed)
    {
      date: getRelativeDate(0), // Today
      time: '11:30',
      serviceType: 'Lavado de Salas',
      clientPhone: '5544332211',
      clientName: 'Patricia Juárez',
      address: 'Lomas de Chapultepec, Tecoyotla 32',
      amount: 2200,
      withTeflon: true,
      notes: 'Sala grande de piel sintética.',
      assignedEmployee: employeeIds[0], // Carlos
      status: 'Confirmada'
    },
    {
      date: getRelativeDate(1), // Tomorrow
      time: '09:30',
      serviceType: 'Lavado de Colchones',
      clientPhone: '5555667788',
      clientName: 'Ignacio Silva',
      address: 'Col. Roma Sur, Coahuila 115',
      amount: 850,
      withTeflon: false,
      notes: 'Colchón individual, lavado express.',
      assignedEmployee: employeeIds[1], // Juan
      status: 'Confirmada'
    },
    {
      date: getRelativeDate(2),
      time: '13:00',
      serviceType: 'Lavado de Alfombras',
      clientPhone: '5599887766',
      clientName: 'Oficinas Nexus',
      address: 'Santa Fe, Av. de los Poetas 500',
      amount: 4500,
      withTeflon: true,
      notes: 'Área de recepción y oficinas administrativas.',
      assignedEmployee: employeeIds[2], // Marcos
      status: 'Pendiente'
    },
    {
      date: getRelativeDate(4),
      time: '10:00',
      serviceType: 'Lavado de Tapetes',
      clientPhone: '5566778899',
      clientName: 'Diana Delgado',
      address: 'Condesa, Amsterdam 22',
      amount: 1100,
      withTeflon: false,
      notes: '2 tapetes de pasillo medianos.',
      assignedEmployee: employeeIds[0], // Carlos
      status: 'Pendiente'
    },
    {
      date: getRelativeDate(7),
      time: '15:00',
      serviceType: 'Lavado de Salas',
      clientPhone: '5533221100',
      clientName: 'Arturo Peniche',
      address: 'Polanco, Campos Elíseos 120',
      amount: 3100,
      withTeflon: true,
      notes: 'Sala modular y sillón reclinable.',
      assignedEmployee: employeeIds[1], // Juan
      status: 'Pendiente'
    },
    // Cancelled Appointment
    {
      date: getRelativeDate(-12),
      time: '12:00',
      serviceType: 'Lavado de Alfombras',
      clientPhone: '5500112233',
      clientName: 'Eduardo Romo',
      address: 'Col. Del Valle, Heriberto Frías 902',
      amount: 1600,
      withTeflon: false,
      notes: 'Canceló por viaje de último minuto.',
      assignedEmployee: employeeIds[2], // Marcos
      status: 'Cancelada'
    }
  ];

  if (dbService.isMock()) {
    localStorage.removeItem('keepitclean_appointments');
  }
  for (const app of appointmentsData) {
    await dbService.addDoc('appointments', app);
  }

  // 6. Seed Expenses
  // Mock image receipt url or base64 placeholder (we will use premium mock images)
  const mockReceiptUrl = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80';

  const expensesData = [
    // Employee reimbursable expenses
    {
      type: 'employee',
      employeeId: employeeIds[0], // Carlos
      category: 'Gasolina',
      amount: 350,
      date: getRelativeDate(-18),
      description: 'Carga de gasolina para camioneta de servicio.',
      receiptURL: mockReceiptUrl,
      reimbursementStatus: 'Reembolsado'
    },
    {
      type: 'employee',
      employeeId: employeeIds[0], // Carlos
      category: 'Productos de limpieza',
      amount: 180,
      date: getRelativeDate(-5),
      description: 'Shampoo quitamanchas de alfombras urgente.',
      receiptURL: mockReceiptUrl,
      reimbursementStatus: 'Pendiente de reembolso'
    },
    {
      type: 'employee',
      employeeId: employeeIds[1], // Juan
      category: 'Herramientas',
      amount: 120,
      date: getRelativeDate(-2),
      description: 'Cepillo manual de cerdas suaves para tapicería fina.',
      receiptURL: mockReceiptUrl,
      reimbursementStatus: 'Pendiente de reembolso'
    },
    {
      type: 'employee',
      employeeId: employeeIds[2], // Marcos
      category: 'Comida',
      amount: 160,
      date: getRelativeDate(-10),
      description: 'Almuerzo en ruta por retraso de servicio.',
      receiptURL: mockReceiptUrl,
      reimbursementStatus: 'Reembolsado'
    },
    // Company Direct Expenses
    {
      type: 'company',
      category: 'Renta',
      amount: 8000,
      date: getRelativeDate(-12),
      description: 'Renta mensual de bodega de resguardo de equipos.',
      receiptURL: mockReceiptUrl
    },
    {
      type: 'company',
      category: 'Publicidad',
      amount: 1500,
      date: getRelativeDate(-22),
      description: 'Campaña de anuncios en Facebook Ads - Limpieza de salas.',
      receiptURL: mockReceiptUrl
    },
    {
      type: 'company',
      category: 'Servicios (luz, agua, internet)',
      amount: 920,
      date: getRelativeDate(-10),
      description: 'Recibo de luz de oficina/bodega.',
      receiptURL: mockReceiptUrl
    },
    {
      type: 'company',
      category: 'Equipo de limpieza',
      amount: 3200,
      date: getRelativeDate(-15),
      description: 'Inyección-succión Karcher SE 4001 manguera de repuesto.',
      receiptURL: mockReceiptUrl
    },
    {
      type: 'company',
      category: 'Productos de limpieza',
      amount: 750,
      date: getRelativeDate(-4),
      description: 'Garrafa 20L de teflón protector y desinfectante cítrico.',
      receiptURL: mockReceiptUrl
    }
  ];

  if (dbService.isMock()) {
    localStorage.removeItem('keepitclean_expenses');
  }
  for (const exp of expensesData) {
    await dbService.addDoc('expenses', exp);
  }

  console.log('✅ Seeding completed!');
};
