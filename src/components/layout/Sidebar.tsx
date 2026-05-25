import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingCart, Package, Users, UserCog,
  BarChart3, Settings, LogOut, ChevronLeft, ChevronRight,
  Warehouse, FileText, Tag, Zap, Moon, Sun
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { DEMO_SETTINGS } from '../../data/demoData';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', roles: ['admin', 'manager', 'cashier'] },
  { icon: ShoppingCart, label: 'POS Billing', path: '/pos', roles: ['admin', 'manager', 'cashier'] },
  { icon: Package, label: 'Products', path: '/products', roles: ['admin', 'manager'] },
  { icon: Tag, label: 'Categories', path: '/categories', roles: ['admin', 'manager'] },
  { icon: Users, label: 'Customers', path: '/customers', roles: ['admin', 'manager', 'cashier'] },
  { icon: UserCog, label: 'Employees', path: '/employees', roles: ['admin'] },
  { icon: Warehouse, label: 'Inventory', path: '/inventory', roles: ['admin', 'manager'] },
  { icon: FileText, label: 'Orders', path: '/orders', roles: ['admin', 'manager', 'cashier'] },
  { icon: BarChart3, label: 'Reports', path: '/reports', roles: ['admin', 'manager'] },
  { icon: Settings, label: 'Settings', path: '/settings', roles: ['admin'] },
];

export const Sidebar: React.FC = () => {
  const { userProfile } = useAuth();
  const { sidebarOpen, toggleSidebar, theme, toggleTheme } = useApp();
  const navigate = useNavigate();

  const userRole = userProfile?.role || 'cashier';
  const filteredNav = navItems.filter(item => item.roles.includes(userRole));

  const handleLogout = () => {
    localStorage.removeItem('smartpos-demo-user');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <aside className={`
      fixed left-0 top-0 h-full z-30 flex flex-col
      bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-700/80
      transition-all duration-300 ease-in-out shadow-sm
      ${sidebarOpen ? 'w-64' : 'w-16'}
    `}>
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-slate-100 dark:border-slate-700/80 flex-shrink-0">
        <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 text-white" />
        </div>
        {sidebarOpen && (
          <div className="ml-3 min-w-0">
            <h1 className="text-base font-bold text-slate-900 dark:text-white truncate">SmartPOS</h1>
            <p className="text-xs text-slate-400 truncate">{DEMO_SETTINGS.storeName}</p>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="ml-auto p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors flex-shrink-0"
        >
          {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {filteredNav.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center rounded-xl px-3 py-2.5 transition-all duration-200 group
              ${isActive
                ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }
              ${!sidebarOpen ? 'justify-center' : ''}
            `}
            title={!sidebarOpen ? item.label : undefined}
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
                {sidebarOpen && (
                  <span className="ml-3 text-sm font-medium truncate">{item.label}</span>
                )}
                {!sidebarOpen && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 dark:bg-slate-700 text-white text-xs rounded-lg
                    opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50 shadow-lg">
                    {item.label}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="border-t border-slate-100 dark:border-slate-700/80 p-2 space-y-0.5 flex-shrink-0">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className={`flex items-center w-full rounded-xl px-3 py-2.5 text-slate-500 dark:text-slate-400
            hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all
            ${!sidebarOpen ? 'justify-center' : ''}`}
          title={!sidebarOpen ? (theme === 'dark' ? 'Light Mode' : 'Dark Mode') : undefined}
        >
          {theme === 'dark'
            ? <Sun className="w-5 h-5 flex-shrink-0" />
            : <Moon className="w-5 h-5 flex-shrink-0" />
          }
          {sidebarOpen && (
            <span className="ml-3 text-sm font-medium">
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
          )}
        </button>

        {/* User profile */}
        <div className={`flex items-center rounded-xl px-3 py-2.5 ${sidebarOpen ? '' : 'justify-center'}`}>
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-white">
              {userProfile?.displayName?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          {sidebarOpen && (
            <div className="ml-2.5 flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">
                {userProfile?.displayName || 'User'}
              </p>
              <p className="text-xs text-slate-400 truncate capitalize">{userProfile?.role || 'cashier'}</p>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`flex items-center w-full rounded-xl px-3 py-2.5 text-slate-500 dark:text-slate-400
            hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-all
            ${!sidebarOpen ? 'justify-center' : ''}`}
          title={!sidebarOpen ? 'Logout' : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {sidebarOpen && <span className="ml-3 text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
};
