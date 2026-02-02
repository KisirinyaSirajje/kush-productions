"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Heart, Package, Star, Film, UtensilsCrossed } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MovieCard from "@/components/MovieCard";
import FoodCard from "@/components/FoodCard";
import { useAuthStore } from "@/lib/store/authStore";
import { useFavoritesStore } from "@/lib/store/favoritesStore";
import { apiClient } from "@/lib/api/client";
import { cn } from "@/lib/utils";

type Tab = 'profile' | 'favorites' | 'orders' | 'ratings';

interface Order {
  id: string;
  items: any[];
  total: number;
  status: string;
  createdAt: string;
  deliveryAddress: string;
}

interface Rating {
  id: string;
  rating: number;
  type: string;
  movieId?: string;
  foodId?: string;
  movie?: { id: string; title: string; thumbnailUrl: string };
  food?: { id: string; name: string; image: string };
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { favorites, fetchFavorites } = useFavoritesStore();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [orders, setOrders] = useState<Order[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchFavorites();
    fetchOrders();
    fetchRatings();
  }, [isAuthenticated, router]);

  const fetchOrders = async () => {
    try {
      const response = await apiClient.get('/api/orders');
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const fetchRatings = async () => {
    try {
      const response = await apiClient.get('/api/ratings');
      setRatings(response.data.ratings || []);
    } catch (error) {
      console.error('Failed to fetch ratings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  const tabs = [
    { id: 'profile' as Tab, label: 'Profile', icon: User },
    { id: 'favorites' as Tab, label: 'Favorites', icon: Heart },
    { id: 'orders' as Tab, label: 'Orders', icon: Package },
    { id: 'ratings' as Tab, label: 'Ratings', icon: Star },
  ];

  const movieFavorites = favorites.filter(f => f.type === 'movie' && f.movie);
  const foodFavorites = favorites.filter(f => f.type === 'food' && f.food);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 pt-24 sm:pt-28 lg:pt-32">
        {/* Header */}
        <div className="glass-card p-6 sm:p-8 rounded-xl mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary flex items-center justify-center">
              <span className="text-2xl sm:text-3xl font-bold text-primary-foreground">
                {user?.name.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">{user?.name}</h1>
              <p className="text-muted-foreground">{user?.email}</p>
              {user?.phone && (
                <p className="text-sm text-muted-foreground mt-1">{user.phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap",
                  activeTab === tab.id
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted hover:bg-muted/80"
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <div className="glass-card p-6 sm:p-8 rounded-xl">
            <h2 className="text-xl font-bold mb-6">Profile Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={user?.name || ''}
                  disabled
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-muted-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-muted-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  value={user?.phone || 'Not provided'}
                  disabled
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-muted-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Role</label>
                <div className="px-4 py-3 rounded-lg bg-muted border border-border">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-sm font-semibold",
                    user?.role === 'ADMIN' 
                      ? "bg-primary text-primary-foreground"
                      : "bg-accent text-accent-foreground"
                  )}>
                    {user?.role}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'favorites' && (
          <div>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto" />
              </div>
            ) : favorites.length === 0 ? (
              <div className="glass-card p-12 rounded-xl text-center">
                <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-bold mb-2">No favorites yet</h3>
                <p className="text-muted-foreground mb-6">Start adding your favorite movies and foods!</p>
                <div className="flex gap-4 justify-center">
                  <Link href="/movies" className="px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-semibold">
                    Browse Movies
                  </Link>
                  <Link href="/foods" className="px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-semibold">
                    Browse Foods
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {movieFavorites.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Film className="w-5 h-5 text-primary" />
                      <h3 className="text-xl font-bold">Movies ({movieFavorites.length})</h3>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {movieFavorites.map((fav) => fav.movie && (
                        <MovieCard
                          key={fav.id}
                          id={fav.movie.id}
                          title={fav.movie.title}
                          posterPath={fav.movie.thumbnailUrl}
                          rating={fav.movie.rating}
                          year={fav.movie.releaseYear}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {foodFavorites.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <UtensilsCrossed className="w-5 h-5 text-accent" />
                      <h3 className="text-xl font-bold">Foods ({foodFavorites.length})</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {foodFavorites.map((fav) => fav.food && (
                        <FoodCard
                          key={fav.id}
                          id={fav.food.id}
                          name={fav.food.name}
                          category={fav.food.category}
                          description={fav.food.description}
                          price={fav.food.price}
                          image={fav.food.image}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            {orders.length === 0 ? (
              <div className="glass-card p-12 rounded-xl text-center">
                <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-bold mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-6">Start ordering delicious Ugandan food!</p>
                <Link href="/foods" className="inline-block px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-semibold">
                  Browse Foods
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="glass-card p-6 rounded-xl">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold">Order #{order.id.slice(0, 8)}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-sm font-semibold",
                        order.status === 'DELIVERED' && "bg-green-600/20 text-green-600",
                        order.status === 'CONFIRMED' && "bg-blue-600/20 text-blue-600",
                        order.status === 'PENDING' && "bg-yellow-600/20 text-yellow-600",
                        order.status === 'CANCELLED' && "bg-red-600/20 text-red-600"
                      )}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {order.items.length} item(s)
                    </p>
                    <div className="flex justify-between items-center pt-4 border-t border-border">
                      <span className="font-semibold">Total</span>
                      <span className="text-lg font-bold text-accent">
                        UGX {order.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'ratings' && (
          <div>
            {ratings.length === 0 ? (
              <div className="glass-card p-12 rounded-xl text-center">
                <Star className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-bold mb-2">No ratings yet</h3>
                <p className="text-muted-foreground">Rate movies and foods you've enjoyed!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {ratings.map((rating) => (
                  <div key={rating.id} className="glass-card p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">
                          {rating.type === 'movie' ? rating.movie?.title : rating.food?.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(rating.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 fill-accent text-accent" />
                        <span className="text-xl font-bold text-accent">{rating.rating}/10</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
