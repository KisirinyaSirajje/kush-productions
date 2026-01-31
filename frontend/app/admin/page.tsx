"use client";

import StatsCard from "@/components/admin/StatsCard";
import { 
  Users, 
  Film, 
  UtensilsCrossed, 
  DollarSign,
  TrendingUp,
  Eye,
  Play,
  Heart
} from "lucide-react";
import { trendingMovies, popularMovies, foods } from "@/data/mockData";

export default function AdminDashboard() {
  // Mock analytics data
  const stats = {
    totalUsers: 12458,
    totalMovies: trendingMovies.length + popularMovies.length,
    totalFoods: foods.length,
    revenue: 45230,
    views: 234567,
    watchTime: "45,234",
    newUsers: 1234,
    engagement: 78.5
  };

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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          change="+12.5% from last month"
          changeType="positive"
          icon={Users}
          iconColor="bg-blue-500/10 text-blue-500"
        />
        <StatsCard
          title="Total Movies"
          value={stats.totalMovies}
          change="+3 new this week"
          changeType="positive"
          icon={Film}
          iconColor="bg-primary/10 text-primary"
        />
        <StatsCard
          title="Total Foods"
          value={stats.totalFoods}
          change="2 pending approval"
          changeType="neutral"
          icon={UtensilsCrossed}
          iconColor="bg-accent/10 text-accent"
        />
        <StatsCard
          title="Revenue"
          value={`$${stats.revenue.toLocaleString()}`}
          change="+18.2% from last month"
          changeType="positive"
          icon={DollarSign}
          iconColor="bg-green-500/10 text-green-500"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Views"
          value={stats.views.toLocaleString()}
          change="+8.1% increase"
          changeType="positive"
          icon={Eye}
          iconColor="bg-purple-500/10 text-purple-500"
        />
        <StatsCard
          title="Watch Time (hrs)"
          value={stats.watchTime}
          change="+15.3% increase"
          changeType="positive"
          icon={Play}
          iconColor="bg-pink-500/10 text-pink-500"
        />
        <StatsCard
          title="New Users"
          value={stats.newUsers.toLocaleString()}
          change="This month"
          changeType="neutral"
          icon={TrendingUp}
          iconColor="bg-orange-500/10 text-orange-500"
        />
        <StatsCard
          title="Engagement Rate"
          value={`${stats.engagement}%`}
          change="+5.2% improvement"
          changeType="positive"
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
    </div>
  );
}
