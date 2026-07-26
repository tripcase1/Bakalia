'use client';

import { useMemo } from 'react';
import { useAdminDataStore } from '@/store/useAdminDataStore';
import { AlertTriangle, Package, TrendingDown, RefreshCw } from 'lucide-react';

export function AdminInventory() {
  const { products, updateProduct } = useAdminDataStore();

  const outOfStock = useMemo(() => products.filter(p => p.stock === 0), [products]);
  const lowStock = useMemo(() => products.filter(p => p.stock > 0 && p.stock < 10), [products]);
  const normalStock = useMemo(() => products.filter(p => p.stock >= 10), [products]);

  const totalStockValue = useMemo(() =>
    products.reduce((s, p) => s + (p.discountPrice ?? p.basePrice) * p.stock, 0),
    [products]
  );

  const handleRestockAll = () => {
    lowStock.forEach(p => updateProduct(p.id, { stock: p.stock + 50 }));
    outOfStock.forEach(p => updateProduct(p.id, { stock: 50 }));
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Inventory Alerts</h1>
          <p className="text-xs text-slate-400 mt-0.5">Monitor stock levels and prevent stockouts</p>
        </div>
        {(outOfStock.length > 0 || lowStock.length > 0) && (
          <button
            onClick={handleRestockAll}
            className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition active:scale-95 shrink-0"
          >
            <RefreshCw className="w-4 h-4" /> Restock All (+50)
          </button>
        )}
      </div>

      {/* Inventory Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Products', value: products.length, icon: Package, color: 'text-blue-400 bg-blue-400/10' },
          { label: 'Out of Stock', value: outOfStock.length, icon: AlertTriangle, color: 'text-rose-400 bg-rose-400/10' },
          { label: 'Low Stock', value: lowStock.length, icon: TrendingDown, color: 'text-amber-400 bg-amber-400/10' },
          { label: 'Stock Value (৳)', value: `৳ ${totalStockValue.toLocaleString()}`, icon: Package, color: 'text-emerald-400 bg-emerald-400/10' },
        ].map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-slate-900 p-4 rounded-2xl border border-slate-800/60">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs text-slate-400 font-semibold">{card.label}</span>
              </div>
              <p className="text-xl font-black text-white">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Out of Stock */}
      {outOfStock.length > 0 && (
        <div>
          <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5" /> Out of Stock ({outOfStock.length})
          </h3>
          <div className="space-y-2">
            {outOfStock.map(p => (
              <InventoryRow key={p.id} product={p} onRestock={qty => updateProduct(p.id, { stock: qty })} urgency="critical" />
            ))}
          </div>
        </div>
      )}

      {/* Low Stock */}
      {lowStock.length > 0 && (
        <div>
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <TrendingDown className="w-3.5 h-3.5" /> Low Stock (&lt;10 units) — {lowStock.length} products
          </h3>
          <div className="space-y-2">
            {lowStock.map(p => (
              <InventoryRow key={p.id} product={p} onRestock={qty => updateProduct(p.id, { stock: qty })} urgency="warning" />
            ))}
          </div>
        </div>
      )}

      {/* Healthy Stock */}
      {normalStock.length > 0 && (
        <div>
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">✓ Adequate Stock ({normalStock.length})</h3>
          <div className="bg-slate-900 rounded-2xl border border-slate-800/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-950/50 text-slate-500 text-[11px] uppercase">
                  <tr>
                    <th className="p-3 text-left font-bold">Product</th>
                    <th className="p-3 text-left font-bold">SKU</th>
                    <th className="p-3 text-left font-bold">Stock</th>
                    <th className="p-3 text-left font-bold">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {normalStock.map(p => (
                    <tr key={p.id} className="hover:bg-slate-800/30 transition">
                      <td className="p-3 font-semibold text-white">{p.titleEn}</td>
                      <td className="p-3 font-mono text-slate-500">{p.sku}</td>
                      <td className="p-3">
                        <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold">
                          {p.stock} {p.unit}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400">৳ {((p.discountPrice ?? p.basePrice) * p.stock).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {outOfStock.length === 0 && lowStock.length === 0 && (
        <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-8 text-center">
          <Package className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <h3 className="font-bold text-emerald-300 mb-1">All Stock Levels Healthy</h3>
          <p className="text-xs text-emerald-600">No products are out of stock or running low.</p>
        </div>
      )}
    </div>
  );
}

function InventoryRow({ product, onRestock, urgency }: { product: any; onRestock: (qty: number) => void; urgency: 'critical' | 'warning' }) {
  const borderColor = urgency === 'critical' ? 'border-rose-500/30 bg-rose-950/20' : 'border-amber-500/30 bg-amber-950/20';
  const textColor = urgency === 'critical' ? 'text-rose-400' : 'text-amber-400';

  return (
    <div className={`flex items-center justify-between p-4 rounded-xl border ${borderColor}`}>
      <div className="flex items-center gap-3">
        {product.images[0] && (
          <img src={product.images[0]} alt="" className="w-10 h-10 object-cover rounded-lg border border-slate-800 shrink-0" />
        )}
        <div>
          <p className="font-bold text-white text-xs">{product.titleEn}</p>
          <p className="text-[11px] text-slate-500">{product.sku}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className={`font-black px-3 py-1 rounded-lg text-xs ${urgency === 'critical' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>
          {product.stock === 0 ? 'OUT OF STOCK' : `${product.stock} left`}
        </span>
        <button
          onClick={() => onRestock(product.stock + 50)}
          className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1"
        >
          <RefreshCw className="w-3 h-3" /> +50
        </button>
      </div>
    </div>
  );
}
