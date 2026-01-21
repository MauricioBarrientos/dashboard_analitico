// src/tests/services/api.test.ts
import { fetchData } from '../../services/api';
import { dashboardDataSchema } from '../../utils/validation';

// Mockear fetch
global.fetch = vi.fn();

describe('API Service', () => {
  beforeEach(() => {
    (global.fetch as Mock).mockClear();
  });

  test('fetchData returns valid data structure', async () => {
    const mockResponse = {
      timeSeries: [
        { date: '2023-01-01', revenue: 4000, users: 2400, conversion: 24 },
      ],
      barData: [
        { name: 'Ene', revenue: 4000, users: 2400, conversion: 24 },
      ],
      heatmapData: [
        { x: 'A', y: 'X', value: 10 },
      ],
    };

    const result = await fetchData();

    // Verificar que los datos sigan el esquema Zod
    expect(() => dashboardDataSchema.parse(result)).not.toThrow();
    
    // Verificar la estructura de los datos
    expect(result).toHaveProperty('timeSeries');
    expect(result).toHaveProperty('barData');
    expect(result).toHaveProperty('heatmapData');
    expect(Array.isArray(result.timeSeries)).toBe(true);
    expect(Array.isArray(result.barData)).toBe(true);
    expect(Array.isArray(result.heatmapData)).toBe(true);
  });

  test('fetchData handles different parameter combinations', async () => {
    const startDate = new Date('2023-01-01');
    const endDate = new Date('2023-01-31');

    const result = await fetchData({ startDate, endDate });

    // Verificar que los datos sigan el esquema Zod
    expect(() => dashboardDataSchema.parse(result)).not.toThrow();
    
    // Verificar que los datos tienen las propiedades esperadas
    expect(result.timeSeries[0]).toHaveProperty('date');
    expect(result.timeSeries[0]).toHaveProperty('revenue');
    expect(result.timeSeries[0]).toHaveProperty('users');
    expect(result.timeSeries[0]).toHaveProperty('conversion');
  });

  test('fetchData validates data with Zod', async () => {
    const result = await fetchData();

    // Verificar que cada objeto en timeSeries tiene la estructura correcta
    result.timeSeries.forEach(item => {
      expect(typeof item.date).toBe('string');
      expect(typeof item.revenue).toBe('number');
      expect(typeof item.users).toBe('number');
      expect(typeof item.conversion).toBe('number');
    });

    // Verificar que cada objeto en barData tiene la estructura correcta
    result.barData.forEach(item => {
      expect(typeof item.name).toBe('string');
      expect(typeof item.revenue).toBe('number');
      expect(typeof item.users).toBe('number');
      expect(typeof item.conversion).toBe('number');
    });

    // Verificar que cada objeto en heatmapData tiene la estructura correcta
    result.heatmapData.forEach(item => {
      expect(typeof item.x).toBe('string');
      expect(typeof item.y).toBe('string');
      expect(typeof item.value).toBe('number');
    });
  });
});