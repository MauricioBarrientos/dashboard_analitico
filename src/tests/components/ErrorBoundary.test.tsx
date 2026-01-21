import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../atoms/ErrorBoundary';

// Componente que lanza un error para probar el ErrorBoundary
const BrokenComponent: React.FC = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary', () => {
  test('should render children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div>Normal content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Normal content')).toBeInTheDocument();
  });

  test('should render fallback when child component throws error', () => {
    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('¡Ups! Algo salió mal.')).toBeInTheDocument();
    expect(screen.getByText('Ha ocurrido un error inesperado. Por favor, intenta recargar la página.')).toBeInTheDocument();
  });

  test('should render custom fallback when provided', () => {
    const CustomFallback: React.FC<{ error?: Error }> = ({ error }) => (
      <div>Custom Error: {error?.message}</div>
    );

    render(
      <ErrorBoundary fallback={CustomFallback}>
        <BrokenComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom Error: Test error')).toBeInTheDocument();
  });
});