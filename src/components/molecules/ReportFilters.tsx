import React from 'react';

interface ReportFiltersProps {
  filters: {
    dateRange: [Date | null, Date | null];
    reportType: string;
    metrics: string[];
    categories: string[];
  };
  onFilterChange: (filters: any) => void;
  onApplyFilters?: () => void;
  onExport?: () => void;
}

const ReportFilters: React.FC<ReportFiltersProps> = ({ filters, onFilterChange, onApplyFilters, onExport }) => {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newDates = [...filters.dateRange] as [Date | null, Date | null];
    if (index === 0) {
      newDates[0] = e.target.value ? new Date(e.target.value) : null;
    } else {
      newDates[1] = e.target.value ? new Date(e.target.value) : null;
    }
    onFilterChange({
      ...filters,
      dateRange: newDates
    });
  };

  const handleReportTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      reportType: e.target.value
    });
  };

  const handleMetricsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    onFilterChange({
      ...filters,
      metrics: selectedOptions
    });
  };

  const handleCategoriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    onFilterChange({
      ...filters,
      categories: selectedOptions
    });
  };

  const handleReset = () => {
    onFilterChange({
      dateRange: [null, null],
      reportType: '',
      metrics: [],
      categories: []
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Fecha Inicio
          </label>
          <input
            type="date"
            value={filters.dateRange[0]?.toISOString().split('T')[0] || ''}
            onChange={(e) => handleDateChange(e, 0)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Fecha Fin
          </label>
          <input
            type="date"
            value={filters.dateRange[1]?.toISOString().split('T')[0] || ''}
            onChange={(e) => handleDateChange(e, 1)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tipo de Reporte
          </label>
          <select
            value={filters.reportType}
            onChange={handleReportTypeChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Todos</option>
            <option value="revenue">Ingresos</option>
            <option value="users">Usuarios</option>
            <option value="conversion">Conversión</option>
            <option value="performance">Rendimiento</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Métricas
          </label>
          <select
            multiple
            value={filters.metrics}
            onChange={handleMetricsChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white h-32"
          >
            <option value="revenue">Ingresos</option>
            <option value="users">Usuarios</option>
            <option value="conversion">Tasa de Conversión</option>
            <option value="sessions">Sesiones</option>
            <option value="pageViews">Vistas de Página</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Categorías
          </label>
          <select
            multiple
            value={filters.categories}
            onChange={handleCategoriesChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white h-32"
          >
            <option value="productA">Producto A</option>
            <option value="productB">Producto B</option>
            <option value="productC">Producto C</option>
            <option value="region">Región</option>
            <option value="channel">Canal</option>
          </select>
        </div>

        <div className="flex items-end space-x-3">
          <button
            onClick={handleReset}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Limpiar Filtros
          </button>
          <button
            onClick={onApplyFilters}
            className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Aplicar Filtros
          </button>
          <button
            onClick={onExport}
            className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Exportar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportFilters;