"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Package, Clock, CheckCircle, Truck, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuthStore } from "@/lib/store/authStore";
import { apiClient } from "@/lib/api/client";
import { cn } from "@/lib/utils";

interface OrderItem {
  foodId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  items: OrderItem[];
  total: number;
  deliveryAddress: string;
  phone: string;
  notes?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const statusConfig: Record<string, { label: string; icon: any; color: string; bgColor: string }> = {
  PENDING: { label: 'Pending', icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-600/20' },
  CONFIRMED: { label: 'Confirmed', icon: CheckCircle, color: 'text-blue-600', bgColor: 'bg-blue-600/20' },
  DELIVERED: { label: 'Delivered', icon: Truck, color: 'text-green-600', bgColor: 'bg-green-600/20' },
  CANCELLED: { label: 'Cancelled', icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-600/20' },
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user?.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    fetchOrders();
  }, [isAuthenticated, user, router]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/api/orders');
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await apiClient.put(`/api/admin/orders/${orderId}`, { status: newStatus });
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const toggleOrderExpanded = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null;
  }

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'PENDING').length,
    confirmed: orders.filter(o => o.status === 'CONFIRMED').length,
    delivered: orders.filter(o => o.status === 'DELIVERED').length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="flex-1 p-8 pt-24">
        <div className="max-w-7xl mx-auto space-y-8">
          <h1 className="text-3xl font-serif font-bold">Orders Management</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-card p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <p className="text-3xl font-bold mt-2">{stats.total}</p>
                  </div>
                  <Package className="w-10 h-10 text-primary opacity-50" />
                </div>
              </div>
              <div className="glass-card p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-3xl font-bold mt-2 text-yellow-600">{stats.pending}</p>
                  </div>
                  <Clock className="w-10 h-10 text-yellow-600 opacity-50" />
                </div>
              </div>
              <div className="glass-card p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Confirmed</p>
                    <p className="text-3xl font-bold mt-2 text-blue-600">{stats.confirmed}</p>
                  </div>
                  <CheckCircle className="w-10 h-10 text-blue-600 opacity-50" />
                </div>
              </div>
              <div className="glass-card p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Delivered</p>
                    <p className="text-3xl font-bold mt-2 text-green-600">{stats.delivered}</p>
                  </div>
                  <Truck className="w-10 h-10 text-green-600 opacity-50" />
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {['all', 'PENDING', 'CONFIRMED', 'DELIVERED', 'CANCELLED'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={cn(
                    "px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap",
                    filter === status
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted hover:bg-muted/80"
                  )}
                >
                  {status === 'all' ? 'All Orders' : statusConfig[status]?.label || status}
                </button>
              ))}
            </div>

            {/* Orders List */}
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto" />
                <p className="mt-4 text-muted-foreground">Loading orders...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="glass-card p-12 rounded-xl text-center">
                <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-bold mb-2">No orders found</h3>
                <p className="text-muted-foreground">
                  {filter === 'all' ? 'No orders yet' : `No ${filter.toLowerCase()} orders`}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const status = statusConfig[order.status] || statusConfig.PENDING;
                  const StatusIcon = status.icon;
                  const isExpanded = expandedOrders.has(order.id);

                  return (
                    <div key={order.id} className="glass-card rounded-xl overflow-hidden">
                      {/* Order Header */}
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">Order #{order.id.slice(0, 8)}</h3>
                              <div className={cn("flex items-center gap-2 px-3 py-1 rounded-full", status.bgColor, status.color)}>
                                <StatusIcon className="w-4 h-4" />
                                <span className="text-sm font-semibold">{status.label}</span>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                              <p><span className="font-medium">Customer:</span> {order.user.name}</p>
                              <p><span className="font-medium">Email:</span> {order.user.email}</p>
                              <p><span className="font-medium">Phone:</span> {order.phone}</p>
                              <p><span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-accent">UGX {order.total.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">{order.items.length} items</p>
                          </div>
                        </div>

                        {/* Status Update Buttons */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {order.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => updateOrderStatus(order.id, 'CONFIRMED')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                              >
                                Confirm Order
                              </button>
                              <button
                                onClick={() => updateOrderStatus(order.id, 'CANCELLED')}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          {order.status === 'CONFIRMED' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'DELIVERED')}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold"
                            >
                              Mark as Delivered
                            </button>
                          )}
                        </div>

                        {/* Expand/Collapse Button */}
                        <button
                          onClick={() => toggleOrderExpanded(order.id)}
                          className="flex items-center gap-2 text-sm text-primary hover:underline"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="w-4 h-4" />
                              Hide Details
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4" />
                              View Details
                            </>
                          )}
                        </button>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="border-t border-border p-6 bg-muted/30">
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold mb-2">Items</h4>
                              <div className="space-y-2">
                                {order.items.map((item, idx) => (
                                  <div key={idx} className="flex items-center justify-between text-sm">
                                    <span>{item.name} × {item.quantity}</span>
                                    <span className="font-semibold">UGX {(item.price * item.quantity).toLocaleString()}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-1">Delivery Address</h4>
                              <p className="text-sm text-muted-foreground">{order.deliveryAddress}</p>
                            </div>
                            {order.notes && (
                              <div>
                                <h4 className="font-semibold mb-1">Notes</h4>
                                <p className="text-sm text-muted-foreground italic">{order.notes}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
      </main>
    </div>
  );
}
