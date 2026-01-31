"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, User, Phone } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match!");
      setIsLoading(false);
      return;
    }
    
    if (isLogin) {
      // Login
      const result = await login(email, password);
      setIsLoading(false);
      
      if (result.success) {
        const user = useAuthStore.getState().user;
        if (user?.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/');
        }
      } else {
        setError(result.error || "Login failed");
      }
    } else {
      // Sign up (not implemented yet)
      setIsLoading(false);
      alert("Sign up functionality will be connected to backend API");
      console.log("Sign up:", { fullName, email, phone, password });
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Back Link */}
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-xl font-bold text-primary-foreground">K</span>
            </div>
            <div>
              <h1 className="text-lg font-serif font-bold text-foreground">Kush Films</h1>
              <p className="text-[10px] text-muted-foreground tracking-wider">UGANDA 🇺🇬</p>
            </div>
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-2">
              {isLogin ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-muted-foreground">
              {isLogin 
                ? "Sign in to access your watchlist and favorites" 
                : "Join Kush Films and start building your collection"}
            </p>
            {isLogin && (
              <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm">
                <p className="text-muted-foreground mb-2">Demo Credentials:</p>
                <p className="text-foreground"><strong>Admin:</strong> admin@kushfilms.com / admin123</p>
                <p className="text-foreground"><strong>User:</strong> user@kushfilms.com / user123</p>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name - Sign up only */}
            {!isLogin && (
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium text-foreground">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10 h-12 bg-card border-border/50 w-full rounded-lg px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 bg-card border-border/50 w-full rounded-lg px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>

            {/* Phone - Sign up only */}
            {!isLogin && (
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-foreground">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+256 700 000 000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10 h-12 bg-card border-border/50 w-full rounded-lg px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 bg-card border-border/50 w-full rounded-lg px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {!isLogin && (
                <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
              )}
            </div>

            {/* Confirm Password - Sign up only */}
            {!isLogin && (
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 bg-card border-border/50 w-full rounded-lg px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {isLogin && (
              <div className="flex justify-end">
                <button type="button" className="text-sm text-primary hover:underline">
                  Forgot password?
                </button>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 bg-primary hover:bg-primary/90 btn-glow text-primary-foreground rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Please wait..." : (isLogin ? "Sign In" : "Create Account")}
            </button>
          </form>

          {/* Toggle */}
          <p className="text-center text-muted-foreground mt-8">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline font-medium"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center max-w-lg">
            <h2 className="text-4xl font-serif font-bold text-foreground mb-6">
              Your Gateway to African Cinema & Cuisine
            </h2>
            <p className="text-muted-foreground text-lg">
              Discover amazing films, explore Ugandan delicacies, and join a community 
              celebrating the best of African culture.
            </p>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-2s' }} />
      </div>
    </div>
  );
}
