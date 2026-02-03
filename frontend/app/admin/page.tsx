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
import { useAuthStore } from "@/lib/store/authStore";
import { apiClient } from "@/lib/api/client";
import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Activity = {
  type: string;
  user: string;
  action: string;
  details: string;
  time: Date;
};

type DashboardAnalytics = {
  topMovies: Array<{
    id: string;
    title: string;
    views: number;
    watchCount: number;
    rating: number;
  }>;
  recentOrders: Array<{
    id: string;
    user: { id: string; name: string; email: string; avatar: string | null };
    items: any;
    total: number;
    status: string;
    deliveryAddress: string | null;
    createdAt: Date;
  }>;
  recentRatings: Array<{
    id: string;
    user: { id: string; name: string; avatar: string | null };
    rating: number;
    type: string;
    movie: { id: string; title: string; thumbnailUrl: string } | null;
    food: { id: string; name: string; image: string } | null;
    createdAt: Date;
  }>;
  metrics: {
    totalViews: number;
    totalWatchTimeHours: number;
    avgWatchTimeMinutes: number;
    engagementRate: number;
  };
  revenueData: Array<{ month: string; revenue: number; orders: number }>;
};

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
  const [activities, setActivities] = useState<Activity[]>([]);
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
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

    fetchDashboardData();
  }, [isAuthenticated, user, router]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch stats
      const statsResponse = await apiClient.get('/api/admin/stats');
      const fetchedStats = statsResponse.data.stats || {};
      setStats({
        totalUsers: fetchedStats.totalUsers || 0,
        totalMovies: fetchedStats.totalMovies || 0,
        totalFoods: fetchedStats.totalFoods || 0,
        totalOrders: fetchedStats.totalOrders || 0,
        totalRevenue: fetchedStats.totalRevenue || 0
      });

      // Fetch recent activity
      const activityResponse = await apiClient.get('/api/admin/activity');
      setActivities(activityResponse.data.activities || []);

      // Fetch dashboard analytics
      const analyticsResponse = await apiClient.get('/api/admin/dashboard-analytics');
      setAnalytics(analyticsResponse.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeAgo = (time: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - new Date(time).getTime()) / 1000);
    
    if (diff < 60) return `${diff} secs ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null;
  }

  const topMovies = analytics?.topMovies || [];
  const revenueData = analytics?.revenueData || [];
  const recentOrders = analytics?.recentOrders || [];
  const recentRatings = analytics?.recentRatings || [];
  const metrics = analytics?.metrics || { totalViews: 0, totalWatchTimeHours: 0, avgWatchTimeMinutes: 0, engagementRate: 0 };

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
              value={metrics.totalViews.toLocaleString()}
              change="Movie watch count"
              changeType="positive"
              icon={Eye}
              iconColor="bg-purple-500/10 text-purple-500"
            />
            <StatsCard
              title="Watch Time"
              value={`${metrics.totalWatchTimeHours}h`}
              change={`Avg ${metrics.avgWatchTimeMinutes} min per view`}
              changeType="positive"
              icon={Play}
              iconColor="bg-pink-500/10 text-pink-500"
            />
            <StatsCard
              title="Engagement"
              value={`${metrics.engagementRate}%`}
              change="Active users rate"
              changeType="positive"
              icon={Heart}
              iconColor="bg-red-500/10 text-red-500"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Movies */}
            <div className="glass-card p-6 rounded-xl border border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-4">Top Movies by Views</h2>
              <div className="space-y-4">
                {topMovies.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No movies yet</p>
                ) : (
                  topMovies.map((movie, index) => (
                    <div key={movie.id} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold text-muted-foreground">#{index + 1}</span>
                        <div>
                          <p className="font-medium text-foreground">{movie.title}</p>
                          <p className="text-sm text-muted-foreground">{movie.views.toLocaleString()} views • {movie.watchCount} watches</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500">
                        <span className="font-semibold">{movie.rating.toFixed(1)}</span>
                        <span className="text-xs">★</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-card p-6 rounded-xl border border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {activities.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No recent activity</p>
                ) : (
                  activities.slice(0, 5).map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 py-2">
                      <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
                      <div className="flex-1">
                        <p className="text-sm text-foreground">
                          <span className="font-medium">{activity.user}</span> {activity.action}{" "}
                          {activity.details && <span className="font-medium">{activity.details}</span>}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{formatTimeAgo(activity.time)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="glass-card p-6 rounded-xl border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-6">Revenue Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.1} />
                <XAxis 
                  dataKey="month" 
                  stroke="#888"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#888"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => `${value}M`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(value: any, name: string | undefined) => {
                    if (name === 'revenue') return [`UGX ${value}M`, 'Revenue'];
                    if (name === 'orders') return [value, 'Orders'];
                    return [value, name || ''];
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
                <Line 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  dot={{ fill: '#f59e0b', r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-muted-foreground">Revenue (UGX)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-muted-foreground">Orders</span>
              </div>
            </div>
          </div>

          {/* Recent Orders & Ratings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <div className="glass-card p-6 rounded-xl border border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-4">Recent Orders</h2>
              <div className="space-y-4">
                {recentOrders.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No orders yet</p>
                ) : (
                  recentOrders.slice(0, 5).map((order) => (
                    <div key={order.id} className="border border-border/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {order.user.avatar ? (
                            <img src={order.user.avatar} alt={order.user.name} className="w-8 h-8 rounded-full" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                              {order.user.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-sm">{order.user.name}</p>
                            <p className="text-xs text-muted-foreground">{order.user.email}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          order.status === 'DELIVERED' ? 'bg-green-500/10 text-green-500' :
                          order.status === 'CONFIRMED' ? 'bg-blue-500/10 text-blue-500' :
                          order.status === 'CANCELLED' ? 'bg-red-500/10 text-red-500' :
                          'bg-amber-500/10 text-amber-500'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span className="text-muted-foreground">{(order.items as any[]).length} items</span>
                        <span className="font-semibold text-green-500">UGX {order.total.toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">{formatTimeAgo(order.createdAt)}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Ratings */}
            <div className="glass-card p-6 rounded-xl border border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-4">Recent Ratings</h2>
              <div className="space-y-4">
                {recentRatings.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No ratings yet</p>
                ) : (
                  recentRatings.slice(0, 5).map((rating) => (
                    <div key={rating.id} className="border border-border/30 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        {rating.user.avatar ? (
                          <img src={rating.user.avatar} alt={rating.user.name} className="w-10 h-10 rounded-full" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                            {rating.user.name.charAt(0)}
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm">{rating.user.name}</p>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={`text-sm ${i < rating.rating ? 'text-amber-500' : 'text-gray-600'}`}>
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Rated {rating.type === 'movie' ? rating.movie?.title : rating.food?.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">{formatTimeAgo(rating.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
