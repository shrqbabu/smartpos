import { useState, useMemo } from 'react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { DEMO_ORDERS, DEMO_EMPLOYEES, getMonthlySalesData, getWeeklySalesData } from '../data/demoData';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from 'recharts';
import { Download, TrendingUp, BarChart3, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
const formatCurrency = (v: number) => `₹${v.toLocaleString('en-IN')}`;

export default function Reports() {
  const [activeReport, setActiveReport] = useState<'sales' | 'products' | 'employees'>('sales');
  const [dateRange, setDateRange] = useState('monthly');

  const monthlySales = useMemo(() => getMonthlySalesData(), []);
  const weeklySales = useMemo(() => getWeeklySalesData(), []);

  type ChartEntry = { name: string; revenue: number; orders?: number; profit?: number; expenses?: number };
  const chartData: ChartEntry[] = dateRange === 'weekly'
    ? weeklySales.map(d => ({ name: d.day, revenue: d.sales, orders: d.orders }))
    : monthlySales.map(d => ({ name: d.month, revenue: d.revenue, profit: d.profit, expenses: d.expenses }));

  // Product sales breakdown
  const productSalesMap: Record<string, { name: string; qty: number; revenue: number }> = {};
  DEMO_ORDERS.forEach(order => {
    order.items.forEach((item: any) => {
      if (!productSalesMap[item.productId]) {
        productSalesMap[item.productId] = { name: item.name, qty: 0, revenue: 0 };
      }
      productSalesMap[item.productId].qty += item.quantity;
      productSalesMap[item.productId].revenue += item.price * item.quantity;
    });
  });
  const productStats = Object.entries(productSalesMap)
    .map(([id, d]) => ({ id, ...d }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  // Employee sales
  const employeeStats = DEMO_EMPLOYEES.map(e => ({
    name: e.name, role: e.role, sales: e.totalSales || 0,
    orders: Math.floor(Math.random() * 100) + 20
  })).sort((a, b) => b.sales - a.sales);

  // Payment method breakdown
  const paymentBreakdown = DEMO_ORDERS.reduce((acc: any, o) => {
    acc[o.paymentMethod] = (acc[o.paymentMethod] || 0) + o.total;
    return acc;
  }, {});
  const paymentData = Object.entries(paymentBreakdown).map(([method, total]) => ({
    name: method.charAt(0).toUpperCase() + method.slice(1),
    value: total as number
  }));

  const totalRevenue = DEMO_ORDERS.reduce((s, o) => s + o.total, 0);
  const totalOrders = DEMO_ORDERS.length;

  const handleExportCSV = () => {
    const headers = ['Order ID', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date'];
    const rows = DEMO_ORDERS.map(o => [
      o.orderId, o.customerName, o.items.length, o.total.toFixed(2),
      o.paymentMethod, o.status,
      (() => { try { return o.createdAt.toDate().toLocaleDateString(); } catch { return '-'; } })()
    ]);

    const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smartpos-report-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Report exported successfully!');
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 text-xs">
          <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">{label}</p>
          {payload.map((p: any, i: number) => (
            <p key={i} style={{ color: p.color }}>
              {p.name}: {typeof p.value === 'number' ? formatCurrency(p.value) : p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Layout title="Reports & Analytics" subtitle="Detailed business insights and reports">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Revenue', value: formatCurrency(totalRevenue), color: 'indigo', change: '+12%' },
          { label: 'Total Orders', value: totalOrders, color: 'emerald', change: '+8%' },
          { label: 'Avg Order Value', value: formatCurrency(Math.round(totalRevenue / totalOrders)), color: 'amber', change: '+3%' },
          { label: 'Total Products Sold', value: DEMO_ORDERS.reduce((s, o) => s + o.items.reduce((a: number, i: any) => a + i.quantity, 0), 0), color: 'purple', change: '+15%' },
        ].map(s => (
          <Card key={s.label}>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{s.label}</p>
            <p className={`text-xl font-bold text-${s.color}-600 dark:text-${s.color}-400`}>{s.value}</p>
            <Badge variant="success" size="sm">{s.change} vs last period</Badge>
          </Card>
        ))}
      </div>

      {/* Report Tabs & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          {[
            { id: 'sales', label: '📈 Sales', icon: TrendingUp },
            { id: 'products', label: '📦 Products', icon: BarChart3 },
            { id: 'employees', label: '👥 Employees', icon: FileText }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveReport(tab.id as any)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeReport === tab.id
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            className="text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-600 dark:text-slate-400 focus:outline-none"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <Button variant="outline" icon={<Download className="w-4 h-4" />} onClick={handleExportCSV}>
            Export CSV
          </Button>
        </div>
      </div>

      {/* Sales Report */}
      {activeReport === 'sales' && (
        <div className="space-y-4">
          {/* Revenue Chart */}
          <Card>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-5">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-700" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                  tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#6366f1" strokeWidth={2}
                  dot={{ fill: '#6366f1', r: 4 }} activeDot={{ r: 6 }} />
                {dateRange === 'monthly' && (
                  <Line type="monotone" dataKey="profit" name="Profit" stroke="#10b981" strokeWidth={2}
                    dot={{ fill: '#10b981', r: 4 }} activeDot={{ r: 6 }} />
                )}
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Payment Methods */}
            <Card>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Revenue by Payment Method</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={paymentData} cx="50%" cy="50%" outerRadius={80} innerRadius={50}
                    paddingAngle={3} dataKey="value">
                    {paymentData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: any) => formatCurrency(v)} />
                  <Legend iconType="circle" iconSize={8}
                    formatter={v => <span className="text-xs text-slate-600 dark:text-slate-400">{v}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            {/* Order Status Breakdown */}
            <Card>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Orders by Status</h3>
              <div className="space-y-3">
                {[
                  { status: 'Completed', count: DEMO_ORDERS.filter(o => o.status === 'completed').length, color: '#10b981' },
                  { status: 'Refunded', count: DEMO_ORDERS.filter(o => o.status === 'refunded').length, color: '#ef4444' },
                ].map(s => (
                  <div key={s.status}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-slate-600 dark:text-slate-400">{s.status}</span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">{s.count}</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all"
                        style={{ width: `${(s.count / DEMO_ORDERS.length) * 100}%`, backgroundColor: s.color }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-900/30 rounded-xl">
                <h4 className="text-xs font-semibold text-slate-500 mb-3">QUICK STATS</h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Best Day', value: 'Saturday', sub: formatCurrency(15200) },
                    { label: 'Best Method', value: 'UPI', sub: '48% orders' },
                    { label: 'Peak Hour', value: '7 PM - 9 PM', sub: '32% orders' },
                    { label: 'Return Rate', value: '4%', sub: 'of orders' },
                  ].map(s => (
                    <div key={s.label} className="bg-white dark:bg-slate-800 rounded-lg p-2.5">
                      <p className="text-xs text-slate-400">{s.label}</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-white">{s.value}</p>
                      <p className="text-xs text-slate-400">{s.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Products Report */}
      {activeReport === 'products' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Top Products by Revenue</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={productStats.slice(0, 6)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-700" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                    tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={80} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="revenue" name="Revenue" fill="#6366f1" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card padding={false}>
              <div className="p-5 border-b border-slate-100 dark:border-slate-700">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Product Performance</h3>
              </div>
              <div className="divide-y divide-slate-50 dark:divide-slate-700/50 max-h-80 overflow-y-auto">
                {productStats.map((p, i) => (
                  <div key={p.id} className="flex items-center gap-3 px-5 py-3">
                    <span className="w-6 h-6 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg flex items-center justify-center text-xs font-bold text-indigo-600">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-white truncate">{p.name}</p>
                      <p className="text-xs text-slate-400">{p.qty} units sold</p>
                    </div>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{formatCurrency(p.revenue)}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Employees Report */}
      {activeReport === 'employees' && (
        <div className="space-y-4">
          <Card>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-5">Employee Sales Performance</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={employeeStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-700" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                  tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="sales" name="Total Sales" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card padding={false}>
            <div className="p-5 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Employee Leaderboard</h3>
            </div>
            <div className="divide-y divide-slate-50 dark:divide-slate-700/50">
              {employeeStats.map((e, i) => (
                <div key={e.name} className="flex items-center gap-4 px-5 py-4">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0
                    ${i === 0 ? 'bg-amber-100 text-amber-600' : i === 1 ? 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400' : 'bg-orange-100 text-orange-600'}`}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-white">{e.name}</p>
                    <p className="text-xs text-slate-400 capitalize">{e.role} · {e.orders} orders</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(e.sales)}</p>
                    <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${(e.sales / employeeStats[0].sales) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </Layout>
  );
}
