import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';

// Define the state structure
interface UIState {
  filters: {
    dateRange: [Date | null, Date | null];
    metrics: string[];
    categories: string[];
  };
  selectedMetrics: string[];
  theme: 'light' | 'dark' | 'system';
  dashboardLayout: 'grid' | 'list';
}

// Define action types
type UIAction =
  | { type: 'SET_DATE_RANGE'; payload: [Date | null, Date | null] }
  | { type: 'ADD_METRIC'; payload: string }
  | { type: 'REMOVE_METRIC'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: string }
  | { type: 'REMOVE_CATEGORY'; payload: string }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' | 'system' }
  | { type: 'SET_DASHBOARD_LAYOUT'; payload: 'grid' | 'list' }
  | { type: 'RESET_FILTERS' };

// Helper function to load initial state from localStorage or use defaults
const loadInitialState = (): UIState => {
  // Cargar tema guardado o usar 'system' por defecto
  const savedTheme = localStorage.getItem('app-theme') as 'light' | 'dark' | 'system' | null;
  
  // Cargar layout guardado o usar 'grid' por defecto
  const savedLayout = localStorage.getItem('dashboard-layout') as 'grid' | 'list' | null;
  
  return {
    filters: {
      dateRange: [null, null],
      metrics: [],
      categories: [],
    },
    selectedMetrics: [],
    theme: savedTheme || 'system', // Usar el tema guardado o 'system' por defecto
    dashboardLayout: savedLayout || 'grid', // Usar el layout guardado o 'grid' por defecto
  };
};

// Initial state
const initialState: UIState = loadInitialState();

// Reducer function
const uiReducer = (state: UIState, action: UIAction): UIState => {
  switch (action.type) {
    case 'SET_DATE_RANGE':
      return {
        ...state,
        filters: {
          ...state.filters,
          dateRange: action.payload,
        },
      };
    case 'ADD_METRIC':
      if (!state.filters.metrics.includes(action.payload)) {
        return {
          ...state,
          filters: {
            ...state.filters,
            metrics: [...state.filters.metrics, action.payload],
          },
        };
      }
      return state;
    case 'REMOVE_METRIC':
      return {
        ...state,
        filters: {
          ...state.filters,
          metrics: state.filters.metrics.filter(metric => metric !== action.payload),
        },
      };
    case 'ADD_CATEGORY':
      if (!state.filters.categories.includes(action.payload)) {
        return {
          ...state,
          filters: {
            ...state.filters,
            categories: [...state.filters.categories, action.payload],
          },
        };
      }
      return state;
    case 'REMOVE_CATEGORY':
      return {
        ...state,
        filters: {
          ...state.filters,
          categories: state.filters.categories.filter(category => category !== action.payload),
        },
      };
    case 'SET_THEME':
      // Guardar tema en localStorage
      localStorage.setItem('app-theme', action.payload);
      return {
        ...state,
        theme: action.payload,
      };
    case 'SET_DASHBOARD_LAYOUT':
      // Guardar layout en localStorage
      localStorage.setItem('dashboard-layout', action.payload);
      return {
        ...state,
        dashboardLayout: action.payload,
      };
    case 'RESET_FILTERS':
      return {
        ...state,
        filters: {
          dateRange: [null, null],
          metrics: [],
          categories: [],
        },
      };
    default:
      return state;
  }
};

// Create context
interface UIContextType {
  state: UIState;
  dispatch: React.Dispatch<UIAction>;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

// Provider component
interface UIProviderProps {
  children: ReactNode;
}

export const UIProvider: React.FC<UIProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(uiReducer, undefined, () => loadInitialState());

  return (
    <UIContext.Provider value={{ state, dispatch }}>
      {children}
    </UIContext.Provider>
  );
};

// Custom hook to use the UI context
export const useUI = (): UIContextType => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};