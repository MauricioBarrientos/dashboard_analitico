import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { dashboardDataSchema, DashboardData } from '../utils/validation';
import { AppError, NetworkError, ValidationError, handleApiError, reportError } from './errorHandler';

interface FetchDataParams {
  startDate?: Date | null;
  endDate?: Date | null;
}

// API service function
export const fetchData = async (params?: FetchDataParams): Promise<DashboardData> => {
  try {
    // In a real implementation, this would call your actual API
    // For now, we'll simulate data
    // const response = await fetch(
    //   `/api/data?start=${params?.startDate?.toISOString() || ''}&end=${params?.endDate?.toISOString() || ''}`,
    //   {
    //     headers: {
    //       'Content-Type': 'application/json',
    //       // Incluir token de autenticación si está disponible
    //       // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
    //     }
    //   }
    // );

    // if (!response.ok) {
    //   throw new NetworkError(`Error de red: ${response.status} ${response.statusText}`, response);
    // }

    // const rawData = await response.json();

    // For demonstration purposes, return mock data
    const mockData: DashboardData = {
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
        { x: 'A', y: 'X', value: 10 },
        { x: 'B', y: 'Y', value: 20 },
        { x: 'C', y: 'Z', value: 30 },
        { x: 'D', y: 'X', value: 40 },
        { x: 'E', y: 'Y', value: 50 },
      ],
    };

    // Validar los datos con Zod
    const validatedData = dashboardDataSchema.parse(mockData);
    return validatedData;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }

    const appError = handleApiError(error);
    reportError(appError);
    throw appError;
  }
};

// Custom hook using React Query with enhanced performance optimizations
export const useData = (params?: FetchDataParams, options?: UseQueryOptions<DashboardData>) => {
  return useQuery({
    queryKey: ['data', params],
    queryFn: () => fetchData(params),
    staleTime: 5 * 60 * 1000, // 5 minutes - data is considered fresh for 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes - cached for 10 minutes before garbage collection
    refetchOnWindowFocus: false, // Disable automatic refetch on window focus to improve performance
    refetchOnReconnect: true, // Refetch on reconnection
    ...options,
    // Opciones predeterminadas para manejo de errores
    retry: (failureCount, error) => {
      // No reintentar si es un error de validación
      if (error instanceof ValidationError) {
        return false;
      }
      // Reintentar hasta 3 veces para errores de red
      return failureCount < 3;
    },
    onError: (error) => {
      console.error('Error al cargar datos del dashboard:', error);
      // Aquí podríamos mostrar una notificación de error al usuario
      if (options?.onError) {
        options.onError(error);
      }
    }
  });
};

// Optimized hook for fetching data with debounce capabilities
export const useDebouncedData = (
  params?: FetchDataParams,
  debounceMs: number = 500,
  options?: UseQueryOptions<DashboardData>
) => {
  // We can implement debounce using a custom hook if needed
  // For now, using the regular useData hook with the same optimizations
  return useData(params, options);
};

// Batch API calls to reduce network requests
export const fetchMultipleDataSets = async (
  paramsList: FetchDataParams[]
): Promise<DashboardData[]> => {
  try {
    // Using Promise.all to execute all requests in parallel
    const results = await Promise.all(
      paramsList.map(params => fetchData(params))
    );
    return results;
  } catch (error) {
    const appError = handleApiError(error);
    reportError(appError);
    throw appError;
  }
};

// Prefetch data to improve user experience
export const prefetchData = async (
  queryClient: any,
  params?: FetchDataParams
) => {
  await queryClient.prefetchQuery({
    queryKey: ['data', params],
    queryFn: () => fetchData(params),
    staleTime: 5 * 60 * 1000,
  });
};

// Función para actualizar datos
export const updateData = async (data: Partial<DashboardData>): Promise<DashboardData> => {
  try {
    // En una implementación real, llamaríamos al endpoint PUT
    // const response = await fetch('/api/data', {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
    //   },
    //   body: JSON.stringify(data),
    // });

    // if (!response.ok) {
    //   throw new NetworkError(`Error al actualizar datos: ${response.status}`, response);
    // }

    // const result = await response.json();

    // Validar la respuesta con Zod
    const validatedData = dashboardDataSchema.partial().parse(data);
    return validatedData as DashboardData;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }

    const appError = handleApiError(error);
    reportError(appError);
    throw appError;
  }
};