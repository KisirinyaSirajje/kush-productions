import Link from "next/link";
import { Film, UtensilsCrossed } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 hero-gradient" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(34, 197, 94, 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(34, 197, 94, 0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 mb-8 animate-fade-in">
            <span className="text-2xl">🇺🇬</span>
            <span className="text-sm font-medium text-white/80">Proudly Ugandan</span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-6 animate-fade-in-up">
            <span className="text-foreground">Kush</span>
            <span className="text-gradient-gold"> Films</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Experience the best of cinema and local Ugandan cuisine. 
            Discover trending movies and explore authentic flavors from the Pearl of Africa.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Link href="/movies">
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground btn-glow group px-8 py-3 rounded-lg font-semibold transition-all">
                <Film className="w-5 h-5 mr-2 inline-block group-hover:animate-pulse" />
                Explore Films
              </button>
            </Link>
            <Link href="/foods">
              <button className="border border-accent/50 text-accent hover:bg-accent hover:text-accent-foreground px-8 py-3 rounded-lg font-semibold transition-all">
                <UtensilsCrossed className="w-5 h-5 mr-2 inline-block" />
                Discover Foods
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-16 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-gradient">500+</p>
              <p className="text-xs text-muted-foreground mt-1">Movies</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-gradient-gold">50+</p>
              <p className="text-xs text-muted-foreground mt-1">Local Foods</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-gradient">10K+</p>
              <p className="text-xs text-muted-foreground mt-1">Users</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
