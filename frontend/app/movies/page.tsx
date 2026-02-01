"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MovieCard from "@/components/MovieCard";
import SectionHeader from "@/components/SectionHeader";
import { Search, Filter, TrendingUp } from "lucide-react";
import apiClient from "@/lib/api/client";

interface Movie {
  id: string;
  title: string;
  releaseYear: number;
  thumbnailUrl: string;
  duration: number;
  rating?: number;
}

export default function MoviesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get('/api/movies');
        setMovies(response.data.movies || []);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovies();
  }, []);
  
  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Page Header */}
      <section className="pt-24 pb-8 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-primary mb-4">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium">Kush Films</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Discover Movies
            </h1>
            <p className="text-muted-foreground text-lg">
              Explore trending and popular films from around the world. Find your next favorite movie.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mt-8 flex gap-4 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border/50 h-12 w-full rounded-lg px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button className="h-12 w-12 border border-border/50 rounded-lg flex items-center justify-center hover:bg-muted transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Movies Grid */}
      <section className="container mx-auto px-4 py-12">
        <SectionHeader
          title={searchQuery ? "Search Results" : "All Movies"}
          subtitle={searchQuery ? `Found ${filteredMovies.length} movies` : "Browse our complete collection"}
        />
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading movies...</p>
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No movies found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {filteredMovies.map((movie, index) => (
              <MovieCard 
                key={movie.id} 
                id={movie.id}
                title={movie.title}
                year={movie.releaseYear}
                posterPath={movie.thumbnailUrl}
                duration={`${Math.floor(movie.duration / 60)}m`}
                rating={movie.rating || 8.0}
                category="Movie"
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
