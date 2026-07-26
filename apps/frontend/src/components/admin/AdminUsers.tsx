'use client';

import { useMemo } from 'react';
import { useAdminDataStore } from '@/store/useAdminDataStore';
import { Users, Phone, MapPin, ShoppingBag, DollarSign } from 'lucide-react';

export function AdminUsers() {
  const { orders } = useAdminDataStore();

  // Derive unique customers from orders
  const customers = useMemo(() => {
    const map = new Map<string, {
      name: string; phone: string; location: string;
      orderCount: number; totalSpent: number; lastOrder: string;
    }>();
    orders.forEach(o => {
      const phone = o.shippingDetail.phone;
      if (map.has(phone)) {
        const existing = map.get(phone)!;
        existing.orderCount++;
        existing.totalSpent += o.totalAmount;
        existing.lastOrder = o.createdAt;
      } else {
        map.set(phone, {
          name: o.shippingDetail.recipientName,
          phone,
          location: `${o.shippingDetail.district}, ${o.shippingDetail.division}`,
          orderCount: 1,
          totalSpent: o.totalAmount,
          lastOrder: o.createdAt,
        });
      }
    });
    return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders]);

  const totalRevenue = useMemo(() => customers.reduce((s, c) => s + c.totalSpent, 0), [customers]);
  const repeatCustomers = useMemo(() => customers.filter(c => c.orderCount > 1).length, [customers]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-white">Customer Management</h1>
        <p className="text-xs text-slate-400 mt-0.5">Derived from order history — {customers.length} unique customers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800/60">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-slate-400 font-semibold">Total Customers</span>
          </div>
          <p className="text-2xl font-black text-white">{customers.length}</p>
        </div>
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800/60">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingBag className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-slate-400 font-semibold">Repeat Customers</span>
          </div>
          <p className="text-2xl font-black text-white">{repeatCustomers}</p>
          <p className="text-[11px] text-purple-400 mt-1 font-semibold">{customers.length > 0 ? Math.round((repeatCustomers / customers.length) * 100) : 0}% retention</p>
        </div>
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800/60">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-slate-400 font-semibold">Total Customer Value</span>
          </div>
          <p className="text-2xl font-black text-white">৳ {totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {customers.length === 0 ? (
        <div className="bg-slate-900 rounded-2xl border border-slate-800/60 p-16 text-center">
          <Users className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <h3 className="font-bold text-white mb-1">No customers yet</h3>
          <p className="text-xs text-slate-500">Customers will appear here once they place orders.</p>
        </div>
      ) : (
        <div className="bg-slate-900 rounded-2xl border border-slate-800/60 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-950/50 text-slate-500 text-[11px] uppercase">
                <tr>
                  <th className="p-3 text-left font-bold">#</th>
                  <th className="p-3 text-left font-bold">Customer</th>
                  <th className="p-3 text-left font-bold">Location</th>
                  <th className="p-3 text-left font-bold">Orders</th>
                  <th className="p-3 text-left font-bold">Total Spent</th>
                  <th className="p-3 text-left font-bold">Last Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {customers.map((c, idx) => (
                  <tr key={c.phone} className="hover:bg-slate-800/30 transition">
                    <td className="p-3 text-slate-500 font-bold">{idx + 1}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-600/20 rounded-lg flex items-center justify-center text-brand-400 font-black text-sm shrink-0">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{c.name}</p>
                          <p className="text-slate-500 flex items-center gap-1"><Phone className="w-3 h-3" />{c.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-slate-400">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{c.location}</span>
                    </td>
                    <td className="p-3">
                      <span className={`font-black px-2 py-1 rounded-lg text-[11px] ${c.orderCount > 1 ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-800 text-slate-400'}`}>
                        {c.orderCount} order{c.orderCount !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="p-3 font-black text-brand-400">৳ {c.totalSpent.toLocaleString()}</td>
                    <td className="p-3 text-slate-500">{c.lastOrder}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
