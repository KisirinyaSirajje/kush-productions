"use client";

import StatsCard from "@/components/admin/StatsCard";
import { TrendingUp, Users, Eye, DollarSign, Play, Clock, MapPin, Smartphone } from "lucide-react";

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

export default function AdminAnalyticsPage() {
  const geographicData = [
    { country: "Uganda", users: 8234, percentage: 66 },
    { country: "Kenya", users: 2156, percentage: 17 },
    { country: "Tanzania", users: 1234, percentage: 10 },
    { country: "Rwanda", users: 567, percentage: 5 },
    { country: "Others", users: 267, percentage: 2 },
  ];

  const deviceData = [
    { device: "Mobile", users: 7234, percentage: 58 },
    { device: "Desktop", users: 3890, percentage: 31 },
    { device: "Tablet", users: 1334, percentage: 11 },
  ];

  const contentPerformance: (MoviePerformance | FoodPerformance)[] = [
    { type: "Movies", views: 234567, watchTime: "45,234 hrs", engagement: 78.5 },
    { type: "Foods", orders: 12456, revenue: "UGX 45.2M", engagement: 65.3 },
  ];

  const trafficSources = [
    { source: "Direct", visits: 45678, percentage: 42 },
    { source: "Social Media", visits: 32456, percentage: 30 },
    { source: "Search", visits: 21234, percentage: 20 },
    { source: "Referral", visits: 8756, percentage: 8 },
  ];

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
          value="UGX 45.2M"
          change="+18.2% vs last month"
          changeType="positive"
          icon={DollarSign}
          iconColor="bg-green-500/10 text-green-500"
        />
        <StatsCard
          title="Active Users"
          value="12,458"
          change="+12.5% growth"
          changeType="positive"
          icon={Users}
          iconColor="bg-blue-500/10 text-blue-500"
        />
        <StatsCard
          title="Total Views"
          value="234K"
          change="+8.1% increase"
          changeType="positive"
          icon={Eye}
          iconColor="bg-purple-500/10 text-purple-500"
        />
        <StatsCard
          title="Avg Watch Time"
          value="24.5 min"
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
          {geographicData.map((item) => (
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
