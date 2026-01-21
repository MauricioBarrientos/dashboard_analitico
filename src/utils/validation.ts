import { z } from 'zod';

/**
 * Esquema de validación para datos de series temporales
 * @typedef {Object} TimeSeriesData
 * @property {string} date - Fecha en formato ISO
 * @property {number|null|undefined} revenue - Ingresos (opcional/nulo)
 * @property {number|null|undefined} users - Número de usuarios (opcional/nulo)
 * @property {number|null|undefined} conversion - Porcentaje de conversión (opcional/nulo)
 */
export const timeSeriesDataSchema = z.object({
  date: z.string(),
  revenue: z.number().nullable().optional(),
  users: z.number().nullable().optional(),
  conversion: z.number().nullable().optional(),
});

/**
 * Esquema de validación para datos de gráficos de barras
 * @typedef {Object} BarData
 * @property {string} name - Nombre de la categoría o período
 * @property {number|null|undefined} revenue - Ingresos (opcional/nulo)
 * @property {number|null|undefined} users - Número de usuarios (opcional/nulo)
 * @property {number|null|undefined} conversion - Porcentaje de conversión (opcional/nulo)
 */
export const barDataSchema = z.object({
  name: z.string(),
  revenue: z.number().nullable().optional(),
  users: z.number().nullable().optional(),
  conversion: z.number().nullable().optional(),
});

/**
 * Esquema de validación para datos de mapas de calor
 * @typedef {Object} HeatmapData
 * @property {string} x - Valor en eje X
 * @property {string} y - Valor en eje Y
 * @property {number} value - Valor numérico
 */
export const heatmapDataSchema = z.object({
  x: z.string(),
  y: z.string(),
  value: z.number(),
});

/**
 * Esquema de validación para los datos completos del dashboard
 * @typedef {Object} DashboardData
 * @property {Array<TimeSeriesData>} timeSeries - Datos de series temporales
 * @property {Array<BarData>} barData - Datos de gráfico de barras
 * @property {Array<HeatmapData>} heatmapData - Datos de mapa de calor
 */
export const dashboardDataSchema = z.object({
  timeSeries: z.array(timeSeriesDataSchema),
  barData: z.array(barDataSchema),
  heatmapData: z.array(heatmapDataSchema),
});

export type TimeSeriesData = z.infer<typeof timeSeriesDataSchema>;
export type BarData = z.infer<typeof barDataSchema>;
export type HeatmapData = z.infer<typeof heatmapDataSchema>;
export type DashboardData = z.infer<typeof dashboardDataSchema>;

/**
 * Esquema de validación para los filtros de datos
 * @typedef {Object} Filters
 * @property {[Date|null, Date|null]} dateRange - Rango de fechas [inicio, fin]
 * @property {string[]} metrics - Lista de métricas seleccionadas
 * @property {string[]} categories - Lista de categorías seleccionadas
 */
export const filterSchema = z.object({
  dateRange: z.tuple([z.date().nullable(), z.date().nullable()]),
  metrics: z.array(z.string()),
  categories: z.array(z.string()),
});

export type Filters = z.infer<typeof filterSchema>;