import { create } from 'zustand';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  subscription?: 'free' | 'basic' | 'premium';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    // Demo authentication - Replace with actual API call
    // Admin credentials: admin@kushfilms.com / admin123
    // User credentials: user@kushfilms.com / user123
    
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

    if (email === 'admin@kushfilms.com' && password === 'admin123') {
      const adminUser: User = {
        id: 1,
        name: 'Admin User',
        email: 'admin@kushfilms.com',
        role: 'admin',
      };
      set({ user: adminUser, isAuthenticated: true });
      return { success: true };
    } else if (email === 'user@kushfilms.com' && password === 'user123') {
      const regularUser: User = {
        id: 2,
        name: 'John Doe',
        email: 'user@kushfilms.com',
        role: 'user',
        subscription: 'free',
      };
      set({ user: regularUser, isAuthenticated: true });
      return { success: true };
    } else {
      return { success: false, error: 'Invalid email or password' };
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  isAdmin: () => {
    const state = get();
    return state.user?.role === 'admin';
  },
}));
