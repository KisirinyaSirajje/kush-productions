"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChefHat, MapPin, Heart, Share2, UtensilsCrossed, ShoppingCart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FoodCard from "@/components/FoodCard";
import RatingInput from "@/components/RatingInput";
import CommentSection from "@/components/CommentSection";
import { apiClient } from "@/lib/api/client";
import { useCartStore } from "@/lib/store/cartStore";
import { useFavoritesStore } from "@/lib/store/favoritesStore";
import { useAuthStore } from "@/lib/store/authStore";
import { cn } from "@/lib/utils";

interface Food {
  id: string;
  name: string;
  category: string;
  price: string;
  location?: string;
  description: string;
  image?: string;
  ingredients?: string[];
}

export default function FoodDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [food, setFood] = useState<Food | null>(null);
  const [relatedFoods, setRelatedFoods] = useState<Food[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);

  const addToCart = useCartStore((state) => state.addToCart);
  const { isAuthenticated } = useAuthStore();
  const { favorites, fetchFavorites, addFavorite, removeFavorite, isFavorited } = useFavoritesStore();
  
  const favorited = food ? isFavorited('food', food.id) : false;
  const favorite = food ? favorites.find((f) => f.type === 'food' && f.foodId === food.id) : null;

  useEffect(() => {
    const fetchFood = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get('/api/foods');
        const foods = response.data.foods || [];
        
        const foundFood = foods.find((f: Food) => f.id === id);
        setFood(foundFood || null);
        
        if (foundFood) {
          const related = foods.filter((f: Food) => f.id !== id).slice(0, 3);
          setRelatedFoods(related);
        }
      } catch (err: unknown) {
        const error = err as { message?: string };
        setError(error.message || 'Failed to load food');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFood();
  }, [id]);

  useEffect(() => {
    if (isAuthenticated && favorites.length === 0) {
      fetchFavorites();
    }
  }, [isAuthenticated, favorites.length, fetchFavorites]);

  const handleAddToCart = () => {
    if (!food) return;
    
    const priceNumber = parseFloat(food.price.replace(/[^0-9.]/g, ''));
    addToCart({
      foodId: food.id,
      name: food.name,
      price: priceNumber,
      image: food.image,
      category: food.category,
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleFavoriteClick = async () => {
    if (!isAuthenticated || !food) return;

    try {
      if (favorited && favorite) {
        await removeFavorite(favorite.id);
      } else {
        await addFavorite('food', food.id);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 pt-24 sm:pt-28 lg:pt-32 text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-accent mx-auto" />
          <p className="mt-4 text-muted-foreground text-sm sm:text-base">Loading food...</p>
        </div>
      </div>
    );
  }

  if (!food || error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 pt-24 sm:pt-28 lg:pt-32 text-center">
          <UtensilsCrossed className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-4">Food not found</h1>
          {error && <p className="text-destructive mb-6 text-sm sm:text-base">{error}</p>}
          <Link 
            href="/foods" 
            className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors text-sm sm:text-base font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Foods
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-16 sm:pt-20 lg:pt-24">
        {/* Backdrop */}
        <div className="absolute inset-0 h-[40vh] sm:h-[50vh]">
          {food.image && (
            <img 
              src={food.image} 
              alt={food.name}
              className="w-full h-full object-cover opacity-30"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
        </div>

        {/* Content */}
        <div className="relative container mx-auto px-4 py-8 sm:px-6 lg:px-8 sm:py-12">
          {/* Back Button */}
          <Link 
            href="/foods" 
            className="inline-flex items-center gap-2 text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors mb-6 sm:mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Foods</span>
            <span className="sm:hidden">Back</span>
          </Link>

          <div className="flex flex-col md:flex-row gap-6 sm:gap-8 lg:gap-12">
            {/* Image */}
            <div className="w-full md:w-1/2 lg:w-2/5 flex-shrink-0">
              <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-gold bg-muted">
                {food.image ? (
                  <img 
                    src={food.image} 
                    alt={food.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/20 to-accent/5 hidden">
                  <UtensilsCrossed className="w-16 h-16 sm:w-20 sm:h-20 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              {/* Category Badge */}
              <div className="inline-flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1 rounded-full bg-accent/20 text-accent text-xs sm:text-sm mb-3 sm:mb-4">
                <ChefHat className="w-3 h-3 sm:w-4 sm:h-4" />
                {food.category}
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-3 sm:mb-4">
                {food.name}
              </h1>

              {/* Location */}
              {food.location && (
                <div className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                  <MapPin className="w-4 h-4" />
                  <span>{food.location}</span>
                </div>
              )}

              {/* Price */}
              <p className="text-2xl sm:text-3xl font-bold text-accent mb-4 sm:mb-6">{food.price}</p>

              {/* Description */}
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                {food.description}
              </p>
              
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6 sm:mb-8">
                This traditional Ugandan dish is a staple in local cuisine, enjoyed by families across 
                the country. It represents the rich culinary heritage of Uganda, made with locally 
                sourced ingredients and prepared using time-honored cooking methods passed down 
                through generations.
              </p>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <button 
                  onClick={handleAddToCart}
                  className={cn(
                    "bg-accent hover:bg-accent/90 text-accent-foreground px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold transition-all text-sm sm:text-base flex items-center gap-2",
                    addedToCart && "bg-green-600 hover:bg-green-600"
                  )}
                >
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                  {addedToCart ? (
                    <span>Added to Cart!</span>
                  ) : (
                    <>
                      <span className="hidden sm:inline">Add to Cart</span>
                      <span className="sm:hidden">Add</span>
                    </>
                  )}
                </button>
                <button 
                  onClick={handleFavoriteClick}
                  disabled={!isAuthenticated}
                  className={cn(
                    "px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-muted transition-colors border border-border text-sm sm:text-base flex items-center gap-2",
                    !isAuthenticated && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Heart className={cn("w-4 h-4 sm:w-5 sm:h-5", favorited && "fill-destructive text-destructive")} />
                  <span className="hidden sm:inline">{favorited ? "Saved" : "Save to Favorites"}</span>
                  <span className="sm:hidden">{favorited ? "Saved" : "Save"}</span>
                </button>
                <button className="px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-muted transition-colors border border-border text-sm sm:text-base flex items-center gap-2">
                  <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ingredients Section */}
      {food.ingredients && food.ingredients.length > 0 && (
        <section className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 sm:py-12">
          <div className="glass-card p-6 sm:p-8 rounded-2xl">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground mb-4 sm:mb-6">Ingredients</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {food.ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                  <span className="text-sm sm:text-base text-foreground">{ingredient}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Rating & Comments Section */}
      <section className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <RatingInput type="food" itemId={id} onRatingSubmitted={() => window.location.reload()} />
          <CommentSection type="food" itemId={id} />
        </div>
      </section>

      {/* Related Foods */}
      {relatedFoods.length > 0 && (
        <section className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 sm:py-12">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-foreground mb-6 sm:mb-8">More Ugandan Delicacies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {relatedFoods.map((relatedFood, index) => (
              <FoodCard
                key={relatedFood.id}
                id={relatedFood.id}
                name={relatedFood.name}
                category={relatedFood.category}
                description={relatedFood.description}
                price={relatedFood.price}
                image={relatedFood.image}
                location={relatedFood.location}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
