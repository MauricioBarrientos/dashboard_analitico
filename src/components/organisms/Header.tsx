import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../atoms/Button';

interface HeaderProps {
  title: string;
  userName: string;
}

const Header: React.FC<HeaderProps> = ({ title, userName }) => {
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-gray-800 dark:to-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-lg sm:text-xl font-bold truncate max-w-[200px] sm:max-w-none">{title}</h1>
          </div>
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Button
              variant="ghost"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-white hover:bg-blue-700 dark:hover:bg-gray-700 p-2"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </Button>
            <div className="relative group">
              <div className="flex items-center cursor-pointer">
                <span className="text-white hidden sm:inline mr-2 truncate max-w-[80px]">{userName}</span>
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold text-sm sm:text-base">
                  {userName.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 hidden group-hover:block z-50">
                <div className="py-1">
                  <button
                    onClick={() => navigate('/settings')}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                  >
                    Configuración
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;