import { create } from 'zustand';
import { Product } from '@/types';

interface WishlistState {
  items: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  toggleWishlist: (product) => {
    set((state) => {
      const exists = state.items.some((p) => p.id === product.id);
      if (exists) {
        return { items: state.items.filter((p) => p.id !== product.id) };
      }
      return { items: [...state.items, product] };
    });
  },
  isInWishlist: (productId) => get().items.some((p) => p.id === productId),
}));
