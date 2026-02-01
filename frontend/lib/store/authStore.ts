import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import apiClient from '@/lib/api/client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  subscription?: 'FREE' | 'BASIC' | 'PREMIUM';
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          const response = await apiClient.post('/api/auth/login', { email, password });
          const { user, token } = response.data;

          set({ 
            user: {
              ...user,
              role: user.role as 'USER' | 'ADMIN',
            }, 
            token, 
            isAuthenticated: true 
          });

          return { success: true };
        } catch (error: unknown) {
          const err = error as { response?: { data?: { error?: string } } };
          const errorMessage = err.response?.data?.error || 'Login failed. Please try again.';
          return { success: false, error: errorMessage };
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem('auth-storage');
      },

      isAdmin: () => {
        const state = get();
        return state.user?.role === 'ADMIN';
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
