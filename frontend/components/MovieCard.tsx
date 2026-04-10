"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Star, Film, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavoritesStore } from "@/lib/store/favoritesStore";
import { useAuthStore } from "@/lib/store/authStore";
import VideoPlayer from "./VideoPlayer";

interface MovieCardProps {
  id: string | number;
  title: string;
  posterPath?: string;
  videoUrl?: string;
  rating?: number;
  year?: number;
  duration?: string;
  category?: string;
  className?: string;
  style?: React.CSSProperties;
}

const MovieCard = ({ id, title, posterPath, videoUrl, rating, year, duration, className, style }: MovieCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const { favorites, fetchFavorites, addFavorite, removeFavorite, isFavorited } = useFavoritesStore();
  
  const favorited = isFavorited('movie', String(id));
  const favorite = favorites.find((f) => f.type === 'movie' && f.movieId === String(id));
  const detailsHref = `/movies/${id}`;

  useEffect(() => {
    if (isAuthenticated && favorites.length === 0) {
      fetchFavorites();
    }
  }, [isAuthenticated, favorites.length, fetchFavorites]);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      // Could redirect to login or show toast
      return;
    }

    setIsLoading(true);
    try {
      if (favorited && favorite) {
        await removeFavorite(favorite.id);
      } else {
        await addFavorite('movie', String(id));
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openVideoModal = () => {
    if (videoUrl) {
      setIsPlayingVideo(true);
    }
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openVideoModal();
  };

  return (
    <>
      <article className={cn("group block", className)} style={style}>
      <div className="relative overflow-hidden rounded-2xl glass-card card-hover shadow-sm hover:shadow-xl hover:shadow-primary/15">
        {/* Image Container */}
        <div className="aspect-[2/3] overflow-hidden bg-muted/40">
          {posterPath ? (
            <img
              src={posterPath}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 md:group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={cn("w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5", posterPath && "hidden")}>
            <Film className="w-12 h-12 text-muted-foreground" />
          </div>

          {/* Play Button Overlay */}
          {videoUrl && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/20 backdrop-blur-[2px]">
              <button
                onClick={handlePlayClick}
                className="pointer-events-auto w-16 h-16 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 flex items-center justify-center transition-all md:hover:scale-110"
              >
                <Play className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" />
              </button>
            </div>
          )}
        </div>
        {/* Rating Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-background/90 border border-border/70 backdrop-blur-sm shadow-sm">
          <Star className="w-3 h-3 text-accent fill-accent" />
          <span className="text-xs font-semibold text-foreground">{rating}</span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          disabled={isLoading}
          className={cn(
            "absolute top-3 right-3 w-9 h-9 rounded-full bg-background/90 border border-border/70 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:bg-destructive hover:text-destructive-foreground",
            isAuthenticated ? "opacity-0 group-hover:opacity-100" : "hidden"
          )}
        >
          <Heart className={cn("w-4 h-4 transition-all", favorited && "fill-destructive text-destructive")} />
        </button>

        {/* Content */}
        <div className="p-4 bg-card/70">
          <Link href={detailsHref} className="group/details block rounded-md -m-1 p-1">
            <h3 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors line-clamp-2 min-h-10">
              {title}
            </h3>
            <span className="mt-1 inline-block text-xs font-medium text-primary opacity-0 translate-y-1 transition-all duration-200 group-hover/details:opacity-100 group-hover/details:translate-y-0">
              Read more
            </span>
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>{year}</span>
              {duration && <span>{duration}</span>}
            </div>
          </Link>
        </div>
      </div>
    </article>

    {/* Video Modal */}
    {isPlayingVideo && videoUrl && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
        {/* Blurred Backdrop */}
        <div 
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={() => setIsPlayingVideo(false)}
        />
        
        {/* Video Container */}
        <div className="relative w-full max-w-6xl z-10">
          <button
            onClick={() => setIsPlayingVideo(false)}
            className="absolute -top-12 right-0 text-white hover:text-primary transition-colors text-2xl font-bold"
          >
            ✕
          </button>
          <VideoPlayer
            src={videoUrl}
            movieId={String(id)}
            title={title}
          />
        </div>
      </div>
    )}
    </>
  );
};

export default MovieCard;
