# 🎨 Kush Films - Frontend Architecture (Next.js App Router)

## Production-Ready Frontend Structure

```
frontend/
├── app/
│   ├── (auth)/                      # Auth layout group
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── forgot-password/
│   │   │   └── page.tsx
│   │   └── layout.tsx               # Auth layout (no navbar)
│   │
│   ├── (main)/                      # Main layout group
│   │   ├── page.tsx                 # Home page
│   │   ├── movies/
│   │   │   ├── page.tsx             # Movies listing
│   │   │   ├── [slug]/
│   │   │   │   └── page.tsx         # Movie details
│   │   │   └── category/
│   │   │       └── [slug]/
│   │   │           └── page.tsx     # Category movies
│   │   ├── watch/
│   │   │   └── [id]/
│   │   │       └── page.tsx         # Watch page
│   │   ├── search/
│   │   │   └── page.tsx
│   │   ├── subscribe/
│   │   │   ├── page.tsx             # Subscription plans
│   │   │   ├── success/
│   │   │   │   └── page.tsx
│   │   │   └── cancel/
│   │   │       └── page.tsx
│   │   ├── dashboard/
│   │   │   ├── page.tsx             # User dashboard
│   │   │   ├── history/
│   │   │   │   └── page.tsx
│   │   │   ├── favorites/
│   │   │   │   └── page.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   └── layout.tsx               # Main layout (with navbar)
│   │
│   ├── admin/                       # Admin section
│   │   ├── page.tsx                 # Admin dashboard
│   │   ├── movies/
│   │   │   ├── page.tsx
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx
│   │   ├── categories/
│   │   │   └── page.tsx
│   │   ├── ads/
│   │   │   └── page.tsx
│   │   ├── users/
│   │   │   └── page.tsx
│   │   ├── analytics/
│   │   │   └── page.tsx
│   │   └── layout.tsx               # Admin layout
│   │
│   ├── api/                         # API routes (BFF pattern)
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   └── revalidate/
│   │       └── route.ts
│   │
│   ├── layout.tsx                   # Root layout
│   ├── globals.css                  # Global styles
│   ├── error.tsx                    # Error boundary
│   ├── loading.tsx                  # Loading UI
│   └── not-found.tsx               # 404 page
│
├── components/
│   ├── ui/                          # Reusable UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── modal.tsx
│   │   ├── dropdown.tsx
│   │   ├── toast.tsx
│   │   └── skeleton.tsx
│   │
│   ├── layout/                      # Layout components
│   │   ├── navbar.tsx
│   │   ├── footer.tsx
│   │   ├── sidebar.tsx
│   │   └── mobile-menu.tsx
│   │
│   ├── movies/                      # Movie-specific components
│   │   ├── movie-card.tsx
│   │   ├── movie-grid.tsx
│   │   ├── movie-hero.tsx
│   │   ├── movie-details.tsx
│   │   ├── movie-player.tsx
│   │   └── movie-list.tsx
│   │
│   ├── ads/                         # Ad components
│   │   ├── video-ad.tsx
│   │   ├── banner-ad.tsx
│   │   └── ad-placeholder.tsx
│   │
│   ├── subscription/                # Subscription components
│   │   ├── plan-card.tsx
│   │   ├── subscription-badge.tsx
│   │   └── upgrade-prompt.tsx
│   │
│   └── admin/                       # Admin components
│       ├── data-table.tsx
│       ├── stats-card.tsx
│       ├── chart.tsx
│       └── upload-form.tsx
│
├── lib/
│   ├── api.ts                       # API client
│   ├── auth.ts                      # Auth helpers
│   ├── utils.ts                     # Utility functions
│   ├── constants.ts                 # Constants
│   └── validators.ts                # Form validators
│
├── hooks/
│   ├── use-auth.ts
│   ├── use-movies.ts
│   ├── use-subscription.ts
│   ├── use-analytics.ts
│   └── use-toast.ts
│
├── stores/                          # State management (Zustand)
│   ├── auth-store.ts
│   ├── ui-store.ts
│   └── player-store.ts
│
├── types/
│   ├── api.ts
│   ├── models.ts
│   └── index.ts
│
├── public/
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── .env.local
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 📄 Page Implementation Examples

### Home Page (Server Component)

```typescript
// app/(main)/page.tsx
import { Suspense } from 'react';
import { MovieGrid } from '@/components/movies/movie-grid';
import { MovieHero } from '@/components/movies/movie-hero';
import { CategorySection } from '@/components/movies/category-section';
import { BannerAd } from '@/components/ads/banner-ad';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata = {
  title: 'Kush Films - Watch Ugandan Movies & Short Videos',
  description: 'Stream the best Ugandan movies, series, and short videos. Free and premium content available.'
};

async function getFeaturedMovies() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/movies/featured`, {
    next: { revalidate: 3600 } // Revalidate every hour
  });
  
  if (!res.ok) throw new Error('Failed to fetch featured movies');
  
  return res.json();
}

async function getTrendingMovies() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/movies/trending`, {
    next: { revalidate: 300 } // Revalidate every 5 minutes
  });
  
  return res.json();
}

async function getCategories() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories`, {
    next: { revalidate: 3600 }
  });
  
  return res.json();
}

export default async function HomePage() {
  const [featured, trending, categories] = await Promise.all([
    getFeaturedMovies(),
    getTrendingMovies(),
    getCategories()
  ]);
  
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <MovieHero movie={featured[0]} />
      
      {/* Banner Ad */}
      <BannerAd type="leaderboard" className="my-8" />
      
      {/* Trending Section */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Trending Now 🔥</h2>
        <Suspense fallback={<Skeleton className="h-64" />}>
          <MovieGrid movies={trending} />
        </Suspense>
      </section>
      
      {/* Categories */}
      {categories.map((category: any) => (
        <CategorySection key={category.id} category={category} />
      ))}
    </main>
  );
}
```

### Movie Details Page

```typescript
// app/(main)/movies/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { MovieDetails } from '@/components/movies/movie-details';
import { BannerAd } from '@/components/ads/banner-ad';
import { UpgradePrompt } from '@/components/subscription/upgrade-prompt';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface Props {
  params: { slug: string };
}

async function getMovie(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/movies/${slug}`, {
    next: { revalidate: 3600 }
  });
  
  if (!res.ok) return null;
  
  return res.json();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const movie = await getMovie(params.slug);
  
  if (!movie) {
    return {
      title: 'Movie Not Found'
    };
  }
  
  return {
    title: `${movie.title} - Kush Films`,
    description: movie.description,
    openGraph: {
      title: movie.title,
      description: movie.description,
      images: [movie.posterUrl],
      type: 'video.movie'
    }
  };
}

export default async function MoviePage({ params }: Props) {
  const [movie, session] = await Promise.all([
    getMovie(params.slug),
    getServerSession(authOptions)
  ]);
  
  if (!movie) {
    notFound();
  }
  
  const userPlan = session?.user?.subscription?.plan || 'FREE';
  const hasAccess = checkAccess(movie.accessLevel, userPlan);
  
  return (
    <main className="min-h-screen">
      <MovieDetails movie={movie} hasAccess={hasAccess} />
      
      {!hasAccess && (
        <UpgradePrompt requiredPlan={movie.accessLevel} />
      )}
      
      {userPlan === 'FREE' && (
        <BannerAd type="rectangle" className="my-8" />
      )}
      
      {/* Related Movies */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">More Like This</h2>
        {/* Related movies grid */}
      </section>
    </main>
  );
}

function checkAccess(accessLevel: string, userPlan: string): boolean {
  const hierarchy = { FREE: 0, BASIC: 1, PREMIUM: 2 };
  return hierarchy[userPlan as keyof typeof hierarchy] >= hierarchy[accessLevel as keyof typeof hierarchy];
}
```

### Watch Page (Client Component)

```typescript
// app/(main)/watch/[id]/page.tsx
'use client';

import { useEffect, useState } from 'use';
import { useRouter } from 'next/navigation';
import { VideoPlayer } from '@/components/movies/movie-player';
import { VideoAd } from '@/components/ads/video-ad';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

interface Props {
  params: { id: string };
}

export default function WatchPage({ params }: Props) {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [movie, setMovie] = useState<any>(null);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [showAd, setShowAd] = useState(false);
  const [currentAd, setCurrentAd] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadMovie() {
      try {
        // Get movie details
        const movieData = await api.get(`/movies/${params.id}`);
        setMovie(movieData);
        
        // Check if user should see ad
        if (user?.subscription?.plan === 'FREE') {
          const ad = await api.get('/ads/get?type=VIDEO_PREROLL');
          
          if (ad) {
            setCurrentAd(ad);
            setShowAd(true);
            
            // Track impression
            await api.post('/ads/impression', { adId: ad.id });
          }
        } else {
          // No ads for premium users, load video directly
          await loadStream();
        }
        
        setLoading(false);
        
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load movie',
          variant: 'destructive'
        });
        router.push('/movies');
      }
    }
    
    loadMovie();
  }, [params.id]);
  
  async function loadStream() {
    try {
      const response = await api.get(`/movies/${params.id}/stream`);
      setStreamUrl(response.streamUrl);
    } catch (error: any) {
      if (error.response?.status === 403) {
        // Subscription required
        toast({
          title: 'Subscription Required',
          description: 'Please upgrade to watch this content',
          action: {
            label: 'Upgrade',
            onClick: () => router.push('/subscribe')
          }
        });
      }
    }
  }
  
  function handleAdComplete() {
    setShowAd(false);
    loadStream();
  }
  
  function handleAdClick() {
    if (currentAd) {
      // Track click
      api.post('/ads/click', { adId: currentAd.id });
      // Open ad URL
      window.open(currentAd.clickUrl, '_blank');
    }
  }
  
  async function handleWatchProgress(progress: number) {
    await api.post(`/movies/${params.id}/watch`, {
      progress,
      completed: progress >= movie.duration * 0.9
    });
  }
  
  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }
  
  return (
    <main className="min-h-screen bg-black">
      <div className="container mx-auto">
        {showAd && currentAd ? (
          <VideoAd
            ad={currentAd}
            onComplete={handleAdComplete}
            onClick={handleAdClick}
          />
        ) : streamUrl ? (
          <VideoPlayer
            src={streamUrl}
            movie={movie}
            onProgress={handleWatchProgress}
          />
        ) : (
          <div className="h-screen flex items-center justify-center">
            <p className="text-white">Loading video...</p>
          </div>
        )}
      </div>
    </main>
  );
}
```

### Subscription Page

```typescript
// app/(main)/subscribe/page.tsx
import { PlanCard } from '@/components/subscription/plan-card';
import { SubscriptionBadge } from '@/components/subscription/subscription-badge';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const metadata = {
  title: 'Subscribe - Kush Films',
  description: 'Choose your plan and start watching premium content'
};

const PLANS = [
  {
    id: 'FREE',
    name: 'Free',
    price: 0,
    interval: 'forever',
    features: [
      'Limited content library',
      'Ads supported',
      '480p quality',
      'Watch on 1 device'
    ],
    popular: false
  },
  {
    id: 'BASIC',
    name: 'Basic',
    price: 2.99,
    interval: 'month',
    features: [
      'Full content library',
      'No ads',
      '720p quality',
      'Watch on 2 devices',
      'Download offline'
    ],
    popular: true
  },
  {
    id: 'PREMIUM',
    name: 'Premium',
    price: 4.99,
    interval: 'month',
    features: [
      'Everything in Basic',
      '1080p quality',
      'Watch on 4 devices',
      'Early access to new releases',
      'Behind-the-scenes content'
    ],
    popular: false
  }
];

export default async function SubscribePage() {
  const session = await getServerSession(authOptions);
  const currentPlan = session?.user?.subscription?.plan || 'FREE';
  
  return (
    <main className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-lg text-gray-600">
            Unlock unlimited entertainment. Cancel anytime.
          </p>
          
          {currentPlan !== 'FREE' && (
            <SubscriptionBadge plan={currentPlan} className="mt-4" />
          )}
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {PLANS.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              currentPlan={currentPlan}
              isAuthenticated={!!session}
            />
          ))}
        </div>
        
        {/* FAQ Section */}
        <section className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Frequently Asked Questions
          </h2>
          {/* FAQ items */}
        </section>
      </div>
    </main>
  );
}
```

---

## 🎨 Component Examples

### Movie Card Component

```typescript
// components/movies/movie-card.tsx
import Image from 'next/image';
import Link from 'next/link';
import { PlayIcon, ClockIcon } from '@heroicons/react/24/solid';

interface MovieCardProps {
  movie: {
    id: string;
    slug: string;
    title: string;
    thumbnailUrl: string;
    duration: number;
    accessLevel: 'FREE' | 'BASIC' | 'PREMIUM';
    rating?: number;
  };
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/movies/${movie.slug}`} className="group">
      <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-900">
        <Image
          src={movie.thumbnailUrl}
          alt={movie.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <PlayIcon className="w-12 h-12 text-white mx-auto" />
          </div>
        </div>
        
        {/* Duration Badge */}
        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
          <ClockIcon className="w-3 h-3" />
          {formatDuration(movie.duration)}
        </div>
        
        {/* Access Level Badge */}
        {movie.accessLevel !== 'FREE' && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">
            {movie.accessLevel}
          </div>
        )}
      </div>
      
      <div className="mt-2">
        <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
          {movie.title}
        </h3>
        
        {movie.rating && (
          <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
            <span className="text-yellow-500">★</span>
            <span>{movie.rating.toFixed(1)}</span>
          </div>
        )}
      </div>
    </Link>
  );
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}
```

### Video Player Component

```typescript
// components/movies/movie-player.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid';

interface VideoPlayerProps {
  src: string;
  movie: {
    id: string;
    title: string;
    duration: number;
  };
  onProgress?: (progress: number) => void;
}

export function VideoPlayer({ src, movie, onProgress }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    // Initialize HLS for adaptive streaming
    if (src.includes('.m3u8') && Hls.isSupported()) {
      const hls = new Hls({
        startLevel: -1, // Auto quality
        capLevelToPlayerSize: true
      });
      
      hls.loadSource(src);
      hls.attachMedia(video);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('HLS manifest loaded');
      });
      
      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      video.src = src;
    } else {
      // Fallback to direct video
      video.src = src;
    }
  }, [src]);
  
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    // Track progress every 30 seconds
    const interval = setInterval(() => {
      if (onProgress && video.currentTime > 0) {
        onProgress(Math.floor(video.currentTime));
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [onProgress]);
  
  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    
    if (playing) {
      video.pause();
    } else {
      video.play();
    }
    
    setPlaying(!playing);
  }
  
  function handleTimeUpdate() {
    const video = videoRef.current;
    if (!video) return;
    
    setCurrentTime(video.currentTime);
  }
  
  function handleLoadedMetadata() {
    const video = videoRef.current;
    if (!video) return;
    
    setDuration(video.duration);
  }
  
  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const video = videoRef.current;
    if (!video) return;
    
    const time = parseFloat(e.target.value);
    video.currentTime = time;
    setCurrentTime(time);
  }
  
  function toggleFullscreen() {
    const video = videoRef.current;
    if (!video) return;
    
    if (!document.fullscreenElement) {
      video.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  }
  
  return (
    <div className="relative w-full h-screen bg-black group">
      <video
        ref={videoRef}
        className="w-full h-full"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onClick={togglePlay}
      />
      
      {/* Controls Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        
        {/* Progress Bar */}
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="w-full mb-4"
        />
        
        {/* Controls */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <button onClick={togglePlay} className="p-2 hover:bg-white/20 rounded">
              {playing ? (
                <PauseIcon className="w-6 h-6" />
              ) : (
                <PlayIcon className="w-6 h-6" />
              )}
            </button>
            
            <span className="text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => {
                const vol = parseFloat(e.target.value);
                setVolume(vol);
                if (videoRef.current) videoRef.current.volume = vol;
              }}
              className="w-24"
            />
            
            <button onClick={toggleFullscreen} className="p-2 hover:bg-white/20 rounded">
              Fullscreen
            </button>
          </div>
        </div>
      </div>
      
      {/* Title Overlay */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <h1 className="text-white text-2xl font-bold">{movie.title}</h1>
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
}
```

### Banner Ad Component

```typescript
// components/ads/banner-ad.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';
import { api } from '@/lib/api';

interface BannerAdProps {
  type: 'leaderboard' | 'rectangle' | 'mobile';
  className?: string;
}

const AD_SIZES = {
  leaderboard: { width: 728, height: 90 },
  rectangle: { width: 300, height: 250 },
  mobile: { width: 320, height: 50 }
};

export function BannerAd({ type, className = '' }: BannerAdProps) {
  const { user } = useAuth();
  const [ad, setAd] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadAd() {
      // Don't show ads to premium users
      if (user?.subscription?.plan === 'PREMIUM' || user?.subscription?.plan === 'BASIC') {
        setLoading(false);
        return;
      }
      
      try {
        const response = await api.get(`/ads/get?type=BANNER`);
        
        if (response) {
          setAd(response);
          
          // Track impression
          await api.post('/ads/impression', { adId: response.id });
        }
      } catch (error) {
        console.error('Failed to load ad:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadAd();
  }, [user]);
  
  async function handleClick() {
    if (ad) {
      await api.post('/ads/click', { adId: ad.id });
      window.open(ad.clickUrl, '_blank');
    }
  }
  
  if (loading) {
    return (
      <div
        className={`bg-gray-200 animate-pulse ${className}`}
        style={{
          width: AD_SIZES[type].width,
          height: AD_SIZES[type].height
        }}
      />
    );
  }
  
  if (!ad) return null;
  
  return (
    <div className={`flex justify-center ${className}`}>
      <div
        className="relative cursor-pointer hover:opacity-90 transition-opacity border border-gray-300"
        onClick={handleClick}
        style={{
          width: AD_SIZES[type].width,
          height: AD_SIZES[type].height
        }}
      >
        <Image
          src={ad.imageUrl}
          alt="Advertisement"
          fill
          className="object-cover"
        />
        
        <span className="absolute top-0 right-0 bg-gray-800 text-white text-xs px-2 py-1">
          Ad
        </span>
      </div>
    </div>
  );
}
```

---

## 🔐 Authentication with NextAuth.js

```typescript
// lib/auth.ts
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { api } from './api';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }
        
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            })
          });
          
          if (!response.ok) {
            throw new Error('Invalid credentials');
          }
          
          const data = await response.json();
          
          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            role: data.user.role,
            subscription: data.user.subscription,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken
          };
        } catch (error) {
          throw new Error('Authentication failed');
        }
      }
    })
  ],
  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.role = user.role;
        token.subscription = user.subscription;
      }
      
      return token;
    },
    
    async session({ session, token }) {
      session.user.id = token.sub!;
      session.user.role = token.role;
      session.user.subscription = token.subscription;
      session.accessToken = token.accessToken;
      
      return session;
    }
  },
  
  pages: {
    signIn: '/login',
    error: '/login'
  },
  
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60 // 7 days
  }
};
```

---

## 🎯 State Management with Zustand

```typescript
// stores/auth-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  subscription?: {
    plan: string;
    status: string;
  };
}

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      
      setUser: (user) => set({ user }),
      
      setAccessToken: (token) => set({ accessToken: token }),
      
      logout: () => set({ user: null, accessToken: null })
    }),
    {
      name: 'auth-storage'
    }
  )
);
```

---

## 🌐 API Client

```typescript
// lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + '/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    // Handle 401 errors
    if (error.response?.status === 401) {
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export { api };
```

---

## 📱 Responsive Design

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B00',
        secondary: '#1A1A1A'
      },
      fontFamily: {
        sans: ['var(--font-inter)']
      }
    }
  },
  plugins: []
};

export default config;
```

---

## 📋 Environment Variables

```env
# .env.example

# API
NEXT_PUBLIC_API_URL=http://localhost:4000

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## 🚀 Performance Optimization

### Image Optimization
- Use Next.js `<Image>` component
- Lazy loading by default
- WebP format conversion
- Responsive sizes

### Code Splitting
- Dynamic imports for heavy components
- Route-based code splitting (automatic)

### SEO Optimization
- Server-side metadata generation
- OpenGraph tags
- Structured data (JSON-LD)
- Sitemap generation

---

**Next**: See [SETUP.md](SETUP.md) for installation instructions
