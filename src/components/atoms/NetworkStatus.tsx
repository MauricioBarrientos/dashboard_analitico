import React from 'react';

interface NetworkStatusProps {
  isOnline: boolean;
  hasError?: boolean;
  errorMessage?: string;
}

const NetworkStatus: React.FC<NetworkStatusProps> = ({ 
  isOnline, 
  hasError, 
  errorMessage 
}) => {
  if (hasError) {
    return (
      <div className="fixed top-4 right-4 z-50 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-lg max-w-sm">
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          <span className="font-semibold">Error de conexión</span>
        </div>
        <p className="mt-1 text-sm">{errorMessage || 'Ocurrió un error de red'}</p>
      </div>
    );
  }

  return (
    <div className={`fixed top-4 right-4 z-50 p-3 rounded-lg shadow-lg transition-all duration-300 ${
      isOnline ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-yellow-100 border border-yellow-400 text-yellow-700'
    }`}>
      <div className="flex items-center">
        <div className={`w-3 h-3 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
        <span className="text-sm font-medium">
          {isOnline ? 'Conexión: Activa' : 'Conexión: Limitada'}
        </span>
      </div>
    </div>
  );
};

export default NetworkStatus;