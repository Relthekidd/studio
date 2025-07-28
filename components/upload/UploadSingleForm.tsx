'use client'
import { useEffect, useState, useTransition } from 'react'
import { supabaseBrowser } from '@/lib/supabase'
import { uploadSingleAction } from '@/app/dashboard/upload/actions'

interface Artist { id: string; name: string }

export default function UploadSingleForm() {
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [artists, setArtists] = useState<Artist[]>([])
  const [cover, setCover] = useState<File | null>(null)
  const [coverUrl, setCoverUrl] = useState<string | null>(null)
  const [audio, setAudio] = useState<File | null>(null)
  const [genre, setGenre] = useState('')
  const [mood, setMood] = useState('')
  const [lyrics, setLyrics] = useState('')
  const [releaseDate, setReleaseDate] = useState('')
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    const loadArtists = async () => {
      const supabase = supabaseBrowser()
      const { data } = await supabase.from('artists').select('id,name')
      setArtists(data || [])
    }
    loadArtists()
  }, [])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!cover || !audio) return
    const formData = new FormData()
    formData.append('title', title)
    formData.append('artist', artist)
    formData.append('genre', genre)
    formData.append('mood', mood)
    formData.append('lyrics', lyrics)
    formData.append('releaseDate', releaseDate)
    formData.append('audio', audio)
    formData.append('cover', cover)
    startTransition(() => uploadSingleAction(formData))
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input
        required
        type="text"
        placeholder="Song title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded-md border bg-background/60 p-2 backdrop-blur"
      />
      <input
        list="artist-list"
        placeholder="Artist name"
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
        className="w-full rounded-md border bg-background/60 p-2 backdrop-blur"
      />
      <datalist id="artist-list">
        {artists.map((a) => (
          <option key={a.id} value={a.name} />
        ))}
      </datalist>
      <input
        required
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0] || null
          setCover(file)
          if (file) setCoverUrl(URL.createObjectURL(file))
        }}
      />
      {coverUrl && (
        <img
          src={coverUrl}
          alt="Preview"
          className="h-32 w-32 rounded object-cover"
        />
      )}
      <input
        required
        type="file"
        accept="audio/*"
        onChange={(e) => setAudio(e.target.files?.[0] || null)}
      />
      <input
        type="text"
        placeholder="Genre"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
        className="w-full rounded-md border bg-background/60 p-2 backdrop-blur"
      />
      <input
        type="text"
        placeholder="Mood (optional)"
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        className="w-full rounded-md border bg-background/60 p-2 backdrop-blur"
      />
      <textarea
        placeholder="Lyrics"
        value={lyrics}
        onChange={(e) => setLyrics(e.target.value)}
        className="w-full rounded-md border bg-background/60 p-2 backdrop-blur"
      />
      <input
        type="date"
        value={releaseDate}
        onChange={(e) => setReleaseDate(e.target.value)}
        className="w-full rounded-md border bg-background/60 p-2 backdrop-blur"
      />
      <button
        disabled={pending}
        className="rounded-md bg-primary px-4 py-2 text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
      >
        {pending ? 'Uploading…' : 'Upload'}
      </button>
    </form>
  )
}
