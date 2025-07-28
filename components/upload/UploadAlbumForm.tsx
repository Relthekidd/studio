'use client'
import { useEffect, useState, useTransition } from 'react'
import { supabaseBrowser } from '@/lib/supabase'
import { uploadAlbumAction } from '@/app/dashboard/upload/actions'

interface Artist { id: string; name: string }
interface Track { title: string; file: File | null; lyrics: string }

export default function UploadAlbumForm() {
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [artists, setArtists] = useState<Artist[]>([])
  const [cover, setCover] = useState<File | null>(null)
  const [releaseDate, setReleaseDate] = useState('')
  const [genre, setGenre] = useState('')
  const [tracks, setTracks] = useState<Track[]>([{ title: '', file: null, lyrics: '' }])
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    const loadArtists = async () => {
      const supabase = supabaseBrowser()
      const { data } = await supabase.from('artists').select('id,name')
      setArtists(data || [])
    }
    loadArtists()
  }, [])

  const addTrack = () => setTracks((t) => [...t, { title: '', file: null, lyrics: '' }])

  const updateTrack = (index: number, key: keyof Track, value: any) => {
    setTracks((t) => t.map((track, i) => (i === index ? { ...track, [key]: value } : track)))
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!cover || tracks.some((t) => !t.file)) return
    const formData = new FormData()
    formData.append('title', title)
    formData.append('artist', artist)
    formData.append('genre', genre)
    formData.append('releaseDate', releaseDate)
    formData.append('cover', cover)
    formData.append('tracks', JSON.stringify(tracks.map(({ title, lyrics }) => ({ title, lyrics }))))
    tracks.forEach((t, i) => {
      if (t.file) formData.append(`file_${i}`, t.file)
    })
    startTransition(() => uploadAlbumAction(formData))
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input
        required
        type="text"
        placeholder="Album title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded-md border bg-background/60 p-2 backdrop-blur"
      />
      <input
        list="artist-album-list"
        placeholder="Main artist"
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
        className="w-full rounded-md border bg-background/60 p-2 backdrop-blur"
      />
      <datalist id="artist-album-list">
        {artists.map((a) => (
          <option key={a.id} value={a.name} />
        ))}
      </datalist>
      <input
        required
        type="file"
        accept="image/*"
        onChange={(e) => setCover(e.target.files?.[0] || null)}
      />
      <input
        type="date"
        value={releaseDate}
        onChange={(e) => setReleaseDate(e.target.value)}
        className="w-full rounded-md border bg-background/60 p-2 backdrop-blur"
      />
      <input
        type="text"
        placeholder="Genre"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
        className="w-full rounded-md border bg-background/60 p-2 backdrop-blur"
      />
      <div className="space-y-2">
        {tracks.map((track, i) => (
          <div key={i} className="rounded-md bg-muted/50 p-3">
            <input
              required
              type="text"
              placeholder="Track title"
              value={track.title}
              onChange={(e) => updateTrack(i, 'title', e.target.value)}
              className="mb-2 w-full rounded-md border bg-background/60 p-2 backdrop-blur"
            />
            <input
              required
              type="file"
              accept="audio/*"
              onChange={(e) => updateTrack(i, 'file', e.target.files?.[0] || null)}
            />
            <textarea
              placeholder="Lyrics"
              value={track.lyrics}
              onChange={(e) => updateTrack(i, 'lyrics', e.target.value)}
              className="mt-2 w-full rounded-md border bg-background/60 p-2 backdrop-blur"
            />
          </div>
        ))}
        <button type="button" onClick={addTrack} className="text-sm underline">
          + Add Another Song
        </button>
      </div>
      <button
        disabled={pending}
        className="rounded-md bg-primary px-4 py-2 text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
      >
        {pending ? 'Uploading…' : 'Upload Album'}
      </button>
    </form>
  )
}
