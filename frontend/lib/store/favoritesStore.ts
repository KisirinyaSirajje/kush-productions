import { create } from 'zustand';
import { apiClient } from '@/lib/api/client';

interface Favorite {
  id: string;
  userId: string;
  type: string;
  movieId?: string;
  foodId?: string;
  movie?: any;
  food?: any;
  createdAt: string;
}

interface FavoritesState {
  favorites: Favorite[];
  isLoading: boolean;
  fetchFavorites: () => Promise<void>;
  addFavorite: (type: 'movie' | 'food', itemId: string) => Promise<void>;
  removeFavorite: (favoriteId: string) => Promise<void>;
  isFavorited: (type: 'movie' | 'food', itemId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  isLoading: false,

  fetchFavorites: async () => {
    try {
      set({ isLoading: true });
      const response = await apiClient.get('/api/favorites');
      set({ favorites: response.data.favorites || [], isLoading: false });
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
      set({ isLoading: false, favorites: [] });
    }
  },

  addFavorite: async (type: 'movie' | 'food', itemId: string) => {
    try {
      const data: any = { type };
      if (type === 'movie') {
        data.movieId = itemId;
      } else {
        data.foodId = itemId;
      }

      const response = await apiClient.post('/api/favorites', data);
      const newFavorite = response.data.favorite;
      
      set((state) => ({
        favorites: [newFavorite, ...state.favorites],
      }));
    } catch (error) {
      console.error('Failed to add favorite:', error);
      throw error;
    }
  },

  removeFavorite: async (favoriteId: string) => {
    try {
      await apiClient.delete(`/api/favorites/${favoriteId}`);
      
      set((state) => ({
        favorites: state.favorites.filter((f) => f.id !== favoriteId),
      }));
    } catch (error) {
      console.error('Failed to remove favorite:', error);
      throw error;
    }
  },

  isFavorited: (type: 'movie' | 'food', itemId: string) => {
    const { favorites } = get();
    return favorites.some((f) => {
      if (type === 'movie') {
        return f.type === 'movie' && f.movieId === itemId;
      }
      return f.type === 'food' && f.foodId === itemId;
    });
  },
}));
