import React, { useMemo } from 'react';
import { Layout } from '../components/layout/Layout';
import { StatCard, Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import {
  ShoppingBag, DollarSign, Users, TrendingUp,
  Package, ArrowRight, ShoppingCart
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { DEMO_ORDERS, DEMO_PRODUCTS, DEMO_CUSTOMERS, getWeeklySalesData, getMonthlySalesData } from '../data/demoData';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

export default function Dashboard() {
  const navigate = useNavigate();
  const weeklySales = useMemo(() => getWeeklySalesData(), []);
  const monthlySales = useMemo(() => getMonthlySalesData().slice(0, 7), []);

  // Calculate stats from demo orders
  const todayOrders = DEMO_ORDERS.slice(0, 8);
  const todaySales = todayOrders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = DEMO_ORDERS.length;
  const totalRevenue = DEMO_ORDERS.reduce((sum, o) => sum + o.total, 0);
  const avgOrderValue = totalRevenue / totalOrders;

  // Best selling products
  const productSales: Record<string, { name: string; qty: number; revenue: number }> = {};
  DEMO_ORDERS.forEach(order => {
    order.items.forEach((item: any) => {
      if (!productSales[item.productId]) {
        productSales[item.productId] = { name: item.name, qty: 0, revenue: 0 };
      }
      productSales[item.productId].qty += item.quantity;
      productSales[item.productId].revenue += item.price * item.quantity;
    });
  });
  const bestSelling = Object.entries(productSales)
    .sort((a, b) => b[1].qty - a[1].qty)
    .slice(0, 5)
    .map(([id, data]) => ({ id, ...data }));

  // Payment method distribution
  const paymentDist = DEMO_ORDERS.reduce((acc: any, o) => {
    acc[o.paymentMethod] = (acc[o.paymentMethod] || 0) + 1;
    return acc;
  }, {});
  const paymentData = Object.entries(paymentDist).map(([method, count]) => ({
    name: method.charAt(0).toUpperCase() + method.slice(1),
    value: count as number
  }));

  // Low stock products
  const lowStock = DEMO_PRODUCTS.filter(p => p.stock <= p.lowStockAlert).slice(0, 5);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700">
          <p className="text-xs text-slate-500 mb-1">{label}</p>
          {payload.map((p: any, i: number) => (
            <p key={i} className="text-sm font-semibold" style={{ color: p.color }}>
              {p.name}: {typeof p.value === 'number' && p.name !== 'orders'
                ? formatCurrency(p.value)
                : p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Layout title="Dashboard" subtitle={`Welcome back! Here's what's happening today.`}>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Today's Sales"
          value={formatCurrency(todaySales)}
          subtitle={`${todayOrders.length} orders today`}
          icon={<DollarSign className="w-5 h-5 text-indigo-600" />}
          iconBg="bg-indigo-50 dark:bg-indigo-500/10"
          trend={{ value: 12.5, label: 'vs yesterday' }}
        />
        <StatCard
          title="Total Orders"
          value={totalOrders.toLocaleString()}
          subtitle="All time orders"
          icon={<ShoppingBag className="w-5 h-5 text-emerald-600" />}
          iconBg="bg-emerald-50 dark:bg-emerald-500/10"
          trend={{ value: 8.2, label: 'vs last week' }}
        />
        <StatCard
          title="Total Customers"
          value={DEMO_CUSTOMERS.length.toLocaleString()}
          subtitle="Active customers"
          icon={<Users className="w-5 h-5 text-blue-600" />}
          iconBg="bg-blue-50 dark:bg-blue-500/10"
          trend={{ value: 5.1, label: 'this month' }}
        />
        <StatCard
          title="Avg Order Value"
          value={formatCurrency(Math.round(avgOrderValue))}
          subtitle="Per transaction"
          icon={<TrendingUp className="w-5 h-5 text-amber-600" />}
          iconBg="bg-amber-50 dark:bg-amber-500/10"
          trend={{ value: -2.3, label: 'vs last month' }}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        {/* Weekly Sales Chart */}
        <Card className="xl:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Weekly Sales</h3>
              <p className="text-xs text-slate-400 mt-0.5">Revenue this week</p>
            </div>
            <Badge variant="info">This Week</Badge>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weeklySales}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-700" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="sales" name="Revenue" stroke="#6366f1" strokeWidth={2}
                fill="url(#salesGrad)" dot={{ fill: '#6366f1', r: 4 }} activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Payment Methods */}
        <Card>
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Payment Methods</h3>
            <p className="text-xs text-slate-400 mt-0.5">Order distribution</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={paymentData} cx="50%" cy="50%" innerRadius={50} outerRadius={75}
                paddingAngle={3} dataKey="value">
                {paymentData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => [`${value} orders`, '']} />
              <Legend iconType="circle" iconSize={8}
                formatter={(value) => <span className="text-xs text-slate-600 dark:text-slate-400">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Monthly Revenue */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        <Card className="xl:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Monthly Revenue</h3>
              <p className="text-xs text-slate-400 mt-0.5">Revenue vs Expenses</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlySales} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-700" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" name="Revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="#f1f5f9" radius={[4, 4, 0, 0]}
                className="dark:fill-slate-700" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Best Selling Products */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Best Selling</h3>
            <button
              onClick={() => navigate('/products')}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {bestSelling.map((product, index) => (
              <div key={product.id} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">#{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-800 dark:text-white truncate">{product.name}</p>
                  <p className="text-xs text-slate-400">{product.qty} sold</p>
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">
                  {formatCurrency(product.revenue)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Recent Transactions */}
        <Card className="xl:col-span-2" padding={false}>
          <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Recent Transactions</h3>
            <button
              onClick={() => navigate('/orders')}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-slate-700/50">
            {DEMO_ORDERS.slice(0, 7).map((order) => (
              <div key={order.id} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                <div className="w-9 h-9 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ShoppingCart className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-white">{order.orderId}</p>
                  <p className="text-xs text-slate-400">{order.customerName} · {order.items.length} items</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{formatCurrency(order.total)}</p>
                  <Badge variant={order.status === 'completed' ? 'success' : 'danger'} size="sm">
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Low Stock Alert */}
        <Card padding={false}>
          <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Stock Alerts</h3>
            <button
              onClick={() => navigate('/inventory')}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              Manage <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-slate-700/50">
            {lowStock.map((product) => (
              <div key={product.id} className="flex items-center gap-3 px-5 py-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0
                  ${product.stock === 0 ? 'bg-red-50 dark:bg-red-500/10' : 'bg-amber-50 dark:bg-amber-500/10'}`}>
                  <Package className={`w-4 h-4 ${product.stock === 0 ? 'text-red-500' : 'text-amber-500'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-800 dark:text-white truncate">{product.name}</p>
                  <p className="text-xs text-slate-400">{product.category}</p>
                </div>
                <Badge variant={product.stock === 0 ? 'danger' : 'warning'} size="sm">
                  {product.stock === 0 ? 'Out' : `${product.stock} left`}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Layout>
  );
}
