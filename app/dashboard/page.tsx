'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { usePosts } from '@/contexts/PostContext';
import Header from '@/components/Header';
import PostCard from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, Crown, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const { getUserPosts } = usePosts();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

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

  const userPosts = getUserPosts(user.id);
  const totalPosts = userPosts.length;
  const premiumPosts = userPosts.filter(post => post.visibility === 'premium').length;
  const freePosts = userPosts.filter(post => post.visibility === 'free').length;
  const isPremium = (user as any)?.is_premium;
  const hasActiveSubscription = user.subscription?.status === 'active';
  const isPremiumUser = isPremium || hasActiveSubscription;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#61dbf2]/20 via-white to-[#61dbf2]/40">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight drop-shadow-lg">
                Welcome back, {user.user_metadata?.full_name || user.email}!
              </h1>
              <p className="text-gray-600 text-lg">Manage your posts and track your writing progress</p>
            </div>
            <div className="flex items-center space-x-4">
              {isPremiumUser && (
                <Badge className="bg-gradient-to-r from-cyan-300 to-cyan-400 text-cyan-900 shadow-md">
                  <Crown className="w-4 h-4 mr-1" />
                  Premium Member
                </Badge>
              )}
              <Link href="/create">
                <Button className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-[#61dbf2] to-cyan-600 hover:from-cyan-600 hover:to-cyan-800 shadow-lg transition-all duration-200 transform hover:-translate-y-1 hover:scale-105 focus:ring-4 focus:ring-[#61dbf2]/30">
                  <Plus className="w-4 h-4" />
                  <span>New Post</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-xl rounded-2xl bg-white/80 backdrop-blur-md border-0 transition-all duration-300 hover:shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <FileText className="h-4 w-4 text-[#61dbf2]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPosts}</div>
              <p className="text-xs text-muted-foreground">
                All your published posts
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-xl rounded-2xl bg-white/80 backdrop-blur-md border-0 transition-all duration-300 hover:shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Free Posts</CardTitle>
              <TrendingUp className="h-4 w-4 text-[#61dbf2]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{freePosts}</div>
              <p className="text-xs text-muted-foreground">
                Available to all readers
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-xl rounded-2xl bg-white/80 backdrop-blur-md border-0 transition-all duration-300 hover:shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Premium Posts</CardTitle>
              <Crown className="h-4 w-4 text-[#61dbf2]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{premiumPosts}</div>
              <p className="text-xs text-muted-foreground">
                Exclusive content
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-xl rounded-2xl bg-white/80 backdrop-blur-md border-0 transition-all duration-300 hover:shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account Status</CardTitle>
              <Crown className="h-4 w-4 text-[#61dbf2]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isPremiumUser ? 'Premium' : 'Free'}
              </div>
              <p className="text-xs text-muted-foreground">
                {isPremiumUser ? 'Full access' : 'Limited features'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Posts Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Posts</h2>
            {totalPosts > 0 && (
              <Link href="/create">
                <Button variant="outline" className="flex items-center space-x-2 rounded-xl border-[#61dbf2] text-[#61dbf2] hover:bg-cyan-50 shadow-md transition-all duration-200">
                  <Plus className="w-4 h-4" />
                  <span>Add New</span>
                </Button>
              </Link>
            )}
          </div>

          {totalPosts === 0 ? (
            <Card className="shadow-xl rounded-2xl bg-white/80 backdrop-blur-md border-0 transition-all duration-300 hover:shadow-2xl">
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No posts yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Start sharing your thoughts and ideas with the world
                  </p>
                  <Link href="/create">
                    <Button className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-[#61dbf2] to-cyan-600 hover:from-cyan-600 hover:to-cyan-800 shadow-lg transition-all duration-200 transform hover:-translate-y-1 hover:scale-105 focus:ring-4 focus:ring-[#61dbf2]/30">
                      <Plus className="w-4 h-4" />
                      <span>Create Your First Post</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {userPosts.map((post) => (
                <div className="transition-all duration-200 hover:scale-[1.025] hover:shadow-2xl rounded-2xl">
                  <PostCard key={post.id} post={post} showActions={true} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Premium Message for Premium Users */}
        {isPremiumUser && (
          <Card className="bg-gradient-to-r from-cyan-100 to-cyan-200 border-cyan-300 shadow-xl rounded-2xl backdrop-blur-md border-0 transition-all duration-300 hover:shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-cyan-800">
                <Crown className="w-5 h-5" />
                <span>Premium Member</span>
              </CardTitle>
              <CardDescription className="text-cyan-700">
                You have full access to all premium features and content.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Badge className="bg-gradient-to-r from-cyan-300 to-cyan-400 text-cyan-900 shadow-md">
                <Crown className="w-4 h-4 mr-1" />
                Premium Active
              </Badge>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}