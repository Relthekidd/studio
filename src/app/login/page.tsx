
"use client";

import { useState } from 'react';
import Link from 'next/link';
import SectionTitle from '@/components/SectionTitle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { SonixLogo } from '@/components/icons/SonixLogo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); // true for login, false for sign up

  // TODO: Implement Firebase authentication
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isLogin) {
      // Firebase login logic
      alert(`Login attempt with: ${email}`);
    } else {
      // Firebase sign up logic
      alert(`Sign up attempt with: ${email}`);
    }
    // On success, redirect to home or dashboard: router.push('/');
  };

  return (
    <div className="container mx-auto p-4 md:p-6 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]"> {/* Adjust min-height if header/footer changes */}
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <Link href="/" className="inline-block mb-4">
            <SonixLogo className="h-10 w-auto mx-auto" />
          </Link>
          <CardTitle className="text-2xl">{isLogin ? 'Welcome Back!' : 'Create Account'}</CardTitle>
          <CardDescription>
            {isLogin ? 'Log in to continue to Sonix.' : 'Sign up to discover your new favorite music.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="mt-1"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="mt-1"
                placeholder="••••••••"
              />
            </div>
            {!isLogin && (
                 <div>
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input 
                        id="confirm-password" 
                        type="password" 
                        required={!isLogin}
                        className="mt-1"
                        placeholder="••••••••"
                    />
                </div>
            )}
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              {isLogin ? 'Log In' : 'Sign Up'}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="text-sm">
              {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Log In'}
            </Button>
          </div>
           {/* TODO: Add OAuth buttons (Google, Apple, etc.) */}
        </CardContent>
      </Card>
    </div>
  );
}
