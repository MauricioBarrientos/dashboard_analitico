import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Icon components
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/reports', label: 'Reportes' },
    { path: '/settings', label: 'Configuración' },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 rounded-lg bg-gray-800 text-white shadow-lg"
          aria-label="Abrir menú"
        >
          <MenuIcon />
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <aside className="relative w-64 h-full bg-gradient-to-b from-gray-800 to-gray-900 text-white shadow-xl z-50 transform transition-transform">
            <div className="p-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Analytics</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-lg hover:bg-gray-700"
                  aria-label="Cerrar menú"
                >
                  <CloseIcon />
                </button>
              </div>
              <nav>
                <ul className="space-y-1">
                  {navItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                          location.pathname === item.path
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span className="ml-3">{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-400 text-sm">
                <p>Versión 1.0.0</p>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-white shadow-xl h-full hidden md:block">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-6 pl-2">Analytics</h2>
          <nav>
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                      location.pathname === item.path
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <span className="ml-3">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="absolute bottom-0 w-full p-4 text-gray-400 text-sm">
            <p>Versión 1.0.0</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;