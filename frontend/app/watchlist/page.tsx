"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Heart } from "lucide-react";

export default function WatchlistPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="text-center max-w-md mx-auto">
          <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-3xl font-serif font-bold text-foreground mb-4">Your Watchlist</h1>
          <p className="text-muted-foreground mb-8">
            Sign in to save your favorite movies and foods
          </p>
          <a 
            href="/login" 
            className="inline-block px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}
