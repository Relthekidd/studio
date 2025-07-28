'use client'
import { useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useSupabaseAuth } from '@/contexts/SupabaseAuthProvider'

export default function LoginPage() {
  const { user } = useSupabaseAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) {
    router.replace('/dashboard')
  }

  const onSubmit = async () => {
    setLoading(true)
    const supabase = supabaseBrowser()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (!error) router.push('/dashboard')
    else alert(error.message)
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-2">
        <input
          className="w-full rounded border p-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full rounded border p-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={onSubmit}
          disabled={loading}
          className="w-full rounded bg-primary px-4 py-2 text-primary-foreground"
        >
          Log in
        </button>
      </div>
    </div>
  )
}
