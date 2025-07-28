'use client'
import { useSupabaseAuth } from '@/contexts/SupabaseAuthProvider'

export default function Header() {
  const { user, logout } = useSupabaseAuth()
  return (
    <header className="flex items-center justify-between border-b border-border p-4">
      <span className="font-semibold">Admin Dashboard</span>
      {user && (
        <button onClick={logout} className="text-sm underline">
          Logout
        </button>
      )}
    </header>
  )
}
