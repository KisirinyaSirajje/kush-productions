"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Package, CheckCircle, Clock, XCircle, Truck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuthStore } from "@/lib/store/authStore";
import { apiClient } from "@/lib/api/client";
import { cn } from "@/lib/utils";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

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
  items: OrderItem[];
  total: number;
  deliveryAddress: string;
  phone: string;
  notes?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const statusConfig: Record<string, { label: string; icon: any; color: string }> = {
  PENDING: { label: 'Pending', icon: Clock, color: 'text-yellow-600' },
  CONFIRMED: { label: 'Confirmed', icon: CheckCircle, color: 'text-blue-600' },
  DELIVERED: { label: 'Delivered', icon: Truck, color: 'text-green-600' },
  CANCELLED: { label: 'Cancelled', icon: XCircle, color: 'text-red-600' },
};

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Check for success parameter in URL
    if (typeof window !== 'undefined' && window.location.search.includes('success=true')) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }

    fetchOrders();
  }, [isAuthenticated, router]);

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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 pt-24 sm:pt-28 lg:pt-32">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-8">My Orders</h1>

        {showSuccess && (
          <div className="glass-card p-4 rounded-lg bg-green-600/10 border border-green-600/20 text-green-600 mb-6 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <p>Order placed successfully! You'll receive a confirmation call shortly.</p>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">Start ordering some delicious Ugandan food!</p>
            <Link href="/foods" className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-semibold">
              Browse Foods
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const status = statusConfig[order.status] || statusConfig.PENDING;
              const StatusIcon = status.icon;

              return (
                <div key={order.id} className="glass-card p-6 rounded-xl">
                  {/* Order Header */}
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4 pb-4 border-b border-border">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Order #{order.id.slice(0, 8)}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted", status.color)}>
                      <StatusIcon className="w-4 h-4" />
                      <span className="text-sm font-semibold">{status.label}</span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3 mb-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded bg-muted flex-shrink-0 overflow-hidden">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-5 h-5 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium truncate">{item.name}</h4>
                          <p className="text-xs text-muted-foreground">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-sm font-semibold">
                          UGX {(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Details */}
                  <div className="bg-muted/30 p-4 rounded-lg space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Delivery Address:</span>
                      <span className="text-right font-medium max-w-xs">{order.deliveryAddress}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="font-medium">{order.phone}</span>
                    </div>
                    {order.notes && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Notes:</span>
                        <span className="text-right italic max-w-xs">{order.notes}</span>
                      </div>
                    )}
                  </div>

                  {/* Order Total */}
                  <div className="flex justify-between items-center pt-4 border-t border-border">
                    <span className="font-semibold">Total</span>
                    <span className="text-xl font-bold text-accent">
                      UGX {order.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
