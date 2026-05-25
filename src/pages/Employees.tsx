import { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table } from '../components/ui/Table';
import { Modal, ConfirmModal } from '../components/ui/Modal';
import { Input, Select } from '../components/ui/Input';
import { DEMO_EMPLOYEES } from '../data/demoData';
import { Plus, Search, Edit, Trash2, UserCog, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

type Employee = typeof DEMO_EMPLOYEES[0];

const roleOptions = [
  { value: 'cashier', label: 'Cashier' },
  { value: 'manager', label: 'Manager' },
  { value: 'admin', label: 'Admin' }
];

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
];

const defaultForm = { name: '', email: '', phone: '', role: 'cashier', salary: '', joinDate: '', status: 'active' };

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>(DEMO_EMPLOYEES);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);

  const filtered = employees.filter(e =>
    !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setEditingEmployee(null); setForm(defaultForm); setShowModal(true); };
  const openEdit = (e: Employee) => {
    setEditingEmployee(e);
    setForm({ name: e.name, email: e.email, phone: e.phone, role: e.role, salary: String(e.salary), joinDate: e.joinDate, status: e.status });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name || !form.email) { toast.error('Name and email are required'); return; }
    setLoading(true);
    const data: Employee = {
      id: editingEmployee?.id || `e-${Date.now()}`,
      name: form.name, email: form.email, phone: form.phone, role: form.role,
      salary: parseInt(form.salary) || 0, joinDate: form.joinDate, status: form.status,
      totalSales: editingEmployee?.totalSales || 0
    };
    setTimeout(() => {
      if (editingEmployee) {
        setEmployees(prev => prev.map(e => e.id === editingEmployee.id ? data : e));
        toast.success('Employee updated');
      } else {
        setEmployees(prev => [data, ...prev]);
        toast.success('Employee added');
      }
      setShowModal(false);
      setLoading(false);
    }, 400);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setEmployees(prev => prev.filter(e => e.id !== deleteId));
    setDeleteId(null);
    toast.success('Employee removed');
  };

  const formatCurrency = (v: number) => `₹${v.toLocaleString('en-IN')}`;

  const getRoleBadge = (role: string) => {
    const map: Record<string, any> = { admin: 'danger', manager: 'purple', cashier: 'info' };
    return map[role] || 'default';
  };

  const columns = [
    {
      key: 'name', title: 'Employee',
      render: (_: any, row: Employee) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-purple-100 dark:bg-purple-500/10 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-purple-600">{row.name[0]}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-white">{row.name}</p>
            <p className="text-xs text-slate-400">{row.email}</p>
          </div>
        </div>
      )
    },
    { key: 'phone', title: 'Phone',
      render: (v: string) => <span className="text-sm text-slate-600 dark:text-slate-400">{v}</span>
    },
    { key: 'role', title: 'Role',
      render: (v: string) => <Badge variant={getRoleBadge(v)} dot>{v}</Badge>
    },
    { key: 'salary', title: 'Salary', align: 'right' as const,
      render: (v: number) => <span className="text-sm font-semibold text-slate-900 dark:text-white">{formatCurrency(v)}/mo</span>
    },
    { key: 'totalSales', title: 'Total Sales', align: 'right' as const,
      render: (v: number) => (
        <div className="flex items-center justify-end gap-1">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(v)}</span>
        </div>
      )
    },
    { key: 'joinDate', title: 'Join Date',
      render: (v: string) => <span className="text-xs text-slate-500">{v}</span>
    },
    { key: 'status', title: 'Status',
      render: (v: string) => <Badge variant={v === 'active' ? 'success' : 'default'} dot>{v}</Badge>
    },
    {
      key: 'actions', title: '', align: 'right' as const,
      render: (_: any, row: Employee) => (
        <div className="flex items-center justify-end gap-1.5">
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
    <Layout title="Employees" subtitle="Manage your team members">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Employees', value: employees.length, color: 'indigo' },
          { label: 'Active', value: employees.filter(e => e.status === 'active').length, color: 'emerald' },
          { label: 'Managers', value: employees.filter(e => e.role === 'manager').length, color: 'purple' },
          { label: 'Monthly Payroll', value: formatCurrency(employees.filter(e => e.status === 'active').reduce((s, e) => s + e.salary, 0)), color: 'amber' },
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
            <input type="text" placeholder="Search employees..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white" />
          </div>
          <Button onClick={openAdd} icon={<Plus className="w-4 h-4" />}>Add Employee</Button>
        </div>
        <Table columns={columns} data={filtered} emptyMessage="No employees found"
          emptyIcon={<UserCog className="w-12 h-12" />} rowKey={r => r.id} />
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}
        title={editingEmployee ? 'Edit Employee' : 'Add Employee'}
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={loading}>{editingEmployee ? 'Update' : 'Add'} Employee</Button>
          </div>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Input label="Full Name *" placeholder="John Doe" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          </div>
          <Input label="Email *" type="email" placeholder="john@smartpos.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
          <Input label="Phone" placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
          <Select label="Role" options={roleOptions} value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} />
          <Input label="Salary (₹/month)" type="number" placeholder="25000" value={form.salary} onChange={e => setForm(p => ({ ...p, salary: e.target.value }))} />
          <Input label="Join Date" type="date" value={form.joinDate} onChange={e => setForm(p => ({ ...p, joinDate: e.target.value }))} />
          <Select label="Status" options={statusOptions} value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} />
        </div>
      </Modal>

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Remove Employee" message="Are you sure you want to remove this employee? Their data will be preserved." />
    </Layout>
  );
}
