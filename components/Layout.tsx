'use client'
import { useSupabaseAuth } from '@/contexts/SupabaseAuthProvider'
import Sidebar from './Sidebar'
import Header from './Header'

export default function Layout({ children }: { children: React.ReactNode }) {
  const { loading } = useSupabaseAuth()
  if (loading) return <div className="p-4">Loading...</div>
  return (
    <div className="flex min-h-screen text-foreground">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  )
}
