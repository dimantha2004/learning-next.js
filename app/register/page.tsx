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

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const result = await register(email, password, name);
    if (result.success) {
      toast.success('Account created successfully!');
      router.push('/dashboard');
    } else {
      setError(result.error || 'Registration failed');
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
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight drop-shadow-lg">Get Started</h1>
          <p className="text-lg text-gray-600">Create your account to start blogging</p>
        </div>

        <Card className="shadow-2xl rounded-3xl border-0 bg-white/70 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_8px_32px_0_rgba(97,219,242,0.25)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-[#61dbf2]">Create Account</CardTitle>
            <CardDescription className="text-gray-500">
              Join our community of writers and readers
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
                <Label htmlFor="name" className="text-base font-medium">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="rounded-xl border-gray-300 focus:border-[#61dbf2] focus:ring-2 focus:ring-[#61dbf2]/30 text-base px-4 py-2 transition-all duration-200 shadow-sm"
                />
              </div>

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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-base font-medium">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="rounded-xl border-gray-300 focus:border-[#61dbf2] focus:ring-2 focus:ring-[#61dbf2]/30 text-base px-4 py-2 transition-all duration-200 shadow-sm"
                />
              </div>

              <Button type="submit" className="w-full py-3 text-lg font-semibold rounded-xl bg-gradient-to-r from-[#61dbf2] to-cyan-600 hover:from-cyan-600 hover:to-cyan-800 shadow-lg transition-all duration-200 transform hover:-translate-y-1 hover:scale-105 focus:ring-4 focus:ring-[#61dbf2]/30" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating account...</span>
                  </div>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-base text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-[#61dbf2] hover:text-cyan-900 font-semibold underline underline-offset-2 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}