'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuthStore } from '@/store/useAdminAuthStore';
import { useAdminDataStore } from '@/store/useAdminDataStore';
import { Product, OrderStatus } from '@/types';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  LayoutDashboard, Package, ShoppingCart, Tag, LogOut, Plus, Search, Edit, Trash2, 
  CheckCircle2, Clock, ShieldCheck, Eye, X, Filter, DollarSign, Users, ArrowUpRight, Grid 
} from 'lucide-react';

const REVENUE_DATA = [
  { day: 'সোম', sales: 45000, orders: 24 },
  { day: 'মঙ্গল', sales: 62000, orders: 32 },
  { day: 'বুধ', sales: 58000, orders: 29 },
  { day: 'বৃহঃ', sales: 78000, orders: 41 },
  { day: 'শুক্র', sales: 110000, orders: 65 },
  { day: 'শনি', sales: 95000, orders: 52 },
  { day: 'রবি', sales: 82000, orders: 44 },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAdminAuthStore();
  const { 
    products, categories, orders, coupons, 
    addProduct, updateProduct, deleteProduct, 
    addCategory, deleteCategory,
    updateOrderStatus, addCoupon, toggleCoupon, deleteCoupon 
  } = useAdminDataStore();

  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'categories' | 'orders' | 'coupons'>('analytics');
  
  // Create Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productForm, setProductForm] = useState({
    titleBn: '',
    titleEn: '',
    slug: '',
    descriptionBn: '',
    descriptionEn: '',
    categoryId: 'fresh-fish',
    basePrice: 1000,
    discountPrice: 900,
    sku: '',
    stock: 50,
    unit: 'kg',
    imageUrl: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?q=75&w=600&auto=format&fit=crop',
  });

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    nameBn: '',
    nameEn: '',
    slug: '',
  });

  // Coupon Modal State
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponForm, setCouponForm] = useState({
    code: '',
    discountPct: 15,
    minOrder: 1000,
  });

  // Selected Order Modal State
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null);

  // Search Filter Query
  const [searchQuery, setSearchQuery] = useState('');

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 bg-slate-900 rounded-3xl border border-slate-800 flex items-center justify-center mb-4 text-brand-400 shadow-xl">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black mb-2">Admin Authentication Required</h1>
        <p className="text-xs text-slate-400 mb-6 max-w-sm">
          Please log in with authorized admin credentials (admin / Arif@424800) to access the management console.
        </p>
        <button
          onClick={() => router.push('/admin/login')}
          className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-xl shadow-brand-600/30 transition"
        >
          Go to Admin Login Page
        </button>
      </div>
    );
  }

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({
      titleBn: productForm.titleBn || 'পদ্মার তাজা মাছ',
      titleEn: productForm.titleEn || 'Fresh Padma Fish',
      slug: productForm.slug || 'product-' + Date.now(),
      descriptionBn: productForm.descriptionBn || 'ফরমালিন মুক্ত তাজা পণ্য',
      descriptionEn: productForm.descriptionEn || '100% Formalin free fresh product',
      categoryId: productForm.categoryId,
      basePrice: Number(productForm.basePrice),
      discountPrice: Number(productForm.discountPrice),
      sku: productForm.sku || 'SKU-' + Math.floor(1000 + Math.random() * 9000),
      stock: Number(productForm.stock),
      unit: productForm.unit,
      images: [productForm.imageUrl],
      tags: ['fresh'],
    });
    setIsProductModalOpen(false);
  };

  const handleSaveEditedProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, {
        titleBn: editingProduct.titleBn,
        titleEn: editingProduct.titleEn,
        basePrice: Number(editingProduct.basePrice),
        discountPrice: Number(editingProduct.discountPrice),
        stock: Number(editingProduct.stock),
        unit: editingProduct.unit,
        categoryId: editingProduct.categoryId,
        images: editingProduct.images,
      });
      setEditingProduct(null);
    }
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (categoryForm.nameEn.trim()) {
      addCategory({
        nameBn: categoryForm.nameBn || categoryForm.nameEn,
        nameEn: categoryForm.nameEn,
        slug: categoryForm.slug || categoryForm.nameEn.toLowerCase().replace(/\s+/g, '-'),
      });
      setIsCategoryModalOpen(false);
      setCategoryForm({ nameBn: '', nameEn: '', slug: '' });
    }
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponForm.code.trim()) {
      addCoupon({
        code: couponForm.code.toUpperCase().trim(),
        discountPct: Number(couponForm.discountPct),
        minOrder: Number(couponForm.minOrder),
        isActive: true,
      });
      setIsCouponModalOpen(false);
      setCouponForm({ code: '', discountPct: 15, minOrder: 1000 });
    }
  };

  const filteredProducts = products.filter(p => 
    p.titleBn.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row font-sans">
      {/* Smart Dedicated Sidebar */}
      <aside className="w-full lg:w-64 bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-800/80 p-4 shrink-0 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="bg-brand-600 text-white p-2 rounded-xl font-black text-lg shadow-md shadow-brand-600/30">
                AHF
              </div>
              <div>
                <h2 className="font-extrabold text-sm text-white leading-tight">Al Hera Fresh</h2>
                <span className="text-[10px] text-brand-400 font-bold uppercase tracking-widest">Admin Workspace</span>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'analytics' ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20' : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'products' ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20' : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              <div className="flex-1 flex justify-between items-center">
                <span>Products Catalog</span>
                <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded-full font-bold">{products.length}</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'categories' ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20' : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Grid className="w-4 h-4" />
              <div className="flex-1 flex justify-between items-center">
                <span>Categories</span>
                <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded-full font-bold">{categories.length}</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'orders' ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20' : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <div className="flex-1 flex justify-between items-center">
                <span>Order Processing</span>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] px-2 py-0.5 rounded-full font-bold">{orders.length}</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('coupons')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'coupons' ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20' : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>Coupon Engine</span>
            </button>
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <div className="space-y-0.5">
            <p className="font-bold text-white leading-none">{user?.name || 'Arif (Super Admin)'}</p>
            <span className="text-[10px] text-emerald-400 font-bold">Active Session</span>
          </div>
          <button
            onClick={logout}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 p-4 sm:p-8 space-y-6 overflow-y-auto">
        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight">System Performance & Revenue</h1>
                <p className="text-xs text-slate-400">Live operational metrics, sales volume, and order processing status</p>
              </div>
              <button
                onClick={() => setIsProductModalOpen(true)}
                className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-600/30 transition transform hover:-translate-y-0.5 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
            </div>

            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800/80 shadow-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-slate-400 font-semibold">Total Revenue</span>
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-black text-white">৳ ৫,৩০,০০০</h3>
                <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1 mt-1">
                  <ArrowUpRight className="w-3 h-3" /> +12.5% vs last week
                </span>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800/80 shadow-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-slate-400 font-semibold">Total Orders</span>
                  <ShoppingCart className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-2xl font-black text-white">{orders.length + 285} Orders</h3>
                <span className="text-[11px] text-blue-400 font-bold flex items-center gap-1 mt-1">
                  <ArrowUpRight className="w-3 h-3" /> +8.2% conversion rate
                </span>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800/80 shadow-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-slate-400 font-semibold">Active Catalog SKUs</span>
                  <Package className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-2xl font-black text-white">{products.length} Products</h3>
                <span className="text-[11px] text-amber-400 font-bold mt-1">Formalin-free certified</span>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800/80 shadow-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-slate-400 font-semibold">Registered Customers</span>
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-2xl font-black text-white">1,450 Users</h3>
                <span className="text-[11px] text-purple-400 font-bold mt-1">+43 new today</span>
              </div>
            </div>

            {/* Recharts Revenue Area Chart */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800/80 shadow-lg">
              <h3 className="text-sm font-bold text-white mb-6">Daily Sales Revenue & Order Performance (Recharts)</h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={REVENUE_DATA}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#059669" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="day" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                    <Area type="monotone" dataKey="sales" stroke="#059669" fillOpacity={1} fill="url(#colorSales)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Products Management Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight">Product Catalog Management</h1>
                <p className="text-xs text-slate-400">Add new products, edit titles, adjust prices, and control inventory stock</p>
              </div>
              <button
                onClick={() => setIsProductModalOpen(true)}
                className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-600/30 transition transform hover:-translate-y-0.5 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Product</span>
              </button>
            </div>

            {/* Search Filter */}
            <div className="relative max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by title or SKU..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800/80 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            </div>

            {/* Products Table */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800/80 overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[11px]">
                    <tr>
                      <th className="p-4">Product Info</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-800/40 transition">
                        <td className="p-4 flex items-center gap-3">
                          <img src={prod.images[0]} alt="" className="w-12 h-12 object-cover rounded-xl border border-slate-800" />
                          <div>
                            <h4 className="font-bold text-white text-xs">{prod.titleBn}</h4>
                            <p className="text-[11px] text-slate-400">{prod.titleEn} ({prod.sku})</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md text-[11px] font-semibold">
                            {prod.categoryId}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="font-extrabold text-brand-400 text-sm">৳ {prod.discountPrice ?? prod.basePrice}</span>
                          {prod.discountPrice && (
                            <span className="text-[10px] text-slate-500 line-through block">৳ {prod.basePrice}</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                            prod.stock < 10 ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                          }`}>
                            {prod.stock} {prod.unit}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-1">
                          <button
                            onClick={() => setEditingProduct(prod)}
                            className="p-2 text-slate-300 hover:text-brand-400 hover:bg-slate-800 rounded-xl transition"
                            title="Edit product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteProduct(prod.id)}
                            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition"
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight">Category Hierarchy & Management</h1>
                <p className="text-xs text-slate-400">Organize organic produce categories and localized names</p>
              </div>
              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition transform hover:-translate-y-0.5 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <div key={cat.id} className="bg-slate-900 p-5 rounded-2xl border border-slate-800/80 shadow-lg flex justify-between items-center">
                  <div>
                    <h3 className="font-extrabold text-white text-sm">{cat.nameBn}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{cat.nameEn} ({cat.slug})</p>
                  </div>

                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Processing Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Order Processing & Fulfillment</h1>
              <p className="text-xs text-slate-400">Track customer orders, verify bKash/Nagad TrxIDs, and update delivery states</p>
            </div>

            <div className="bg-slate-900 rounded-2xl border border-slate-800/80 overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[11px]">
                    <tr>
                      <th className="p-4">Order ID & Date</th>
                      <th className="p-4">Customer Details</th>
                      <th className="p-4">Payment Info</th>
                      <th className="p-4">Total Amount</th>
                      <th className="p-4">Order Status</th>
                      <th className="p-4 text-right">View Detail</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-800/40 transition">
                        <td className="p-4">
                          <span className="font-extrabold text-white text-xs block">{ord.orderNumber}</span>
                          <span className="text-[10px] text-slate-400">{ord.createdAt}</span>
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-white">{ord.shippingDetail.recipientName}</p>
                          <p className="text-[11px] text-slate-400">{ord.shippingDetail.phone}</p>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-brand-400">{ord.paymentMethod}</span>
                          {ord.trxId && (
                            <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded ml-1 font-mono">
                              Trx: {ord.trxId}
                            </span>
                          )}
                        </td>
                        <td className="p-4 font-black text-white text-sm">৳ {ord.totalAmount}</td>
                        <td className="p-4">
                          <select
                            value={ord.orderStatus}
                            onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                            className="bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-brand-500 font-semibold"
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="PROCESSING">PROCESSING</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Coupons Tab */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight">Coupon & Discount Engine</h1>
                <p className="text-xs text-slate-400">Create active promo codes and percentage discounts</p>
              </div>
              <button
                onClick={() => setIsCouponModalOpen(true)}
                className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition transform hover:-translate-y-0.5 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Create Promo Code</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {coupons.map((c) => (
                <div key={c.id} className="bg-slate-900 p-5 rounded-2xl border border-slate-800/80 shadow-lg flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-brand-400 text-base font-mono">{c.code}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        c.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                      }`}>
                        {c.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Discount: {c.discountPct}% OFF</p>
                    <p className="text-[10px] text-slate-500">Min order amount: ৳ {c.minOrder}</p>
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => toggleCoupon(c.id)}
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition text-xs font-bold"
                    >
                      Toggle
                    </button>
                    <button
                      onClick={() => deleteCoupon(c.id)}
                      className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Add Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Add New Product to Catalog</h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Title (Bangla)</label>
                  <input
                    type="text"
                    required
                    value={productForm.titleBn}
                    onChange={(e) => setProductForm({ ...productForm, titleBn: e.target.value })}
                    placeholder="পদ্মার তাজা মাছ"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Title (English)</label>
                  <input
                    type="text"
                    required
                    value={productForm.titleEn}
                    onChange={(e) => setProductForm({ ...productForm, titleEn: e.target.value })}
                    placeholder="Fresh Padma Fish"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Base Price (৳)</label>
                  <input
                    type="number"
                    required
                    value={productForm.basePrice}
                    onChange={(e) => setProductForm({ ...productForm, basePrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Discount Price (৳)</label>
                  <input
                    type="number"
                    value={productForm.discountPrice}
                    onChange={(e) => setProductForm({ ...productForm, discountPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Stock</label>
                  <input
                    type="number"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Image URL</label>
                <input
                  type="text"
                  required
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brand-600 hover:bg-brand-500 text-white py-3 rounded-xl font-bold text-xs shadow-lg transition"
              >
                Save Product
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Edit Product Details</h3>
              <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedProduct} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Title (Bangla)</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.titleBn}
                    onChange={(e) => setEditingProduct({ ...editingProduct, titleBn: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Title (English)</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.titleEn}
                    onChange={(e) => setEditingProduct({ ...editingProduct, titleEn: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Base Price (৳)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.basePrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, basePrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Discount Price (৳)</label>
                  <input
                    type="number"
                    value={editingProduct.discountPrice ?? ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, discountPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Stock</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Image URL</label>
                <input
                  type="text"
                  required
                  value={editingProduct.images[0]}
                  onChange={(e) => setEditingProduct({ ...editingProduct, images: [e.target.value] })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brand-600 hover:bg-brand-500 text-white py-3 rounded-xl font-bold text-xs shadow-lg transition"
              >
                Update Product Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Add New Category</h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Category Name (Bangla)</label>
                <input
                  type="text"
                  required
                  value={categoryForm.nameBn}
                  onChange={(e) => setCategoryForm({ ...categoryForm, nameBn: e.target.value })}
                  placeholder="মিঠা পানির মাছ"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Category Name (English)</label>
                <input
                  type="text"
                  required
                  value={categoryForm.nameEn}
                  onChange={(e) => setCategoryForm({ ...categoryForm, nameEn: e.target.value })}
                  placeholder="Fresh Fish"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brand-600 hover:bg-brand-500 text-white py-3 rounded-xl font-bold text-xs shadow-lg transition"
              >
                Save Category
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Coupon Modal */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Create Promo Code</h3>
              <button onClick={() => setIsCouponModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })}
                  placeholder="E.g. SUMMER15"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white uppercase focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Discount %</label>
                  <input
                    type="number"
                    required
                    value={couponForm.discountPct}
                    onChange={(e) => setCouponForm({ ...couponForm, discountPct: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Min Order (৳)</label>
                  <input
                    type="number"
                    required
                    value={couponForm.minOrder}
                    onChange={(e) => setCouponForm({ ...couponForm, minOrder: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-600 hover:bg-brand-500 text-white py-3 rounded-xl font-bold text-xs shadow-lg transition"
              >
                Save Coupon
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-white text-base">Order Details: {selectedOrder.orderNumber}</h3>
                <span className="text-[10px] text-slate-400">{selectedOrder.createdAt}</span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <p className="font-bold text-white">Shipping Address</p>
                <p>Recipient: {selectedOrder.shippingDetail.recipientName}</p>
                <p>Phone: {selectedOrder.shippingDetail.phone}</p>
                <p>Address: {selectedOrder.shippingDetail.streetAddress}, {selectedOrder.shippingDetail.upazila}, {selectedOrder.shippingDetail.district}</p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <p className="font-bold text-white">Payment Method & Status</p>
                <p>Method: <span className="font-bold text-brand-400">{selectedOrder.paymentMethod}</span></p>
                {selectedOrder.trxId && <p>TrxID: <span className="font-mono">{selectedOrder.trxId}</span></p>}
                <p>Total Payable: <span className="font-bold text-white text-sm">৳ {selectedOrder.totalAmount}</span></p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
