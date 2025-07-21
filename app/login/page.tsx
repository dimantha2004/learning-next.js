'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      toast.success('Welcome back!');
      router.push('/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#61dbf2]/20 via-white to-[#61dbf2]/40 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center space-x-2 text-[#61dbf2] hover:text-cyan-900 transition-colors mb-4 font-semibold">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight drop-shadow-lg">Welcome Back</h1>
          <p className="text-lg text-gray-600">Sign in to your account to continue</p>
        </div>

        <Card className="shadow-2xl rounded-3xl border-0 bg-white/70 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_8px_32px_0_rgba(97,219,242,0.25)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-[#61dbf2]">Sign In</CardTitle>
            <CardDescription className="text-gray-500">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="rounded-xl border-gray-300 focus:border-[#61dbf2] focus:ring-2 focus:ring-[#61dbf2]/30 text-base px-4 py-2 transition-all duration-200 shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-base font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="rounded-xl border-gray-300 focus:border-[#61dbf2] focus:ring-2 focus:ring-[#61dbf2]/30 text-base px-4 py-2 transition-all duration-200 shadow-sm"
                />
              </div>

              <Button type="submit" className="w-full py-3 text-lg font-semibold rounded-xl bg-gradient-to-r from-[#61dbf2] to-cyan-600 hover:from-cyan-600 hover:to-cyan-800 shadow-lg transition-all duration-200 transform hover:-translate-y-1 hover:scale-105 focus:ring-4 focus:ring-[#61dbf2]/30" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-base text-gray-600">
                Don't have an account?{' '}
                <Link href="/register" className="text-[#61dbf2] hover:text-cyan-900 font-semibold underline underline-offset-2 transition-colors">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}