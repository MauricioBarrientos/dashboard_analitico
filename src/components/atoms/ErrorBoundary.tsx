import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    // Aquí podríamos enviar el error a un servicio de reporte de errores
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error} />;
    }

    return this.props.children;
  }
}

const DefaultErrorFallback: React.FC<{ error?: Error }> = ({ error }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <h2 className="text-xl font-bold text-red-600 mb-2">¡Ups! Algo salió mal.</h2>
    <p className="text-gray-600 dark:text-gray-300 mb-4">
      Ha ocurrido un error inesperado. Por favor, intenta recargar la página.
    </p>
    {error && (
      <details className="text-left text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 p-4 rounded">
        <summary className="cursor-pointer">Detalles del error</summary>
        <p className="mt-2">{error.toString()}</p>
      </details>
    )}
    <button
      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      onClick={() => window.location.reload()}
    >
      Recargar página
    </button>
  </div>
);

export default ErrorBoundary;