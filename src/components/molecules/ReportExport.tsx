import React, { useState } from 'react';

interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv';
  includeCharts: boolean;
  includeTables: boolean;
  dateRange: [Date | null, Date | null];
}

interface ReportExportProps {
  data: any;
  title: string;
  onClose: () => void;
  onExport: (options: ExportOptions) => void;
}

const ReportExport: React.FC<ReportExportProps> = ({ data, title, onClose, onExport }) => {
  const [options, setOptions] = useState<ExportOptions>({
    format: 'pdf',
    includeCharts: true,
    includeTables: true,
    dateRange: [null, null],
  });

  const handleChange = (field: keyof ExportOptions, value: any) => {
    setOptions(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleExport = () => {
    onExport(options);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Exportar Reporte: {title}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Formato de exportación
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['pdf', 'excel', 'csv'] as const).map(format => (
                <button
                  key={format}
                  type="button"
                  className={`py-2 px-3 rounded-md text-sm font-medium ${
                    options.format === format
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  onClick={() => handleChange('format', format)}
                >
                  {format.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contenido a incluir
            </label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  id="includeCharts"
                  type="checkbox"
                  checked={options.includeCharts}
                  onChange={(e) => handleChange('includeCharts', e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="includeCharts" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Incluir gráficos
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="includeTables"
                  type="checkbox"
                  checked={options.includeTables}
                  onChange={(e) => handleChange('includeTables', e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="includeTables" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Incluir tablas
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Exportar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportExport;