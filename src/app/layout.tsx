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
    <html lang="en" className="h-full dark">
      <body
        className={cn(
          'h-full font-sans antialiased',
          fontSans.variable,
          fontMono.variable
        )}
      >
        <div className="min-h-screen flex flex-col bg-background">
          <AuthProvider>
            <ClientLayout>
              <main className="flex-grow overflow-y-auto">
                {children}
              </main>
            </ClientLayout>
            <Toaster />
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
