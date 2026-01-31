"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, ChefHat, MapPin, Heart, Share2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FoodCard from "@/components/FoodCard";
import { foods } from "@/data/mockData";

export default function FoodDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const food = foods.find(f => f.id === Number(id));
  
  // Get related foods (excluding current)
  const relatedFoods = foods.filter(f => f.id !== Number(id)).slice(0, 3);

  if (!food) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 text-center">
          <h1 className="text-2xl font-bold text-foreground">Food not found</h1>
          <Link href="/foods" className="text-primary hover:underline mt-4 inline-block">
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
      <section className="relative pt-20">
        {/* Backdrop */}
        <div className="absolute inset-0 h-[50vh]">
          <img 
            src={food.image} 
            alt={food.name}
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
        </div>

        {/* Content */}
        <div className="relative container mx-auto px-4 py-12">
          {/* Back Button */}
          <Link 
            href="/foods" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Foods
          </Link>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Image */}
            <div className="w-full md:w-1/2 flex-shrink-0">
              <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-gold">
                <img 
                  src={food.image} 
                  alt={food.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              {/* Category Badge */}
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/20 text-accent text-sm mb-4">
                <ChefHat className="w-4 h-4" />
                {food.category}
              </div>

              <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
                {food.name}
              </h1>

              {/* Location */}
              <div className="flex items-center gap-2 text-muted-foreground mb-6">
                <MapPin className="w-4 h-4" />
                <span>Popular across Uganda 🇺🇬</span>
              </div>

              {/* Price */}
              {food.price && (
                <p className="text-3xl font-bold text-accent mb-6">{food.price}</p>
              )}

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed mb-4">
                {food.description}
              </p>
              
              <p className="text-muted-foreground leading-relaxed mb-8">
                This traditional Ugandan dish is a staple in local cuisine, enjoyed by families across 
                the country. It represents the rich culinary heritage of Uganda, made with locally 
                sourced ingredients and prepared using time-honored cooking methods passed down 
                through generations.
              </p>

              {/* Actions */}
              <div className="flex flex-wrap gap-4">
                <button className="bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-3 rounded-lg font-semibold transition-colors">
                  <Heart className="w-5 h-5 mr-2 inline-block" />
                  Save to Favorites
                </button>
                <button className="px-6 py-3 rounded-lg hover:bg-muted transition-colors">
                  <Share2 className="w-5 h-5 mr-2 inline-block" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ingredients Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="glass-card p-8 rounded-2xl">
          <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Traditional Ingredients</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Fresh produce", "Local spices", "Natural oils", "Fresh herbs"].map((ingredient) => (
              <div key={ingredient} className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-sm text-foreground">{ingredient}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Foods */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-serif font-bold text-foreground mb-8">More Ugandan Delicacies</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedFoods.map((food, index) => (
            <FoodCard
              key={food.id}
              {...food}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
