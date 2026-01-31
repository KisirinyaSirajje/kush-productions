import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import MovieCard from "@/components/MovieCard";
import FoodCard from "@/components/FoodCard";
import SectionHeader from "@/components/SectionHeader";
import { trendingMovies, foods } from "@/data/mockData";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Trending Movies Section */}
      <section className="container mx-auto px-4 py-16">
        <SectionHeader
          title="Trending Films"
          subtitle="Discover the most popular movies right now"
          href="/movies"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {trendingMovies.map((movie, index) => (
            <MovieCard
              key={movie.id}
              {...movie}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            />
          ))}
        </div>
      </section>

      {/* Featured Foods Section */}
      <section className="container mx-auto px-4 py-16">
        <SectionHeader
          title="Kush Foods"
          subtitle="Authentic Ugandan cuisine at your fingertips"
          href="/foods"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {foods.slice(0, 3).map((food, index) => (
            <FoodCard
              key={food.id}
              {...food}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-emerald-600 p-8 md:p-12">
          <div className="absolute inset-0 opacity-10">
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: '24px 24px'
              }}
            />
          </div>
          
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
              Join the Kush Community
            </h2>
            <p className="text-white/80 mb-8">
              Create your watchlist, save your favorite foods, and be part of Uganda&apos;s growing entertainment platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 rounded-lg bg-accent text-accent-foreground font-semibold hover:bg-accent/90 transition-colors">
                Get Started Free
              </button>
              <button className="px-8 py-3 rounded-lg bg-white/10 text-white font-semibold border border-white/20 hover:bg-white/20 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
