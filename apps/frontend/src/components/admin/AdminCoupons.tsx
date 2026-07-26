'use client';

import { useState } from 'react';
import { useAdminDataStore } from '@/store/useAdminDataStore';
import { Plus, Trash2, X, Tag, ToggleLeft, ToggleRight, Copy, CheckCircle2 } from 'lucide-react';

export function AdminCoupons() {
  const { coupons, addCoupon, toggleCoupon, deleteCoupon } = useAdminDataStore();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ code: '', discountPct: '10', minOrder: '500' });
  const [copied, setCopied] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code.trim()) return;
    addCoupon({ code: form.code.toUpperCase().trim(), discountPct: Number(form.discountPct), minOrder: Number(form.minOrder), isActive: true });
    setForm({ code: '', discountPct: '10', minOrder: '500' });
    setShowModal(false);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(code);
    setTimeout(() => setCopied(null), 1500);
  };

  const activeCoupons = coupons.filter(c => c.isActive);
  const inactiveCoupons = coupons.filter(c => !c.isActive);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Coupon & Discount Engine</h1>
          <p className="text-xs text-slate-400 mt-0.5">{activeCoupons.length} active · {inactiveCoupons.length} disabled</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-brand-600/30 transition active:scale-95 shrink-0">
          <Plus className="w-4 h-4" /> Create Coupon
        </button>
      </div>

      {coupons.length === 0 && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800/60 p-16 text-center">
          <Tag className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <h3 className="font-bold text-white mb-1">No coupons yet</h3>
          <p className="text-xs text-slate-500">Create your first promo code to boost sales.</p>
        </div>
      )}

      {/* Active Coupons */}
      {activeCoupons.length > 0 && (
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Active Promotions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeCoupons.map(c => (
              <CouponCard key={c.id} c={c} onToggle={() => toggleCoupon(c.id)} onDelete={() => deleteCoupon(c.id)} onCopy={() => copyCode(c.code)} copied={copied === c.code} />
            ))}
          </div>
        </div>
      )}

      {/* Inactive Coupons */}
      {inactiveCoupons.length > 0 && (
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">Disabled Coupons</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 opacity-60">
            {inactiveCoupons.map(c => (
              <CouponCard key={c.id} c={c} onToggle={() => toggleCoupon(c.id)} onDelete={() => deleteCoupon(c.id)} onCopy={() => copyCode(c.code)} copied={copied === c.code} />
            ))}
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white">Create Promo Code</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white p-1.5 hover:bg-slate-800 rounded-lg transition"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-400 block mb-1">Coupon Code *</label>
                <input
                  required type="text"
                  value={form.code}
                  onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                  placeholder="SAVE20"
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono uppercase focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
                <p className="text-[11px] text-slate-600 mt-1">Code will be uppercased automatically.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Discount % *</label>
                  <div className="relative">
                    <input required type="number" min="1" max="100" value={form.discountPct} onChange={e => setForm(p => ({ ...p, discountPct: e.target.value }))} className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">%</span>
                  </div>
                </div>
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Min Order (৳)</label>
                  <input type="number" min="0" value={form.minOrder} onChange={e => setForm(p => ({ ...p, minOrder: e.target.value }))} className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500" />
                </div>
              </div>

              {/* Live Preview */}
              {form.code && (
                <div className="bg-slate-950 border border-brand-500/30 rounded-xl p-3 text-center">
                  <p className="text-slate-500 text-[11px] mb-1">Preview:</p>
                  <p className="font-mono font-black text-brand-400 text-lg">{form.code || 'CODE'}</p>
                  <p className="text-xs text-slate-400">{form.discountPct}% OFF · Min order ৳{form.minOrder}</p>
                </div>
              )}

              <button type="submit" className="w-full bg-brand-600 hover:bg-brand-500 text-white py-3 rounded-xl font-bold text-sm shadow-lg transition">✓ Create Coupon</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function CouponCard({ c, onToggle, onDelete, onCopy, copied }: any) {
  return (
    <div className={`bg-slate-900 p-5 rounded-2xl border shadow-lg transition ${c.isActive ? 'border-slate-800/60' : 'border-slate-800/30'}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono font-black text-brand-400 text-base">{c.code}</span>
            <button onClick={onCopy} className="text-slate-500 hover:text-white transition" title="Copy">
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <div className="mt-2 space-y-1">
            <p className="text-xs text-slate-300 font-semibold">
              <span className="text-brand-400 font-black">{c.discountPct}% OFF</span>
              {c.minOrder > 0 && <span className="text-slate-500"> · min ৳{c.minOrder.toLocaleString()}</span>}
            </p>
            <span className={`inline-block text-[10px] px-2 py-0.5 rounded font-bold ${c.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
              {c.isActive ? '● Active' : '○ Disabled'}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-1 ml-2">
          <button onClick={onToggle} className="text-slate-400 hover:text-white transition p-1 rounded-lg hover:bg-slate-800" title={c.isActive ? 'Disable' : 'Activate'}>
            {c.isActive ? <ToggleRight className="w-5 h-5 text-brand-400" /> : <ToggleLeft className="w-5 h-5" />}
          </button>
          <button onClick={onDelete} className="p-1 text-slate-600 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition" title="Delete">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
