// src/tests/utils/validation.test.ts
import { 
  timeSeriesDataSchema, 
  barDataSchema, 
  heatmapDataSchema, 
  dashboardDataSchema,
  filterSchema 
} from '../../utils/validation';

describe('Validation Schemas', () => {
  describe('timeSeriesDataSchema', () => {
    test('validates correct time series data', () => {
      const validData = {
        date: '2023-01-01',
        revenue: 1000,
        users: 500,
        conversion: 20
      };

      expect(() => timeSeriesDataSchema.parse(validData)).not.toThrow();
    });

    test('rejects invalid time series data', () => {
      const invalidData = {
        date: '2023-01-01',
        revenue: 'not a number', // should be number
        users: 500,
        conversion: 20
      };

      expect(() => timeSeriesDataSchema.parse(invalidData)).toThrow();
    });

    test('accepts optional fields as null', () => {
      const validData = {
        date: '2023-01-01',
        revenue: null
      };

      expect(() => timeSeriesDataSchema.parse(validData)).not.toThrow();
    });
  });

  describe('barDataSchema', () => {
    test('validates correct bar data', () => {
      const validData = {
        name: 'January',
        revenue: 1000,
        users: 500,
        conversion: 20
      };

      expect(() => barDataSchema.parse(validData)).not.toThrow();
    });

    test('rejects invalid bar data', () => {
      const invalidData = {
        name: 'January',
        revenue: 'not a number' // should be number
      };

      expect(() => barDataSchema.parse(invalidData)).toThrow();
    });
  });

  describe('heatmapDataSchema', () => {
    test('validates correct heatmap data', () => {
      const validData = {
        x: 'A',
        y: 'B',
        value: 50
      };

      expect(() => heatmapDataSchema.parse(validData)).not.toThrow();
    });

    test('rejects invalid heatmap data', () => {
      const invalidData = {
        x: 'A',
        y: 'B',
        value: 'not a number' // should be number
      };

      expect(() => heatmapDataSchema.parse(invalidData)).toThrow();
    });
  });

  describe('dashboardDataSchema', () => {
    test('validates correct dashboard data', () => {
      const validData = {
        timeSeries: [
          { date: '2023-01-01', revenue: 1000, users: 500, conversion: 20 }
        ],
        barData: [
          { name: 'January', revenue: 1000, users: 500, conversion: 20 }
        ],
        heatmapData: [
          { x: 'A', y: 'B', value: 50 }
        ]
      };

      expect(() => dashboardDataSchema.parse(validData)).not.toThrow();
    });

    test('rejects invalid dashboard data', () => {
      const invalidData = {
        timeSeries: [
          { date: '2023-01-01', revenue: 'not a number' } // revenue should be number
        ],
        barData: [
          { name: 'January', revenue: 1000, users: 500, conversion: 20 }
        ],
        heatmapData: [
          { x: 'A', y: 'B', value: 50 }
        ]
      };

      expect(() => dashboardDataSchema.parse(invalidData)).toThrow();
    });
  });

  describe('filterSchema', () => {
    test('validates correct filter data', () => {
      const validData = {
        dateRange: [new Date(), new Date()],
        metrics: ['revenue', 'users'],
        categories: ['marketing', 'sales']
      };

      expect(() => filterSchema.parse(validData)).not.toThrow();
    });

    test('rejects invalid filter data', () => {
      const invalidData = {
        dateRange: ['not a date', 'not a date'], // should be Date objects or null
        metrics: ['revenue', 'users'],
        categories: ['marketing', 'sales']
      };

      expect(() => filterSchema.parse(invalidData)).toThrow();
    });

    test('accepts null dates in dateRange', () => {
      const validData = {
        dateRange: [null, null],
        metrics: [],
        categories: []
      };

      expect(() => filterSchema.parse(validData)).not.toThrow();
    });
  });
});