import { useEffect } from 'react';
import { useUI } from '../store/uiStore';

// Hook para aplicar el tema basado en la preferencia del usuario y el sistema
export const useTheme = () => {
  const { state, dispatch } = useUI();

  useEffect(() => {
    const applyTheme = () => {
      const theme = state.theme;
      const html = document.documentElement;

      // Si el tema es 'system', detectamos la preferencia del sistema
      if (theme === 'system') {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        html.classList.remove('light', 'dark'); // Limpiar clases previas
        html.classList.add(systemPrefersDark ? 'dark' : 'light');
        html.classList.toggle('dark', systemPrefersDark);
      } else {
        // Si no es 'system', aplicamos directamente el tema seleccionado
        html.classList.remove('light', 'dark'); // Limpiar clases previas
        html.classList.add(theme);
        html.classList.toggle('dark', theme === 'dark');
      }

      // Guardar la preferencia del usuario en localStorage
      localStorage.setItem('app-theme', theme);
    };

    // Aplicar el tema inicialmente
    applyTheme();

    // Escuchar cambios en la preferencia del sistema si el tema es 'system'
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (state.theme === 'system') {
        applyTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [state.theme]);

  const setTheme = (theme: 'light' | 'dark' | 'system') => {
    dispatch({ type: 'SET_THEME', payload: theme });
  };

  return { theme: state.theme, setTheme };
};