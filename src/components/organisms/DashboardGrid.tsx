import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import TimeSeriesChart from '../molecules/TimeSeriesChart';
import StackedBarChart from '../molecules/StackedBarChart';
import HeatmapChart from '../molecules/HeatmapChart';
import { useQuery } from '@tanstack/react-query';
import { fetchData } from '../../services/api';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useUI } from '../../store/uiStore';
import { DashboardData, timeSeriesDataSchema, barDataSchema, heatmapDataSchema, dashboardDataSchema } from '../../utils/validation';
import z from 'zod';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const GridLayout = WidthProvider(Responsive);

interface DashboardGridProps {
  filters: {
    dateRange: [Date | null, Date | null];
    metrics: string[];
    categories: string[];
  };
}

const DashboardGrid: React.FC<DashboardGridProps> = ({ filters }) => {
  const { state } = useUI();
  const [layout, setLayout] = useState<any[]>([
    { i: 'timeSeries', x: 0, y: 0, w: 6, h: 8 },
    { i: 'stackedBar', x: 6, y: 0, w: 6, h: 8 },
    { i: 'heatmap', x: 0, y: 8, w: 12, h: 8 },
  ]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard-data', filters],
    queryFn: () => fetchData({ startDate: filters.dateRange[0], endDate: filters.dateRange[1] }),
  });

  // Use WebSocket for real-time updates
  // Usamos una URL configurable o simulada si no hay servidor
  const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8080';
  const { data: socketData, isConnected, error: wsError } = useWebSocket(wsUrl);

  // Validar los datos del WebSocket con Zod
  let validatedSocketData: DashboardData | null = null;
  if (socketData) {
    try {
      // Si recibimos datos iniciales (con tipo 'initial'), usamos directamente la estructura
      if (socketData.type === 'initial' && socketData.data) {
        validatedSocketData = z.object({
          timeSeries: z.array(timeSeriesDataSchema),
          barData: z.array(barDataSchema),
          heatmapData: z.array(heatmapDataSchema),
        }).parse(socketData.data);
      }
      // Si recibimos actualizaciones (con tipo 'update'), actualizamos solo la serie temporal
      else if (socketData.type === 'update' && socketData.data.timeSeries) {
        // Mantenemos los datos anteriores y solo actualizamos los datos recibidos
        if (data) {
          validatedSocketData = {
            ...data,
            timeSeries: [...data.timeSeries, ...socketData.data.timeSeries]
          };
        } else if (socketData.data.timeSeries) {
          // Si no hay datos anteriores, creamos una estructura vacía
          validatedSocketData = {
            timeSeries: socketData.data.timeSeries,
            barData: [],
            heatmapData: []
          };
        }
      }
      // Compatibilidad con el formato original (en caso de que el servidor no envíe el tipo)
      else {
        validatedSocketData = dashboardDataSchema.parse(socketData);
      }
    } catch (error) {
      console.error('WebSocket data validation error:', error);
    }
  }

  // Aplicar filtros a los datos
  let dashboardData = validatedSocketData || data;

  if (dashboardData && filters.dateRange[0] && filters.dateRange[1]) {
    // Filtrar datos de series temporales por rango de fechas
    if (dashboardData.timeSeries) {
      dashboardData = {
        ...dashboardData,
        timeSeries: dashboardData.timeSeries.filter(item => {
          const itemDate = new Date(item.date);
          return itemDate >= filters.dateRange[0]! && itemDate <= filters.dateRange[1]!;
        })
      };
    }
  }

  // Filtrar métricas si se han seleccionado
  if (filters.metrics.length > 0 && dashboardData) {
    // En el caso de series temporales, mantener los objetos pero solo con las métricas seleccionadas
    if (dashboardData.timeSeries) {
      dashboardData = {
        ...dashboardData,
        timeSeries: dashboardData.timeSeries.map(item => {
          const filteredItem: any = { date: item.date };
          filters.metrics.forEach(metric => {
            if (item.hasOwnProperty(metric)) {
              filteredItem[metric] = item[metric as keyof typeof item];
            }
          });
          return filteredItem;
        })
      };
    }
  }

  // Filtrar categorías si se han seleccionado (aplicar a barData y heatmapData)
  if (filters.categories.length > 0 && dashboardData) {
    // Para barData, mantener solo las categorías seleccionadas
    if (dashboardData.barData) {
      dashboardData = {
        ...dashboardData,
        barData: dashboardData.barData.filter(item =>
          filters.categories.includes(item.name.toLowerCase()) ||
          filters.categories.includes(item.name.toUpperCase()) ||
          filters.categories.some(cat => item.name.toLowerCase().includes(cat.toLowerCase()))
        )
      };
    }

    // Para heatmapData, filtrar basado en y o x si corresponde
    if (dashboardData.heatmapData) {
      dashboardData = {
        ...dashboardData,
        heatmapData: dashboardData.heatmapData.filter(item =>
          filters.categories.some(cat =>
            item.y.toLowerCase().includes(cat.toLowerCase()) ||
            item.x.toLowerCase().includes(cat.toLowerCase())
          )
        )
      };
    }
  }

  if (isLoading) return (
    <div className="flex justify-center items-center h-64 w-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (isError) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-md mx-auto w-full">
      <p>Error al cargar los datos</p>
      <p className="text-sm mt-1">Verifica tu conexión o intenta más tarde</p>
    </div>
  );

  return (
    <div className="dashboard-grid w-full">
      {/* Indicador de estado de WebSocket */}
      <div className="mb-4 flex justify-between items-center">
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          isConnected
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
            : wsError
              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
        }`}>
          {isConnected ? 'Conectado' : wsError ? 'Error de conexión' : 'Conectando...'}
          <span className="ml-2 text-xs">
            ({state.dashboardLayout === 'grid' ? 'Cuadrícula' : 'Lista'})
          </span>
        </div>

        {wsError && (
          <div className="text-xs text-gray-500 dark:text-gray-400 max-w-xs text-right">
            {wsError}
          </div>
        )}
      </div>

      {state.dashboardLayout === 'grid' ? (
        <GridLayout
          className="layout w-full"
          layouts={{
            lg: layout,
            md: [
              { i: 'timeSeries', x: 0, y: 0, w: 6, h: 8 },
              { i: 'stackedBar', x: 6, y: 0, w: 6, h: 8 },
              { i: 'heatmap', x: 0, y: 8, w: 12, h: 8 },
            ],
            sm: [
              { i: 'timeSeries', x: 0, y: 0, w: 4, h: 8 },
              { i: 'stackedBar', x: 0, y: 8, w: 4, h: 8 },
              { i: 'heatmap', x: 0, y: 16, w: 4, h: 8 },
            ],
            xs: [
              { i: 'timeSeries', x: 0, y: 0, w: 2, h: 8 },
              { i: 'stackedBar', x: 0, y: 8, w: 2, h: 8 },
              { i: 'heatmap', x: 0, y: 16, w: 2, h: 8 },
            ],
            xxs: [
              { i: 'timeSeries', x: 0, y: 0, w: 1, h: 8 },
              { i: 'stackedBar', x: 0, y: 8, w: 1, h: 8 },
              { i: 'heatmap', x: 0, y: 16, w: 1, h: 8 },
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
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Series Temporales</h3>
            </div>
            {dashboardData && (
              <TimeSeriesChart
                data={dashboardData.timeSeries || []}
                metrics={filters.metrics}
              />
            )}
          </div>

          <div key="stackedBar" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Barras Apiladas</h3>
            </div>
            {dashboardData && (
              <StackedBarChart
                data={dashboardData.barData || []}
                categories={filters.categories}
              />
            )}
          </div>

          <div key="heatmap" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Mapa de Calor</h3>
            </div>
            {dashboardData && (
              <HeatmapChart
                data={dashboardData.heatmapData || []}
              />
            )}
          </div>
        </GridLayout>
      ) : (
        // Modo lista
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Series Temporales</h3>
            </div>
            {dashboardData && (
              <TimeSeriesChart
                data={dashboardData.timeSeries || []}
                metrics={filters.metrics}
              />
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Barras Apiladas</h3>
            </div>
            {dashboardData && (
              <StackedBarChart
                data={dashboardData.barData || []}
                categories={filters.categories}
              />
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Mapa de Calor</h3>
            </div>
            {dashboardData && (
              <HeatmapChart
                data={dashboardData.heatmapData || []}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardGrid;