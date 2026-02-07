import Link from "next/link";
import { ArrowLeft, Film } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MovieCard from "@/components/MovieCard";
import MovieDetailClient from "./MovieDetailClient";

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

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getMovie(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const response = await fetch(`${baseUrl}/api/movies/${id}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch movie');
    }
    
    const data = await response.json();
    return data.movie;
  } catch (error) {
    console.error('Error fetching movie:', error);
    return null;
  }
}

async function getRelatedMovies(currentId: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const response = await fetch(`${baseUrl}/api/movies`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch movies');
    }
    
    const data = await response.json();
    const movies = data.movies || [];
    return movies.filter((m: Movie) => m.id !== currentId).slice(0, 4);
  } catch (error) {
    console.error('Error fetching related movies:', error);
    return [];
  }
}

export default async function MovieDetailPage({ params }: PageProps) {
  const { id } = await params;
  const movie = await getMovie(id);
  const relatedMovies = await getRelatedMovies(id);

  if (!movie) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 pt-24 sm:pt-28 lg:pt-32 text-center">
          <Film className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-4">Movie not found</h1>
          <Link 
            href="/movies" 
            className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm sm:text-base font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Movies
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <MovieDetailClient movie={movie} relatedMovies={relatedMovies} />
      <Footer />
    </div>
  );
}
