"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MovieCard from "@/components/MovieCard";
import FoodCard from "@/components/FoodCard";
import { Heart, Film, UtensilsCrossed } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { useFavoritesStore } from "@/lib/store/favoritesStore";

export default function WatchlistPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { favorites, fetchFavorites } = useFavoritesStore();
  const [activeTab, setActiveTab] = useState<'movies' | 'foods'>('movies');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const loadFavorites = async () => {
      await fetchFavorites();
      setIsLoading(false);
    };

    loadFavorites();
  }, [isAuthenticated, router, fetchFavorites]);

  if (!isAuthenticated) {
    return null;
  }

  const movieFavorites = favorites.filter(fav => fav.type === 'movie' && fav.movie);
  const foodFavorites = favorites.filter(fav => fav.type === 'food' && fav.food);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <Heart className="w-10 h-10 text-primary" fill="currentColor" />
            <div>
              <h1 className="text-4xl font-serif font-bold text-foreground">Your Watchlist</h1>
              <p className="text-muted-foreground mt-1">
                All your favorite movies and foods in one place
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 border-b border-border">
            <button
              onClick={() => setActiveTab('movies')}
              className={`flex items-center gap-2 px-6 py-3 font-semibold transition-colors relative ${
                activeTab === 'movies'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Film className="w-5 h-5" />
              Movies ({movieFavorites.length})
              {activeTab === 'movies' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('foods')}
              className={`flex items-center gap-2 px-6 py-3 font-semibold transition-colors relative ${
                activeTab === 'foods'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <UtensilsCrossed className="w-5 h-5" />
              Foods ({foodFavorites.length})
              {activeTab === 'foods' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading your favorites...</p>
            </div>
          ) : (
            <>
              {/* Movies Tab */}
              {activeTab === 'movies' && (
                <div>
                  {movieFavorites.length === 0 ? (
                    <div className="text-center py-16 glass-card rounded-xl">
                      <Film className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2">No movies in your watchlist</h3>
                      <p className="text-muted-foreground mb-6">
                        Start adding movies you love to watch them later
                      </p>
                      <a
                        href="/movies"
                        className="inline-block px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
                      >
                        Browse Movies
                      </a>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {movieFavorites.map((fav: any) => (
                        fav.movie && (
                          <MovieCard
                            key={fav.id}
                            id={fav.movie.id}
                            title={fav.movie.title}
                            posterPath={fav.movie.thumbnailUrl}
                            rating={fav.movie.averageRating || fav.movie.rating}
                            year={fav.movie.releaseYear}
                            duration={fav.movie.duration}
                          />
                        )
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Foods Tab */}
              {activeTab === 'foods' && (
                <div>
                  {foodFavorites.length === 0 ? (
                    <div className="text-center py-16 glass-card rounded-xl">
                      <UtensilsCrossed className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2">No foods in your watchlist</h3>
                      <p className="text-muted-foreground mb-6">
                        Start adding delicious foods you want to order
                      </p>
                      <a
                        href="/foods"
                        className="inline-block px-6 py-3 rounded-lg bg-accent text-accent-foreground font-semibold hover:bg-accent/90 transition-colors"
                      >
                        Browse Foods
                      </a>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {foodFavorites.map((fav: any) => (
                        fav.food && (
                          <FoodCard
                            key={fav.id}
                            id={fav.food.id}
                            name={fav.food.name}
                            image={fav.food.image}
                            category={fav.food.category}
                            description={fav.food.description}
                            price={fav.food.price}
                            location={fav.food.location}
                          />
                        )
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
