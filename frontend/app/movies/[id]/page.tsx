"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Star, Calendar, Clock, Heart, Play, Share2, Film } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MovieCard from "@/components/MovieCard";
import RatingInput from "@/components/RatingInput";
import CommentSection from "@/components/CommentSection";
import VideoPlayer from "@/components/VideoPlayer";
import { apiClient } from "@/lib/api/client";

interface Movie {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number;
  releaseYear: number;
  rating?: number;
  genre?: string;
  director?: string;
  cast?: string;
  language?: string;
  country?: string;
}

export default function MovieDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [relatedMovies, setRelatedMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isWatching, setIsWatching] = useState(false);
  const [watchProgress, setWatchProgress] = useState(0);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setIsLoading(true);
        // Fetch the specific movie
        const movieResponse = await apiClient.get(`/api/movies/${id}`);
        setMovie(movieResponse.data.movie || null);
        
        // Fetch all movies for related section
        const allMoviesResponse = await apiClient.get('/api/movies');
        const movies = allMoviesResponse.data.movies || [];
        const related = movies.filter((m: Movie) => m.id !== id).slice(0, 4);
        setRelatedMovies(related);
      } catch (err: unknown) {
        const error = err as { message?: string };
        setError(error.message || 'Failed to load movie');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 pt-24 sm:pt-28 lg:pt-32 text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground text-sm sm:text-base">Loading movie...</p>
        </div>
      </div>
    );
  }

  if (!movie || error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 pt-24 sm:pt-28 lg:pt-32 text-center">
          <Film className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-4">Movie not found</h1>
          {error && <p className="text-destructive mb-6 text-sm sm:text-base">{error}</p>}
          <Link 
            href="/movies" 
            className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm sm:text-base font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Movies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section with Backdrop */}
      <section className="relative pt-16 sm:pt-20 lg:pt-24">
        {/* Backdrop */}
        <div className="absolute inset-0 h-[50vh] sm:h-[60vh]">
          <img 
            src={movie.thumbnailUrl} 
            alt={movie.title}
            className="w-full h-full object-cover opacity-20"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
        </div>

        {/* Content */}
        <div className="relative container mx-auto px-4 py-8 sm:px-6 lg:px-8 sm:py-12">
          {/* Back Button */}
          <Link 
            href="/movies" 
            className="inline-flex items-center gap-2 text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors mb-6 sm:mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Movies</span>
            <span className="sm:hidden">Back</span>
          </Link>

          <div className="flex flex-col md:flex-row gap-6 sm:gap-8 lg:gap-12">
            {/* Poster */}
            <div className="w-full sm:w-64 md:w-80 flex-shrink-0 mx-auto md:mx-0">
              <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-glow bg-muted">
                {movie.thumbnailUrl ? (
                  <img 
                    src={movie.thumbnailUrl} 
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 hidden">
                  <Film className="w-16 h-16 sm:w-20 sm:h-20 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-3 sm:mb-4">
                {movie.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                {movie.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 text-accent fill-accent" />
                    <span className="font-semibold text-foreground">{movie.rating}</span>
                    <span>/10</span>
                  </div>
                )}
                {movie.releaseYear && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{movie.releaseYear}</span>
                  </div>
                )}
                {movie.duration && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{Math.floor(movie.duration / 60)}m</span>
                  </div>
                )}
              </div>

              {/* Genre */}
              {movie.genre && (
                <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                  {movie.genre.split(',').map((genre, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 sm:px-3 sm:py-1 rounded-full bg-primary/20 text-primary text-xs sm:text-sm font-medium"
                    >
                      {genre.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* Description */}
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6 sm:mb-8">
                {movie.description || 'A compelling story that takes you on an unforgettable journey.'}
              </p>

              {/* Additional Details */}
              {(movie.director || movie.cast || movie.language || movie.country) && (
                <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 text-sm sm:text-base">
                  {movie.director && (
                    <div className="flex gap-2">
                      <span className="font-semibold text-foreground min-w-20 sm:min-w-24">Director:</span>
                      <span className="text-muted-foreground">{movie.director}</span>
                    </div>
                  )}
                  {movie.cast && (
                    <div className="flex gap-2">
                      <span className="font-semibold text-foreground min-w-20 sm:min-w-24">Cast:</span>
                      <span className="text-muted-foreground">{movie.cast}</span>
                    </div>
                  )}
                  {movie.language && (
                    <div className="flex gap-2">
                      <span className="font-semibold text-foreground min-w-20 sm:min-w-24">Language:</span>
                      <span className="text-muted-foreground">{movie.language}</span>
                    </div>
                  )}
                  {movie.country && (
                    <div className="flex gap-2">
                      <span className="font-semibold text-foreground min-w-20 sm:min-w-24">Country:</span>
                      <span className="text-muted-foreground">{movie.country}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-3 sm:gap-4">
                {movie.videoUrl && (
                  <button 
                    onClick={() => setIsWatching(true)}
                    className="bg-primary hover:bg-primary/90 btn-glow px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base flex items-center gap-2"
                  >
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                    <span className="hidden sm:inline">Watch Now</span>
                    <span className="sm:hidden">Watch</span>
                  </button>
                )}
                <button className="border border-border px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold hover:bg-muted transition-colors text-sm sm:text-base flex items-center gap-2">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Add to Watchlist</span>
                  <span className="sm:hidden">Save</span>
                </button>
                <button className="p-2 sm:px-4 sm:py-3 rounded-lg hover:bg-muted transition-colors border border-border sm:border-0">
                  <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Player Modal */}
      {isWatching && movie.videoUrl && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setIsWatching(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl z-10"
          >
            ×
          </button>
          <div className="w-full max-w-6xl">
            <VideoPlayer
              src={movie.videoUrl}
              movieId={movie.id}
              title={movie.title}
              initialProgress={watchProgress}
              onProgress={(progress) => {
                setWatchProgress(progress);
                // Here you can also save to backend
                // apiClient.post(`/api/watch-history/${movie.id}`, { progress });
              }}
            />
          </div>
        </div>
      )}

      {/* Rating & Comments Section */}
      <section className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <RatingInput type="movie" itemId={id} onRatingSubmitted={() => window.location.reload()} />
          <CommentSection type="movie" itemId={id} />
        </div>
      </section>

      {/* Related Movies */}
      {relatedMovies.length > 0 && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-foreground mb-6 sm:mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
            {relatedMovies.map((relatedMovie, index) => (
              <MovieCard
                key={relatedMovie.id}
                id={relatedMovie.id}
                title={relatedMovie.title}
                posterPath={relatedMovie.thumbnailUrl}
                year={relatedMovie.releaseYear}
                rating={relatedMovie.rating}
                duration={`${Math.floor(relatedMovie.duration / 60)}m`}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
