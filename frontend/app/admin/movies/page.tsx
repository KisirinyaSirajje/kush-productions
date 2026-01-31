"use client";

import { useState, useMemo } from "react";
import { trendingMovies, popularMovies, type Movie } from "@/data/mockData";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import Modal from "@/components/admin/Modal";
import MovieForm, { MovieFormData } from "@/components/admin/MovieForm";

export default function AdminMoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([...trendingMovies, ...popularMovies]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<MovieFormData | undefined>();
  
  // Static views data to avoid hydration errors
  const movieViews = useMemo(() => {
    return movies.map((_, index) => 45000 - (index * 3000));
  }, [movies]);

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
      year: movie.year.toString(),
      category: movie.category,
      rating: movie.rating,
      duration: movie.duration,
      posterPath: movie.posterPath,
      description: movie.description || "A captivating story that will keep you on the edge of your seat.",
    });
    setIsModalOpen(true);
  };

  const handleDeleteMovie = (id: number) => {
    if (confirm("Are you sure you want to delete this movie?")) {
      setMovies(movies.filter((m) => m.id !== id));
    }
  };

  const handleSubmitMovie = (data: MovieFormData) => {
    if (editingMovie && editingMovie.id) {
      // Update existing movie
      setMovies(movies.map((m) => (m.id === editingMovie.id ? { 
        ...m, 
        ...data, 
        year: parseInt(data.year) 
      } : m)));
    } else {
      // Add new movie
      const newMovie: Movie = {
        ...data,
        id: Math.max(...movies.map((m) => m.id), 0) + 1,
        year: parseInt(data.year),
      };
      setMovies([newMovie, ...movies]);
    }
    setIsModalOpen(false);
    setEditingMovie(undefined);
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

      {/* Stats */}
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
                        src={movie.posterPath}
                        alt={movie.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium text-foreground">{movie.title}</p>
                        <p className="text-sm text-muted-foreground">{movie.year}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">{movie.category}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 text-amber-500 font-semibold">
                      {movie.rating} ★
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground">{movie.duration}</td>
                  <td className="p-4 text-muted-foreground">{movieViews[movies.findIndex(m => m.id === movie.id)]?.toLocaleString()}</td>
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
