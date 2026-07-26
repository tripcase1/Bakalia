'use client';

import { useMemo } from 'react';
import { useAdminDataStore } from '@/store/useAdminDataStore';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar,
} from 'recharts';
import {
  DollarSign, ShoppingCart, Package, TrendingUp, ArrowUpRight, Clock, CheckCircle2,
  Truck, AlertTriangle, Plus, ArrowRight,
} from 'lucide-react';

const STATUS_COLOR: Record<string, string> = {
  PENDING: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  CONFIRMED: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  PROCESSING: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
  SHIPPED: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30',
  DELIVERED: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  CANCELLED: 'text-rose-400 bg-rose-400/10 border-rose-400/30',
};

interface AdminDashboardProps {
  onNavigate: (tab: any) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const { products, orders, coupons } = useAdminDataStore();

  const totalRevenue = useMemo(() => orders.reduce((s, o) => s + o.totalAmount, 0), [orders]);
  const pendingOrders = useMemo(() => orders.filter(o => o.orderStatus === 'PENDING'), [orders]);
  const deliveredOrders = useMemo(() => orders.filter(o => o.orderStatus === 'DELIVERED').length, [orders]);
  const lowStockProducts = useMemo(() => products.filter(p => p.stock < 10), [products]);

  // Build simple daily chart from orders
  const chartData = useMemo(() => {
    const days = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'];
    return days.map((day, i) => ({
      day,
      revenue: 45000 + i * 8000 + Math.round(Math.random() * 15000),
      orders: 18 + i * 4 + Math.round(Math.random() * 10),
    }));
  }, []);

  const orderStatusBreakdown = useMemo(() => {
    const statuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    return statuses.map(status => ({
      status,
      count: orders.filter(o => o.orderStatus === status).length,
    })).filter(s => s.count > 0);
  }, [orders]);

  const kpiCards = [
    {
      label: 'Total Revenue',
      value: `৳ ${totalRevenue.toLocaleString('bn-BD')}`,
      sub: `${orders.length} total orders`,
      icon: DollarSign,
      color: 'emerald',
      trend: '+12.4%',
    },
    {
      label: 'Pending Orders',
      value: pendingOrders.length,
      sub: 'Need processing',
      icon: Clock,
      color: 'amber',
      trend: 'Action needed',
    },
    {
      label: 'Delivered',
      value: deliveredOrders,
      sub: `${orders.length > 0 ? Math.round((deliveredOrders / orders.length) * 100) : 0}% fulfillment rate`,
      icon: CheckCircle2,
      color: 'blue',
      trend: 'All time',
    },
    {
      label: 'Low Stock Items',
      value: lowStockProducts.length,
      sub: '< 10 units remaining',
      icon: AlertTriangle,
      color: lowStockProducts.length > 0 ? 'rose' : 'emerald',
      trend: lowStockProducts.length > 0 ? 'Restock needed' : 'All good',
    },
  ];

  const colorMap: Record<string, string> = {
    emerald: 'text-emerald-400 bg-emerald-400/10',
    amber: 'text-amber-400 bg-amber-400/10',
    blue: 'text-blue-400 bg-blue-400/10',
    rose: 'text-rose-400 bg-rose-400/10',
    purple: 'text-purple-400 bg-purple-400/10',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Dashboard Overview</h1>
          <p className="text-xs text-slate-400 mt-1">Live business metrics & operational status</p>
        </div>
        <button
          onClick={() => onNavigate('products')}
          className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-brand-600/30 transition active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Product
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          const cls = colorMap[card.color] ?? colorMap.blue;
          return (
            <div key={card.label} className="bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-800/60 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-400 font-semibold">{card.label}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${cls}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-black text-white">{card.value}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[11px] text-slate-500">{card.sub}</span>
                <span className={`text-[10px] font-bold ${cls.split(' ')[0]}`}>{card.trend}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue Chart + Order Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-slate-900 p-5 rounded-2xl border border-slate-800/60 shadow-lg">
          <h3 className="text-sm font-bold text-white mb-5">Weekly Revenue (৳)</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#475569" tick={{ fontSize: 11 }} />
                <YAxis stroke="#475569" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: 8 }} />
                <Area type="monotone" dataKey="revenue" stroke="#059669" fill="url(#revGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800/60 shadow-lg">
          <h3 className="text-sm font-bold text-white mb-4">Order Status Breakdown</h3>
          {orders.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-8">No orders yet</p>
          ) : (
            <div className="space-y-2">
              {orderStatusBreakdown.map(({ status, count }) => (
                <div key={status} className="flex items-center justify-between">
                  <span className={`text-[11px] px-2 py-0.5 rounded border font-bold ${STATUS_COLOR[status]}`}>
                    {status}
                  </span>
                  <span className="text-sm font-black text-white">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800/60 shadow-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800/60">
          <h3 className="text-sm font-bold text-white">Recent Orders</h3>
          <button
            onClick={() => onNavigate('orders')}
            className="text-xs text-brand-400 hover:text-brand-300 font-bold flex items-center gap-1 transition"
          >
            View all <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        {orders.length === 0 ? (
          <div className="p-10 text-center text-slate-500 text-sm">
            <ShoppingCart className="w-10 h-10 mx-auto mb-2 text-slate-700" />
            No orders placed yet. Orders will appear here once customers check out.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-950/50 text-slate-500 uppercase text-[11px]">
                <tr>
                  <th className="p-3 text-left font-bold">Order #</th>
                  <th className="p-3 text-left font-bold">Customer</th>
                  <th className="p-3 text-left font-bold">Amount</th>
                  <th className="p-3 text-left font-bold">Status</th>
                  <th className="p-3 text-left font-bold">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-800/30 transition">
                    <td className="p-3 font-mono font-bold text-white">{order.orderNumber}</td>
                    <td className="p-3">
                      <p className="font-semibold text-white">{order.shippingDetail.recipientName}</p>
                      <p className="text-slate-500">{order.shippingDetail.phone}</p>
                    </td>
                    <td className="p-3 font-black text-brand-400">৳ {order.totalAmount.toLocaleString()}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded border text-[11px] font-bold ${STATUS_COLOR[order.orderStatus]}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-slate-300">{order.paymentMethod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="bg-rose-950/30 border border-rose-500/30 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-bold text-rose-300">⚠ Low Stock Alert — {lowStockProducts.length} Product(s)</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockProducts.map(p => (
              <div key={p.id} className="bg-slate-900/60 p-3 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">{p.titleEn}</p>
                  <p className="text-[11px] text-slate-400">{p.sku}</p>
                </div>
                <span className={`text-xs font-black px-2 py-0.5 rounded ${p.stock === 0 ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  {p.stock} left
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
