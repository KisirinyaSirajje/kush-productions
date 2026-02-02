import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  foodId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
}

interface CartState {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (foodId: string) => void;
  updateQuantity: (foodId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (item) => {
        const { items } = get();
        const existingItem = items.find((i) => i.foodId === item.foodId);

        if (existingItem) {
          set({
            items: items.map((i) =>
              i.foodId === item.foodId ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          set({ items: [...items, { ...item, quantity: 1 }] });
        }
      },

      removeFromCart: (foodId) => {
        set({ items: get().items.filter((item) => item.foodId !== foodId) });
      },

      updateQuantity: (foodId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(foodId);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.foodId === foodId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'kush-cart-storage',
    }
  )
);
