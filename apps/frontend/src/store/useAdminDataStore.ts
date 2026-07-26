import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, Category, Order, OrderStatus, CartItem } from '@/types';

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

  // Order Management - called by checkout
  placeOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => string;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Coupon Control
  addCoupon: (coupon: Omit<Coupon, 'id'>) => void;
  toggleCoupon: (id: string) => void;
  deleteCoupon: (id: string) => void;

  // Stock management
  deductStock: (items: CartItem[]) => void;
}

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    titleBn: 'পদ্মার তাজা ডিমওয়ালা বড় ইলিশ (১.৫ কেজি)',
    titleEn: 'Padma Big Silver Hilsa Fish (1.5kg)',
    slug: 'padma-river-hilsa-ilish',
    descriptionBn: 'সরাসরি পদ্মার আসল ইলিশ মাছ। কেমিক্যাল ও ফরমালিন মুক্ত।',
    descriptionEn: 'Authentic Padma River silver Hilsa fish. 100% formalin free.',
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
    descriptionBn: 'বঙ্গোপসাগরের তাজা রূপচাঁদা মাছ।',
    descriptionEn: 'Deep sea fresh white pomfret from Bay of Bengal.',
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
    titleBn: 'রাজশাহীর মিষ্টি কাটিমন আম (৫ কেজি বাক্স)',
    titleEn: 'Rajshahi Katimon Organic Mango (5kg Box)',
    slug: 'rajshahi-katimon-mango',
    descriptionBn: 'গাছ পাকা সুমিষ্ট কাটিমন আম।',
    descriptionEn: 'Tree-ripened Katimon Mangoes from Rajshahi.',
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
];

export const useAdminDataStore = create<AdminDataState>()(
  persist(
    (set, get) => ({
      products: INITIAL_PRODUCTS,

      categories: [
        { id: 'fresh-fish', nameBn: 'মিঠা পানির মাছ', nameEn: 'Fresh Fish', slug: 'fresh-fish' },
        { id: 'sea-fish', nameBn: 'সামুদ্রিক মাছ', nameEn: 'Sea Fish', slug: 'sea-fish' },
        { id: 'dry-fish', nameBn: 'শুঁটকি মাছ', nameEn: 'Dry Fish', slug: 'dry-fish' },
        { id: 'mango', nameBn: 'রাজশাহীর আম', nameEn: 'Mango', slug: 'mango' },
        { id: 'honey', nameBn: 'খাঁটি মধু', nameEn: 'Pure Honey', slug: 'honey' },
        { id: 'vegetables', nameBn: 'তাজা শাকসবজি', nameEn: 'Vegetables', slug: 'vegetables' },
      ],

      orders: [],

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
          ratingCount: 0,
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

      // ─── REAL ORDER PLACEMENT ───────────────────────────────────────────────────
      placeOrder: (orderData) => {
        const orderNumber = 'AHF-' + Math.floor(100000 + Math.random() * 900000);
        const id = 'ord-' + Date.now();
        const now = new Date();
        const createdAt = now.toLocaleDateString('bn-BD', {
          year: 'numeric', month: 'long', day: 'numeric',
          hour: '2-digit', minute: '2-digit',
        });

        const newOrder: Order = {
          ...orderData,
          id,
          orderNumber,
          createdAt,
        };

        set((state) => ({ orders: [newOrder, ...state.orders] }));

        // Deduct stock for each ordered item
        get().deductStock(orderData.items);

        return orderNumber;
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, orderStatus: status } : o
          ),
        }));
      },

      addCoupon: (couponData) => {
        // Prevent duplicate codes
        const existing = get().coupons.find(
          (c) => c.code === couponData.code.toUpperCase()
        );
        if (existing) return;

        const id = 'c-' + Date.now();
        set((state) => ({
          coupons: [...state.coupons, { ...couponData, code: couponData.code.toUpperCase(), id }],
        }));
      },

      toggleCoupon: (id) => {
        set((state) => ({
          coupons: state.coupons.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c)),
        }));
      },

      deleteCoupon: (id) => {
        set((state) => ({ coupons: state.coupons.filter((c) => c.id !== id) }));
      },

      // ─── STOCK DEDUCTION ────────────────────────────────────────────────────────
      deductStock: (items) => {
        set((state) => ({
          products: state.products.map((product) => {
            const orderedItem = items.find((i) => i.product.id === product.id);
            if (orderedItem) {
              return {
                ...product,
                stock: Math.max(0, product.stock - orderedItem.quantity),
              };
            }
            return product;
          }),
        }));
      },
    }),
    {
      name: 'alhera-admin-data',
    }
  )
);
