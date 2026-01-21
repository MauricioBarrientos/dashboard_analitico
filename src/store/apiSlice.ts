import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface FetchDataParams {
  startDate?: string;
  endDate?: string;
}

interface ApiResponse {
  timeSeries: Array<{
    date: string;
    revenue: number;
    users: number;
    conversion: number;
  }>;
  barData: Array<{
    name: string;
    revenue: number;
    users: number;
    conversion: number;
  }>;
  heatmapData: Array<{
    x: string;
    y: string;
    value: number;
  }>;
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api',
  }),
  tagTypes: ['Data'],
  endpoints: (builder) => ({
    getData: builder.query<ApiResponse, FetchDataParams>({
      query: (params) => ({
        url: '/data',
        params: {
          start: params?.startDate,
          end: params?.endDate,
        },
      }),
      providesTags: ['Data'],
    }),
    updateData: builder.mutation<ApiResponse, Partial<ApiResponse>>({
      query: (body) => ({
        url: '/data',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Data'],
    }),
  }),
});

export const { useGetDataQuery, useUpdateDataMutation } = apiSlice;