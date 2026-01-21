import React, { useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import TimeSeriesChart from '../molecules/TimeSeriesChart';
import StackedBarChart from '../molecules/StackedBarChart';
import HeatmapChart from '../molecules/HeatmapChart';
import ReportTable from '../organisms/ReportTable';
import ReportExport from '../molecules/ReportExport';
import { useReportExport } from '../../hooks/useReportExport';
import { DashboardData } from '../../utils/validation';

const GridLayout = WidthProvider(Responsive);

interface ReportGridProps {
  filters: {
    dateRange: [Date | null, Date | null];
    reportType: string;
    metrics: string[];
    categories: string[];
  };
}

const ReportGrid: React.FC<ReportGridProps> = ({ filters }) => {
  // Simular datos de reporte usando los mismos tipos que el dashboard
  const mockReportData: DashboardData = {
    timeSeries: [
      { date: '2023-01-01', revenue: 4000, users: 2400, conversion: 24 },
      { date: '2023-01-02', revenue: 3000, users: 1398, conversion: 22 },
      { date: '2023-01-03', revenue: 2000, users: 9800, conversion: 20 },
      { date: '2023-01-04', revenue: 2780, users: 3908, conversion: 18 },
      { date: '2023-01-05', revenue: 1890, users: 4800, conversion: 16 },
      { date: '2023-01-06', revenue: 2390, users: 3800, conversion: 14 },
      { date: '2023-01-07', revenue: 3490, users: 4300, conversion: 12 },
    ],
    barData: [
      { name: 'Ene', revenue: 4000, users: 2400, conversion: 24 },
      { name: 'Feb', revenue: 3000, users: 1398, conversion: 22 },
      { name: 'Mar', revenue: 2000, users: 9800, conversion: 20 },
      { name: 'Abr', revenue: 2780, users: 3908, conversion: 18 },
      { name: 'May', revenue: 1890, users: 4800, conversion: 16 },
    ],
    heatmapData: [
      { x: '00-04', y: 'Producto A', value: 10 },
      { x: '04-08', y: 'Producto A', value: 20 },
      { x: '08-12', y: 'Producto A', value: 30 },
      { x: '12-16', y: 'Producto A', value: 40 },
      { x: '16-20', y: 'Producto A', value: 50 },
      { x: '20-24', y: 'Producto A', value: 60 },
      { x: '00-04', y: 'Producto B', value: 15 },
      { x: '04-08', y: 'Producto B', value: 25 },
      { x: '08-12', y: 'Producto B', value: 35 },
      { x: '12-16', y: 'Producto B', value: 45 },
      { x: '16-20', y: 'Producto B', value: 55 },
      { x: '20-24', y: 'Producto B', value: 65 },
    ]
  };

  const { showExportModal, setShowExportModal, exportReport } = useReportExport();
  const [exportTitle, setExportTitle] = useState('Reporte General');

  const handleExport = (options: any) => {
    exportReport(mockReportData.timeSeries, exportTitle, options);
  };

  // Definir el layout para el reporte
  const [layout, setLayout] = React.useState<any[]>([
    { i: 'timeSeries', x: 0, y: 0, w: 6, h: 8 },
    { i: 'stackedBar', x: 6, y: 0, w: 6, h: 8 },
    { i: 'heatmap', x: 0, y: 8, w: 12, h: 8 },
    { i: 'reportTable', x: 0, y: 16, w: 12, h: 10 },
  ]);

  // Filtrar métricas según las seleccionadas
  const filteredMetrics = filters.metrics.length > 0 ? filters.metrics : ['revenue', 'users', 'conversion'];

  return (
    <div className="report-grid w-full">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Reporte General</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {filters.dateRange[0] && filters.dateRange[1]
              ? `Periodo: ${filters.dateRange[0]?.toDateString()} - ${filters.dateRange[1]?.toDateString()}`
              : 'Seleccione un periodo'}
            {filters.reportType && ` | Tipo: ${filters.reportType}`}
            {filters.categories.length > 0 && ` | Categorías: ${filters.categories.join(', ')}`}
          </p>
        </div>
        <button
          onClick={() => setShowExportModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
        >
          Exportar Reporte
        </button>
      </div>

      {/* Modal de exportación */}
      {showExportModal && (
        <ReportExport
          data={mockReportData}
          title={exportTitle}
          onClose={() => setShowExportModal(false)}
          onExport={handleExport}
        />
      )}

      <GridLayout
        className="layout w-full"
        layouts={{
          lg: layout,
          md: [
            { i: 'timeSeries', x: 0, y: 0, w: 6, h: 8 },
            { i: 'stackedBar', x: 6, y: 0, w: 6, h: 8 },
            { i: 'heatmap', x: 0, y: 8, w: 12, h: 8 },
            { i: 'reportTable', x: 0, y: 16, w: 12, h: 10 },
          ],
          sm: [
            { i: 'timeSeries', x: 0, y: 0, w: 4, h: 8 },
            { i: 'stackedBar', x: 0, y: 8, w: 4, h: 8 },
            { i: 'heatmap', x: 0, y: 16, w: 4, h: 8 },
            { i: 'reportTable', x: 0, y: 24, w: 4, h: 10 },
          ],
          xs: [
            { i: 'timeSeries', x: 0, y: 0, w: 2, h: 8 },
            { i: 'stackedBar', x: 0, y: 8, w: 2, h: 8 },
            { i: 'heatmap', x: 0, y: 16, w: 2, h: 8 },
            { i: 'reportTable', x: 0, y: 24, w: 2, h: 10 },
          ],
          xxs: [
            { i: 'timeSeries', x: 0, y: 0, w: 1, h: 8 },
            { i: 'stackedBar', x: 0, y: 8, w: 1, h: 8 },
            { i: 'heatmap', x: 0, y: 16, w: 1, h: 8 },
            { i: 'reportTable', x: 0, y: 24, w: 1, h: 10 },
          ]
        }}
        onLayoutChange={(newLayout) => setLayout(newLayout)}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 12, sm: 4, xs: 2, xxs: 1 }}
        rowHeight={60}
        isDraggable={true}
        isResizable={true}
        margin={[16, 16]}
        containerPadding={[8, 8]}
      >
        <div key="timeSeries" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Evolución Temporal</h3>
          </div>
          <TimeSeriesChart
            data={mockReportData.timeSeries}
            metrics={filteredMetrics}
          />
        </div>

        <div key="stackedBar" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Comparativa Mensual</h3>
          </div>
          <StackedBarChart
            data={mockReportData.barData}
            categories={filters.categories.length > 0 ? filters.categories : ['revenue', 'users', 'conversion']}
          />
        </div>

        <div key="heatmap" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Distribución de Actividad</h3>
          </div>
          <HeatmapChart
            data={mockReportData.heatmapData}
          />
        </div>

        <div key="reportTable" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Datos Detallados</h3>
          </div>
          <ReportTable
            data={mockReportData.timeSeries}
            metrics={filteredMetrics}
          />
        </div>
      </GridLayout>
    </div>
  );
};

export default ReportGrid;