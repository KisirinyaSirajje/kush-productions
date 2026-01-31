import Link from "next/link";
import { Heart, ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";
import { Food } from "@/data/mockData";

interface FoodCardProps extends Food {
  className?: string;
  style?: React.CSSProperties;
}

const FoodCard = ({ id, name, image, category, description, price, className, style }: FoodCardProps) => {
  return (
    <Link href={`/foods/${id}`} className={cn("group block", className)} style={style}>
      <div className="relative overflow-hidden rounded-xl glass-card card-hover">
        {/* Image Container */}
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-md bg-accent/90 text-accent-foreground">
          <ChefHat className="w-3 h-3" />
          <span className="text-xs font-medium">{category}</span>
        </div>

        {/* Favorite Button */}
        <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-destructive hover:text-destructive-foreground">
          <Heart className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {description}
              </p>
            </div>
            {price && (
              <span className="text-lg font-bold text-accent whitespace-nowrap">
                {price}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FoodCard;
