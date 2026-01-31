"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Star, Calendar, Clock, Heart, Play, Share2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MovieCard from "@/components/MovieCard";
import { trendingMovies, popularMovies } from "@/data/mockData";

export default function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const allMovies = [...trendingMovies, ...popularMovies];
  const movie = allMovies.find(m => m.id === Number(id));
  
  // Get related movies (excluding current)
  const relatedMovies = allMovies.filter(m => m.id !== Number(id)).slice(0, 4);

  if (!movie) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 text-center">
          <h1 className="text-2xl font-bold text-foreground">Movie not found</h1>
          <Link href="/movies" className="text-primary hover:underline mt-4 inline-block">
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
      <section className="relative pt-20">
        {/* Backdrop */}
        <div className="absolute inset-0 h-[60vh]">
          <img 
            src={movie.posterPath} 
            alt={movie.title}
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
        </div>

        {/* Content */}
        <div className="relative container mx-auto px-4 py-12">
          {/* Back Button */}
          <Link 
            href="/movies" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Movies
          </Link>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="w-full md:w-80 flex-shrink-0">
              <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-glow">
                <img 
                  src={movie.posterPath} 
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
                {movie.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-accent fill-accent" />
                  <span className="font-semibold text-foreground">{movie.rating}</span>
                  <span>/10</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{movie.year}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>2h 15m</span>
                </div>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-6">
                {["Drama", "Action", "Adventure"].map((genre) => (
                  <span 
                    key={genre}
                    className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed mb-8 max-w-2xl">
                A compelling story that takes you on an unforgettable journey. This critically acclaimed 
                film showcases exceptional performances and stunning cinematography, earning praise from 
                audiences and critics worldwide.
              </p>

              {/* Actions */}
              <div className="flex flex-wrap gap-4">
                <button className="bg-primary hover:bg-primary/90 btn-glow px-6 py-3 rounded-lg font-semibold transition-colors">
                  <Play className="w-5 h-5 mr-2 inline-block fill-current" />
                  Watch Trailer
                </button>
                <button className="border border-border px-6 py-3 rounded-lg font-semibold hover:bg-muted transition-colors">
                  <Heart className="w-5 h-5 mr-2 inline-block" />
                  Add to Watchlist
                </button>
                <button className="px-4 py-3 rounded-lg hover:bg-muted transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Movies */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-serif font-bold text-foreground mb-8">You May Also Like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {relatedMovies.map((movie, index) => (
            <MovieCard
              key={movie.id}
              {...movie}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
