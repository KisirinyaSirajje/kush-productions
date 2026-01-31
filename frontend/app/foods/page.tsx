"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FoodCard from "@/components/FoodCard";
import SectionHeader from "@/components/SectionHeader";
import { Search, Filter, UtensilsCrossed } from "lucide-react";
import { foods } from "@/data/mockData";

export default function FoodsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredFoods = foods.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    food.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Page Header */}
      <section className="pt-24 pb-8 bg-gradient-to-b from-accent/10 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-accent mb-4">
              <UtensilsCrossed className="w-5 h-5" />
              <span className="text-sm font-medium">Kush Foods</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Ugandan Delicacies
            </h1>
            <p className="text-muted-foreground text-lg">
              Explore authentic Ugandan cuisine. From street food to traditional dishes, discover the flavors of Uganda.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mt-8 flex gap-4 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search foods..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border/50 h-12 w-full rounded-lg px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <button className="h-12 w-12 border border-border/50 rounded-lg flex items-center justify-center hover:bg-muted transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Foods Grid */}
      <section className="container mx-auto px-4 py-12">
        <SectionHeader
          title="All Dishes"
          subtitle={`${filteredFoods.length} delicious options`}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFoods.map((food, index) => (
            <FoodCard
              key={food.id}
              {...food}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            />
          ))}
        </div>
      </section>

      {/* No Results */}
      {searchQuery && filteredFoods.length === 0 && (
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground text-lg">No foods found for &quot;{searchQuery}&quot;</p>
        </div>
      )}

      <Footer />
    </div>
  );
}
