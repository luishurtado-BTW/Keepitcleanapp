import React, { createContext, useContext, useState, useEffect } from 'react';
import { Employee } from '../types/employee';
import { Settings, ServiceType, ExpenseCategory } from '../types/settings';
import { employeeService } from '../services/employeeService';
import { settingsService } from '../services/settingsService';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  employees: Employee[];
  activeEmployees: Employee[];
  activeTechnicians: Employee[];
  settings: Settings | null;
  serviceTypes: ServiceType[];
  activeServiceTypes: ServiceType[];
  expenseCategories: ExpenseCategory[];
  activeExpenseCategories: ExpenseCategory[];
  isLoading: boolean;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  refreshSettings: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // 1. Toast Helpers
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    
    // Auto remove after 3.5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // 2. Settings Manual Refresh Helper (if needed)
  const refreshSettings = async () => {
    try {
      const data = await settingsService.getSettings();
      setSettings(data);
    } catch (err) {
      console.error('Error refreshing settings:', err);
    }
  };

  // 3. Mount real-time subscriptions
  useEffect(() => {
    let activeSubs = 0;
    const totalSubs = 4;

    const checkLoading = () => {
      activeSubs++;
      if (activeSubs >= totalSubs) {
        setIsLoading(false);
      }
    };

    // Sub 1: Employees
    const unsubEmployees = employeeService.subscribeEmployees((data) => {
      setEmployees(data);
      checkLoading();
    });

    // Sub 2: Settings
    const unsubSettings = settingsService.subscribeSettings((data) => {
      setSettings(data);
      checkLoading();
    });

    // Sub 3: Service Types
    const unsubServices = settingsService.subscribeServiceTypes((data) => {
      setServiceTypes(data);
      checkLoading();
    });

    // Sub 4: Expense Categories
    const unsubCategories = settingsService.subscribeExpenseCategories((data) => {
      setExpenseCategories(data);
      checkLoading();
    });

    return () => {
      unsubEmployees();
      unsubSettings();
      unsubServices();
      unsubCategories();
    };
  }, []);

  // Derived states
  const activeEmployees = employees.filter((e) => e.status === 'Activo');
  const activeTechnicians = activeEmployees.filter((e) => e.role === 'Técnico');
  const activeServiceTypes = serviceTypes.filter((s) => s.isActive);
  const activeExpenseCategories = expenseCategories.filter((c) => c.isActive);

  return (
    <AppContext.Provider
      value={{
        employees,
        activeEmployees,
        activeTechnicians,
        settings,
        serviceTypes,
        activeServiceTypes,
        expenseCategories,
        activeExpenseCategories,
        isLoading,
        toasts,
        showToast,
        removeToast,
        refreshSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
