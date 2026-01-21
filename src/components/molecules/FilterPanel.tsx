import React from 'react';
import Button from '../atoms/Button';
import Input from '../atoms/Input';

interface FilterPanelProps {
  filters: {
    dateRange: [Date | null, Date | null];
    metrics: string[];
    categories: string[];
  };
  onFilterChange: (filters: any) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Filtros de Datos</h3>
        <Button
          variant="outline"
          onClick={() => onFilterChange({
            dateRange: [null, null],
            metrics: [],
            categories: []
          })}
          className="text-sm dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Limpiar Filtros
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Rango de Fechas
          </label>
          <div className="space-y-2">
            <Input
              type="date"
              value={filters.dateRange[0]?.toISOString().split('T')[0] || ''}
              onChange={(e) => onFilterChange({
                ...filters,
                dateRange: [e.target.valueAsDate, filters.dateRange[1]]
              })}
              className="w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:border-blue-500 focus:ring-blue-500 text-sm"
              placeholder="Fecha inicial"
            />
            <div className="text-center text-gray-500 dark:text-gray-400 text-xs sm:text-sm">a</div>
            <Input
              type="date"
              value={filters.dateRange[1]?.toISOString().split('T')[0] || ''}
              onChange={(e) => onFilterChange({
                ...filters,
                dateRange: [filters.dateRange[0], e.target.valueAsDate]
              })}
              className="w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:border-blue-500 focus:ring-blue-500 text-sm"
              placeholder="Fecha final"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Métricas
          </label>
          <select
            multiple
            value={filters.metrics}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
              onFilterChange({ ...filters, metrics: selected });
            }}
            className="w-full h-24 sm:h-32 rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-sm"
          >
            <option value="revenue" className="dark:bg-gray-700 dark:hover:bg-gray-600">Ingresos</option>
            <option value="users" className="dark:bg-gray-700 dark:hover:bg-gray-600">Usuarios</option>
            <option value="conversion" className="dark:bg-gray-700 dark:hover:bg-gray-600">Conversión</option>
            <option value="sessions" className="dark:bg-gray-700 dark:hover:bg-gray-600">Sesiones</option>
            <option value="bounce" className="dark:bg-gray-700 dark:hover:bg-gray-600">Rebote</option>
          </select>
          <p className="text-xs text-gray-500 dark:text-gray-400">Mantén Ctrl para seleccionar múltiples</p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Categorías
          </label>
          <select
            multiple
            value={filters.categories}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
              onFilterChange({ ...filters, categories: selected });
            }}
            className="w-full h-24 sm:h-32 rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-sm"
          >
            <option value="marketing" className="dark:bg-gray-700 dark:hover:bg-gray-600">Marketing</option>
            <option value="sales" className="dark:bg-gray-700 dark:hover:bg-gray-600">Ventas</option>
            <option value="support" className="dark:bg-gray-700 dark:hover:bg-gray-600">Soporte</option>
            <option value="operations" className="dark:bg-gray-700 dark:hover:bg-gray-600">Operaciones</option>
            <option value="development" className="dark:bg-gray-700 dark:hover:bg-gray-600">Desarrollo</option>
          </select>
          <p className="text-xs text-gray-500 dark:text-gray-400">Mantén Ctrl para seleccionar múltiples</p>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;