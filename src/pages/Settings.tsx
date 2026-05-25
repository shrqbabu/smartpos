import { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select, Textarea } from '../components/ui/Input';
import { DEMO_SETTINGS } from '../data/demoData';
import { Save, Store, CreditCard, Bell, Shield, Palette, Database, Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';

const tabs = [
  { id: 'general', label: 'General', icon: Store },
  { id: 'billing', label: 'Billing & Tax', icon: CreditCard },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'data', label: 'Data & Backup', icon: Database },
];

export default function Settings() {
  const { theme, toggleTheme } = useApp();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(DEMO_SETTINGS);
  const [notifications, setNotifications] = useState({
    lowStock: true, newOrder: true, dailyReport: false, emailAlerts: true, smsAlerts: false
  });

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('smartpos-settings', JSON.stringify(settings));
      toast.success('Settings saved successfully!');
      setLoading(false);
    }, 600);
  };

  const handleExportData = () => {
    const data = { settings, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smartpos-backup-${Date.now()}.json`;
    a.click();
    toast.success('Data exported successfully!');
  };

  return (
    <Layout title="Settings" subtitle="Configure your SmartPOS system">
      <div className="flex gap-6">
        {/* Sidebar tabs */}
        <div className="w-52 flex-shrink-0">
          <Card padding={false}>
            <div className="p-2 space-y-0.5">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all
                    ${activeTab === tab.id
                      ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    }`}
                >
                  <tab.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="flex-1 min-w-0">
          {/* General Settings */}
          {activeTab === 'general' && (
            <Card>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-5">Store Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Input label="Store Name" value={settings.storeName}
                    onChange={e => setSettings(p => ({ ...p, storeName: e.target.value }))} />
                </div>
                <Input label="Phone Number" value={settings.storePhone}
                  onChange={e => setSettings(p => ({ ...p, storePhone: e.target.value }))} />
                <Input label="Email Address" type="email" value={settings.storeEmail}
                  onChange={e => setSettings(p => ({ ...p, storeEmail: e.target.value }))} />
                <div className="col-span-2">
                  <Textarea label="Store Address" value={settings.storeAddress} rows={2}
                    onChange={e => setSettings(p => ({ ...p, storeAddress: e.target.value }))} />
                </div>
                <Select
                  label="Timezone"
                  options={[
                    { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST +5:30)' },
                    { value: 'America/New_York', label: 'America/New_York (EST -5:00)' },
                    { value: 'Europe/London', label: 'Europe/London (GMT)' },
                    { value: 'Asia/Dubai', label: 'Asia/Dubai (GST +4:00)' },
                  ]}
                  value={settings.timezone}
                  onChange={e => setSettings(p => ({ ...p, timezone: e.target.value }))}
                />
                <Select
                  label="Language"
                  options={[
                    { value: 'en', label: 'English' },
                    { value: 'hi', label: 'Hindi' },
                    { value: 'mr', label: 'Marathi' },
                    { value: 'ta', label: 'Tamil' },
                  ]}
                  value={settings.language}
                  onChange={e => setSettings(p => ({ ...p, language: e.target.value }))}
                />
                <div className="col-span-2">
                  <Textarea label="Receipt Footer Message" value={settings.receiptFooter} rows={2}
                    onChange={e => setSettings(p => ({ ...p, receiptFooter: e.target.value }))} />
                </div>
              </div>
              <div className="flex justify-end mt-5">
                <Button onClick={handleSave} loading={loading} icon={<Save className="w-4 h-4" />}>
                  Save Changes
                </Button>
              </div>
            </Card>
          )}

          {/* Billing Settings */}
          {activeTab === 'billing' && (
            <Card>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-5">Billing & Tax Configuration</h2>
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Currency"
                  options={[
                    { value: '₹', label: '₹ Indian Rupee (INR)' },
                    { value: '$', label: '$ US Dollar (USD)' },
                    { value: '€', label: '€ Euro (EUR)' },
                    { value: '£', label: '£ British Pound (GBP)' },
                    { value: 'د.إ', label: 'د.إ UAE Dirham (AED)' },
                  ]}
                  value={settings.currency}
                  onChange={e => setSettings(p => ({ ...p, currency: e.target.value }))}
                />
                <Input label="Tax Name (e.g. GST, VAT)" value={settings.taxName}
                  onChange={e => setSettings(p => ({ ...p, taxName: e.target.value }))} />
                <Input label="Default Tax Rate (%)" type="number" value={settings.taxRate.toString()}
                  onChange={e => setSettings(p => ({ ...p, taxRate: parseFloat(e.target.value) || 0 }))} />
                <Input label="Low Stock Alert Threshold" type="number" value={settings.lowStockThreshold.toString()}
                  onChange={e => setSettings(p => ({ ...p, lowStockThreshold: parseInt(e.target.value) || 0 }))} />
              </div>

              <div className="mt-5 p-4 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl border border-indigo-100 dark:border-indigo-500/20">
                <h3 className="text-sm font-semibold text-indigo-800 dark:text-indigo-300 mb-2">🇮🇳 GST Configuration</h3>
                <p className="text-xs text-indigo-600 dark:text-indigo-400">
                  Configure GST slabs: 0%, 5%, 12%, 18%, 28% per product category. 
                  Each product can have its own tax rate configured in the Products section.
                </p>
              </div>

              <div className="flex justify-end mt-5">
                <Button onClick={handleSave} loading={loading} icon={<Save className="w-4 h-4" />}>
                  Save Changes
                </Button>
              </div>
            </Card>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <Card>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-5">Notification Preferences</h2>
              <div className="space-y-4">
                {[
                  { key: 'lowStock', label: 'Low Stock Alerts', desc: 'Get notified when products run low' },
                  { key: 'newOrder', label: 'New Order Notifications', desc: 'Notify when a new order is placed' },
                  { key: 'dailyReport', label: 'Daily Sales Report', desc: 'Receive daily summary at end of day' },
                  { key: 'emailAlerts', label: 'Email Notifications', desc: 'Send alerts to store email' },
                  { key: 'smsAlerts', label: 'SMS Notifications', desc: 'Send SMS alerts to registered number' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/30 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-white">{item.label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifications(p => ({ ...p, [item.key]: !p[item.key as keyof typeof p] }))}
                      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
                        notifications[item.key as keyof typeof notifications] ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
                      }`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        notifications[item.key as keyof typeof notifications] ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Appearance */}
          {activeTab === 'appearance' && (
            <Card>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-5">Appearance Settings</h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Theme</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'light', label: 'Light Mode', emoji: '☀️', desc: 'Clean light interface' },
                      { value: 'dark', label: 'Dark Mode', emoji: '🌙', desc: 'Easy on the eyes' },
                    ].map(t => (
                      <button
                        key={t.value}
                        onClick={() => theme !== t.value && toggleTheme()}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          theme === t.value
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-2xl">{t.emoji}</span>
                        <p className="text-sm font-semibold text-slate-800 dark:text-white mt-2">{t.label}</p>
                        <p className="text-xs text-slate-400">{t.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Accent Color</label>
                  <div className="flex gap-2">
                    {['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'].map(color => (
                      <button
                        key={color}
                        className="w-9 h-9 rounded-full ring-2 ring-offset-2 ring-transparent hover:ring-slate-300 transition-all"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <Card>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-5">Security Settings</h2>
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Firestore Security Rules</p>
                  </div>
                  <pre className="text-xs text-emerald-700 dark:text-emerald-400 font-mono mt-2 overflow-x-auto">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users - only authenticated users
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId
        || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    // Products - read for all auth, write for admin/manager
    match /products/{productId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'manager'];
    }
    // Orders - create for all auth, read/update for admin
    match /orders/{orderId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null;
      allow update, delete: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}`}
                  </pre>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {[
                    { label: 'Two-Factor Authentication', desc: 'Add extra security to admin accounts', enabled: false },
                    { label: 'Session Timeout', desc: 'Auto logout after 30 minutes of inactivity', enabled: true },
                    { label: 'Audit Logs', desc: 'Track all admin actions', enabled: true },
                    { label: 'IP Whitelist', desc: 'Restrict access to specific IP addresses', enabled: false },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900/30 rounded-xl">
                      <div>
                        <p className="text-sm font-medium text-slate-800 dark:text-white">{item.label}</p>
                        <p className="text-xs text-slate-400">{item.desc}</p>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        item.enabled ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                      }`}>
                        {item.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Data & Backup */}
          {activeTab === 'data' && (
            <Card>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-5">Data Management & Backup</h2>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-500/10 rounded-xl border border-blue-100 dark:border-blue-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Globe className="w-4 h-4 text-blue-600" />
                    <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">Firebase Deployment Instructions</p>
                  </div>
                  <div className="text-xs text-blue-700 dark:text-blue-400 font-mono mt-2 space-y-1">
                    <p># Install Firebase CLI</p>
                    <p>npm install -g firebase-tools</p>
                    <p># Login and init</p>
                    <p>firebase login</p>
                    <p>firebase init hosting</p>
                    <p># Build and deploy</p>
                    <p>npm run build</p>
                    <p>firebase deploy</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleExportData}
                    className="p-4 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-200 dark:border-slate-700 text-left hover:border-indigo-300 transition-colors"
                  >
                    <Database className="w-5 h-5 text-indigo-600 mb-2" />
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">Export Data</p>
                    <p className="text-xs text-slate-400 mt-0.5">Download all data as JSON backup</p>
                  </button>

                  <div className="p-4 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-200 dark:border-slate-700 text-left">
                    <Shield className="w-5 h-5 text-emerald-600 mb-2" />
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">Firebase Sync</p>
                    <p className="text-xs text-slate-400 mt-0.5">Real-time sync with Firebase Firestore</p>
                    <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">Configure Firebase</span>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-500/10 rounded-xl border border-amber-100 dark:border-amber-500/20">
                  <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">⚠️ Demo Mode Active</p>
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    This app is running in demo mode with sample data. To use real Firebase:
                    <br />1. Create a Firebase project at console.firebase.google.com
                    <br />2. Enable Authentication, Firestore & Storage
                    <br />3. Update <code className="bg-amber-100 dark:bg-amber-900/30 px-1 rounded">src/firebase/config.ts</code> with your credentials
                    <br />4. Deploy Firestore security rules
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
