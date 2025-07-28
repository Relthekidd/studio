import './globals.css'
import { SupabaseAuthProvider } from '@/contexts/SupabaseAuthProvider'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Admin Dashboard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SupabaseAuthProvider>{children}</SupabaseAuthProvider>
      </body>
    </html>
  )
}
