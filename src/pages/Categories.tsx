import { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal, ConfirmModal } from '../components/ui/Modal';
import { Input, Textarea } from '../components/ui/Input';
import { DEMO_CATEGORIES, DEMO_PRODUCTS } from '../data/demoData';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';
import toast from 'react-hot-toast';

type Category = typeof DEMO_CATEGORIES[0];

const defaultForm = { name: '', description: '', color: '#6366f1', icon: '📦' };
const EMOJIS = ['📦', '☕', '🍔', '📱', '👕', '🛒', '💊', '🍕', '🎮', '🏠', '🚗', '✈️', '🌸', '💎', '🔧', '📚'];
const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'];

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>(DEMO_CATEGORIES);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);

  const getProductCount = (catId: string) => DEMO_PRODUCTS.filter(p => p.categoryId === catId).length;

  const openAdd = () => { setEditingCategory(null); setForm(defaultForm); setShowModal(true); };
  const openEdit = (c: Category) => {
    setEditingCategory(c);
    setForm({ name: c.name, description: c.description || '', color: c.color || '#6366f1', icon: c.icon || '📦' });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name) { toast.error('Category name is required'); return; }
    setLoading(true);
    const data: Category = {
      id: editingCategory?.id || `cat-${Date.now()}`,
      name: form.name,
      description: form.description,
      color: form.color,
      icon: form.icon
    };
    setTimeout(() => {
      if (editingCategory) {
        setCategories(prev => prev.map(c => c.id === editingCategory.id ? data : c));
        toast.success('Category updated');
      } else {
        setCategories(prev => [...prev, data]);
        toast.success('Category added');
      }
      setShowModal(false);
      setLoading(false);
    }, 300);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setCategories(prev => prev.filter(c => c.id !== deleteId));
    setDeleteId(null);
    toast.success('Category deleted');
  };

  return (
    <Layout title="Categories" subtitle="Organize your products into categories">
      <div className="flex justify-end mb-5">
        <Button onClick={openAdd} icon={<Plus className="w-4 h-4" />}>Add Category</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(cat => (
          <Card key={cat.id} className="group">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ backgroundColor: `${cat.color}20` }}
                >
                  {cat.icon}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">{cat.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{cat.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                      style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                    >
                      {getProductCount(cat.id)} products
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(cat)}
                  className="p-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-slate-400 hover:text-indigo-600 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => setDeleteId(cat.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Color bar */}
            <div className="mt-4 h-1 rounded-full" style={{ backgroundColor: cat.color }} />
          </Card>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={loading}>{editingCategory ? 'Update' : 'Add'} Category</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input label="Category Name *" placeholder="e.g. Beverages" value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          
          <Textarea label="Description" placeholder="Brief description..." value={form.description} rows={2}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />

          {/* Icon Picker */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Icon</label>
            <div className="grid grid-cols-8 gap-2">
              {EMOJIS.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setForm(p => ({ ...p, icon: emoji }))}
                  className={`w-9 h-9 text-xl rounded-lg flex items-center justify-center transition-all
                    ${form.icon === emoji
                      ? 'bg-indigo-100 dark:bg-indigo-500/20 ring-2 ring-indigo-500'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Color</label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setForm(p => ({ ...p, color }))}
                  className={`w-8 h-8 rounded-full transition-all ${form.color === color ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : ''}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900/30 rounded-xl">
            <p className="text-xs text-slate-400 mb-2">Preview</p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ backgroundColor: `${form.color}20` }}>
                {form.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{form.name || 'Category Name'}</p>
                <p className="text-xs text-slate-400">{form.description || 'Description'}</p>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Category" message="Products in this category will not be deleted, but will become uncategorized." />
    </Layout>
  );
}
