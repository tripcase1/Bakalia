import { create } from 'zustand';
import { Product, ProductVariant, CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  couponCode: string | null;
  discountAmount: number;
  isOpen: boolean;
  addItem: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  applyCoupon: (code: string) => boolean;
  clearCart: () => void;
  toggleCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  couponCode: null,
  discountAmount: 0,
  isOpen: false,

  addItem: (product, variant, quantity = 1) => {
    set((state) => {
      const existingIndex = state.items.findIndex(
        (item) => item.product.id === product.id && item.selectedVariant?.id === variant?.id
      );

      if (existingIndex > -1) {
        const updated = [...state.items];
        updated[existingIndex].quantity += quantity;
        return { items: updated, isOpen: true };
      }

      return {
        items: [...state.items, { product, selectedVariant: variant, quantity }],
        isOpen: true,
      };
    });
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
    const uppercaseCode = code.toUpperCase().trim();
    if (uppercaseCode === 'ALHERAFRESH10') {
      const subtotal = get().getSubtotal();
      const discount = Math.round(subtotal * 0.1);
      set({ couponCode: uppercaseCode, discountAmount: discount });
      return true;
    }
    return false;
  },

  clearCart: () => set({ items: [], couponCode: null, discountAmount: 0 }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

  getTotalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),

  getSubtotal: () =>
    get().items.reduce((acc, item) => {
      const price = item.selectedVariant
        ? item.selectedVariant.price
        : item.product.discountPrice ?? item.product.basePrice;
      return acc + price * item.quantity;
    }, 0),

  getTotal: () => {
    const subtotal = get().getSubtotal();
    const delivery = subtotal > 0 ? 60 : 0; // Standard Dhaka Delivery Fee
    return Math.max(0, subtotal + delivery - get().discountAmount);
  },
}));
