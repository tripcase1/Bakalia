'use client';

import { useMemo } from 'react';
import { useAdminDataStore } from '@/store/useAdminDataStore';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { TrendingUp, DollarSign, ShoppingCart, Users } from 'lucide-react';

const COLORS = ['#059669', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

export function AdminAnalytics() {
  const { orders, products } = useAdminDataStore();

  // Revenue by payment method
  const revenueByPayment = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach(o => {
      map[o.paymentMethod] = (map[o.paymentMethod] ?? 0) + o.totalAmount;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [orders]);

  // Orders over time (group by day using createdAt string)
  const ordersOverTime = useMemo(() => {
    const map: Record<string, { orders: number; revenue: number }> = {};
    orders.forEach(o => {
      const day = o.createdAt.split(' ').slice(0, 3).join(' ');
      if (!map[day]) map[day] = { orders: 0, revenue: 0 };
      map[day].orders++;
      map[day].revenue += o.totalAmount;
    });
    return Object.entries(map).map(([date, data]) => ({ date, ...data }));
  }, [orders]);

  // Top products by order frequency
  const topProducts = useMemo(() => {
    const map: Record<string, { name: string; count: number; revenue: number }> = {};
    orders.forEach(o => {
      o.items.forEach(item => {
        const id = item.product.id;
        if (!map[id]) map[id] = { name: item.product.titleEn, count: 0, revenue: 0 };
        map[id].count += item.quantity;
        map[id].revenue += (item.product.discountPrice ?? item.product.basePrice) * item.quantity;
      });
    });
    return Object.values(map).sort((a, b) => b.count - a.count).slice(0, 5);
  }, [orders]);

  // Status distribution for pie
  const statusPie = useMemo(() => {
    const statuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    return statuses.map(s => ({ name: s, value: orders.filter(o => o.orderStatus === s).length })).filter(s => s.value > 0);
  }, [orders]);

  const totalRevenue = orders.reduce((s, o) => s + o.totalAmount, 0);
  const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;
  const deliveredRevenue = orders.filter(o => o.orderStatus === 'DELIVERED').reduce((s, o) => s + o.totalAmount, 0);

  // Fallback chart data if no real orders
  const chartData = ordersOverTime.length > 0 ? ordersOverTime : [
    { date: 'Day 1', orders: 0, revenue: 0 },
    { date: 'Day 2', orders: 0, revenue: 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Sales Analytics</h1>
        <p className="text-xs text-slate-400 mt-0.5">Comprehensive business intelligence from real order data</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `৳ ${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-400 bg-emerald-400/10' },
          { label: 'Total Orders', value: orders.length, icon: ShoppingCart, color: 'text-blue-400 bg-blue-400/10' },
          { label: 'Avg Order Value', value: `৳ ${avgOrderValue.toLocaleString()}`, icon: TrendingUp, color: 'text-purple-400 bg-purple-400/10' },
          { label: 'Delivered Revenue', value: `৳ ${deliveredRevenue.toLocaleString()}`, icon: Users, color: 'text-amber-400 bg-amber-400/10' },
        ].map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-800/60">
              <div className="flex items-center gap-2 mb-3">
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

      {/* Revenue Over Time */}
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800/60 shadow-lg">
        <h3 className="text-sm font-bold text-white mb-5">Revenue Over Time (৳)</h3>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="analyticsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#475569" tick={{ fontSize: 10 }} />
              <YAxis stroke="#475569" tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: 8, fontSize: 11 }} />
              <Area type="monotone" dataKey="revenue" stroke="#059669" fill="url(#analyticsGrad)" strokeWidth={2} name="Revenue (৳)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue by Payment Method */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800/60 shadow-lg">
          <h3 className="text-sm font-bold text-white mb-5">Revenue by Payment Method</h3>
          {revenueByPayment.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-slate-600 text-xs">No data yet</div>
          ) : (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={revenueByPayment} cx="50%" cy="50%" outerRadius={70} dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={{ stroke: '#475569' }}>
                    {revenueByPayment.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: 8, fontSize: 11 }} formatter={(val: any) => `৳ ${Number(val).toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Order Status Distribution */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800/60 shadow-lg">
          <h3 className="text-sm font-bold text-white mb-5">Order Status Distribution</h3>
          {statusPie.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-slate-600 text-xs">No orders yet</div>
          ) : (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusPie} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis type="number" stroke="#475569" tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" stroke="#475569" tick={{ fontSize: 10 }} width={80} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: 8, fontSize: 11 }} />
                  <Bar dataKey="value" name="Orders" radius={[0, 4, 4, 0]}>
                    {statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Top Products */}
      {topProducts.length > 0 && (
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800/60 shadow-lg">
          <h3 className="text-sm font-bold text-white mb-5">Top Selling Products</h3>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-4">
                <span className="text-slate-500 font-bold text-xs w-4">#{i + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-white">{p.name}</span>
                    <span className="text-xs font-black text-brand-400">৳ {p.revenue.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${Math.min((p.count / (topProducts[0]?.count ?? 1)) * 100, 100)}%`, backgroundColor: COLORS[i % COLORS.length] }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500">{p.count} units sold</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
