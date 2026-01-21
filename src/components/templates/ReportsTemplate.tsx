import React, { useState } from 'react';
import Header from '../organisms/Header';
import Sidebar from '../organisms/Sidebar';
import ReportFilters from '../molecules/ReportFilters';
import ReportGrid from '../organisms/ReportGrid';

const ReportsTemplate: React.FC = () => {
  const [filters, setFilters] = useState({
    dateRange: [null as Date | null, null as Date | null],
    reportType: '' as string,
    metrics: [] as string[],
    categories: [] as string[],
  });

  const handleApplyFilters = () => {
    // Aquí iría la lógica para aplicar los filtros
    // Por ejemplo, podríamos actualizar los datos del reporte
    console.log('Aplicando filtros:', filters);
  };

  const handleExport = () => {
    // Lógica para exportar el reporte
    console.log('Exportando reporte con filtros:', filters);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 flex flex-col w-full">
        <Header title="Reportes" userName="Usuario" />
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
          <div className="mb-4 sm:mb-6">
            <ReportFilters
              filters={filters}
              onFilterChange={setFilters}
              onApplyFilters={handleApplyFilters}
              onExport={handleExport}
            />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 sm:p-4">
            <ReportGrid filters={filters} />
          </div>
        </main>
        <footer className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-3 text-center text-xs sm:text-sm">
          <div className="max-w-7xl mx-auto">
            <p>Última actualización: {new Date().toLocaleString()} | Versión 1.0.0</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ReportsTemplate;