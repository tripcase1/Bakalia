'use client';

import { create } from 'zustand';
import { CheckCircle2, ShoppingBag, Heart, X } from 'lucide-react';
import { useEffect } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'cart' | 'wishlist' | 'info';
}

interface ToastState {
  toasts: Toast[];
  showToast: (message: string, type?: 'cart' | 'wishlist' | 'info') => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  showToast: (message, type = 'cart') => {
    const id = Math.random().toString();
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 3000);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export function ToastNotifier() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-slate-900 text-white p-3.5 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center justify-between gap-3 animate-in slide-in-from-bottom-5 duration-300 backdrop-blur-md"
        >
          <div className="flex items-center gap-2.5">
            {toast.type === 'cart' && <ShoppingBag className="w-5 h-5 text-emerald-400 shrink-0" />}
            {toast.type === 'wishlist' && <Heart className="w-5 h-5 text-rose-400 fill-rose-400 shrink-0" />}
            {toast.type === 'info' && <CheckCircle2 className="w-5 h-5 text-gold-400 shrink-0" />}
            <span className="text-xs font-semibold leading-snug">{toast.message}</span>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-white p-1 transition shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
