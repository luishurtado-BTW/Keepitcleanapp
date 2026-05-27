import React, { useState, useEffect } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { useEmployees } from '../../hooks/useEmployees';
import { Input } from '../shared/Input';
import { Select } from '../shared/Select';
import { Button } from '../shared/Button';
import { ShieldAlert, CheckCircle, Percent } from 'lucide-react';

export const CommissionSettings: React.FC = () => {
  const { settings, updateSettings, isActionLoading } = useSettings();
  const { activeEmployees } = useEmployees();

  // Core splits
  const [companyPct, setCompanyPct] = useState('30');
  const [employeesPct, setEmployeesPct] = useState('70');
  
  // Mode
  const [distributionMode, setDistributionMode] = useState<'equal' | 'custom'>('equal');
  
  // Custom allocations
  const [customPctAllocations, setCustomPctAllocations] = useState<Record<string, string>>({});

  useEffect(() => {
    if (settings) {
      setCompanyPct(String(settings.companyPercentage));
      setEmployeesPct(String(settings.employeesPercentage));
      setDistributionMode(settings.distributionMode);
      
      // Load custom allocations and convert to string
      const allocations: Record<string, string> = {};
      activeEmployees.forEach(e => {
        allocations[e.id] = String(settings.customDistribution[e.id] || 0);
      });
      setCustomPctAllocations(allocations);
    }
  }, [settings, activeEmployees]);

  // Adjust remaining split percentage when one changes
  const handleCompanyPctChange = (val: string) => {
    const num = Number(val);
    if (isNaN(num) || num < 0 || num > 100) return;
    setCompanyPct(val);
    setEmployeesPct(String(100 - num));
  };

  const handleEmployeesPctChange = (val: string) => {
    const num = Number(val);
    if (isNaN(num) || num < 0 || num > 100) return;
    setEmployeesPct(val);
    setCompanyPct(String(100 - num));
  };

  const handleCustomAllocChange = (techId: string, val: string) => {
    const num = Number(val);
    if (isNaN(num) || num < 0 || num > 100) return;
    setCustomPctAllocations(prev => ({
      ...prev,
      [techId]: val
    }));
  };

  // Perform sum verification for custom allocation
  const customSum = Object.values(customPctAllocations).reduce(
    (sum, val) => sum + (Number(val) || 0), 
    0
  );

  const isCustomAllocValid = distributionMode === 'equal' || customSum === 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCustomAllocValid) return;

    // Convert custom allocations to number record
    const finalCustomDist: Record<string, number> = {};
    activeEmployees.forEach(e => {
      finalCustomDist[e.id] = Number(customPctAllocations[e.id]) || 0;
    });

    await updateSettings({
      companyPercentage: Number(companyPct),
      employeesPercentage: Number(employeesPct),
      distributionMode,
      customDistribution: finalCustomDist
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col px-1">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
          Finanzas y Parámetros
        </span>
        <h3 className="text-xs font-bold text-slate-800 mt-1">
          Porcentajes y Reparto de Ingresos
        </h3>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-premium flex flex-col gap-4">
        {/* 1. Global Splits (Company vs Employees) */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="number"
            label="Parte Empresa (%)"
            min="0"
            max="100"
            value={companyPct}
            onChange={(e) => handleCompanyPctChange(e.target.value)}
            required
          />
          <Input
            type="number"
            label="Parte Colaboradores (%)"
            min="0"
            max="100"
            value={employeesPct}
            onChange={(e) => handleEmployeesPctChange(e.target.value)}
            required
          />
        </div>

        {/* 2. Mode Selector */}
        <Select
          label="Modo de Reparto entre Colaboradores"
          options={[
            { value: 'equal', label: 'Reparto Equitativo (Igual entre activos)' },
            { value: 'custom', label: 'Porcentajes Personalizados (Por colaborador)' }
          ]}
          value={distributionMode}
          onChange={(e) => setDistributionMode(e.target.value as 'equal' | 'custom')}
          required
        />

        {/* 3. Custom Allocations inputs */}
        {distributionMode === 'custom' && (
          <div className="flex flex-col gap-3.5 mt-2 border-t border-slate-50 pt-4 animate-slide-down">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Asignación por Colaborador (Debe sumar 100%)
            </span>
            
            <div className="flex flex-col gap-3">
              {activeEmployees.map(t => (
                <div key={t.id} className="flex items-center gap-4 justify-between bg-slate-50 border border-slate-100 rounded-xl px-4 py-1.5">
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-600 truncate">{t.name}</span>
                    <span className="text-[8px] font-semibold text-slate-400 leading-none mt-0.5">{t.role}</span>
                  </div>
                  <div className="w-24 flex-shrink-0">
                    <Input
                      type="number"
                      placeholder="0"
                      min="0"
                      max="100"
                      value={customPctAllocations[t.id] || '0'}
                      onChange={(e) => handleCustomAllocChange(t.id, e.target.value)}
                      className="px-2.5 py-1.5 text-center text-xs"
                      required
                    />
                  </div>
                </div>
              ))}
              {activeEmployees.length === 0 && (
                <span className="text-[9px] font-semibold text-slate-400 text-center py-2">
                  No hay empleados activos registrados. Agrégalos arriba.
                </span>
              )}
            </div>

            {/* Sum validation warning badge */}
            <div className={`
              mt-2 p-3.5 rounded-2xl border flex items-start gap-2.5 text-[10px] font-bold leading-normal transition-all
              ${isCustomAllocValid 
                ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
                : 'bg-red-50 border-red-100 text-red-800'
              }
            `}>
              <div className="flex-shrink-0 mt-0.5">
                {isCustomAllocValid ? <CheckCircle size={15} className="text-emerald-500" /> : <ShieldAlert size={15} className="text-danger-500" />}
              </div>
              <div className="flex-1">
                <span>Total asignado: <strong className="font-extrabold text-xs">{customSum}%</strong></span>
                {!isCustomAllocValid && (
                  <span className="block font-medium mt-1">
                    El porcentaje total debe ser exactamente igual a 100% de la parte de los empleados. Faltan o sobran {Math.abs(100 - customSum)}%.
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 4. Save splits */}
        <Button
          type="submit"
          variant="primary"
          isLoading={isActionLoading}
          disabled={!isCustomAllocValid || activeEmployees.length === 0}
          className="w-full mt-2 rounded-2xl py-3 font-bold"
        >
          Guardar Configuración de Reparto
        </Button>
      </div>
    </form>
  );
};

export default CommissionSettings;
