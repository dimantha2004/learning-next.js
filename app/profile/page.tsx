'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, User, Mail, Calendar, CreditCard, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user, isLoading, refreshUser } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('stripe_user_orders')
        .select('*')
        .order('order_date', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
      } else {
        setOrders(data || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Add handler to become premium (demo)
  const handleBecomePremium = async () => {
    if (!user) return;
    const { error } = await supabase
      .from('users')
      .update({ is_premium: true })
      .eq('id', user.id);
    if (error) {
      toast.error('Failed to update premium status');
    } else {
      toast.success('You are now a premium user!');
      if (typeof refreshUser === 'function') {
        await refreshUser();
      } else {
        window.location.reload();
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isPremium = (user as any)?.is_premium;
  const hasActiveSubscription = user.subscription?.status === 'active';
  const isPremiumUser = isPremium || hasActiveSubscription;

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#61dbf2]/20 via-white to-[#61dbf2]/40">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight drop-shadow-lg">Profile</h1>
            <p className="text-gray-600 text-lg">Manage your account and subscription details</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Profile Information */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-xl rounded-2xl bg-white/80 backdrop-blur-md border-0 transition-all duration-300 hover:shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-[#61dbf2]" />
                    <span>Account Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#61dbf2] to-cyan-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg">
                        {(user?.user_metadata?.full_name || user?.email || 'U').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {user?.user_metadata?.full_name || 'User'}
                      </h3>
                      <p className="text-gray-600">{user?.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-cyan-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Email</p>
                        <p className="text-sm text-gray-600">{user?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-cyan-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Member Since</p>
                        <p className="text-sm text-gray-600">
                          {user?.created_at ? format(new Date(user.created_at), 'MMMM d, yyyy') : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Premium status display and manual upgrade button */}
                  <div className="pt-4">
                    {isPremiumUser ? (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 shadow-md">
                        <Crown className="w-4 h-4 mr-1 text-yellow-700" />
                        Premium Member
                      </Badge>
                    ) : hasActiveSubscription ? (
                      <Button
                        onClick={handleBecomePremium}
                        className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 shadow-md"
                      >
                        <Crown className="w-4 h-4 mr-2 text-yellow-700" />
                        Become Premium User
                      </Button>
                    ) : null}
                  </div>
                </CardContent>
              </Card>

              {/* Order History */}
              <Card className="shadow-xl rounded-2xl bg-white/80 backdrop-blur-md border-0 transition-all duration-300 hover:shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5 text-cyan-400" />
                    <span>Order History</span>
                  </CardTitle>
                  <CardDescription>
                    Your recent purchases and transactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isPremiumUser && orders.length > 0 && (
                    <div className="flex items-center mb-4">
                      <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 shadow-md">
                        <Crown className="w-4 h-4 mr-1 text-yellow-700" />
                        Premium Member
                      </Badge>
                    </div>
                  )}
                  {loadingOrders ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#61dbf2] mx-auto mb-2"></div>
                      <p className="text-gray-600">Loading orders...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-8">
                      <CreditCard className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                      <p className="text-gray-600 mb-4">You haven't made any purchases yet.</p>
                      <Link href="/subscription">
                        <Button className="rounded-xl bg-gradient-to-r from-[#61dbf2] to-cyan-600 hover:from-cyan-600 hover:to-cyan-800 shadow-lg transition-all duration-200 transform hover:-translate-y-1 hover:scale-105 focus:ring-4 focus:ring-[#61dbf2]/30">View Subscription Plans</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.order_id} className="border rounded-lg p-4 bg-white/60 backdrop-blur-md shadow-md transition-all duration-200 hover:shadow-xl">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-medium text-gray-900">
                                Order #{order.order_id}
                              </p>
                              <p className="text-sm text-gray-600">
                                {format(new Date(order.order_date), 'MMMM d, yyyy')}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">
                                {formatCurrency(order.amount_total, order.currency)}
                              </p>
                              <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'}>
                                {order.payment_status}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>Payment Intent: {order.payment_intent_id}</span>
                            <Badge variant="outline">{order.order_status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Subscription Status */}
            <div className="space-y-6">
              <Card className="shadow-xl rounded-2xl bg-white/80 backdrop-blur-md border-0 transition-all duration-300 hover:shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Crown className="w-5 h-5 text-cyan-400" />
                    <span>Subscription</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isPremiumUser ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 shadow-md">
                          <Crown className="w-3 h-3 mr-1 text-yellow-700" />
                          Premium Active
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-900">Plan</p>
                        <p className="text-sm text-gray-600">Premium Plan</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-900">Status</p>
                        <p className="text-sm text-gray-600 capitalize">Active</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-center">
                        <Crown className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                        <h3 className="font-semibold text-gray-900 mb-2">Free Plan</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Upgrade to premium for exclusive content and features
                        </p>
                        <Link href="/subscription">
                          <Button className="w-full rounded-xl bg-gradient-to-r from-cyan-300 to-cyan-400 hover:from-cyan-400 hover:to-cyan-600 text-cyan-900 shadow-lg transition-all duration-200 transform hover:-translate-y-1 hover:scale-105 focus:ring-4 focus:ring-cyan-200">
                            <Crown className="w-4 h-4 mr-2" />
                            Upgrade to Premium
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="shadow-xl rounded-2xl bg-white/80 backdrop-blur-md border-0 transition-all duration-300 hover:shadow-2xl">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/dashboard">
                    <Button variant="outline" className="w-full justify-start rounded-xl border-[#61dbf2] text-[#61dbf2] hover:bg-cyan-50 shadow-md transition-all duration-200">
                      <User className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/create">
                    <Button variant="outline" className="w-full justify-start rounded-xl border-[#61dbf2] text-[#61dbf2] hover:bg-cyan-50 shadow-md transition-all duration-200">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Create Post
                    </Button>
                  </Link>
                  <Link href="/subscription">
                    <Button variant="outline" className="w-full justify-start rounded-xl border-[#61dbf2] text-[#61dbf2] hover:bg-cyan-50 shadow-md transition-all duration-200">
                      <Crown className="w-4 h-4 mr-2" />
                      Subscription
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}