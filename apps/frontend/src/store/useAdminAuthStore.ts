import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminUser {
  username: string;
  name: string;
  role: 'ADMIN' | 'MANAGER';
}

interface AdminAuthState {
  isAuthenticated: boolean;
  user: AdminUser | null;
  loginError: string | null;
  login: (userOrEmail: string, pass: string) => boolean;
  logout: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      loginError: null,

      login: (userOrEmail, pass) => {
        const trimmed = userOrEmail.trim().toLowerCase();
        const isUserValid = trimmed === 'admin' || trimmed === 'admin@alherafresh.com';
        const isPassValid = pass === 'Arif@424800';

        if (isUserValid && isPassValid) {
          set({
            isAuthenticated: true,
            loginError: null,
            user: {
              username: 'admin',
              name: 'Arif (Super Admin)',
              role: 'ADMIN',
            },
          });
          return true;
        }

        set({ loginError: 'Invalid username or password.' });
        return false;
      },

      logout: () => set({ isAuthenticated: false, user: null, loginError: null }),
    }),
    {
      name: 'alhera-admin-auth',
    }
  )
);
