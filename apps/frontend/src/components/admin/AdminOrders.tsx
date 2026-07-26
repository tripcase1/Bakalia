'use client';

import { useState, useMemo } from 'react';
import { useAdminDataStore } from '@/store/useAdminDataStore';
import { OrderStatus } from '@/types';
import { Eye, X, Search, Filter, Printer } from 'lucide-react';

const STATUS_COLOR: Record<string, string> = {
  PENDING: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  CONFIRMED: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  PROCESSING: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
  SHIPPED: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30',
  DELIVERED: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  CANCELLED: 'text-rose-400 bg-rose-400/10 border-rose-400/30',
};

const PAY_COLOR: Record<string, string> = {
  BKASH: 'text-pink-400 bg-pink-400/10',
  NAGAD: 'text-orange-400 bg-orange-400/10',
  ROCKET: 'text-purple-400 bg-purple-400/10',
  COD: 'text-emerald-400 bg-emerald-400/10',
};

export function AdminOrders() {
  const { orders, updateOrderStatus } = useAdminDataStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null);

  const filtered = useMemo(() => orders.filter(o => {
    const matchSearch = !search ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.shippingDetail.recipientName.toLowerCase().includes(search.toLowerCase()) ||
      o.shippingDetail.phone.includes(search);
    const matchStatus = !statusFilter || o.orderStatus === statusFilter;
    return matchSearch && matchStatus;
  }), [orders, search, statusFilter]);

  const totalRevenue = useMemo(() => filtered.reduce((s, o) => s + o.totalAmount, 0), [filtered]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Order Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {filtered.length} orders · Total: <span className="text-brand-400 font-bold">৳ {totalRevenue.toLocaleString()}</span>
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by order #, name, or phone..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800/60 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <select
          value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800/60 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          <option value="">All Statuses</option>
          {['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(s =>
            <option key={s} value={s}>{s}</option>
          )}
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800/60 overflow-hidden shadow-lg">
        {orders.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="font-bold text-white mb-2">No orders yet</h3>
            <p className="text-xs text-slate-500">When customers place orders, they will appear here in real time.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-950/50 text-slate-500 text-[11px] uppercase">
                <tr>
                  <th className="p-3 text-left font-bold">Order #</th>
                  <th className="p-3 text-left font-bold">Customer</th>
                  <th className="p-3 text-left font-bold">Items</th>
                  <th className="p-3 text-left font-bold">Amount</th>
                  <th className="p-3 text-left font-bold">Payment</th>
                  <th className="p-3 text-left font-bold">Status</th>
                  <th className="p-3 text-right font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {filtered.map(order => (
                  <tr key={order.id} className="hover:bg-slate-800/30 transition">
                    <td className="p-3">
                      <p className="font-mono font-black text-white">{order.orderNumber}</p>
                      <p className="text-slate-500 text-[10px]">{order.createdAt}</p>
                    </td>
                    <td className="p-3">
                      <p className="font-semibold text-white">{order.shippingDetail.recipientName}</p>
                      <p className="text-slate-500">{order.shippingDetail.phone}</p>
                      <p className="text-slate-600 text-[10px]">{order.shippingDetail.district}, {order.shippingDetail.division}</p>
                    </td>
                    <td className="p-3 text-slate-400">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</td>
                    <td className="p-3">
                      <p className="font-black text-brand-400">৳ {order.totalAmount.toLocaleString()}</p>
                      {order.discount > 0 && <p className="text-[10px] text-emerald-500">-৳ {order.discount} off</p>}
                    </td>
                    <td className="p-3">
                      <span className={`text-[11px] px-2 py-1 rounded-lg font-bold ${PAY_COLOR[order.paymentMethod] ?? 'bg-slate-800 text-slate-300'}`}>
                        {order.paymentMethod}
                      </span>
                      {order.trxId && <p className="text-[10px] font-mono text-slate-500 mt-0.5">{order.trxId}</p>}
                    </td>
                    <td className="p-3">
                      <select
                        value={order.orderStatus}
                        onChange={e => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className={`text-[11px] font-bold px-2 py-1.5 rounded-lg border bg-slate-950 focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer ${STATUS_COLOR[order.orderStatus]}`}
                      >
                        {['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(s =>
                          <option key={s} value={s}>{s}</option>
                        )}
                      </select>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setSelectedOrder(null)}>
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-slate-900 flex items-center justify-between p-5 border-b border-slate-800">
              <div>
                <h3 className="font-black text-white text-base">{selectedOrder.orderNumber}</h3>
                <p className="text-xs text-slate-400">{selectedOrder.createdAt}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => window.print()} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition" title="Print invoice">
                  <Printer className="w-4 h-4" />
                </button>
                <button onClick={() => setSelectedOrder(null)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-5 space-y-5 text-xs">
              {/* Status Control */}
              <div className="flex items-center justify-between bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                <span className="font-bold text-slate-300">Order Status:</span>
                <select
                  value={selectedOrder.orderStatus}
                  onChange={e => {
                    updateOrderStatus(selectedOrder.id, e.target.value as OrderStatus);
                    setSelectedOrder({ ...selectedOrder, orderStatus: e.target.value as OrderStatus });
                  }}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border bg-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer ${STATUS_COLOR[selectedOrder.orderStatus]}`}
                >
                  {['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(s =>
                    <option key={s} value={s}>{s}</option>
                  )}
                </select>
              </div>

              {/* Customer Info */}
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-slate-300 mb-2">📦 Delivery Details</h4>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div><span className="text-slate-500">Name:</span> <span className="text-white font-semibold">{selectedOrder.shippingDetail.recipientName}</span></div>
                  <div><span className="text-slate-500">Phone:</span> <span className="text-white font-semibold">{selectedOrder.shippingDetail.phone}</span></div>
                  <div className="col-span-2"><span className="text-slate-500">Address:</span> <span className="text-white font-semibold">{selectedOrder.shippingDetail.streetAddress}, {selectedOrder.shippingDetail.upazila}, {selectedOrder.shippingDetail.district}, {selectedOrder.shippingDetail.division}</span></div>
                  {selectedOrder.shippingDetail.note && <div className="col-span-2"><span className="text-slate-500">Note:</span> <span className="text-white">{selectedOrder.shippingDetail.note}</span></div>}
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-slate-300 mb-2">💳 Payment Info</h4>
                <div className="flex justify-between">
                  <span className="text-slate-500">Method:</span>
                  <span className={`font-bold px-2 py-0.5 rounded ${PAY_COLOR[selectedOrder.paymentMethod] ?? 'text-white'}`}>{selectedOrder.paymentMethod}</span>
                </div>
                {selectedOrder.trxId && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">TrxID:</span>
                    <span className="font-mono font-bold text-white">{selectedOrder.trxId}</span>
                  </div>
                )}
              </div>

              {/* Items */}
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                <h4 className="font-bold text-slate-300 mb-3">🛒 Ordered Items</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, i) => {
                    const price = item.product.discountPrice ?? item.product.basePrice;
                    return (
                      <div key={i} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {item.product.images[0] && <img src={item.product.images[0]} alt="" className="w-8 h-8 object-cover rounded-lg border border-slate-800 shrink-0" />}
                          <div>
                            <p className="font-semibold text-white leading-tight">{item.product.titleBn}</p>
                            <p className="text-[10px] text-slate-500">× {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-bold text-brand-400">৳ {(price * item.quantity).toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-1.5 border-t border-slate-800 pt-3">
                <div className="flex justify-between"><span className="text-slate-500">Subtotal:</span><span className="font-semibold text-white">৳ {selectedOrder.subTotal.toLocaleString()}</span></div>
                {selectedOrder.discount > 0 && <div className="flex justify-between text-emerald-500"><span>Discount:</span><span className="font-semibold">-৳ {selectedOrder.discount.toLocaleString()}</span></div>}
                <div className="flex justify-between"><span className="text-slate-500">Delivery:</span><span className="font-semibold text-white">৳ {selectedOrder.deliveryFee.toLocaleString()}</span></div>
                <div className="flex justify-between text-sm font-black border-t border-slate-800 pt-2"><span className="text-white">Total:</span><span className="text-brand-400">৳ {selectedOrder.totalAmount.toLocaleString()}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
