import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  weeklyReport: boolean;
  monthlyReport: boolean;
}

interface NotificationState {
  settings: NotificationSettings;
}

interface NotificationAction {
  type: 'UPDATE_SETTING';
  payload: { key: keyof NotificationSettings; value: boolean };
}

const NotificationContext = createContext<{
  state: NotificationState;
  dispatch: React.Dispatch<NotificationAction>;
} | undefined>(undefined);

const notificationReducer = (state: NotificationState, action: NotificationAction): NotificationState => {
  switch (action.type) {
    case 'UPDATE_SETTING':
      return {
        ...state,
        settings: {
          ...state.settings,
          [action.payload.key]: action.payload.value
        }
      };
    default:
      return state;
  }
};

const initialState: NotificationState = {
  settings: {
    email: true,
    push: true,
    sms: false,
    weeklyReport: true,
    monthlyReport: true
  }
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  return (
    <NotificationContext.Provider value={{ state, dispatch }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};