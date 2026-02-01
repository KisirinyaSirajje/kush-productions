import Link from "next/link";
import { Heart, Star, Film } from "lucide-react";
import { cn } from "@/lib/utils";

interface MovieCardProps {
  id: string | number;
  title: string;
  posterPath?: string;
  rating?: number;
  year?: number;
  duration?: string;
  category?: string;
  className?: string;
  style?: React.CSSProperties;
}

const MovieCard = ({ id, title, posterPath, rating, year, className, style }: MovieCardProps) => {
  return (
    <Link href={`/movies/${id}`} className={cn("group block", className)} style={style}>
      <div className="relative overflow-hidden rounded-xl glass-card card-hover">
        {/* Image Container */}
        <div className="aspect-[2/3] overflow-hidden bg-muted">
          {posterPath ? (
            <img
              src={posterPath}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={cn("w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5", posterPath && "hidden")}>
            <Film className="w-12 h-12 text-muted-foreground" />
          </div>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-md bg-black/80 backdrop-blur-sm">
          <Star className="w-3 h-3 text-accent fill-accent" />
          <span className="text-xs font-semibold text-white">{rating}</span>
        </div>

        {/* Favorite Button */}
        <button className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-destructive hover:text-destructive-foreground">
          <Heart className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
          <h3 className="font-semibold text-white text-sm group-hover:text-primary transition-colors line-clamp-1">
            {title}
          </h3>
          <p className="text-xs text-white/70 mt-1">{year}</p>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
