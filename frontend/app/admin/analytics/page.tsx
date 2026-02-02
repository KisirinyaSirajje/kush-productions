"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StatsCard from "@/components/admin/StatsCard";
import { TrendingUp, Users, Eye, DollarSign, Play, Clock, MapPin, Smartphone } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";

type MoviePerformance = {
  type: "Movies";
  views: number;
  watchTime: string;
  engagement: number;
};

type FoodPerformance = {
  type: "Foods";
  orders: number;
  revenue: string;
  engagement: number;
};

type AnalyticsData = {
  keyMetrics: {
    totalRevenue: string;
    activeUsers: string;
    totalViews: string;
    avgWatchTime: string;
  };
  geographic: Array<{ country: string; users: number; percentage: number }>;
  deviceData: Array<{ device: string; users: number; percentage: number }>;
  contentPerformance: (MoviePerformance | FoodPerformance)[];
  trafficSources: Array<{ source: string; visits: number; percentage: number }>;
};

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
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

    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:4000/api/admin/analytics', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAnalytics(data);
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load analytics data</p>
      </div>
    );
  }

  const { keyMetrics, geographic, deviceData, contentPerformance, trafficSources } = analytics;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Analytics</h1>
        <p className="text-muted-foreground">Detailed insights and performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value={keyMetrics.totalRevenue}
          change="+18.2% vs last month"
          changeType="positive"
          icon={DollarSign}
          iconColor="bg-green-500/10 text-green-500"
        />
        <StatsCard
          title="Active Users"
          value={keyMetrics.activeUsers}
          change="+12.5% growth"
          changeType="positive"
          icon={Users}
          iconColor="bg-blue-500/10 text-blue-500"
        />
        <StatsCard
          title="Total Views"
          value={keyMetrics.totalViews}
          change="+8.1% increase"
          changeType="positive"
          icon={Eye}
          iconColor="bg-purple-500/10 text-purple-500"
        />
        <StatsCard
          title="Avg Watch Time"
          value={keyMetrics.avgWatchTime}
          change="+3.2% improvement"
          changeType="positive"
          icon={Clock}
          iconColor="bg-orange-500/10 text-orange-500"
        />
      </div>

      {/* Geographic Distribution */}
      <div className="glass-card p-6 rounded-xl border border-border/50">
        <div className="flex items-center gap-2 mb-6">
          <MapPin className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Geographic Distribution</h2>
        </div>
        <div className="space-y-4">
          {geographic.map((item) => (
            <div key={item.country}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-foreground">{item.country}</span>
                <div className="text-right">
                  <span className="text-muted-foreground">{item.users.toLocaleString()} users</span>
                  <span className="ml-2 text-primary font-semibold">{item.percentage}%</span>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Device Distribution & Traffic Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Distribution */}
        <div className="glass-card p-6 rounded-xl border border-border/50">
          <div className="flex items-center gap-2 mb-6">
            <Smartphone className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Device Distribution</h2>
          </div>
          <div className="space-y-4">
            {deviceData.map((item) => (
              <div key={item.device}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-foreground">{item.device}</span>
                  <div className="text-right">
                    <span className="text-muted-foreground">{item.users.toLocaleString()} users</span>
                    <span className="ml-2 text-primary font-semibold">{item.percentage}%</span>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="glass-card p-6 rounded-xl border border-border/50">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Traffic Sources</h2>
          </div>
          <div className="space-y-4">
            {trafficSources.map((item) => (
              <div key={item.source}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-foreground">{item.source}</span>
                  <div className="text-right">
                    <span className="text-muted-foreground">{item.visits.toLocaleString()} visits</span>
                    <span className="ml-2 text-primary font-semibold">{item.percentage}%</span>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Performance */}
      <div className="glass-card p-6 rounded-xl border border-border/50">
        <div className="flex items-center gap-2 mb-6">
          <Play className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Content Performance</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contentPerformance.map((item) => (
            <div key={item.type} className="p-4 bg-muted/30 rounded-lg">
              <h3 className="text-lg font-semibold text-foreground mb-4">{item.type}</h3>
              <div className="space-y-3">
                {'views' in item && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Views</span>
                    <span className="font-semibold text-foreground">{item.views.toLocaleString()}</span>
                  </div>
                )}
                {'orders' in item && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Orders</span>
                      <span className="font-semibold text-foreground">{item.orders.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Revenue</span>
                      <span className="font-semibold text-foreground">{item.revenue}</span>
                    </div>
                  </>
                )}
                {'watchTime' in item && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Watch Time</span>
                    <span className="font-semibold text-foreground">{item.watchTime}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Engagement</span>
                  <span className="font-semibold text-primary">{item.engagement}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="glass-card p-6 rounded-xl border border-border/50">
        <h2 className="text-xl font-semibold text-foreground mb-4">Revenue Trend (Last 12 Months)</h2>
        <div className="h-80 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
          <div className="text-center">
            <p className="text-muted-foreground mb-2">Chart visualization placeholder</p>
            <p className="text-sm text-muted-foreground">Install Chart.js or Recharts for interactive charts</p>
          </div>
        </div>
      </div>
    </div>
  );
}
