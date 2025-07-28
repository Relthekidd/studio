'use client'
import { useEffect, useState } from 'react'
import { supabaseAdmin } from '@/lib/supabase'
import Skeleton from './Skeleton'
import { Check, X } from 'lucide-react'
import * as Tooltip from '@radix-ui/react-tooltip'
import { motion } from 'framer-motion'

export default function VerifyArtistsTable() {
  const [artists, setArtists] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const supabase = supabaseAdmin()
      const { data } = await supabase.from('artists').select('*').eq('approved', false)
      setArtists(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const approve = async (id: string) => {
    const supabase = supabaseAdmin()
    await supabase.from('artists').update({ approved: true }).eq('id', id)
    setArtists((a) => a.filter((ar) => ar.id !== id))
  }

  const reject = async (id: string) => {
    const supabase = supabaseAdmin()
    await supabase.from('artists').delete().eq('id', id)
    setArtists((a) => a.filter((ar) => ar.id !== id))
  }

  if (loading)
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
    )

  return (
    <motion.table
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full table-auto border-collapse"
    >
      <thead>
        <tr className="border-b text-left">
          <th className="p-2">Name</th>
          <th className="p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {artists.map((artist) => (
          <tr key={artist.id} className="border-b">
            <td className="p-2">{artist.name}</td>
            <td className="p-2 space-x-2">
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    onClick={() => approve(artist.id)}
                    className="rounded bg-green-600 p-1 text-white hover:opacity-80"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Content className="rounded bg-muted px-2 py-1 text-xs">
                  Approve
                </Tooltip.Content>
              </Tooltip.Root>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    onClick={() => reject(artist.id)}
                    className="rounded bg-red-600 p-1 text-white hover:opacity-80"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Content className="rounded bg-muted px-2 py-1 text-xs">
                  Reject
                </Tooltip.Content>
              </Tooltip.Root>
            </td>
          </tr>
        ))}
      </tbody>
    </motion.table>
  )
}
