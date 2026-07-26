import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, ProductVariant, CartItem } from '@/types';
import { useAdminDataStore } from './useAdminDataStore';

interface CartState {
  items: CartItem[];
  couponCode: string | null;
  discountAmount: number;
  isOpen: boolean;
  addItem: (product: Product, variant?: ProductVariant, quantity?: number) => { success: boolean; error?: string };
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  applyCoupon: (code: string) => { success: boolean; error?: string };
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getTotal: () => number;
  getDiscountAmount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      discountAmount: 0,
      isOpen: false,

      addItem: (product, variant, quantity = 1) => {
        // Stock validation against admin catalog
        const adminProducts = useAdminDataStore.getState().products;
        const liveProduct = adminProducts.find(p => p.id === product.id) || product;

        const existingItem = get().items.find(
          (item) => item.product.id === product.id && item.selectedVariant?.id === variant?.id
        );
        const currentQty = existingItem?.quantity ?? 0;
        const requestedQty = currentQty + quantity;

        if (requestedQty > liveProduct.stock) {
          return {
            success: false,
            error: `Sorry, only ${liveProduct.stock} ${liveProduct.unit} in stock.`,
          };
        }

        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.product.id === product.id && item.selectedVariant?.id === variant?.id
          );

          if (existingIndex > -1) {
            const updated = [...state.items];
            updated[existingIndex] = { ...updated[existingIndex], quantity: requestedQty };
            return { items: updated, isOpen: true };
          }

          return {
            items: [...state.items, { product: liveProduct, selectedVariant: variant, quantity }],
            isOpen: true,
          };
        });

        return { success: true };
      },

      removeItem: (productId, variantId) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.product.id === productId && item.selectedVariant?.id === variantId)
          ),
        }));
      },

      updateQuantity: (productId, quantity, variantId) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId);
          return;
        }

        // Validate against stock
        const adminProducts = useAdminDataStore.getState().products;
        const item = get().items.find(
          (i) => i.product.id === productId && i.selectedVariant?.id === variantId
        );
        if (item) {
          const liveProduct = adminProducts.find(p => p.id === productId);
          const stock = liveProduct?.stock ?? item.product.stock;
          if (quantity > stock) return; // Silently cap at stock
        }

        set((state) => ({
          items: state.items.map((item) => {
            if (item.product.id === productId && item.selectedVariant?.id === variantId) {
              return { ...item, quantity };
            }
            return item;
          }),
        }));
      },

      applyCoupon: (code) => {
        const upperCode = code.toUpperCase().trim();
        if (!upperCode) return { success: false, error: 'Please enter a coupon code.' };

        const subtotal = get().getSubtotal();
        if (subtotal <= 0) return { success: false, error: 'Add items to cart first.' };

        // Check against live admin coupons
        const adminCoupons = useAdminDataStore.getState().coupons;
        const coupon = adminCoupons.find(c => c.code === upperCode && c.isActive);

        if (!coupon) {
          return { success: false, error: 'Invalid or expired coupon code.' };
        }

        if (subtotal < coupon.minOrder) {
          return {
            success: false,
            error: `Minimum order ৳${coupon.minOrder} required for this coupon.`,
          };
        }

        const discount = Math.round(subtotal * (coupon.discountPct / 100));
        set({ couponCode: upperCode, discountAmount: discount });
        return { success: true };
      },

      clearCart: () => set({ items: [], couponCode: null, discountAmount: 0, isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),

      getTotalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),

      getSubtotal: () =>
        get().items.reduce((acc, item) => {
          const price = item.selectedVariant
            ? item.selectedVariant.price
            : item.product.discountPrice ?? item.product.basePrice;
          return acc + price * item.quantity;
        }, 0),

      getDiscountAmount: () => get().discountAmount,

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const delivery = subtotal > 0 ? 60 : 0;
        return Math.max(0, subtotal + delivery - get().discountAmount);
      },
    }),
    {
      name: 'alhera-cart',
      // Don't persist isOpen drawer state
      partialize: (state) => ({
        items: state.items,
        couponCode: state.couponCode,
        discountAmount: state.discountAmount,
      }),
    }
  )
);
