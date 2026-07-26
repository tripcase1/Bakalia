'use client';

import { useState } from 'react';
import { useAdminDataStore } from '@/store/useAdminDataStore';
import { Plus, Trash2, X, Grid3x3, Tag } from 'lucide-react';

export function AdminCategories() {
  const { categories, products, addCategory, deleteCategory } = useAdminDataStore();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nameBn: '', nameEn: '', slug: '' });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const getProductCount = (catId: string) => products.filter(p => p.categoryId === catId).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nameEn.trim()) return;
    addCategory({
      nameBn: form.nameBn || form.nameEn,
      nameEn: form.nameEn.trim(),
      slug: form.slug || form.nameEn.trim().toLowerCase().replace(/\s+/g, '-'),
    });
    setForm({ nameBn: '', nameEn: '', slug: '' });
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    const count = getProductCount(id);
    if (count > 0) {
      alert(`Cannot delete: ${count} product(s) use this category. Move them first.`);
      return;
    }
    deleteCategory(id);
    setDeleteId(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Category Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">{categories.length} categories · organize your product catalog</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-brand-600/30 transition active:scale-95 shrink-0">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(cat => {
          const count = getProductCount(cat.id);
          return (
            <div key={cat.id} className="bg-slate-900 p-5 rounded-2xl border border-slate-800/60 shadow-lg flex items-center justify-between group hover:border-brand-500/40 transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-600/10 border border-brand-600/20 rounded-xl flex items-center justify-center">
                  <Grid3x3 className="w-5 h-5 text-brand-400" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-sm">{cat.nameBn}</h3>
                  <p className="text-xs text-slate-400">{cat.nameEn}</p>
                  <p className="text-[10px] text-slate-600 font-mono">/cat/{cat.slug}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-black px-2 py-1 rounded-lg ${count > 0 ? 'bg-brand-600/20 text-brand-400' : 'bg-slate-800 text-slate-500'}`}>
                  {count} products
                </span>
                <button
                  onClick={() => count > 0 ? alert(`Cannot delete: ${count} product(s) are in this category.`) : setDeleteId(cat.id)}
                  className="p-2 text-slate-600 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition opacity-0 group-hover:opacity-100"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white">New Product Category</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white p-1.5 hover:bg-slate-800 rounded-lg transition"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-400 block mb-1">Category Name (Bangla)</label>
                <input type="text" value={form.nameBn} onChange={e => setForm(p => ({ ...p, nameBn: e.target.value }))} placeholder="যেমন: সামুদ্রিক মাছ" className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500" />
              </div>
              <div>
                <label className="font-bold text-slate-400 block mb-1">Category Name (English) *</label>
                <input required type="text" value={form.nameEn} onChange={e => setForm(p => ({ ...p, nameEn: e.target.value }))} placeholder="e.g., Sea Fish" className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500" />
              </div>
              <div>
                <label className="font-bold text-slate-400 block mb-1">URL Slug (auto-generated)</label>
                <input type="text" value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} placeholder="sea-fish" className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500" />
              </div>
              <button type="submit" className="w-full bg-brand-600 hover:bg-brand-500 text-white py-3 rounded-xl font-bold text-sm shadow-lg transition">✓ Add Category</button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4">
            <Trash2 className="w-10 h-10 text-rose-400 mx-auto" />
            <h3 className="font-bold text-white">Delete Category?</h3>
            <p className="text-xs text-slate-400">All products in this category will become uncategorized.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 bg-slate-800 text-white py-2.5 rounded-xl text-xs font-bold">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 bg-rose-600 text-white py-2.5 rounded-xl text-xs font-bold">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
