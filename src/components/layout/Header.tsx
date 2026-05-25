import React, { useState } from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { DEMO_PRODUCTS } from '../../data/demoData';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const { userProfile } = useAuth();
  const { toggleSidebar } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  // Low stock alerts
  const lowStockItems = DEMO_PRODUCTS.filter(p => p.stock > 0 && p.stock <= p.lowStockAlert);
  const outOfStockItems = DEMO_PRODUCTS.filter(p => p.stock === 0);
  const notificationCount = lowStockItems.length + outOfStockItems.length;

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700/80 flex items-center px-4 lg:px-6 gap-4 flex-shrink-0">
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Title */}
      <div className="flex-1">
        <h1 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>

          {/* Notification dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {outOfStockItems.map(item => (
                  <div key={item.id} className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 border-b border-slate-50 dark:border-slate-700/50">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-red-100 dark:bg-red-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-xs">🚫</span>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-800 dark:text-white">{item.name} is out of stock</p>
                        <p className="text-xs text-slate-400 mt-0.5">Restock required immediately</p>
                      </div>
                    </div>
                  </div>
                ))}
                {lowStockItems.map(item => (
                  <div key={item.id} className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 border-b border-slate-50 dark:border-slate-700/50">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-amber-100 dark:bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-xs">⚠️</span>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-800 dark:text-white">{item.name} is low on stock</p>
                        <p className="text-xs text-slate-400 mt-0.5">Only {item.stock} units remaining</p>
                      </div>
                    </div>
                  </div>
                ))}
                {notificationCount === 0 && (
                  <div className="px-4 py-8 text-center">
                    <p className="text-sm text-slate-400">All good! No alerts.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User avatar */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
            <span className="text-xs font-bold text-white">
              {userProfile?.displayName?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-800 dark:text-white leading-none">
              {userProfile?.displayName || 'User'}
            </p>
            <p className="text-xs text-slate-400 capitalize leading-none mt-0.5">
              {userProfile?.role || 'cashier'}
            </p>
          </div>
        </div>
      </div>

      {/* Click outside to close */}
      {showNotifications && (
        <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
      )}
    </header>
  );
};
