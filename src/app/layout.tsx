import './globals.css';
import { Inter, JetBrains_Mono } from 'next/font/google';

import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import ClientLayout from '@/components/layout/ClientLayout';
import { AuthProvider } from '@/contexts/AuthProvider';

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata = {
  title: 'Sonix',
  description: 'Music streaming app built with Next.js + Firebase',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={cn('h-full font-sans antialiased', fontSans.variable, fontMono.variable)}>
        {/*
          ✅ Ensure scroll works across desktop and mobile
          - Sets full height layout with scrollable content
          - Applies Tailwind classes to allow vertical scrolling
          - Works for both light and dark modes
          - Prevents layout shift and hidden overflow issues
          - Fixes hydration mismatch bugs by not using window-specific logic in SSR
        */}
        <div className="flex min-h-screen flex-col bg-background">
          <AuthProvider>
            <ClientLayout>{children}</ClientLayout>
            <Toaster />
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
