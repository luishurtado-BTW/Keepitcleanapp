/**
 * Formats a Date object or string (YYYY-MM-DD) into DD/MM/YYYY.
 * @param dateInput Date object, ISO date string, or YYYY-MM-DD string
 */
export const formatDate = (dateInput: Date | string): string => {
  if (!dateInput) return '';
  
  if (typeof dateInput === 'string') {
    // If it's already YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
      const [year, month, day] = dateInput.split('-');
      return `${day}/${month}/${year}`;
    }
    
    // Attempt to parse other strings
    const parsed = new Date(dateInput);
    if (isNaN(parsed.getTime())) return dateInput;
    dateInput = parsed;
  }
  
  const day = String(dateInput.getDate()).padStart(2, '0');
  const month = String(dateInput.getMonth() + 1).padStart(2, '0');
  const year = dateInput.getFullYear();
  
  return `${day}/${month}/${year}`;
};

/**
 * Returns a human-readable date in Spanish, e.g., "21 de Mayo de 2026"
 * @param dateStr Date string in YYYY-MM-DD format
 */
export const formatHumanDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  // Create date using local timezone to avoid UTC shifts
  const date = new Date(year, month - 1, day);
  
  return date.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

/**
 * Formats a date string to Spanish month and year, e.g., "Mayo 2026"
 * @param yearMonthStr Format "YYYY-MM"
 */
export const formatMonthYear = (yearMonthStr: string): string => {
  if (!yearMonthStr) return '';
  const [year, month] = yearMonthStr.split('-').map(Number);
  const date = new Date(year, month - 1, 1);
  const monthName = date.toLocaleDateString('es-MX', { month: 'long' });
  return `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`;
};

/**
 * Helper to get Spanish month names
 */
export const getSpanishMonths = () => {
  return [
    { value: '01', label: 'Enero' },
    { value: '02', label: 'Febrero' },
    { value: '03', label: 'Marzo' },
    { value: '04', label: 'Abril' },
    { value: '05', label: 'Mayo' },
    { value: '06', label: 'Junio' },
    { value: '07', label: 'Julio' },
    { value: '08', label: 'Agosto' },
    { value: '09', label: 'Septiembre' },
    { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' },
    { value: '12', label: 'Diciembre' }
  ];
};
