import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useAppointments } from '../../hooks/useAppointments';
import { Appointment, AppointmentStatus } from '../../types/appointment';
import { Input } from '../shared/Input';
import { Select } from '../shared/Select';
import { Button } from '../shared/Button';

interface AppointmentFormProps {
  appointment?: Appointment;
  initialDate?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({
  appointment,
  initialDate,
  onSuccess,
  onCancel
}) => {
  const { activeEmployees, activeServiceTypes } = useApp();
  const { addAppointment, updateAppointment, isActionLoading } = useAppointments();

  // Form Fields State
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00');
  const [serviceType, setServiceType] = useState('');
  const [customServiceType, setCustomServiceType] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientName, setClientName] = useState('');
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [withTeflon, setWithTeflon] = useState(false);
  const [notes, setNotes] = useState('');
  const [assignedEmployee, setAssignedEmployee] = useState('');
  const [status, setStatus] = useState<AppointmentStatus>('Pendiente');

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Set default date or pre-fill
    if (appointment) {
      setDate(appointment.date);
      setTime(appointment.time);
      setClientPhone(appointment.clientPhone);
      setClientName(appointment.clientName || '');
      setAddress(appointment.address);
      setAmount(String(appointment.amount));
      setWithTeflon(appointment.withTeflon);
      setNotes(appointment.notes || '');
      setAssignedEmployee(appointment.assignedEmployee || '');
      setStatus(appointment.status);

      // Check if service type is custom or standard
      const isStandard = activeServiceTypes.some((s) => s.name === appointment.serviceType);
      if (isStandard || appointment.serviceType === '') {
        setServiceType(appointment.serviceType);
      } else {
        setServiceType('Otro');
        setCustomServiceType(appointment.serviceType);
      }
    } else {
      setDate(initialDate || new Date().toISOString().split('T')[0]);
      if (activeServiceTypes.length > 0) {
        setServiceType(activeServiceTypes[0].name);
      }
    }
  }, [appointment, initialDate, activeServiceTypes]);

  // Clean client phone numeric input only
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setClientPhone(val);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!date) newErrors.date = 'La fecha es obligatoria';
    if (!time) newErrors.time = 'La hora es obligatoria';
    if (!serviceType) newErrors.serviceType = 'El tipo de servicio es obligatorio';
    if (serviceType === 'Otro' && !customServiceType.trim()) {
      newErrors.customServiceType = 'Por favor especifica el tipo de servicio';
    }
    if (!clientPhone || clientPhone.length < 10) {
      newErrors.clientPhone = 'El teléfono debe contener 10 dígitos';
    }
    if (!address.trim()) newErrors.address = 'La dirección del servicio es obligatoria';
    if (!amount || Number(amount) <= 0) {
      newErrors.amount = 'El monto debe ser un valor positivo';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const finalServiceType = serviceType === 'Otro' ? customServiceType.trim() : serviceType;
    const data = {
      date,
      time,
      serviceType: finalServiceType,
      clientPhone,
      clientName: clientName.trim() || undefined,
      address: address.trim(),
      amount: Number(amount),
      withTeflon,
      notes: notes.trim() || undefined,
      assignedEmployee: assignedEmployee || undefined,
      status
    };

    let result = false;
    if (appointment) {
      result = await updateAppointment(appointment.id, data);
    } else {
      const newId = await addAppointment(data);
      result = !!newId;
    }

    if (result) {
      onSuccess();
    }
  };

  // Compile Service Options list
  const serviceOptions = [
    ...activeServiceTypes.map(s => ({ value: s.name, label: s.name })),
    { value: 'Otro', label: 'Otro (Especificar)' }
  ];

  // Compile Employee dropdown list
  const employeeOptions = [
    { value: '', label: 'Sin Asignar / En espera' },
    ...activeEmployees.map(t => ({ value: t.id, label: `${t.name} (${t.role})` }))
  ];

  // Compile Status Options
  const statusOptions: Array<{ value: AppointmentStatus; label: string }> = [
    { value: 'Pendiente', label: 'Pendiente' },
    { value: 'Confirmada', label: 'Confirmada' },
    { value: 'Completada', label: 'Completada' },
    { value: 'Cancelada', label: 'Cancelada' }
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Date & Time Picker */}
      <div className="grid grid-cols-2 gap-3">
        <Input
          type="date"
          label="Fecha del Servicio"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          error={errors.date}
          required
        />
        <Input
          type="time"
          label="Hora"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          error={errors.time}
          required
        />
      </div>

      {/* Service Type Select */}
      <Select
        label="Tipo de Servicio"
        options={serviceOptions}
        value={serviceType}
        onChange={(e) => setServiceType(e.target.value)}
        error={errors.serviceType}
        required
      />

      {/* Custom Service type input */}
      {serviceType === 'Otro' && (
        <Input
          type="text"
          label="Especificar tipo de servicio"
          placeholder="Ej. Lavado de Vestiduras"
          value={customServiceType}
          onChange={(e) => setCustomServiceType(e.target.value)}
          error={errors.customServiceType}
          required
        />
      )}

      {/* Client Phone & Optional Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          type="tel"
          label="Teléfono del Cliente (10 dígitos)"
          placeholder="5512345678"
          value={clientPhone}
          onChange={handlePhoneChange}
          error={errors.clientPhone}
          required
        />
        <Input
          type="text"
          label="Nombre del Cliente (Opcional)"
          placeholder="Ej. Juan Pérez"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
        />
      </div>

      {/* Address */}
      <Input
        type="text"
        label="Dirección del Servicio"
        placeholder="Calle, Número, Colonia, Alcaldía"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        error={errors.address}
        required
      />

      {/* Amount & Teflon Toggle */}
      <div className="grid grid-cols-2 gap-4 items-end">
        <Input
          type="number"
          label="Monto del Servicio (MXN)"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          error={errors.amount}
          required
        />
        
        {/* Yes/No Toggle for Teflon */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-slate-600 px-0.5">
            ¿Incluye Teflón?
          </span>
          <div className="flex bg-slate-50 border border-slate-200 rounded-xl p-1 h-[46px]">
            <button
              type="button"
              onClick={() => setWithTeflon(true)}
              className={`
                flex-1 rounded-lg text-xs font-bold transition-all duration-150
                ${withTeflon ? 'bg-primary-500 text-white shadow-sm' : 'text-slate-500'}
              `}
            >
              Sí
            </button>
            <button
              type="button"
              onClick={() => setWithTeflon(false)}
              className={`
                flex-1 rounded-lg text-xs font-bold transition-all duration-150
                ${!withTeflon ? 'bg-slate-200 text-slate-700 shadow-sm' : 'text-slate-500'}
              `}
            >
              No
            </button>
          </div>
        </div>
      </div>

      {/* Employee assignment & Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Select
          label="Colaborador Asignado (Opcional)"
          options={employeeOptions}
          value={assignedEmployee}
          onChange={(e) => setAssignedEmployee(e.target.value)}
        />
        <Select
          label="Estado de la Cita"
          options={statusOptions}
          value={status}
          onChange={(e) => setStatus(e.target.value as AppointmentStatus)}
          required
        />
      </div>

      {/* Notes */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-600 px-0.5">
          Notas adicionales (Opcional)
        </label>
        <textarea
          className="w-full px-4 py-3 rounded-xl border bg-slate-50 border-slate-200 text-sm text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-400 h-20 resize-none"
          placeholder="Detalles específicos del sillón, manchas, accesos..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-3 mt-4">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isActionLoading}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" isLoading={isActionLoading}>
          {appointment ? 'Guardar Cambios' : 'Agendar Cita'}
        </Button>
      </div>
    </form>
  );
};

export default AppointmentForm;
