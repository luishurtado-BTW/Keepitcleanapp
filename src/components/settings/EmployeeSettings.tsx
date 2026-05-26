import React, { useState } from 'react';
import { useEmployees } from '../../hooks/useEmployees';
import { Employee, EmployeeRole, EmployeeStatus } from '../../types/employee';
import { Input } from '../shared/Input';
import { Select } from '../shared/Select';
import { Button } from '../shared/Button';
import { Modal } from '../shared/Modal';
import { UserPlus, UserCheck, ShieldAlert, Edit, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';

export const EmployeeSettings: React.FC = () => {
  const { employees, addEmployee, updateEmployee, deactivateEmployee, isActionLoading } = useEmployees();

  // Modal / Form state
  const [isOpen, setIsOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [role, setRole] = useState<EmployeeRole>('Técnico');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<EmployeeStatus>('Activo');

  // Validations
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleOpenForm = (emp?: Employee) => {
    if (emp) {
      setEditingEmployee(emp);
      setName(emp.name);
      setRole(emp.role);
      setPhone(emp.phone);
      setStatus(emp.status);
    } else {
      setEditingEmployee(null);
      setName('');
      setRole('Técnico');
      setPhone('');
      setStatus('Activo');
    }
    setErrors({});
    setIsOpen(true);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(val);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!phone || phone.length < 10) newErrors.phone = 'El teléfono debe contener 10 dígitos';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const data = {
      name: name.trim(),
      role,
      phone,
      status
    };

    let result = false;
    if (editingEmployee) {
      result = await updateEmployee(editingEmployee.id, data);
    } else {
      result = await addEmployee(data);
    }

    if (result) {
      setIsOpen(false);
    }
  };

  const handleToggleStatus = async (emp: Employee) => {
    if (emp.status === 'Activo') {
      const confirmDeactivate = window.confirm(
        `¿Estás seguro de que deseas desactivar a ${emp.name}? No se podrá asignar a nuevas citas, pero se preservará su historial.`
      );
      if (confirmDeactivate) {
        await deactivateEmployee(emp.id, emp.name);
      }
    } else {
      await updateEmployee(emp.id, { status: 'Activo' });
    }
  };

  const roleLabels = {
    'Admin/Dueño': 'Administrador',
    'Secretaria': 'Secretaría',
    'Técnico': 'Técnico de Limpieza'
  };

  const roleStyles = {
    'Admin/Dueño': 'bg-purple-50 text-purple-600 border-purple-100',
    'Secretaria': 'bg-blue-50 text-blue-600 border-blue-100',
    'Técnico': 'bg-emerald-50 text-emerald-600 border-emerald-100'
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Directory Title and Button */}
      <div className="flex justify-between items-center px-1">
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
            Recursos Humanos
          </span>
          <h3 className="text-xs font-bold text-slate-800 mt-1">
            Catálogo de Empleados
          </h3>
        </div>
        <Button
          onClick={() => handleOpenForm()}
          size="sm"
          leftIcon={<UserPlus size={14} />}
          className="rounded-full py-1.5 px-3 text-[10px]"
        >
          Agregar Empleado
        </Button>
      </div>

      {/* Directory Grid */}
      <div className="flex flex-col gap-3">
        {employees.map((emp) => (
          <div
            key={emp.id}
            className={`
              bg-white border rounded-2xl p-4 shadow-premium flex items-center justify-between gap-4 transition-all
              ${emp.status === 'Activo' ? 'border-slate-100' : 'border-slate-200/60 opacity-65 bg-slate-50/50'}
            `}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className={`p-2.5 rounded-xl border flex-shrink-0 ${emp.status === 'Activo' ? 'bg-primary-50 text-primary-500 border-primary-100' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                <UserCheck size={18} />
              </div>
              
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800 truncate leading-tight">
                    {emp.name}
                  </span>
                  <span className={`px-2 py-0.5 rounded-md text-[8px] font-black border uppercase tracking-wider ${emp.status === 'Activo' ? 'bg-success-50 text-success-500 border-success-100' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                    {emp.status}
                  </span>
                </div>
                <span className="text-[9px] font-semibold text-slate-400 mt-1">
                  Tel: {emp.phone}
                </span>
                <span className={`mt-1.5 self-start px-2 py-0.5 rounded-lg text-[8px] font-bold border ${roleStyles[emp.role]}`}>
                  {roleLabels[emp.role]}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleOpenForm(emp)}
                className="p-2 rounded-xl text-slate-400 hover:text-primary-500 hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all"
                title="Editar empleado"
              >
                <Edit size={14} />
              </button>
              
              <button
                onClick={() => handleToggleStatus(emp)}
                className={`
                  p-2 rounded-xl border border-transparent hover:border-slate-100 transition-all
                  ${emp.status === 'Activo' 
                    ? 'text-slate-400 hover:text-danger-500 hover:bg-red-50/50' 
                    : 'text-slate-400 hover:text-success-600 hover:bg-emerald-50/50'
                  }
                `}
                title={emp.status === 'Activo' ? 'Desactivar empleado' : 'Activar empleado'}
              >
                {emp.status === 'Activo' ? <ToggleRight size={18} className="text-primary-500" /> : <ToggleLeft size={18} />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={editingEmployee ? 'Editar Empleado' : 'Registrar Nuevo Empleado'}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="text"
            label="Nombre Completo"
            placeholder="Ej. Carlos Mendoza"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            required
          />

          <Select
            label="Rol en la Empresa"
            options={[
              { value: 'Técnico', label: 'Técnico de Limpieza (Genera comisión)' },
              { value: 'Secretaria', label: 'Secretaría (Uso administrativo)' },
              { value: 'Admin/Dueño', label: 'Administrador / Dueño' }
            ]}
            value={role}
            onChange={(e) => setRole(e.target.value as EmployeeRole)}
            required
          />

          <Input
            type="tel"
            label="Teléfono de Contacto (10 dígitos)"
            placeholder="5512345678"
            value={phone}
            onChange={handlePhoneChange}
            error={errors.phone}
            required
          />

          {editingEmployee && (
            <Select
              label="Estado Laboral"
              options={[
                { value: 'Activo', label: 'Activo' },
                { value: 'Inactivo', label: 'Inactivo' }
              ]}
              value={status}
              onChange={(e) => setStatus(e.target.value as EmployeeStatus)}
              required
            />
          )}

          <div className="flex justify-end gap-3 mt-4">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} disabled={isActionLoading}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" isLoading={isActionLoading}>
              {editingEmployee ? 'Guardar Cambios' : 'Registrar Empleado'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EmployeeSettings;
