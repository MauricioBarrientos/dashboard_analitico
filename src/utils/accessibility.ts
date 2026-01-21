// Accessibility utilities for the dashboard
import React from 'react';

// ARIA attributes for charts
export const getAriaLabelForChart = (chartType: string, title: string) => {
  return `${title} - ${getChartDescription(chartType)}`;
};

const getChartDescription = (chartType: string) => {
  switch(chartType) {
    case 'timeSeries':
      return 'Gráfico de series temporales que muestra la evolución de datos a lo largo del tiempo';
    case 'stackedBar':
      return 'Gráfico de barras apiladas para comparar diferentes categorías';
    case 'heatmap':
      return 'Mapa de calor que representa la densidad de valores en una matriz';
    default:
      return 'Gráfico visualizando datos analíticos';
  }
};

// Focus management utilities
export const focusFirstElement = (containerRef: React.RefObject<HTMLElement>) => {
  if (containerRef.current) {
    const firstFocusableElement = containerRef.current.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as HTMLElement;
    
    if (firstFocusableElement) {
      firstFocusableElement.focus();
    }
  }
};

// Keyboard navigation helper
export const handleKeyDown = (
  event: React.KeyboardEvent,
  callback: () => void,
  additionalKeys: string[] = []
) => {
  const validKeys = ['Enter', ' ', ...additionalKeys];
  
  if (validKeys.includes(event.key)) {
    event.preventDefault();
    callback();
  }
};

// Screen reader utility components
interface ScreenReaderOnlyProps {
  children: React.ReactNode;
}

export const ScreenReaderOnly: React.FC<ScreenReaderOnlyProps> = ({ children }) => (
  <span 
    style={{
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: '0',
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      border: '0',
    }}
  >
    {children}
  </span>
);

// High contrast mode detection
export const useHighContrastMode = () => {
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    const handleContrastChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }
    };

    if (mediaQuery.matches) {
      document.documentElement.classList.add('high-contrast');
    }

    mediaQuery.addEventListener('change', handleContrastChange);

    return () => {
      mediaQuery.removeEventListener('change', handleContrastChange);
    };
  }, []);
};