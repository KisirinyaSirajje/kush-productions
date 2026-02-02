"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, Film } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import MovieCard from "@/components/MovieCard";

type WatchHistoryItem = {
  id: string;
  movieId: string;
  watchDuration: number;
  lastWatchedAt: Date;
  movie: {
    id: string;
    title: string;
    thumbnailUrl: string;
    averageRating: number;
    releaseYear: number;
    duration: string;
  };
};

export default function WatchHistoryPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [history, setHistory] = useState<WatchHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchWatchHistory();
  }, [isAuthenticated, router]);

  const fetchWatchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/watch-history', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setHistory(data.watchHistory || []);
      }
    } catch (error) {
      console.error('Failed to fetch watch history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins} min`;
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hours}h ${remainingMins}m`;
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    return new Date(date).toLocaleDateString();
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Clock className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-serif font-bold">Watch History</h1>
        </div>
        <p className="text-muted-foreground">
          Keep track of movies you&apos;ve watched
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && history.length === 0 && (
        <div className="text-center py-12">
          <Film className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No Watch History</h2>
          <p className="text-muted-foreground mb-6">
            Start watching movies to build your history
          </p>
          <a
            href="/movies"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Browse Movies
          </a>
        </div>
      )}

      {/* History Grid */}
      {!isLoading && history.length > 0 && (
        <div className="space-y-6">
          {history.map((item) => (
            <div key={item.id} className="glass-card p-4 rounded-xl border border-border/50">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Movie Card */}
                <div className="md:col-span-3">
                  <MovieCard
                    id={item.movie.id}
                    title={item.movie.title}
                    posterPath={item.movie.thumbnailUrl}
                    rating={item.movie.averageRating}
                    year={item.movie.releaseYear}
                    duration={item.movie.duration}
                  />
                </div>

                {/* Watch Info */}
                <div className="flex flex-col justify-center space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Watched Duration</p>
                    <p className="text-lg font-semibold">{formatDuration(item.watchDuration)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Watched</p>
                    <p className="text-lg font-semibold">{formatTimeAgo(item.lastWatchedAt)}</p>
                  </div>
                  <button
                    onClick={() => router.push(`/movies/${item.movie.id}`)}
                    className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Watch Again
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
