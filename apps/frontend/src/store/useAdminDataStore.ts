import { create } from 'zustand';
import { Product, Category, Order, OrderStatus } from '@/types';

export interface Coupon {
  id: string;
  code: string;
  discountPct: number;
  minOrder: number;
  isActive: boolean;
}

export interface AdminDataState {
  products: Product[];
  categories: Category[];
  orders: Order[];
  coupons: Coupon[];
  
  // Product CRUD
  addProduct: (product: Omit<Product, 'id' | 'ratingAvg' | 'ratingCount'>) => void;
  updateProduct: (id: string, productData: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Category CRUD
  addCategory: (category: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => void;

  // Order Status Control
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Coupon Control
  addCoupon: (coupon: Omit<Coupon, 'id'>) => void;
  toggleCoupon: (id: string) => void;
  deleteCoupon: (id: string) => void;
}

export const useAdminDataStore = create<AdminDataState>((set) => ({
  products: [
    {
      id: 'p1',
      titleBn: 'পদ্মার তাজা ডিমওয়ালা বড় ইলিশ (১.৫ কেজি)',
      titleEn: 'Padma Big Silver Hilsa Fish (1.5kg)',
      slug: 'padma-river-hilsa-ilish',
      descriptionBn: 'সরাসরি পদ্মার আসল ইলিশ মাছ। কেমিক্যাল ও ফরমালিন মুক্ত।',
      descriptionEn: 'Authentic Padma River silver Hilsa fish.',
      categoryId: 'fresh-fish',
      basePrice: 2200,
      discountPrice: 1950,
      sku: 'ILISH-1.5',
      stock: 25,
      unit: 'kg',
      isFeatured: true,
      isFlashSale: true,
      images: ['https://images.unsplash.com/photo-1534483509719-3feaee7c30da?q=75&w=600&auto=format&fit=crop'],
      ratingAvg: 4.9,
      ratingCount: 154,
      tags: ['hilsa', 'padma'],
    },
    {
      id: 'p2',
      titleBn: 'চট্টগ্রামের প্রিমিয়াম সাদা রূপচাঁদা',
      titleEn: 'Chittagong Deep Sea White Pomfret',
      slug: 'chittagong-sea-rupchanda',
      descriptionBn: 'বঙ্গোপসাগরের রূপচাঁদা মাছ।',
      descriptionEn: 'Deep sea fresh white pomfret.',
      categoryId: 'sea-fish',
      basePrice: 1400,
      discountPrice: 1250,
      sku: 'RUPCHANDA-01',
      stock: 30,
      unit: 'kg',
      images: ['https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=75&w=600&auto=format&fit=crop'],
      ratingAvg: 4.8,
      ratingCount: 88,
      tags: ['sea fish'],
    },
    {
      id: 'p3',
      titleBn: 'সুন্দরবনের খলিসা ফুলের খাঁটি মধু (৫০০ গ্রাম)',
      titleEn: 'Sundarbans Kholisa Pure Raw Honey (500g)',
      slug: 'sundarban-natural-raw-honey',
      descriptionBn: 'সুন্দরবনের অর্গানিক কাঁচা মধু।',
      descriptionEn: '100% Raw unprocessed Sundarbans honey.',
      categoryId: 'honey',
      basePrice: 950,
      discountPrice: 850,
      sku: 'HONEY-KHOLISA',
      stock: 50,
      unit: 'jar',
      images: ['https://images.unsplash.com/photo-1587049352847-4a222e784d38?q=75&w=600&auto=format&fit=crop'],
      ratingAvg: 5.0,
      ratingCount: 310,
      tags: ['honey'],
    },
    {
      id: 'p4',
      titleBn: 'রাজশাহীর মিষ্টি কাটিমন আম (৫ কেজি)',
      titleEn: 'Rajshahi Katimon Organic Mango (5kg)',
      slug: 'rajshahi-katimon-mango',
      descriptionBn: 'গাছ পাকা সুমিষ্ট আম।',
      descriptionEn: 'Tree-ripened Katimon Mangoes.',
      categoryId: 'mango',
      basePrice: 1200,
      discountPrice: 990,
      sku: 'MANGO-KATIMON',
      stock: 60,
      unit: 'box',
      images: ['https://images.unsplash.com/photo-1553279768-865429fa0078?q=75&w=600&auto=format&fit=crop'],
      ratingAvg: 4.9,
      ratingCount: 95,
      tags: ['mango'],
    },
  ],

  categories: [
    { id: 'fresh-fish', nameBn: 'মিঠা পানির মাছ', nameEn: 'Fresh Fish', slug: 'fresh-fish' },
    { id: 'sea-fish', nameBn: 'সামুদ্রিক মাছ', nameEn: 'Sea Fish', slug: 'sea-fish' },
    { id: 'dry-fish', nameBn: 'শুঁটকি মাছ', nameEn: 'Dry Fish', slug: 'dry-fish' },
    { id: 'mango', nameBn: 'রাজশাহীর আম', nameEn: 'Mango', slug: 'mango' },
    { id: 'honey', nameBn: 'খাঁটি মধু', nameEn: 'Pure Honey', slug: 'honey' },
    { id: 'vegetables', nameBn: 'তাজা শাকসবজি', nameEn: 'Vegetables', slug: 'vegetables' },
  ],

  orders: [
    {
      id: 'ord-1',
      orderNumber: 'AHF-849201',
      subTotal: 1950,
      deliveryFee: 60,
      discount: 0,
      totalAmount: 2010,
      paymentMethod: 'BKASH',
      paymentStatus: 'PAID',
      orderStatus: 'PROCESSING',
      trxId: '9B7X2M1A',
      items: [],
      shippingDetail: {
        recipientName: 'মো: তানভীর হাসান',
        phone: '01712345678',
        division: 'ঢাকা',
        district: 'ঢাকা',
        upazila: 'ধানমন্ডি',
        streetAddress: 'রোড নং ২৭, বাসা নং ১৫/এ',
      },
      createdAt: '২০২৬-০৭-২৬',
    },
    {
      id: 'ord-2',
      orderNumber: 'AHF-710294',
      subTotal: 1700,
      deliveryFee: 60,
      discount: 100,
      totalAmount: 1660,
      paymentMethod: 'COD',
      paymentStatus: 'PENDING',
      orderStatus: 'PENDING',
      items: [],
      shippingDetail: {
        recipientName: 'ফারহানা সুলতানা',
        phone: '01898765432',
        division: 'ঢাকা',
        district: 'ঢাকা',
        upazila: 'উত্তরা',
        streetAddress: 'সেক্টর ৪, রোড ১০',
      },
      createdAt: '২০২৬-০৭-২৫',
    },
  ],

  coupons: [
    { id: 'c1', code: 'ALHERAFRESH10', discountPct: 10, minOrder: 1000, isActive: true },
    { id: 'c2', code: 'RAMADAN20', discountPct: 20, minOrder: 2000, isActive: false },
  ],

  addProduct: (productData) => {
    const id = 'p-' + Date.now();
    const newProduct: Product = {
      ...productData,
      id,
      ratingAvg: 5.0,
      ratingCount: 1,
    };
    set((state) => ({ products: [newProduct, ...state.products] }));
  },

  updateProduct: (id, productData) => {
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, ...productData } : p)),
    }));
  },

  deleteProduct: (id) => {
    set((state) => ({ products: state.products.filter((p) => p.id !== id) }));
  },

  addCategory: (categoryData) => {
    const id = 'cat-' + Date.now();
    set((state) => ({ categories: [...state.categories, { ...categoryData, id }] }));
  },

  deleteCategory: (id) => {
    set((state) => ({ categories: state.categories.filter((c) => c.id !== id) }));
  },

  updateOrderStatus: (orderId, status) => {
    set((state) => ({
      orders: state.orders.map((o) => (o.id === orderId ? { ...o, orderStatus: status } : o)),
    }));
  },

  addCoupon: (couponData) => {
    const id = 'c-' + Date.now();
    set((state) => ({ coupons: [...state.coupons, { ...couponData, id }] }));
  },

  toggleCoupon: (id) => {
    set((state) => ({
      coupons: state.coupons.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c)),
    }));
  },

  deleteCoupon: (id) => {
    set((state) => ({ coupons: state.coupons.filter((c) => c.id !== id) }));
  },
}));
