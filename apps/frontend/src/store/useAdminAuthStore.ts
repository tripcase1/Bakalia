import { create } from 'zustand';

interface AdminUser {
  username: string;
  name: string;
  role: 'ADMIN' | 'MANAGER';
}

interface AdminAuthState {
  isAuthenticated: boolean;
  user: AdminUser | null;
  login: (userOrEmail: string, pass: string) => boolean;
  logout: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>((set) => ({
  isAuthenticated: false,
  user: null,

  login: (userOrEmail, pass) => {
    const trimmedInput = userOrEmail.trim().toLowerCase();
    const isUserValid = trimmedInput === 'admin' || trimmedInput === 'admin@alherafresh.com';
    const isPassValid = pass === 'Arif@424800';

    if (isUserValid && isPassValid) {
      set({
        isAuthenticated: true,
        user: {
          username: 'admin',
          name: 'Arif (Super Admin)',
          role: 'ADMIN',
        },
      });
      return true;
    }
    return false;
  },

  logout: () => set({ isAuthenticated: false, user: null }),
}));
