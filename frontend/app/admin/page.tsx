"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StatsCard from "@/components/admin/StatsCard";
import { 
  Users, 
  Film, 
  UtensilsCrossed, 
  DollarSign,
  Eye,
  Play,
  Heart
} from "lucide-react";
import { trendingMovies } from "@/data/mockData";
import { useAuthStore } from "@/lib/store/authStore";
import { apiClient } from "@/lib/api/client";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMovies: 0,
    totalFoods: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user?.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    fetchStats();
  }, [isAuthenticated, user, router]);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/api/admin/stats');
      const fetchedStats = response.data.stats || {};
      setStats({
        totalUsers: fetchedStats.totalUsers || 0,
        totalMovies: fetchedStats.totalMovies || 0,
        totalFoods: fetchedStats.totalFoods || 0,
        totalOrders: fetchedStats.totalOrders || 0,
        totalRevenue: fetchedStats.totalRevenue || 0
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      // Keep default 0 values on error
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null;
  }

  const recentActivity = [
    { user: "John Doe", action: "Watched", item: "The Last Kingdom", time: "5 mins ago" },
    { user: "Jane Smith", action: "Added to Watchlist", item: "Desert Storm", time: "12 mins ago" },
    { user: "Mike Johnson", action: "Ordered", item: "Rolex", time: "25 mins ago" },
    { user: "Sarah Williams", action: "Subscribed", item: "Premium Plan", time: "1 hour ago" },
    { user: "David Brown", action: "Watched", item: "Night Shadows", time: "2 hours ago" },
  ];

  // Static mock views to avoid hydration errors
  const topMovies = trendingMovies.slice(0, 5).map((movie, index) => ({
    rank: index + 1,
    title: movie.title,
    views: [45230, 38456, 32109, 28745, 24890][index],
    rating: movie.rating,
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here&apos;s what&apos;s happening today.</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Users"
              value={(stats.totalUsers || 0).toLocaleString()}
              change="Registered users"
              changeType="neutral"
              icon={Users}
              iconColor="bg-blue-500/10 text-blue-500"
            />
            <StatsCard
              title="Total Movies"
              value={String(stats.totalMovies || 0)}
              change="Available movies"
              changeType="neutral"
              icon={Film}
              iconColor="bg-primary/10 text-primary"
            />
            <StatsCard
              title="Total Foods"
              value={String(stats.totalFoods || 0)}
              change="Available foods"
              changeType="neutral"
              icon={UtensilsCrossed}
              iconColor="bg-accent/10 text-accent"
            />
            <StatsCard
              title="Total Orders"
              value={String(stats.totalOrders || 0)}
              change="All orders"
              changeType="neutral"
              icon={DollarSign}
              iconColor="bg-green-500/10 text-green-500"
            />
          </div>

          {/* Revenue Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Revenue"
              value={`UGX ${(stats.totalRevenue || 0).toLocaleString()}`}
              change="From all orders"
              changeType="positive"
              icon={DollarSign}
              iconColor="bg-purple-500/10 text-purple-500"
            />
            <StatsCard
              title="Total Views"
              value="N/A"
              change="Coming soon"
              changeType="neutral"
              icon={Eye}
              iconColor="bg-purple-500/10 text-purple-500"
            />
            <StatsCard
              title="Watch Time"
              value="N/A"
              change="Coming soon"
              changeType="neutral"
              icon={Play}
              iconColor="bg-pink-500/10 text-pink-500"
            />
            <StatsCard
              title="Engagement"
              value="N/A"
              change="Coming soon"
              changeType="neutral"
              icon={Heart}
              iconColor="bg-red-500/10 text-red-500"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Movies */}
            <div className="glass-card p-6 rounded-xl border border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-4">Top Movies</h2>
              <div className="space-y-4">
                {topMovies.map((movie) => (
                  <div key={movie.rank} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-muted-foreground">#{movie.rank}</span>
                      <div>
                        <p className="font-medium text-foreground">{movie.title}</p>
                        <p className="text-sm text-muted-foreground">{movie.views.toLocaleString()} views</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      <span className="font-semibold">{movie.rating}</span>
                      <span className="text-xs">★</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-card p-6 rounded-xl border border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 py-2">
                    <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
                    <div className="flex-1">
                      <p className="text-sm text-foreground">
                        <span className="font-medium">{activity.user}</span> {activity.action}{" "}
                        <span className="font-medium">{activity.item}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Revenue Chart Placeholder */}
          <div className="glass-card p-6 rounded-xl border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-4">Revenue Overview</h2>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
              <p className="text-muted-foreground">Chart visualization would go here (integrate Chart.js or Recharts)</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
