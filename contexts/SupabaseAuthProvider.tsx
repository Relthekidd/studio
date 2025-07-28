'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabaseBrowser } from '@/lib/supabase'

type AuthContextType = {
  user: User | null
  loading: boolean
  isAdmin: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const SupabaseAuthProvider = ({ children }: { children: ReactNode }) => {
  const supabase = supabaseBrowser()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      handleSession(session)
    })
    supabase.auth.getSession().then(({ data }) => handleSession(data.session))
    return () => {
      listener.subscription.unsubscribe()
    }
  }, [supabase])

  const handleSession = (session: Session | null) => {
    const currentUser = session?.user ?? null
    setUser(currentUser)
    setIsAdmin((currentUser?.user_metadata as any)?.role === 'admin')
    setLoading(false)
  }

  const logout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useSupabaseAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useSupabaseAuth must be used within provider')
  return ctx
}
