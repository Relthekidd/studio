'use client'
import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { supabaseAdmin } from '@/lib/supabase'
import Skeleton from './Skeleton'

export default function UploadsTable() {
  const [tracks, setTracks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const supabase = supabaseAdmin()
      const { data } = await supabase
        .from('tracks')
        .select('*')
        .order('created_at', { ascending: false })
      setTracks(data || [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading)
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
    )

  return (
    <table className="w-full table-auto border-collapse">
      <thead>
        <tr className="border-b text-left">
          <th className="p-2">Title</th>
          <th className="p-2">Status</th>
        </tr>
      </thead>
      <tbody>
        {tracks.map((track) => (
          <tr key={track.id} className="border-b">
            <td className="p-2">{track.title}</td>
            <td className="p-2">
              <span
                className={clsx(
                  'rounded px-2 py-1 text-xs',
                  track.is_published
                    ? 'bg-green-600 text-white'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                {track.is_published ? 'Published' : 'Draft'}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
