'use client';

import { useState, useMemo } from 'react';
import { useAdminDataStore } from '@/store/useAdminDataStore';
import { Product } from '@/types';
import { Plus, Search, Edit, Trash2, X, Star, PackageCheck, PackageX, Image } from 'lucide-react';

const EMPTY_FORM = {
  titleBn: '', titleEn: '', slug: '', descriptionBn: '', descriptionEn: '',
  categoryId: '', basePrice: '', discountPrice: '', sku: '', stock: '',
  unit: 'kg', isFeatured: false, isFlashSale: false,
  imageUrl: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?q=75&w=600&auto=format&fit=crop',
};

export function AdminProducts() {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useAdminDataStore();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showModal, setShowModal] = useState<'add' | 'edit' | null>(null);
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filtered = useMemo(() => products.filter(p => {
    const matchSearch = !search || p.titleBn.toLowerCase().includes(search.toLowerCase()) ||
      p.titleEn.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = !categoryFilter
      ? true
      : categoryFilter === 'featured_only'
      ? p.isFeatured
      : categoryFilter === 'flash_only'
      ? p.isFlashSale
      : p.categoryId === categoryFilter;
    return matchSearch && matchCat;
  }), [products, search, categoryFilter]);

  const openAdd = () => {
    setForm({ ...EMPTY_FORM, categoryId: categories[0]?.id ?? '' });
    setShowModal('add');
  };

  const openEdit = (p: Product) => {
    setForm({
      titleBn: p.titleBn, titleEn: p.titleEn, slug: p.slug,
      descriptionBn: p.descriptionBn ?? '', descriptionEn: p.descriptionEn ?? '',
      categoryId: p.categoryId, basePrice: String(p.basePrice),
      discountPrice: String(p.discountPrice ?? ''), sku: p.sku,
      stock: String(p.stock), unit: p.unit, isFeatured: p.isFeatured ?? false,
      isFlashSale: p.isFlashSale ?? false, imageUrl: p.images[0] ?? '',
    });
    setEditTarget(p);
    setShowModal('edit');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      titleBn: form.titleBn,
      titleEn: form.titleEn,
      slug: form.slug || form.titleEn.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      descriptionBn: form.descriptionBn,
      descriptionEn: form.descriptionEn,
      categoryId: form.categoryId,
      basePrice: Number(form.basePrice),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
      sku: form.sku || 'SKU-' + Math.floor(1000 + Math.random() * 9000),
      stock: Number(form.stock),
      unit: form.unit,
      isFeatured: form.isFeatured,
      isFlashSale: form.isFlashSale,
      images: [form.imageUrl],
      tags: [],
    };
    if (showModal === 'add') {
      addProduct(data);
    } else if (editTarget) {
      updateProduct(editTarget.id, data);
    }
    setShowModal(null);
    setEditTarget(null);
  };

  // Helper for string-valued fields only
  const f = (field: 'titleBn' | 'titleEn' | 'slug' | 'descriptionBn' | 'descriptionEn' | 'categoryId' | 'basePrice' | 'discountPrice' | 'sku' | 'stock' | 'unit' | 'imageUrl') => ({
    value: form[field] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm(prev => ({ ...prev, [field]: e.target.value }));
    },
  });

  const getCatName = (id: string) => categories.find(c => c.id === id)?.nameEn ?? id;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Product Catalog</h1>
          <p className="text-xs text-slate-400 mt-0.5">{products.length} products in catalog</p>
        </div>
        <button onClick={openAdd} className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-brand-600/30 transition active:scale-95 shrink-0">
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or SKU..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800/60 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <select
          value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800/60 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          <option value="">All Categories</option>
          <option value="featured_only">⭐ Featured Only</option>
          <option value="flash_only">⚡ Flash Sale Only</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.nameEn}</option>)}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800/60 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-950/50 text-slate-500 text-[11px] uppercase">
              <tr>
                <th className="p-3 text-left font-bold">Product</th>
                <th className="p-3 text-left font-bold">Category</th>
                <th className="p-3 text-left font-bold">Price</th>
                <th className="p-3 text-left font-bold">Stock</th>
                <th className="p-3 text-left font-bold">Quick Toggles (1-Click)</th>
                <th className="p-3 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="p-10 text-center text-slate-500">No products found</td></tr>
              )}
              {filtered.map(prod => (
                <tr key={prod.id} className="hover:bg-slate-800/30 transition group">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      {prod.images[0] ? (
                        <img src={prod.images[0]} alt="" className="w-12 h-12 object-cover rounded-xl border border-slate-800 shrink-0" />
                      ) : (
                        <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center shrink-0">
                          <Image className="w-5 h-5 text-slate-600" />
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-white">{prod.titleBn}</p>
                        <p className="text-slate-500">{prod.titleEn}</p>
                        <p className="text-[10px] text-slate-600 font-mono">{prod.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded-lg font-semibold">
                      {getCatName(prod.categoryId)}
                    </span>
                  </td>
                  <td className="p-3">
                    <p className="font-black text-brand-400">৳ {prod.discountPrice ?? prod.basePrice}</p>
                    {prod.discountPrice && <p className="text-[11px] line-through text-slate-600">৳ {prod.basePrice}</p>}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-lg text-[11px] font-bold ${prod.stock === 0 ? 'bg-rose-500/20 text-rose-400' : prod.stock < 10 ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      {prod.stock} {prod.unit}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1.5 flex-wrap items-center">
                      <button
                        onClick={() => updateProduct(prod.id, { isFeatured: !prod.isFeatured })}
                        title="Click to toggle Featured status"
                        className={`text-[11px] px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 active:scale-95 ${
                          prod.isFeatured
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                            : 'bg-slate-800/60 text-slate-500 hover:text-amber-300 hover:bg-slate-800'
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${prod.isFeatured ? 'fill-amber-400 text-amber-400' : ''}`} />
                        <span>{prod.isFeatured ? 'Featured' : '+ Featured'}</span>
                      </button>

                      <button
                        onClick={() => updateProduct(prod.id, { isFlashSale: !prod.isFlashSale })}
                        title="Click to toggle Flash Sale status"
                        className={`text-[11px] px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 active:scale-95 ${
                          prod.isFlashSale
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm animate-pulse'
                            : 'bg-slate-800/60 text-slate-500 hover:text-rose-300 hover:bg-slate-800'
                        }`}
                      >
                        ⚡ <span>{prod.isFlashSale ? 'Flash Sale' : '+ Flash Sale'}</span>
                      </button>
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(prod)} className="p-2 text-slate-400 hover:text-brand-400 hover:bg-slate-800 rounded-lg transition" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteConfirmId(prod.id)} className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setShowModal(null)}>
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-slate-900 flex items-center justify-between p-5 border-b border-slate-800 z-10">
              <h3 className="font-bold text-white text-base">{showModal === 'add' ? 'Add New Product' : 'Edit Product'}</h3>
              <button onClick={() => setShowModal(null)} className="text-slate-400 hover:text-white p-1.5 hover:bg-slate-800 rounded-lg transition"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Title (Bangla) *</label>
                  <input required type="text" {...f('titleBn')} placeholder="পদ্মার তাজা ইলিশ" className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Title (English) *</label>
                  <input required type="text" {...f('titleEn')} placeholder="Fresh Padma Hilsa" className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-400 block mb-1">SKU</label>
                  <input type="text" {...f('sku')} placeholder="Auto-generated if empty" className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Category *</label>
                  <select required {...f('categoryId')} className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500">
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.nameEn}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Base Price (৳) *</label>
                  <input required type="number" min="1" {...f('basePrice')} className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Discount Price (৳)</label>
                  <input type="number" min="0" {...f('discountPrice')} placeholder="Leave empty for no discount" className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Stock *</label>
                  <input required type="number" min="0" {...f('stock')} className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Unit</label>
                  <select {...f('unit')} className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500">
                    {['kg', 'g', 'piece', 'box', 'jar', 'liter', 'pack'].map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-400 block mb-1">URL Slug</label>
                  <input type="text" {...f('slug')} placeholder="auto-generated" className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500" />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-400 block mb-1">Image URL *</label>
                <input required type="text" {...f('imageUrl')} className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500" />
                {form.imageUrl && <img src={form.imageUrl} alt="preview" className="mt-2 h-24 w-full object-cover rounded-xl border border-slate-800" onError={e => (e.currentTarget.style.display = 'none')} />}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Description (Bangla)</label>
                  <textarea rows={2} {...f('descriptionBn')} placeholder="পণ্যের বিবরণ..." className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500 resize-none" />
                </div>
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Description (English)</label>
                  <textarea rows={2} {...f('descriptionEn')} placeholder="Product description..." className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500 resize-none" />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isFeatured as boolean} onChange={e => setForm(p => ({ ...p, isFeatured: e.target.checked }))} className="w-4 h-4 accent-brand-600" />
                  <span className="text-slate-300 font-semibold flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400" /> Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isFlashSale as boolean} onChange={e => setForm(p => ({ ...p, isFlashSale: e.target.checked }))} className="w-4 h-4 accent-rose-500" />
                  <span className="text-slate-300 font-semibold">⚡ Flash Sale</span>
                </label>
              </div>

              <button type="submit" className="w-full bg-brand-600 hover:bg-brand-500 text-white py-3 rounded-xl font-bold text-sm shadow-lg transition active:scale-95">
                {showModal === 'add' ? '✓ Save Product to Catalog' : '✓ Update Product'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6 text-rose-400" />
            </div>
            <h3 className="font-bold text-white">Delete Product?</h3>
            <p className="text-xs text-slate-400">This action cannot be undone. The product will be permanently removed from the catalog.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2.5 rounded-xl text-xs font-bold transition">Cancel</button>
              <button onClick={() => { deleteProduct(deleteConfirmId); setDeleteConfirmId(null); }} className="flex-1 bg-rose-600 hover:bg-rose-500 text-white py-2.5 rounded-xl text-xs font-bold transition">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
