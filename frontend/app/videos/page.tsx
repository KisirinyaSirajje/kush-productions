"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MovieCard from "@/components/MovieCard";
import SectionHeader from "@/components/SectionHeader";
import EnhancedSearch from "@/components/EnhancedSearch";
import { Filter, PlayCircle } from "lucide-react";
import apiClient from "@/lib/api/client";

interface Movie {
  id: string;
  title: string;
  releaseYear: number;
  thumbnailUrl: string;
  videoUrl?: string;
  duration: number;
  rating?: number;
}

export default function VideosPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get('/api/movies');
        setMovies(response.data.movies || []);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const filteredVideos = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-24 pb-8 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-primary mb-4">
              <PlayCircle className="w-5 h-5" />
              <span className="text-sm font-medium">KUSH FILMS UGANDA</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Watch Videos
            </h1>
            <p className="text-muted-foreground text-lg">
              Browse all uploaded videos and play instantly from the popup player.
            </p>
          </div>

          <div className="mt-8 flex gap-4 max-w-2xl">
            <div className="flex-1">
              <EnhancedSearch
                placeholder="Search videos..."
                onSearch={setSearchQuery}
                type="movies"
              />
            </div>
            <button className="h-12 w-12 border border-border/50 rounded-lg flex items-center justify-center hover:bg-muted transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <SectionHeader
          title={searchQuery ? "Search Results" : "All Videos"}
          subtitle={searchQuery ? `Found ${filteredVideos.length} videos` : "All channel videos in one place"}
        />

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading videos...</p>
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No videos found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {filteredVideos.map((movie, index) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                year={movie.releaseYear}
                posterPath={movie.thumbnailUrl}
                videoUrl={movie.videoUrl}
                duration={`${Math.floor(movie.duration / 60)}m`}
                rating={movie.rating || 8.0}
                category="Video"
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
