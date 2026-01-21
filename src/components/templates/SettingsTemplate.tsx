import React, { useState } from 'react';
import { z } from 'zod';
import { useTheme } from '../../hooks/useTheme';
import { useUI } from '../../store/uiStore';
import { useNotification } from '../../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import Header from '../organisms/Header';
import Sidebar from '../organisms/Sidebar';

const SettingsTemplate: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 flex flex-col w-full">
        <Header title="Configuración" userName="Usuario" />
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              {/* Pestañas de configuración */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-0">
                  {[
                    { id: 'profile', label: 'Perfil' },
                    { id: 'general', label: 'General' },
                    { id: 'appearance', label: 'Apariencia' },
                    { id: 'notifications', label: 'Notificaciones' },
                    { id: 'security', label: 'Seguridad' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      className={`py-4 px-6 text-center font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Contenido de las pestañas */}
              <div className="p-6">
                {activeTab === 'profile' && <ProfileSettings />}
                {activeTab === 'general' && <GeneralSettings />}
                {activeTab === 'appearance' && <AppearanceSettings />}
                {activeTab === 'notifications' && <NotificationSettings />}
                {activeTab === 'security' && <SecuritySettings />}
              </div>
            </div>
          </div>
        </main>
        <footer className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-3 text-center text-xs sm:text-sm">
          <div className="max-w-7xl mx-auto">
            <p>Última actualización: {new Date().toLocaleString()} | Versión 1.0.0</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

import { profileSchema, ProfileData, generalSettingsSchema, GeneralSettingsData } from '../../utils/validationSchemas';

// Componentes para cada pestaña
const ProfileSettings: React.FC = () => {
  const [formData, setFormData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Validar campo individual cuando cambie
    try {
      profileSchema.shape[name as keyof ProfileData].parse(value);
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({
          ...prev,
          [name]: error.errors[0].message
        }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validar todos los datos
      profileSchema.parse(formData);

      // Limpiar errores si la validación es exitosa
      setErrors({});

      console.log('Perfil actualizado:', formData);
      // Aquí iría la lógica para guardar los cambios

      // Mostrar mensaje de éxito
      alert('Perfil actualizado correctamente');
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Mapear errores de Zod a nuestro formato
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Nombre
          </label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${
              errors.firstName
                ? 'border-red-500'
                : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.firstName}</p>
          )}
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Apellido
          </label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${
              errors.lastName
                ? 'border-red-500'
                : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.lastName}</p>
          )}
        </div>

        <div className="sm:col-span-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Correo electrónico
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${
              errors.email
                ? 'border-red-500'
                : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.email}</p>
          )}
        </div>

        <div className="sm:col-span-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Teléfono
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${
              errors.phone
                ? 'border-red-500'
                : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.phone}</p>
          )}
        </div>

        <div className="sm:col-span-6">
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Biografía
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={3}
            value={formData.bio}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${
              errors.bio
                ? 'border-red-500'
                : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {errors.bio && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.bio}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Guardar cambios
        </button>
      </div>
    </form>
  );
};

const GeneralSettings: React.FC = () => {
  const [formData, setFormData] = useState<GeneralSettingsData>({
    companyName: '',
    timezone: 'America/Bogota',
    language: 'es',
    currency: 'USD',
    dateFormat: 'DD/MM/YYYY'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Validar campo individual cuando cambie
    if (name !== 'timezone' && name !== 'language' && name !== 'currency' && name !== 'dateFormat') {
      try {
        generalSettingsSchema.shape[name as keyof GeneralSettingsData].parse(value);
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          setErrors(prev => ({
            ...prev,
            [name]: error.errors[0].message
          }));
        }
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validar todos los datos
      generalSettingsSchema.parse(formData);

      // Limpiar errores si la validación es exitosa
      setErrors({});

      console.log('Configuración general actualizada:', formData);
      // Aquí iría la lógica para guardar los cambios

      // Mostrar mensaje de éxito
      alert('Configuración general actualizada correctamente');
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Mapear errores de Zod a nuestro formato
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-4">
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Nombre de la Empresa
          </label>
          <input
            type="text"
            name="companyName"
            id="companyName"
            value={formData.companyName}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${
              errors.companyName
                ? 'border-red-500'
                : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {errors.companyName && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.companyName}</p>
          )}
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Zona Horaria
          </label>
          <select
            id="timezone"
            name="timezone"
            value={formData.timezone}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="America/Bogota">Bogotá (GMT-5)</option>
            <option value="America/Mexico_City">Ciudad de México (GMT-6)</option>
            <option value="America/Argentina/Buenos_Aires">Buenos Aires (GMT-3)</option>
            <option value="Europe/Madrid">Madrid (GMT+1)</option>
            <option value="Europe/London">Londres (GMT+0)</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Idioma
          </label>
          <select
            id="language"
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="es">Español</option>
            <option value="en">Inglés</option>
            <option value="fr">Francés</option>
            <option value="de">Alemán</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Moneda
          </label>
          <select
            id="currency"
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="USD">USD (Dólar Estadounidense)</option>
            <option value="EUR">EUR (Euro)</option>
            <option value="COP">COP (Peso Colombiano)</option>
            <option value="MXN">MXN (Peso Mexicano)</option>
            <option value="ARS">ARS (Peso Argentino)</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Formato de Fecha
          </label>
          <select
            id="dateFormat"
            name="dateFormat"
            value={formData.dateFormat}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            <option value="DD-MM-YYYY">DD-MM-YYYY</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Guardar cambios
        </button>
      </div>
    </form>
  );
};

const AppearanceSettings: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { state, dispatch } = useUI();
  const navigate = useNavigate();
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');
  const [dashboardLayout, setDashboardLayout] = useState<'grid' | 'list'>('grid');

  // Sincronizar el estado local con el estado del store para dashboardLayout
  React.useEffect(() => {
    setDashboardLayout(state.dashboardLayout);
  }, [state.dashboardLayout]);

  const handleSave = () => {
    console.log('Preferencias de apariencia actualizadas:', {
      theme,
      fontSize,
      dashboardLayout
    });
    // Redirigir a la página principal para ver los cambios
    navigate('/');
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Tema</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Elige cómo se ve la aplicación
        </p>

        <div className="mt-4 space-y-3">
          {[
            { id: 'light', title: 'Claro', description: 'Tema claro siempre' },
            { id: 'dark', title: 'Oscuro', description: 'Tema oscuro siempre' },
            { id: 'system', title: 'Sistema', description: 'Usar configuración del sistema' },
          ].map((option) => (
            <div
              key={option.id}
              onClick={() => setTheme(option.id as 'light' | 'dark' | 'system')}
              className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                theme === option.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 ring-2 ring-blue-500/20'
                  : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <div className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center ${
                theme === option.id
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-400 dark:border-gray-500'
              }`}>
                {theme === option.id && (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${theme === option.id ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}>
                  {option.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {option.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Tamaño de Fuente</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Ajusta el tamaño de fuente de la aplicación
        </p>

        <div className="mt-4 space-y-3">
          {[
            { id: 'normal', title: 'Normal', description: 'Tamaño de fuente estándar' },
            { id: 'large', title: 'Grande', description: 'Texto ampliado para mejor lectura' },
          ].map((option) => (
            <div
              key={option.id}
              onClick={() => setFontSize(option.id as 'normal' | 'large')}
              className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                fontSize === option.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 ring-2 ring-blue-500/20'
                  : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <div className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center ${
                fontSize === option.id
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-400 dark:border-gray-500'
              }`}>
                {fontSize === option.id && (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${fontSize === option.id ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}>
                  {option.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {option.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Diseño del Dashboard</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Elige cómo se organizan los widgets en el dashboard
        </p>

        <div className="mt-4 space-y-3">
          {[
            { id: 'grid', title: 'Cuadrícula', description: 'Widgets organizados en una cuadrícula' },
            { id: 'list', title: 'Lista', description: 'Widgets organizados en una lista vertical' },
          ].map((option) => (
            <div
              key={option.id}
              onClick={() => dispatch({ type: 'SET_DASHBOARD_LAYOUT', payload: option.id as 'grid' | 'list' })}
              className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                state.dashboardLayout === option.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 ring-2 ring-blue-500/20'
                  : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <div className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center ${
                state.dashboardLayout === option.id
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-400 dark:border-gray-500'
              }`}>
                {state.dashboardLayout === option.id && (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${state.dashboardLayout === option.id ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}>
                  {option.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {option.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <button
          onClick={handleSave}
          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Guardar cambios
        </button>
      </div>
    </div>
  );
};

const NotificationSettings: React.FC = () => {
  const { state, dispatch } = useNotification();

  const handleToggle = (key: keyof NotificationSettings) => {
    dispatch({ type: 'UPDATE_SETTING', payload: { key, value: !state.settings[key] }});
  };

  const handleSave = () => {
    console.log('Configuración de notificaciones actualizada:', state.settings);
    // Aquí iría la lógica para guardar las preferencias en localStorage o backend
    localStorage.setItem('notification-settings', JSON.stringify(state.settings));
  };

  // Cargar preferencias guardadas al iniciar
  React.useEffect(() => {
    const savedSettings = localStorage.getItem('notification-settings');
    if (savedSettings) {
      const parsedSettings: NotificationSettings = JSON.parse(savedSettings);
      // Actualizar el estado con las preferencias guardadas
      Object.keys(parsedSettings).forEach(key => {
        const settingKey = key as keyof NotificationSettings;
        if (state.settings[settingKey] !== parsedSettings[settingKey]) {
          dispatch({
            type: 'UPDATE_SETTING',
            payload: { key: settingKey, value: parsedSettings[settingKey] }
          });
        }
      });
    }
  }, []); // Solo al inicio

  const options = [
    { id: 'email', title: 'Notificaciones por email', description: 'Recibir actualizaciones importantes por correo electrónico' },
    { id: 'push', title: 'Notificaciones push', description: 'Recibir notificaciones en el navegador' },
    { id: 'sms', title: 'Notificaciones por SMS', description: 'Recibir alertas críticas por mensaje de texto' },
    { id: 'weeklyReport', title: 'Reporte semanal', description: 'Recibir resumen semanal de métricas' },
    { id: 'monthlyReport', title: 'Reporte mensual', description: 'Recibir resumen mensual de métricas' },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Preferencias de Notificaciones</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Selecciona cómo deseas recibir notificaciones
        </p>
      </div>

      <div className="space-y-4">
        {options.map((option) => (
          <div key={option.id} className="flex items-center justify-between">
            <div className="flex items-center">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{option.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{option.description}</p>
              </div>
            </div>
            <button
              type="button"
              className={`${
                state.settings[option.id as keyof NotificationSettings]
                  ? 'bg-blue-600'
                  : 'bg-gray-200 dark:bg-gray-600'
              } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              onClick={() => handleToggle(option.id as keyof NotificationSettings)}
            >
              <span
                aria-hidden="true"
                className={`${
                  state.settings[option.id as keyof NotificationSettings] ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
              />
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-6">
        <button
          onClick={handleSave}
          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Guardar cambios
        </button>
      </div>
    </div>
  );
};

const SecuritySettings: React.FC = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Configuración de seguridad actualizada:', formData);
    // Aquí iría la lógica para guardar los cambios
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Contraseña</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Cambia tu contraseña de forma segura
        </p>
      </div>

      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-4">
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Contraseña actual
          </label>
          <input
            type="password"
            name="currentPassword"
            id="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="sm:col-span-4">
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Nueva contraseña
          </label>
          <input
            type="password"
            name="newPassword"
            id="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="sm:col-span-4">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Confirmar nueva contraseña
          </label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Actualizar contraseña
        </button>
      </div>
    </form>
  );
};

export default SettingsTemplate;