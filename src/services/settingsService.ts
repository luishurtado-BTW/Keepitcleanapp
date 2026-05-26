import { dbService } from './firebase';
import { Settings, ServiceType, ExpenseCategory } from '../types/settings';

const SETTINGS_COLLECTION = 'settings';
const CONFIG_DOC_ID = 'config';
const SERVICES_COLLECTION = 'serviceTypes';
const CATEGORIES_COLLECTION = 'expenseCategories';

const DEFAULT_SETTINGS: Settings = {
  companyPercentage: 30,
  employeesPercentage: 70,
  distributionMode: 'equal',
  customDistribution: {}
};

export const settingsService = {
  // --- Global config settings (document 'config' inside 'settings') ---
  
  // Get active configurations
  async getSettings(): Promise<Settings> {
    const config = await dbService.getDoc<Settings>(SETTINGS_COLLECTION, CONFIG_DOC_ID);
    if (!config) {
      // Save default settings if not exists
      await dbService.setDoc(SETTINGS_COLLECTION, CONFIG_DOC_ID, DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    }
    return config;
  },

  // Subscribe to config changes
  subscribeSettings(callback: (settings: Settings) => void): () => void {
    // Check if document exists first, if not create it
    this.getSettings().then((settings) => {
      callback(settings);
    });

    return dbService.subscribe<any>(SETTINGS_COLLECTION, (docs) => {
      const configDoc = docs.find(d => d.id === CONFIG_DOC_ID);
      if (configDoc) {
        const { id, createdAt, updatedAt, ...settingsData } = configDoc;
        callback(settingsData as Settings);
      }
    });
  },

  // Update configuration percentages or distribution type
  async updateSettings(settings: Partial<Settings>): Promise<void> {
    return dbService.setDoc(SETTINGS_COLLECTION, CONFIG_DOC_ID, settings);
  },

  // --- Dynamic Service Types ---
  
  // Subscribe to service types
  subscribeServiceTypes(callback: (services: ServiceType[]) => void): () => void {
    return dbService.subscribe<ServiceType>(SERVICES_COLLECTION, (services) => {
      const sorted = [...services].sort((a, b) => a.name.localeCompare(b.name));
      callback(sorted);
    });
  },

  // Add new service type
  async addServiceType(name: string): Promise<string> {
    return dbService.addDoc(SERVICES_COLLECTION, {
      name,
      isActive: true
    });
  },

  // Update service type (active toggle or name edit)
  async updateServiceType(serviceId: string, data: Partial<ServiceType>): Promise<void> {
    return dbService.updateDoc(SERVICES_COLLECTION, serviceId, data);
  },

  // Delete service type
  async deleteServiceType(serviceId: string): Promise<void> {
    return dbService.deleteDoc(SERVICES_COLLECTION, serviceId);
  },

  // --- Dynamic Expense Categories ---
  
  // Subscribe to expense categories
  subscribeExpenseCategories(callback: (categories: ExpenseCategory[]) => void): () => void {
    return dbService.subscribe<ExpenseCategory>(CATEGORIES_COLLECTION, (categories) => {
      const sorted = [...categories].sort((a, b) => a.name.localeCompare(b.name));
      callback(sorted);
    });
  },

  // Add new expense category
  async addExpenseCategory(name: string, type: 'employee' | 'company' | 'both'): Promise<string> {
    return dbService.addDoc(CATEGORIES_COLLECTION, {
      name,
      type,
      isActive: true
    });
  },

  // Update expense category
  async updateExpenseCategory(categoryId: string, data: Partial<ExpenseCategory>): Promise<void> {
    return dbService.updateDoc(CATEGORIES_COLLECTION, categoryId, data);
  },

  // Delete expense category
  async deleteExpenseCategory(categoryId: string): Promise<void> {
    return dbService.deleteDoc(CATEGORIES_COLLECTION, categoryId);
  }
};
