import React, { useState } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { Input } from '../shared/Input';
import { Button } from '../shared/Button';
import { Sparkles, Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

export const ServiceSettings: React.FC = () => {
  const { serviceTypes, addServiceType, updateServiceType, deleteServiceType, isActionLoading } = useSettings();
  
  const [newServiceName, setNewServiceName] = useState('');
  const [error, setError] = useState('');

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!newServiceName.trim()) {
      setError('El nombre del servicio es obligatorio');
      return;
    }

    const success = await addServiceType(newServiceName.trim());
    if (success) {
      setNewServiceName('');
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    await updateServiceType(id, { isActive: !currentStatus });
  };

  const handleDeleteService = async (id: string, name: string) => {
    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar el tipo de servicio "${name}"? Esto no afectará las citas ya registradas.`
    );
    if (confirmDelete) {
      await deleteServiceType(id);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col px-1">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
          Catálogos Comerciales
        </span>
        <h3 className="text-xs font-bold text-slate-800 mt-1">
          Tipos de Servicios Ofrecidos
        </h3>
      </div>

      {/* Inline Create Form */}
      <form onSubmit={handleAddService} className="flex gap-2.5 items-end bg-white border border-slate-100 rounded-2xl p-4 shadow-premium">
        <div className="flex-1">
          <Input
            type="text"
            label="Nuevo Tipo de Servicio"
            placeholder="Ej. Lavado de Vestiduras de Autos"
            value={newServiceName}
            onChange={(e) => setNewServiceName(e.target.value)}
            error={error}
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          isLoading={isActionLoading}
          leftIcon={<Plus size={14} />}
          className="h-[46px] rounded-xl px-4 flex-shrink-0"
        >
          Agregar
        </Button>
      </form>

      {/* Services List */}
      <div className="flex flex-col gap-2.5">
        {serviceTypes.map((service) => (
          <div
            key={service.id}
            className={`
              bg-white border rounded-2xl px-4 py-3 flex items-center justify-between gap-4 transition-all
              ${service.isActive ? 'border-slate-100' : 'border-slate-200/60 opacity-60 bg-slate-50/50'}
            `}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Sparkles size={14} className={service.isActive ? 'text-primary-500 flex-shrink-0' : 'text-slate-400 flex-shrink-0'} />
              <span className="text-xs font-bold text-slate-700 truncate leading-tight">
                {service.name}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                type="button"
                onClick={() => handleToggleActive(service.id, service.isActive)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-primary-500 hover:bg-slate-50 transition-colors"
                title={service.isActive ? 'Desactivar servicio' : 'Activar servicio'}
              >
                {service.isActive ? <ToggleRight size={18} className="text-primary-500" /> : <ToggleLeft size={18} />}
              </button>
              <button
                type="button"
                onClick={() => handleDeleteService(service.id, service.name)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-danger-500 hover:bg-slate-50 transition-colors"
                title="Eliminar servicio"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceSettings;
