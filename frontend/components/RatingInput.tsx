"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api/client";
import { useAuthStore } from "@/lib/store/authStore";

interface RatingInputProps {
  type: 'movie' | 'food';
  itemId: string;
  onRatingSubmitted?: () => void;
}

export default function RatingInput({ type, itemId, onRatingSubmitted }: RatingInputProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { isAuthenticated } = useAuthStore();

  const handleSubmit = async () => {
    if (!isAuthenticated || rating === 0) return;

    setIsSubmitting(true);
    try {
      const data: any = {
        type,
        rating,
      };

      if (type === 'movie') {
        data.movieId = itemId;
      } else {
        data.foodId = itemId;
      }

      await apiClient.post('/api/ratings', data);
      setHasSubmitted(true);
      if (onRatingSubmitted) {
        onRatingSubmitted();
      }
    } catch (error) {
      console.error('Failed to submit rating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="glass-card p-6 rounded-xl text-center">
        <p className="text-muted-foreground">Please log in to rate this {type}</p>
      </div>
    );
  }

  if (hasSubmitted) {
    return (
      <div className="glass-card p-6 rounded-xl text-center">
        <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
          <Star className="w-5 h-5 fill-current" />
          <span className="font-semibold">Thanks for your rating!</span>
        </div>
        <p className="text-sm text-muted-foreground">Your {rating}/10 rating has been submitted</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 rounded-xl">
      <h3 className="font-semibold text-lg mb-4">Rate this {type}</h3>
      
      <div className="flex items-center gap-2 mb-4">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
            <button
              key={value}
              type="button"
              onMouseEnter={() => setHoveredRating(value)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(value)}
              className="p-1 transition-transform hover:scale-110 focus:outline-none"
              disabled={isSubmitting}
            >
              <Star
                className={cn(
                  "w-6 h-6 transition-colors",
                  (hoveredRating >= value || rating >= value)
                    ? "fill-accent text-accent"
                    : "text-muted-foreground"
                )}
              />
            </button>
          ))}
        </div>
        {rating > 0 && (
          <span className="text-lg font-bold text-accent ml-2">{rating}/10</span>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={rating === 0 || isSubmitting}
        className={cn(
          "w-full px-4 py-2 rounded-lg font-semibold transition-colors",
          rating === 0 || isSubmitting
            ? "bg-muted text-muted-foreground cursor-not-allowed"
            : "bg-accent text-accent-foreground hover:bg-accent/90"
        )}
      >
        {isSubmitting ? "Submitting..." : "Submit Rating"}
      </button>
    </div>
  );
}
