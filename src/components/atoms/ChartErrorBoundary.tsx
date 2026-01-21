import React from 'react';

interface ChartErrorBoundaryState {
  hasError: boolean;
}

interface ChartErrorBoundaryProps {
  children: React.ReactNode;
}

class ChartErrorBoundary extends React.Component<ChartErrorBoundaryProps, ChartErrorBoundaryState> {
  constructor(props: ChartErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ChartErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ChartErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center h-full w-full">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Error al cargar el gráfico</h3>
          <p className="text-gray-600 dark:text-gray-300">
            No se pudo renderizar este gráfico. Intentaremos solucionarlo pronto.
          </p>
          <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg w-full h-64 flex items-center justify-center">
            <svg 
              className="w-16 h-16 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ChartErrorBoundary;