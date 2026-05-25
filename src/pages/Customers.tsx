import { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table } from '../components/ui/Table';
import { Modal, ConfirmModal } from '../components/ui/Modal';
import { Input, Textarea } from '../components/ui/Input';
import { DEMO_CUSTOMERS, DEMO_ORDERS } from '../data/demoData';
import { Plus, Search, Edit, Trash2, Users, Star, Eye, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

type Customer = typeof DEMO_CUSTOMERS[0];

const defaultForm = { name: '', phone: '', email: '', address: '', loyaltyPoints: '0' };

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>(DEMO_CUSTOMERS);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);

  const filtered = customers.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  );

  const openAdd = () => { setEditingCustomer(null); setForm(defaultForm); setShowModal(true); };
  const openEdit = (c: Customer) => {
    setEditingCustomer(c);
    setForm({ name: c.name, phone: c.phone, email: c.email || '', address: c.address || '', loyaltyPoints: String(c.loyaltyPoints) });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name || !form.phone) { toast.error('Name and phone are required'); return; }
    setLoading(true);
    const data: Customer = {
      id: editingCustomer?.id || `c-${Date.now()}`,
      name: form.name, phone: form.phone, email: form.email, address: form.address,
      loyaltyPoints: parseInt(form.loyaltyPoints) || 0,
      totalPurchases: editingCustomer?.totalPurchases || 0
    };
    setTimeout(() => {
      if (editingCustomer) {
        setCustomers(prev => prev.map(c => c.id === editingCustomer.id ? data : c));
        toast.success('Customer updated');
      } else {
        setCustomers(prev => [data, ...prev]);
        toast.success('Customer added');
      }
      setShowModal(false);
      setLoading(false);
    }, 400);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setCustomers(prev => prev.filter(c => c.id !== deleteId));
    setDeleteId(null);
    toast.success('Customer deleted');
  };

  // Get customer orders
  const getCustomerOrders = (customerId: string) =>
    DEMO_ORDERS.filter(o => o.customerId === customerId);

  const formatCurrency = (v: number) => `₹${v.toLocaleString('en-IN')}`;

  const getLoyaltyTier = (points: number) => {
    if (points >= 500) return { label: 'Gold', variant: 'warning' as const };
    if (points >= 200) return { label: 'Silver', variant: 'default' as const };
    return { label: 'Bronze', variant: 'info' as const };
  };

  const columns = [
    {
      key: 'name', title: 'Customer',
      render: (_: any, row: Customer) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-100 dark:bg-indigo-500/10 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-indigo-600">{row.name[0]}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-white">{row.name}</p>
            <p className="text-xs text-slate-400 flex items-center gap-1"><Phone className="w-3 h-3" />{row.phone}</p>
          </div>
        </div>
      )
    },
    { key: 'email', title: 'Email',
      render: (v: string) => <span className="text-sm text-slate-500 dark:text-slate-400">{v || '-'}</span>
    },
    { key: 'loyaltyPoints', title: 'Loyalty Points', align: 'center' as const,
      render: (v: number) => {
        const tier = getLoyaltyTier(v);
        return (
          <div className="flex items-center justify-center gap-2">
            <Star className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-semibold text-slate-900 dark:text-white">{v}</span>
            <Badge variant={tier.variant} size="sm">{tier.label}</Badge>
          </div>
        );
      }
    },
    { key: 'totalPurchases', title: 'Total Spent', align: 'right' as const,
      render: (v: number) => <span className="text-sm font-semibold text-slate-900 dark:text-white">{formatCurrency(v || 0)}</span>
    },
    {
      key: 'actions', title: '', align: 'right' as const,
      render: (_: any, row: Customer) => (
        <div className="flex items-center justify-end gap-1.5">
          <button onClick={() => setViewCustomer(row)} className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 text-slate-400 hover:text-blue-600 transition-colors">
            <Eye className="w-4 h-4" />
          </button>
          <button onClick={() => openEdit(row)} className="p-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-slate-400 hover:text-indigo-600 transition-colors">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => setDeleteId(row.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <Layout title="Customers" subtitle="Manage customer relationships">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Customers', value: customers.length, color: 'indigo' },
          { label: 'Gold Members', value: customers.filter(c => c.loyaltyPoints >= 500).length, color: 'amber' },
          { label: 'Avg Loyalty Pts', value: Math.round(customers.reduce((s, c) => s + c.loyaltyPoints, 0) / customers.length), color: 'purple' },
          { label: 'Total Revenue', value: formatCurrency(customers.reduce((s, c) => s + (c.totalPurchases || 0), 0)), color: 'emerald' },
        ].map(s => (
          <Card key={s.label}>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{s.label}</p>
            <p className={`text-xl font-bold text-${s.color}-600 dark:text-${s.color}-400`}>{s.value}</p>
          </Card>
        ))}
      </div>

      <Card padding={false}>
        <div className="flex items-center gap-3 p-5 border-b border-slate-100 dark:border-slate-700">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
            />
          </div>
          <Button onClick={openAdd} icon={<Plus className="w-4 h-4" />}>Add Customer</Button>
        </div>

        <Table columns={columns} data={filtered} emptyMessage="No customers found"
          emptyIcon={<Users className="w-12 h-12" />} rowKey={r => r.id} />
      </Card>

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}
        title={editingCustomer ? 'Edit Customer' : 'Add Customer'}
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={loading}>{editingCustomer ? 'Update' : 'Add'} Customer</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input label="Full Name *" placeholder="John Doe" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          <Input label="Phone Number *" placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
          <Input label="Email" type="email" placeholder="john@email.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
          <Textarea label="Address" placeholder="Street, City, State" value={form.address} rows={2} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} />
          <Input label="Loyalty Points" type="number" value={form.loyaltyPoints} onChange={e => setForm(p => ({ ...p, loyaltyPoints: e.target.value }))} />
        </div>
      </Modal>

      {/* View Customer Modal */}
      <Modal isOpen={!!viewCustomer} onClose={() => setViewCustomer(null)} title="Customer Profile" size="lg">
        {viewCustomer && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center">
                <span className="text-2xl font-bold text-indigo-600">{viewCustomer.name[0]}</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{viewCustomer.name}</h3>
                <p className="text-sm text-slate-500">{viewCustomer.phone}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Star className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-semibold">{viewCustomer.loyaltyPoints} pts</span>
                  <Badge variant={getLoyaltyTier(viewCustomer.loyaltyPoints).variant}>
                    {getLoyaltyTier(viewCustomer.loyaltyPoints).label}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Email', value: viewCustomer.email || 'Not provided' },
                { label: 'Total Spent', value: formatCurrency(viewCustomer.totalPurchases || 0) },
                { label: 'Address', value: viewCustomer.address || 'Not provided' },
                { label: 'Loyalty Points', value: `${viewCustomer.loyaltyPoints} pts` },
              ].map(item => (
                <div key={item.label} className="bg-slate-50 dark:bg-slate-900/30 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-1">{item.label}</p>
                  <p className="text-sm font-medium text-slate-800 dark:text-white">{item.value}</p>
                </div>
              ))}
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-3">Recent Orders</h4>
              <div className="space-y-2">
                {getCustomerOrders(viewCustomer.id).slice(0, 5).map((order, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/30 rounded-xl">
                    <div>
                      <p className="text-xs font-mono font-semibold text-indigo-600">{order.orderId}</p>
                      <p className="text-xs text-slate-400">{order.items.length} items · {order.paymentMethod}</p>
                    </div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(order.total)}</span>
                  </div>
                ))}
                {getCustomerOrders(viewCustomer.id).length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-4">No orders found</p>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Customer" message="Are you sure you want to delete this customer?" />
    </Layout>
  );
}
