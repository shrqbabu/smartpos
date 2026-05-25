import { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Input, Select } from '../components/ui/Input';
import { DEMO_PRODUCTS, DEMO_SUPPLIERS } from '../data/demoData';
import { Plus, Search, Package, AlertTriangle, ArrowUp, ArrowDown, Truck } from 'lucide-react';
import toast from 'react-hot-toast';

type InventoryEntry = {
  id: string;
  productId: string;
  productName: string;
  type: 'restock' | 'sale' | 'adjustment' | 'purchase';
  quantity: number;
  notes?: string;
  supplierId?: string;
  supplierName?: string;
  cost?: number;
  createdAt: string;
};

const mockHistory: InventoryEntry[] = [
  { id: 'i-1', productId: 'p-1', productName: 'Cappuccino', type: 'restock', quantity: 50, supplierName: 'Alpha Distributors', cost: 2500, createdAt: '2024-01-15 10:30' },
  { id: 'i-2', productId: 'p-3', productName: 'Cold Brew', type: 'sale', quantity: -12, createdAt: '2024-01-15 11:45' },
  { id: 'i-3', productId: 'p-7', productName: 'USB Cable', type: 'restock', quantity: 30, supplierName: 'Tech World Supply', cost: 5970, createdAt: '2024-01-14 09:00' },
  { id: 'i-4', productId: 'p-6', productName: 'Pizza Slice', type: 'sale', quantity: -20, createdAt: '2024-01-14 18:30' },
  { id: 'i-5', productId: 'p-14', productName: 'Vitamin C', type: 'restock', quantity: 10, supplierName: 'Agro Fresh', cost: 800, createdAt: '2024-01-13 12:00' },
];

const typeOptions = [
  { value: 'restock', label: 'Restock' },
  { value: 'adjustment', label: 'Adjustment' },
  { value: 'purchase', label: 'Purchase' }
];

export default function Inventory() {
  const [products, setProducts] = useState(DEMO_PRODUCTS);
  const [history, setHistory] = useState<InventoryEntry[]>(mockHistory);
  const [search, setSearch] = useState('');
  const [filterAlert, setFilterAlert] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [form, setForm] = useState({
    productId: '', quantity: '', type: 'restock', supplierId: '', notes: '', cost: ''
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'history' | 'suppliers'>('products');

  const filteredProducts = products.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    const matchAlert = !filterAlert || p.stock <= p.lowStockAlert;
    return matchSearch && matchAlert;
  });

  const handleRestock = () => {
    if (!form.productId || !form.quantity) { toast.error('Product and quantity are required'); return; }
    setLoading(true);

    const product = products.find(p => p.id === form.productId);
    const qty = parseInt(form.quantity);
    const supplier = DEMO_SUPPLIERS.find(s => s.id === form.supplierId);

    setTimeout(() => {
      setProducts(prev => prev.map(p =>
        p.id === form.productId
          ? { ...p, stock: p.stock + (form.type === 'restock' || form.type === 'purchase' ? Math.abs(qty) : qty) }
          : p
      ));

      const entry: InventoryEntry = {
        id: `i-${Date.now()}`,
        productId: form.productId,
        productName: product?.name || '',
        type: form.type as InventoryEntry['type'],
        quantity: Math.abs(qty),
        supplierName: supplier?.name,
        notes: form.notes,
        cost: form.cost ? parseFloat(form.cost) : undefined,
        createdAt: new Date().toLocaleString()
      };
      setHistory(prev => [entry, ...prev]);
      setShowRestockModal(false);
      setForm({ productId: '', quantity: '', type: 'restock', supplierId: '', notes: '', cost: '' });
      toast.success('Stock updated successfully!');
      setLoading(false);
    }, 500);
  };

  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= p.lowStockAlert).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  const productOptions = [
    { value: '', label: 'Select Product' },
    ...DEMO_PRODUCTS.map(p => ({ value: p.id, label: `${p.name} (Stock: ${p.stock})` }))
  ];

  const supplierOptions = [
    { value: '', label: 'No Supplier' },
    ...DEMO_SUPPLIERS.map(s => ({ value: s.id, label: s.name }))
  ];

  return (
    <Layout title="Inventory" subtitle="Stock management and tracking">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Products', value: products.length, color: 'indigo', icon: Package },
          { label: 'Low Stock', value: lowStockCount, color: 'amber', icon: AlertTriangle },
          { label: 'Out of Stock', value: outOfStockCount, color: 'red', icon: AlertTriangle },
          { label: 'Total Stock Value', value: `₹${products.reduce((s, p) => s + p.price * p.stock, 0).toLocaleString()}`, color: 'emerald', icon: Package },
        ].map(s => (
          <Card key={s.label}>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{s.label}</p>
            <p className={`text-xl font-bold text-${s.color}-600 dark:text-${s.color}-400`}>{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
        {[
          { id: 'products', label: 'Stock Levels' },
          { id: 'history', label: 'History' },
          { id: 'suppliers', label: 'Suppliers' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Stock Levels */}
      {activeTab === 'products' && (
        <Card padding={false}>
          <div className="flex items-center gap-3 p-5 border-b border-slate-100 dark:border-slate-700">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white" />
            </div>
            <button
              onClick={() => setFilterAlert(!filterAlert)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                filterAlert ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              Alerts Only
            </button>
            <Button onClick={() => setShowRestockModal(true)} icon={<Plus className="w-4 h-4" />}>
              Update Stock
            </Button>
          </div>

          <Table
            columns={[
              {
                key: 'name', title: 'Product',
                render: (_: any, row: any) => (
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-50 dark:bg-slate-700/50 rounded-xl flex items-center justify-center">
                      <span className="text-base">📦</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{row.name}</p>
                      <p className="text-xs text-slate-400">{row.category}</p>
                    </div>
                  </div>
                )
              },
              { key: 'barcode', title: 'Barcode', render: (v: string) => <span className="text-xs font-mono text-slate-500">{v || '-'}</span> },
              { key: 'unit', title: 'Unit', render: (v: string) => <span className="text-sm text-slate-600 dark:text-slate-400">{v}</span> },
              {
                key: 'stock', title: 'Current Stock', align: 'center' as const,
                render: (v: number, row: any) => (
                  <div className="text-center">
                    <span className={`text-lg font-bold ${v === 0 ? 'text-red-500' : v <= row.lowStockAlert ? 'text-amber-500' : 'text-slate-900 dark:text-white'}`}>
                      {v}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">{row.unit}s</span>
                  </div>
                )
              },
              {
                key: 'lowStockAlert', title: 'Alert Threshold', align: 'center' as const,
                render: (v: number) => <span className="text-sm text-slate-500">{v}</span>
              },
              {
                key: 'status', title: 'Status', align: 'center' as const,
                render: (_: any, row: any) => {
                  if (row.stock === 0) return <Badge variant="danger" dot>Out of Stock</Badge>;
                  if (row.stock <= row.lowStockAlert) return <Badge variant="warning" dot>Low Stock</Badge>;
                  return <Badge variant="success" dot>In Stock</Badge>;
                }
              },
              {
                key: 'value', title: 'Stock Value', align: 'right' as const,
                render: (_: any, row: any) => (
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    ₹{(row.price * row.stock).toLocaleString()}
                  </span>
                )
              }
            ]}
            data={filteredProducts}
            emptyMessage="No products found"
            emptyIcon={<Package className="w-12 h-12" />}
            rowKey={r => r.id}
          />
        </Card>
      )}

      {/* History */}
      {activeTab === 'history' && (
        <Card padding={false}>
          <div className="p-5 border-b border-slate-100 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Inventory History</h3>
          </div>
          <Table
            columns={[
              { key: 'createdAt', title: 'Date & Time', render: (v: string) => <span className="text-sm text-slate-600 dark:text-slate-400">{v}</span> },
              { key: 'productName', title: 'Product', render: (v: string) => <span className="text-sm font-medium text-slate-800 dark:text-white">{v}</span> },
              {
                key: 'type', title: 'Type',
                render: (v: string) => {
                  const map: Record<string, any> = { restock: 'success', sale: 'danger', adjustment: 'info', purchase: 'purple' };
                  return <Badge variant={map[v] || 'default'}>{v}</Badge>;
                }
              },
              {
                key: 'quantity', title: 'Quantity', align: 'center' as const,
                render: (v: number) => (
                  <div className="flex items-center justify-center gap-1">
                    {v > 0
                      ? <><ArrowUp className="w-3.5 h-3.5 text-emerald-500" /><span className="text-sm font-semibold text-emerald-600">+{v}</span></>
                      : <><ArrowDown className="w-3.5 h-3.5 text-red-500" /><span className="text-sm font-semibold text-red-500">{v}</span></>
                    }
                  </div>
                )
              },
              { key: 'supplierName', title: 'Supplier', render: (v: string) => <span className="text-sm text-slate-500">{v || '-'}</span> },
              { key: 'cost', title: 'Cost', align: 'right' as const, render: (v: number) => <span className="text-sm text-slate-600 dark:text-slate-400">{v ? `₹${v.toLocaleString()}` : '-'}</span> },
              { key: 'notes', title: 'Notes', render: (v: string) => <span className="text-xs text-slate-400">{v || '-'}</span> }
            ]}
            data={history}
            emptyMessage="No inventory history"
            rowKey={r => r.id}
          />
        </Card>
      )}

      {/* Suppliers */}
      {activeTab === 'suppliers' && (
        <Card padding={false}>
          <div className="p-5 border-b border-slate-100 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Supplier Directory</h3>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-slate-700/50">
            {DEMO_SUPPLIERS.map(supplier => (
              <div key={supplier.id} className="flex items-center gap-4 p-5 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Truck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{supplier.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{supplier.contact} · {supplier.phone}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{supplier.address}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {supplier.categories.map(cat => (
                    <Badge key={cat} variant="info" size="sm">{cat}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Restock Modal */}
      <Modal isOpen={showRestockModal} onClose={() => setShowRestockModal(false)}
        title="Update Stock"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowRestockModal(false)}>Cancel</Button>
            <Button onClick={handleRestock} loading={loading} icon={<ArrowUp className="w-4 h-4" />}>Update Stock</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Select label="Product *" options={productOptions} value={form.productId}
            onChange={e => setForm(p => ({ ...p, productId: e.target.value }))} />
          <Select label="Type" options={typeOptions} value={form.type}
            onChange={e => setForm(p => ({ ...p, type: e.target.value }))} />
          <Input label="Quantity *" type="number" placeholder="Enter quantity" value={form.quantity}
            onChange={e => setForm(p => ({ ...p, quantity: e.target.value }))} />
          <Select label="Supplier" options={supplierOptions} value={form.supplierId}
            onChange={e => setForm(p => ({ ...p, supplierId: e.target.value }))} />
          <Input label="Total Cost (₹)" type="number" placeholder="0.00" value={form.cost}
            onChange={e => setForm(p => ({ ...p, cost: e.target.value }))} />
          <Input label="Notes" placeholder="Any additional notes..." value={form.notes}
            onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
        </div>
      </Modal>
    </Layout>
  );
}
