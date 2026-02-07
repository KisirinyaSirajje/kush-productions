import Link from "next/link";
import { Film, UtensilsCrossed, Heart, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border/30 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg overflow-hidden">
                <img 
                  src="/logo.png" 
                  alt="Kush Films Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-foreground">Kush Films</h3>
                <p className="text-[10px] text-muted-foreground tracking-wider">UGANDA 🇺🇬</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Celebrating Ugandan cinema and cuisine. Discover amazing films and delicious local foods.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/movies" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <Film className="w-4 h-4" />
                  Kush Films
                </Link>
              </li>
              <li>
                <Link href="/foods" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <UtensilsCrossed className="w-4 h-4" />
                  Kush Foods
                </Link>
              </li>
              <li>
                <Link href="/watchlist" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Watchlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Categories</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-muted-foreground">Trending Movies</span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">Popular Films</span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">Local Cuisine</span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">Street Food</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                Kampala, Uganda
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                hello@kushfilms.ug
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/30 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 Kush Films. Proudly Ugandan 🇺🇬
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">Movies powered by TMDB</span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">Created by Raj Technologies</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
