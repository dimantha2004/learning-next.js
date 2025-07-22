'use client';

import { useState, useEffect } from 'react';
import { usePosts } from '@/contexts/PostContext';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import PostCard from '@/components/PostCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Crown, Star } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { posts } = usePosts();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState(posts);
  const [filter, setFilter] = useState<'all' | 'free' | 'premium'>('all');

  const hasActiveSubscription = user?.subscription?.status === 'active';
  const isPremium = (user as any)?.is_premium;

  useEffect(() => {
    let result = searchQuery
      ? posts.filter(post =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : posts;
    if (filter === 'free') {
      result = result.filter(post => post.visibility === 'free');
    } else if (filter === 'premium') {
      result = result.filter(post => post.visibility === 'premium');
    }
    setFilteredPosts(result);
  }, [posts, searchQuery, filter]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#61dbf2]/20 via-white to-[#61dbf2]/40">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#61dbf2]/30 via-white/80 to-[#61dbf2]/40 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#61dbf2]/20 via-white/0 to-transparent pointer-events-none"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight drop-shadow-xl">
            Welcome to <span className="text-[#61dbf2]">Bloggers hub</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-2xl mx-auto font-medium">
            Discover amazing content from our community of writers. Join our premium membership for exclusive access to advanced articles and insights.
          </p>
          {!user && (
            <div className="flex items-center justify-center space-x-4 animate-fade-in">
              <Link href="/register">
                <Button size="lg" className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-[#61dbf2] to-cyan-600 hover:from-cyan-600 hover:to-cyan-800 shadow-lg transition-all duration-200 transform hover:-translate-y-1 hover:scale-105 focus:ring-4 focus:ring-[#61dbf2]/30">
                  <Star className="w-5 h-5" />
                  <span>Get Started Free</span>
                </Button>
              </Link>
              <Link href="/subscription">
                <Button size="lg" variant="outline" className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 border-yellow-500 hover:from-yellow-500 hover:to-yellow-600 shadow-lg transition-all duration-200">
                  <Crown className="w-5 h-5 text-yellow-700" />
                  <span>Go Premium</span>
                </Button>
              </Link>
            </div>
          )}
          {user && isPremium && (
            <div className="flex items-center justify-center mt-4 animate-fade-in">
              <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 shadow-md">
                <Crown className="w-4 h-4 mr-1 text-yellow-700" />
                Premium Member
              </Badge>
            </div>
          )}
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                size="sm"
              >
                All Posts
              </Button>
              <Button
                variant={filter === 'free' ? 'default' : 'outline'}
                onClick={() => setFilter('free')}
                size="sm"
              >
                Free
              </Button>
              <Button
                variant={filter === 'premium' ? 'default' : 'outline'}
                onClick={() => setFilter('premium')}
                size="sm"
                className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 border-yellow-500 hover:from-yellow-500 hover:to-yellow-600"
              >
                <Crown className="w-4 h-4 text-yellow-700" />
                <span>Premium</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <main className="container mx-auto px-4 py-12">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              {searchQuery ? 'No posts found' : 'No posts yet'}
            </h3>
            <p className="text-gray-600 mb-8">
              {searchQuery 
                ? `No posts match "${searchQuery}". Try a different search term.`
                : 'Be the first to create a post!'
              }
            </p>
            {user && (
              <Link href="/create">
                <Button className="rounded-xl bg-gradient-to-r from-[#61dbf2] to-cyan-600 hover:from-cyan-600 hover:to-cyan-800 shadow-lg transition-all duration-200 transform hover:-translate-y-1 hover:scale-105 focus:ring-4 focus:ring-[#61dbf2]/30">Create Your First Post</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredPosts.map((post) => (
              <div className="transition-all duration-200 hover:scale-[1.025] hover:shadow-2xl rounded-2xl">
                <PostCard key={post.id} post={post} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}