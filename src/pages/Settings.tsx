import React, { useState } from 'react';
import Header from '../components/layout/Header';
import CommissionSettings from '../components/settings/CommissionSettings';
import EmployeeSettings from '../components/settings/EmployeeSettings';
import ServiceSettings from '../components/settings/ServiceSettings';
import ExpenseCategorySettings from '../components/settings/ExpenseCategorySettings';
import Button from '../components/shared/Button';
import { useApp } from '../context/AppContext';
import { seedData } from '../services/seedData';
import { 
  Percent, 
  Users, 
  Sparkles, 
  Tag, 
  Database,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';

type SectionKey = 'commission' | 'employees' | 'services' | 'categories' | 'seed';

export const Settings: React.FC = () => {
  const { showToast } = useApp();
  const [expandedSection, setExpandedSection] = useState<SectionKey | null>('commission');
  const [isSeeding, setIsSeeding] = useState(false);

  const toggleSection = (section: SectionKey) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const handleSeedData = async () => {
    const confirmSeed = window.confirm(
      '¿Deseas reiniciar y sembrar datos de prueba? Esto restablecerá los empleados, citas y gastos para demostrar las funciones del panel.'
    );
    if (!confirmSeed) return;

    setIsSeeding(true);
    showToast('Iniciando carga de datos de prueba...', 'info');
    try {
      await seedData();
      showToast('¡Datos de prueba cargados con éxito! Recarga la app si es necesario.', 'success');
      // Briefly wait and reload page to reflect seeded changes
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error(err);
      showToast('Error al cargar los datos de prueba.', 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  const sections = [
    {
      key: 'commission' as SectionKey,
      title: 'Reparto de Ingresos y Comisiones',
      icon: <Percent size={18} className="text-primary-500" />,
      component: <CommissionSettings />,
      description: 'Porcentajes para empresa/técnicos y distribución equitativa o personalizada.'
    },
    {
      key: 'employees' as SectionKey,
      title: 'Gestión de Empleados',
      icon: <Users size={18} className="text-primary-500" />,
      component: <EmployeeSettings />,
      description: 'Administración de roles (Técnicos, Secretaria, Administrador) y estatus laboral.'
    },
    {
      key: 'services' as SectionKey,
      title: 'Tipos de Servicios Ofrecidos',
      icon: <Sparkles size={18} className="text-primary-500" />,
      component: <ServiceSettings />,
      description: 'Catálogo de limpiezas estándar (Lavado de Sillas, Salas, Colchones, etc.).'
    },
    {
      key: 'categories' as SectionKey,
      title: 'Categorías de Gastos',
      icon: <Tag size={18} className="text-primary-500" />,
      component: <ExpenseCategorySettings />,
      description: 'Administración de conceptos de egresos y definición de ámbitos.'
    },
    {
      key: 'seed' as SectionKey,
      title: 'Datos de Prueba y Demostración',
      icon: <Database size={18} className="text-primary-500" />,
      description: 'Restablece el almacenamiento y carga registros de demostración completos.',
      component: (
        <div className="flex flex-col gap-4 p-1">
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-2.5 text-[10px] font-bold text-amber-800 leading-relaxed">
            <AlertCircle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <span className="block font-black text-amber-900 mb-1">¡Acción destructiva!</span>
              Al sembrar datos se purgará todo el historial local actual y se configurará un escenario con técnicos ficticios (Juan Gómez, Pedro Ramos), citas en varios estados e historial de reembolsos.
            </div>
          </div>
          <Button
            onClick={handleSeedData}
            variant="danger"
            isLoading={isSeeding}
            className="w-full rounded-2xl py-3 text-xs font-bold"
          >
            Sembrar Datos de Demostración
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-6 p-4 md:p-0">
      <Header title="Configuración del Sistema" />

      {/* Accordion Layout */}
      <div className="flex flex-col gap-3.5">
        {sections.map((sec) => {
          const isExpanded = expandedSection === sec.key;
          return (
            <div
              key={sec.key}
              className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-premium transition-all duration-200"
            >
              {/* Accordion Header */}
              <button
                type="button"
                onClick={() => toggleSection(sec.key)}
                className="w-full flex items-center justify-between p-5 text-left active:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    {sec.icon}
                  </div>
                  <div className="flex flex-col min-w-0 leading-tight">
                    <span className="text-xs font-black text-slate-800 truncate">
                      {sec.title}
                    </span>
                    <span className="text-[9px] font-semibold text-slate-400 mt-1 truncate">
                      {sec.description}
                    </span>
                  </div>
                </div>

                <div className="text-slate-400 flex-shrink-0">
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </button>

              {/* Accordion Content */}
              {isExpanded && (
                <div className="px-5 pb-6 border-t border-slate-50 pt-5 animate-slide-down">
                  {sec.component}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Settings;
