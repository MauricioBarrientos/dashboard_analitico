import React from 'react';

interface ApiErrorComponentProps {
  message?: string;
  onRetry?: () => void;
  showRetryButton?: boolean;
}

const ApiErrorComponent: React.FC<ApiErrorComponentProps> = ({ 
  message = 'Error al cargar los datos', 
  onRetry, 
  showRetryButton = true 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-red-50 dark:bg-red-900/20 rounded-xl">
      <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-3 mb-4">
        <svg 
          className="w-8 h-8 text-red-600 dark:text-red-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          ></path>
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Error de red</h3>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
        {message}
      </p>
      {showRetryButton && onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
        >
          Reintentar
        </button>
      )}
    </div>
  );
};

export default ApiErrorComponent;