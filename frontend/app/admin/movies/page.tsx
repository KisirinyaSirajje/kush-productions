"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import Modal from "@/components/admin/Modal";
import MovieForm, { MovieFormData } from "@/components/admin/MovieForm";
import apiClient from "@/lib/api/client";

interface Movie {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number;
  releaseYear: number;
  rating?: number;
  category?: string;
  posterPath?: string;
  year?: number;
}

export default function AdminMoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<MovieFormData | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch movies from API
  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/api/movies');
      setMovies(response.data.movies);
      setError(null);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'Failed to load movies');
      console.error('Error fetching movies:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddMovie = () => {
    setEditingMovie(undefined);
    setIsModalOpen(true);
  };

  const handleEditMovie = (movie: Movie) => {
    setEditingMovie({
      id: movie.id,
      title: movie.title,
      year: movie.releaseYear?.toString() || movie.year?.toString() || new Date().getFullYear().toString(),
      category: movie.category || "Drama",
      rating: movie.rating || 8.0,
      duration: movie.duration.toString(),
      posterPath: movie.thumbnailUrl || movie.posterPath || "",
      description: movie.description || "",
    });
    setIsModalOpen(true);
  };

  const handleDeleteMovie = async (id: string) => {
    if (!confirm("Are you sure you want to delete this movie?")) return;

    try {
      await apiClient.delete(`/api/admin/movies/${id}`);
      setMovies(movies.filter((m) => m.id !== id));
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      alert(error.response?.data?.error || 'Failed to delete movie');
    }
  };

  const handleSubmitMovie = async (data: MovieFormData) => {
    try {
      if (editingMovie && editingMovie.id) {
        // Update existing movie
        const response = await apiClient.put(`/api/admin/movies/${editingMovie.id}`, {
          title: data.title,
          description: data.description,
          thumbnailUrl: data.posterPath,
          videoUrl: `https://example.com/videos/${data.title.toLowerCase().replace(/\s+/g, '-')}.mp4`,
          duration: parseInt(data.duration),
          releaseYear: parseInt(data.year),
        });
        setMovies(movies.map((m) => (m.id === editingMovie.id ? response.data.movie : m)));
      } else {
        // Create new movie
        const response = await apiClient.post('/api/admin/movies', {
          title: data.title,
          description: data.description,
          thumbnailUrl: data.posterPath,
          videoUrl: `https://example.com/videos/${data.title.toLowerCase().replace(/\s+/g, '-')}.mp4`,
          duration: parseInt(data.duration),
          releaseYear: parseInt(data.year),
        });
        setMovies([response.data.movie, ...movies]);
      }
      setIsModalOpen(false);
      setEditingMovie(undefined);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      alert(error.response?.data?.error || 'Failed to save movie');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Movies Management</h1>
          <p className="text-muted-foreground">Manage your movie collection</p>
        </div>
        <button 
          onClick={handleAddMovie}
          className="flex items-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors btn-glow"
        >
          <Plus className="w-5 h-5" />
          Add Movie
        </button>
      </div>

      {/* Search Bar */}
      <div className="glass-card p-4 rounded-xl border border-border/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading movies...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500">
          {error}
        </div>
      )}

      {/* Stats */}
      {!isLoading && !error && (
        <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl border border-border/50">
          <p className="text-sm text-muted-foreground mb-1">Total Movies</p>
          <p className="text-2xl font-bold text-foreground">{movies.length}</p>
        </div>
        <div className="glass-card p-4 rounded-xl border border-border/50">
          <p className="text-sm text-muted-foreground mb-1">Published</p>
          <p className="text-2xl font-bold text-green-500">{movies.length}</p>
        </div>
        <div className="glass-card p-4 rounded-xl border border-border/50">
          <p className="text-sm text-muted-foreground mb-1">Draft</p>
          <p className="text-2xl font-bold text-amber-500">0</p>
        </div>
        <div className="glass-card p-4 rounded-xl border border-border/50">
          <p className="text-sm text-muted-foreground mb-1">Avg Rating</p>
          <p className="text-2xl font-bold text-foreground">8.0</p>
        </div>
      </div>

      {/* Movies Table */}
      <div className="glass-card rounded-xl border border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left p-4 font-semibold text-foreground">Movie</th>
                <th className="text-left p-4 font-semibold text-foreground">Category</th>
                <th className="text-left p-4 font-semibold text-foreground">Rating</th>
                <th className="text-left p-4 font-semibold text-foreground">Duration</th>
                <th className="text-left p-4 font-semibold text-foreground">Views</th>
                <th className="text-left p-4 font-semibold text-foreground">Status</th>
                <th className="text-right p-4 font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMovies.map((movie) => (
                <tr key={movie.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={movie.thumbnailUrl || movie.posterPath || "https://via.placeholder.com/100x150"}
                        alt={movie.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium text-foreground">{movie.title}</p>
                        <p className="text-sm text-muted-foreground">{movie.releaseYear || movie.year}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">{movie.category || "N/A"}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 text-amber-500 font-semibold">
                      {movie.rating || "N/A"} ★
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground">{Math.floor(movie.duration / 60)}m</td>
                  <td className="p-4 text-muted-foreground">-</td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
                      Published
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/movies/${movie.id}`}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </Link>
                      <button
                        onClick={() => handleEditMovie(movie)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => handleDeleteMovie(movie.id)}
                        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
        </>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingMovie(undefined);
        }}
        title={editingMovie ? "Edit Movie" : "Add New Movie"}
      >
        <MovieForm
          movie={editingMovie}
          onSubmit={handleSubmitMovie}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingMovie(undefined);
          }}
        />
      </Modal>
    </div>
  );
}
