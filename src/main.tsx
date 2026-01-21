import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import App from './App';
import './i18n/i18n';
import './index.css'; // Import global styles
import { ThemeProvider } from './contexts/ThemeContext';
import { store } from './store/store';
import { apiSlice } from './store/apiSlice';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Disable refetch on window focus for better performance
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <BrowserRouter future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>,
);