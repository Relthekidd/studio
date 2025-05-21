
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter
import SectionTitle from '@/components/SectionTitle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { SonixLogo } from '@/components/icons/SonixLogo';
import { useToast } from "@/hooks/use-toast";

// Accept onLogin as a prop
export default function LoginPage({ onLogin }: { onLogin?: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isLogin && password !== confirmPassword) {
      toast({
        title: "Sign Up Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    // Simulate Firebase authentication
    console.log(`${isLogin ? 'Login' : 'Sign up'} attempt with: ${email}`);
    
    if (onLogin) {
      onLogin(); // Call the onLogin prop passed from ClientLayout (sets auth state)
      toast({
        title: isLogin ? "Login Successful" : "Sign Up Successful",
        description: `Welcome ${email}! Redirecting...`,
      });
      // ClientLayout's useEffect will now handle the redirect based on isAuthenticated state change.
      // No router.push('/') or router.refresh() here.
    } else {
      // Fallback if onLogin is not provided (e.g. direct navigation, less ideal)
      // This relies on ClientLayout's localStorage check after navigation
      console.warn("LoginPage handleSubmit: onLogin prop was not provided. Using fallback auth logic.");
      localStorage.setItem('isMockAuthenticated', 'true');
      toast({
        title: isLogin ? "Login Successful (fallback)" : "Sign Up Successful (fallback)",
        description: `Welcome ${email}! Redirecting via fallback...`,
      });
      router.push('/'); // Fallback pushes to home
      router.refresh(); // and refreshes to trigger ClientLayout's auth check
    }
  };
  
  // Effect to check if already authenticated (e.g. browser back after login, or direct URL nav)
  // This is a secondary check; ClientLayout is the primary handler.
  useEffect(() => {
    if (localStorage.getItem('isMockAuthenticated') === 'true') {
      // If ClientLayout hasn't redirected yet and this page loads for an auth'd user,
      // send them to home. ClientLayout will also do this, but this can be quicker.
      if (window.location.pathname === '/login') { // Only replace if still on /login
         router.replace('/'); 
      }
    }
  }, [router]);


  return (
    <div className="container mx-auto p-4 md:p-6 flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background via-card to-background">
      <Card className="w-full max-w-md shadow-2xl bg-card/80 backdrop-blur-sm animate-fadeIn">
        <CardHeader className="text-center">
          <Link href="/" className="inline-block mb-6">
            <SonixLogo className="h-12 w-auto mx-auto" />
          </Link>
          <CardTitle className="text-3xl font-bold">{isLogin ? 'Welcome Back' : 'Create Your Account'}</CardTitle>
          <CardDescription className="text-muted-foreground">
            {isLogin ? 'Enter your credentials to access Sonix.' : 'Join Sonix to discover a universe of music.'}
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
                className="mt-1 bg-input/70 focus:bg-input"
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
                className="mt-1 bg-input/70 focus:bg-input"
                placeholder="••••••••"
              />
            </div>
            {!isLogin && (
                 <div>
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input 
                        id="confirm-password" 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required={!isLogin}
                        className="mt-1 bg-input/70 focus:bg-input"
                        placeholder="••••••••"
                    />
                </div>
            )}
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-base font-semibold transition-transform active:scale-95">
              {isLogin ? 'Log In' : 'Sign Up'}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="text-sm text-accent hover:text-accent/80">
              {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Log In'}
            </Button>
          </div>
           {/* TODO: Add OAuth buttons (Google, Apple, etc.) with icons */}
        </CardContent>
      </Card>
    </div>
  );
}

