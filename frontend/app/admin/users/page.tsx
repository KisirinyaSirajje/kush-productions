"use client";

import { useState } from "react";
import { Search, UserPlus, MoreVertical, Ban, CheckCircle } from "lucide-react";

// Mock user data
const mockUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", subscription: "Premium", status: "Active", joined: "2024-01-15", lastActive: "2 hours ago" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", subscription: "Basic", status: "Active", joined: "2024-02-20", lastActive: "1 day ago" },
  { id: 3, name: "Mike Johnson", email: "mike@example.com", subscription: "Free", status: "Active", joined: "2024-03-10", lastActive: "3 hours ago" },
  { id: 4, name: "Sarah Williams", email: "sarah@example.com", subscription: "Premium", status: "Active", joined: "2024-01-05", lastActive: "5 mins ago" },
  { id: 5, name: "David Brown", email: "david@example.com", subscription: "Basic", status: "Suspended", joined: "2023-12-15", lastActive: "1 week ago" },
  { id: 6, name: "Emily Davis", email: "emily@example.com", subscription: "Free", status: "Active", joined: "2024-03-25", lastActive: "2 days ago" },
  { id: 7, name: "Robert Wilson", email: "robert@example.com", subscription: "Premium", status: "Active", joined: "2024-02-01", lastActive: "1 hour ago" },
  { id: 8, name: "Lisa Anderson", email: "lisa@example.com", subscription: "Basic", status: "Active", joined: "2024-03-15", lastActive: "4 hours ago" },
];

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = mockUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSubscriptionColor = (subscription: string) => {
    switch (subscription) {
      case "Premium":
        return "bg-amber-500/10 text-amber-500";
      case "Basic":
        return "bg-blue-500/10 text-blue-500";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    return status === "Active"
      ? "bg-green-500/10 text-green-500"
      : "bg-red-500/10 text-red-500";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Users Management</h1>
          <p className="text-muted-foreground">Manage platform users and subscriptions</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors btn-glow">
          <UserPlus className="w-5 h-5" />
          Add User
        </button>
      </div>

      {/* Search Bar */}
      <div className="glass-card p-4 rounded-xl border border-border/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl border border-border/50">
          <p className="text-sm text-muted-foreground mb-1">Total Users</p>
          <p className="text-2xl font-bold text-foreground">{mockUsers.length}</p>
        </div>
        <div className="glass-card p-4 rounded-xl border border-border/50">
          <p className="text-sm text-muted-foreground mb-1">Premium Users</p>
          <p className="text-2xl font-bold text-amber-500">
            {mockUsers.filter(u => u.subscription === "Premium").length}
          </p>
        </div>
        <div className="glass-card p-4 rounded-xl border border-border/50">
          <p className="text-sm text-muted-foreground mb-1">Active Users</p>
          <p className="text-2xl font-bold text-green-500">
            {mockUsers.filter(u => u.status === "Active").length}
          </p>
        </div>
        <div className="glass-card p-4 rounded-xl border border-border/50">
          <p className="text-sm text-muted-foreground mb-1">New This Month</p>
          <p className="text-2xl font-bold text-primary">4</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card rounded-xl border border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left p-4 font-semibold text-foreground">User</th>
                <th className="text-left p-4 font-semibold text-foreground">Subscription</th>
                <th className="text-left p-4 font-semibold text-foreground">Status</th>
                <th className="text-left p-4 font-semibold text-foreground">Joined</th>
                <th className="text-left p-4 font-semibold text-foreground">Last Active</th>
                <th className="text-right p-4 font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSubscriptionColor(user.subscription)}`}>
                      {user.subscription}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status === "Active" ? <CheckCircle className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground">{user.joined}</td>
                  <td className="p-4 text-muted-foreground">{user.lastActive}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end">
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
