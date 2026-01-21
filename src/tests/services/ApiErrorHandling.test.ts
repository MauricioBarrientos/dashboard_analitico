import { fetchData, updateData } from '../../services/api';
import { dashboardDataSchema } from '../../utils/validation';
import { AppError, NetworkError, ValidationError } from '../../utils/errorHandler';

// Mock de la función fetch
global.fetch = jest.fn();

describe('API Error Handling', () => {
  const mockValidData = {
    timeSeries: [
      { date: '2023-01-01', revenue: 4000, users: 2400, conversion: 24 }
    ],
    barData: [
      { name: 'Ene', revenue: 4000, users: 2400, conversion: 24 }
    ],
    heatmapData: [
      { x: 'A', y: 'X', value: 10 }
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('fetchData should throw ValidationError for invalid data', async () => {
    const invalidData = { invalid: 'data' };
    
    (fetch as jest.MockedFunction<typeof fetch>)
      .mockResolvedValueOnce({
        json: () => Promise.resolve(invalidData),
        ok: true,
      } as Response);

    await expect(fetchData()).rejects.toThrow(ValidationError);
  });

  test('fetchData should throw NetworkError for network issues', async () => {
    (fetch as jest.MockedFunction<typeof fetch>)
      .mockRejectedValueOnce(new TypeError('Network error'));

    await expect(fetchData()).rejects.toThrow(NetworkError);
  });

  test('fetchData should throw NetworkError for HTTP errors', async () => {
    const mockResponse = {
      json: () => Promise.resolve({ message: 'Internal server error' }),
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    } as Response;

    (fetch as jest.MockedFunction<typeof fetch>)
      .mockResolvedValueOnce(mockResponse);

    await expect(fetchData()).rejects.toThrow(NetworkError);
  });

  test('updateData should handle validation errors', async () => {
    const invalidData = { invalid: 'data' };
    
    await expect(updateData(invalidData)).rejects.toThrow(ValidationError);
  });

  test('fetchData should handle valid data correctly', async () => {
    (fetch as jest.MockedFunction<typeof fetch>)
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockValidData),
        ok: true,
      } as Response);

    const result = await fetchData();
    
    // Verificar que los datos se validaron correctamente con Zod
    expect(() => dashboardDataSchema.parse(result)).not.toThrow();
    expect(result).toEqual(mockValidData);
  });
});