import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthAction {
  type: 'LOGIN_SUCCESS' | 'LOGOUT' | 'SET_LOADING' | 'LOGIN_FAILURE';
  payload?: any;
}

const AuthContext = createContext<{
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
} | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    default:
      return state;
  }
};

// Estado inicial
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verificar token almacenado al iniciar la app
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !state.user) {
      // En una implementación real, aquí recuperaríamos los datos del usuario desde la API
      // Por ahora simulamos que el token es válido
      const mockUser = {
        id: '1',
        email: 'admin@example.com',
        name: 'Administrador',
        role: 'admin'
      };
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { token, user: mockUser }
      });
    }
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      // Simular una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simular respuesta exitosa de autenticación
      const mockToken = `token_${email.replace('@', '_')}_${Date.now()}`;
      const mockUser = {
        id: '1',
        email,
        name: email.split('@')[0],
        role: 'user'
      };

      // Guardar token en localStorage
      localStorage.setItem('token', mockToken);

      // Recuperar preferencias guardadas anteriormente
      const savedTheme = localStorage.getItem('app-theme');
      const savedLayout = localStorage.getItem('dashboard-layout');
      const savedNotifications = localStorage.getItem('notification-settings');

      // Solo guardar preferencias que no existen aún o que no se sobreescriben
      if (!localStorage.getItem('app-theme')) {
        localStorage.setItem('app-theme', 'system');
      }
      if (!localStorage.getItem('dashboard-layout')) {
        localStorage.setItem('dashboard-layout', 'grid');
      }

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { token: mockToken, user: mockUser }
      });
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw new Error('Credenciales inválidas. Por favor inténtalo de nuevo.');
    }
  };

  const logout = () => {
    // Eliminar token de localStorage
    localStorage.removeItem('token');

    // Mantener algunas preferencias del usuario (tema, layout, notificaciones)
    // para que se mantengan entre sesiones
    // localStorage.removeItem('notification-settings');
    // localStorage.removeItem('app-theme');
    // localStorage.removeItem('dashboard-layout');

    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};