"use client";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";

export interface MovieFormData {
  id?: number;
  title: string;
  year: string;
  category: string;
  rating: number;
  duration: string;
  description: string;
  posterPath: string;
}

interface MovieFormProps {
  movie?: MovieFormData;
  onSubmit: (data: MovieFormData) => void;
  onCancel: () => void;
}

export default function MovieForm({ movie, onSubmit, onCancel }: MovieFormProps) {
  const [formData, setFormData] = useState<MovieFormData>({
    title: "",
    year: new Date().getFullYear().toString(),
    category: "Action",
    rating: 7.0,
    duration: "120 min",
    description: "",
    posterPath: "",
  });

  useEffect(() => {
    if (movie) {
      setFormData({
        title: movie.title || "",
        year: movie.year || new Date().getFullYear().toString(),
        category: movie.category || "Action",
        rating: movie.rating || 7.0,
        duration: movie.duration || "120 min",
        description: movie.description || "",
        posterPath: movie.posterPath || "",
      });
    }
  }, [movie]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseFloat(value) : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter movie title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Year *
          </label>
          <input
            type="text"
            name="year"
            value={formData.year}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="2024"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="Action">Action</option>
            <option value="Drama">Drama</option>
            <option value="Comedy">Comedy</option>
            <option value="Thriller">Thriller</option>
            <option value="Romance">Romance</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Horror">Horror</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Duration *
          </label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="120 min"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Rating (0-10) *
          </label>
          <input
            type="number"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            min="0"
            max="10"
            step="0.1"
            required
            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Poster URL *
          </label>
          <input
            type="url"
            name="posterPath"
            value={formData.posterPath}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="https://example.com/poster.jpg"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Description *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter movie description..."
        />
      </div>

      <div className="flex items-center gap-3 pt-4">
        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors btn-glow"
        >
          <Save className="w-5 h-5" />
          {movie ? "Update Movie" : "Add Movie"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 bg-muted text-foreground rounded-lg font-semibold hover:bg-muted/80 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
