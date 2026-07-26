'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuthStore } from '@/store/useAdminAuthStore';
import { useAdminDataStore } from '@/store/useAdminDataStore';
import {
  LayoutDashboard, Package, ShoppingCart, Tag, LogOut, Users, BarChart3,
  AlertTriangle, Grid, ShieldCheck, Menu, X, ChevronRight, Bell,
} from 'lucide-react';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { AdminProducts } from '@/components/admin/AdminProducts';
import { AdminOrders } from '@/components/admin/AdminOrders';
import { AdminCategories } from '@/components/admin/AdminCategories';
import { AdminCoupons } from '@/components/admin/AdminCoupons';
import { AdminUsers } from '@/components/admin/AdminUsers';
import { AdminInventory } from '@/components/admin/AdminInventory';
import { AdminAnalytics } from '@/components/admin/AdminAnalytics';

type Tab = 'dashboard' | 'products' | 'orders' | 'categories' | 'coupons' | 'users' | 'inventory' | 'analytics';

const NAV_ITEMS: { id: Tab; label: string; icon: React.ElementType; badgeKey?: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package, badgeKey: 'products' },
  { id: 'orders', label: 'Orders', icon: ShoppingCart, badgeKey: 'orders' },
  { id: 'categories', label: 'Categories', icon: Grid, badgeKey: 'categories' },
  { id: 'coupons', label: 'Coupons', icon: Tag, badgeKey: 'coupons' },
  { id: 'users', label: 'Customers', icon: Users },
  { id: 'inventory', label: 'Inventory Alerts', icon: AlertTriangle },
  { id: 'analytics', label: 'Sales Analytics', icon: BarChart3 },
];

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAdminAuthStore();
  const { products, orders, categories, coupons } = useAdminDataStore();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pendingOrders = useMemo(() => orders.filter(o => o.orderStatus === 'PENDING').length, [orders]);
  const lowStockCount = useMemo(() => products.filter(p => p.stock < 10).length, [products]);

  const getBadge = (key?: string): number | null => {
    if (!key) return null;
    const map: Record<string, number> = {
      products: products.length,
      orders: orders.length,
      categories: categories.length,
      coupons: coupons.filter(c => c.isActive).length,
    };
    return map[key] ?? null;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="text-center space-y-5 max-w-sm">
          <div className="w-16 h-16 bg-brand-600/10 border border-brand-600/30 rounded-2xl flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8 text-brand-400" />
          </div>
          <h1 className="text-2xl font-black text-white">Admin Access Required</h1>
          <p className="text-sm text-slate-400">Please log in with authorized credentials to access the admin workspace.</p>
          <button
            onClick={() => router.push('/admin/login')}
            className="w-full bg-brand-600 hover:bg-brand-500 text-white py-3 rounded-xl font-bold text-sm transition shadow-xl shadow-brand-600/30"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const handleNav = (tab: Tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─── SIDEBAR ──────────────────────────────────────────────────────────── */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800/60 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-md shadow-brand-600/30">
              AHF
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-white leading-tight">Al Hera Fresh</h2>
              <span className="text-[10px] text-brand-400 font-bold uppercase tracking-wider">Admin Panel</span>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alert Banner */}
        {(pendingOrders > 0 || lowStockCount > 0) && (
          <div className="mx-3 mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-400 space-y-1">
            {pendingOrders > 0 && (
              <p className="flex items-center gap-1.5">
                <Bell className="w-3 h-3" />
                {pendingOrders} new pending order{pendingOrders > 1 ? 's' : ''}
              </p>
            )}
            {lowStockCount > 0 && (
              <p className="flex items-center gap-1.5">
                <AlertTriangle className="w-3 h-3" />
                {lowStockCount} product{lowStockCount > 1 ? 's' : ''} low stock
              </p>
            )}
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto mt-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const badge = getBadge(item.badgeKey);
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition group ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                    : 'text-slate-400 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.id === 'orders' && pendingOrders > 0 && (
                  <span className="bg-amber-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shrink-0 animate-pulse">
                    {pendingOrders}
                  </span>
                )}
                {item.id === 'inventory' && lowStockCount > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                    {lowStockCount}
                  </span>
                )}
                {badge !== null && item.id !== 'orders' && item.id !== 'inventory' && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ${isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-800/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-brand-600/20 border border-brand-600/30 rounded-lg flex items-center justify-center text-brand-400 font-black text-sm">
                {user?.name?.charAt(0) ?? 'A'}
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-none">{user?.name ?? 'Admin'}</p>
                <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">● Online</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-slate-900/80 backdrop-blur border-b border-slate-800/60 px-4 py-3 flex items-center justify-between shrink-0 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold text-white text-sm capitalize flex items-center gap-1.5">
            <ChevronRight className="w-4 h-4 text-slate-500" />
            {NAV_ITEMS.find(n => n.id === activeTab)?.label}
          </span>
          <div className="w-8" />
        </header>

        {/* Tab Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {activeTab === 'dashboard' && <AdminDashboard onNavigate={handleNav} />}
          {activeTab === 'products' && <AdminProducts />}
          {activeTab === 'orders' && <AdminOrders />}
          {activeTab === 'categories' && <AdminCategories />}
          {activeTab === 'coupons' && <AdminCoupons />}
          {activeTab === 'users' && <AdminUsers />}
          {activeTab === 'inventory' && <AdminInventory />}
          {activeTab === 'analytics' && <AdminAnalytics />}
        </main>
      </div>
    </div>
  );
}
