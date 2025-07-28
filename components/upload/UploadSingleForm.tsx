'use client'
import { useEffect, useState, useTransition } from 'react'
import { supabaseBrowser } from '@/lib/supabase'
import { uploadSingleAction } from '@/app/actions/upload'
import { Image as ImageIcon, FileAudio, CalendarDays } from 'lucide-react'

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
  const [description, setDescription] = useState('')
  const [lyrics, setLyrics] = useState('')
  const [releaseDate, setReleaseDate] = useState('')
  const [albumId, setAlbumId] = useState('')
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
    formData.append('description', description)
    formData.append('lyrics', lyrics)
    formData.append('releaseDate', releaseDate)
    formData.append('albumId', albumId)
    formData.append('audio', audio)
    formData.append('cover', cover)
    startTransition(() => uploadSingleAction(formData))
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="relative">
        <input
          id="title"
          required
          placeholder=" "
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="peer w-full rounded-md border bg-background/60 p-2 pt-6 backdrop-blur"
        />
        <label
          htmlFor="title"
          className="absolute left-2 top-2 text-xs text-muted-foreground transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs"
        >
          Song Title
        </label>
      </div>
      <div className="relative">
        <input
          id="artist"
          list="artist-list"
          placeholder=" "
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          className="peer w-full rounded-md border bg-background/60 p-2 pt-6 backdrop-blur"
        />
        <label
          htmlFor="artist"
          className="absolute left-2 top-2 text-xs text-muted-foreground transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs"
        >
          Artist
        </label>
        <datalist id="artist-list">
          {artists.map((a) => (
            <option key={a.id} value={a.name} />
          ))}
        </datalist>
      </div>
      <div>
        <input
          id="cover"
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0] || null
            setCover(file)
            if (file) setCoverUrl(URL.createObjectURL(file))
          }}
        />
        <label
          htmlFor="cover"
          className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground"
        >
          {coverUrl ? (
            <img src={coverUrl} alt="Preview" className="h-full w-full rounded object-cover" />
          ) : (
            <span className="flex flex-col items-center gap-2"><ImageIcon className="h-6 w-6" /> Drop cover image</span>
          )}
        </label>
      </div>
      <div>
        <input
          id="audio"
          type="file"
          accept="audio/*"
          hidden
          onChange={(e) => setAudio(e.target.files?.[0] || null)}
        />
        <label
          htmlFor="audio"
          className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed p-4 text-sm text-muted-foreground"
        >
          <FileAudio className="h-5 w-5" /> {audio ? audio.name : 'Upload audio file'}
        </label>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="relative">
          <input
            id="genre"
            placeholder=" "
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="peer w-full rounded-md border bg-background/60 p-2 pt-6 backdrop-blur"
          />
          <label
            htmlFor="genre"
            className="absolute left-2 top-2 text-xs text-muted-foreground transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs"
          >
            Genre
          </label>
        </div>
        <div className="relative">
          <input
            id="mood"
            placeholder=" "
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="peer w-full rounded-md border bg-background/60 p-2 pt-6 backdrop-blur"
          />
          <label
            htmlFor="mood"
            className="absolute left-2 top-2 text-xs text-muted-foreground transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs"
          >
            Mood
          </label>
        </div>
      </div>
      <div className="relative">
        <textarea
          id="description"
          placeholder=" "
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="peer w-full rounded-md border bg-background/60 p-2 pt-6 backdrop-blur"
        />
        <label
          htmlFor="description"
          className="absolute left-2 top-2 text-xs text-muted-foreground transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs"
        >
          Description
        </label>
      </div>
      <div className="relative">
        <textarea
          id="lyrics"
          placeholder=" "
          value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
          className="peer w-full rounded-md border bg-background/60 p-2 pt-6 backdrop-blur"
        />
        <label
          htmlFor="lyrics"
          className="absolute left-2 top-2 text-xs text-muted-foreground transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs"
        >
          Lyrics
        </label>
      </div>
      <div className="relative">
        <input
          id="releaseDate"
          type="date"
          placeholder=" "
          value={releaseDate}
          onChange={(e) => setReleaseDate(e.target.value)}
          className="peer w-full rounded-md border bg-background/60 p-2 pt-6 backdrop-blur"
        />
        <label
          htmlFor="releaseDate"
          className="absolute left-2 top-2 flex items-center gap-1 text-xs text-muted-foreground transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs"
        >
          <CalendarDays className="h-4 w-4" /> Release Date
        </label>
      </div>
      <div className="relative">
        <input
          id="albumId"
          placeholder=" "
          value={albumId}
          onChange={(e) => setAlbumId(e.target.value)}
          className="peer w-full rounded-md border bg-background/60 p-2 pt-6 backdrop-blur"
        />
        <label
          htmlFor="albumId"
          className="absolute left-2 top-2 text-xs text-muted-foreground transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs"
        >
          Album ID (optional)
        </label>
      </div>
      <button
        disabled={pending}
        className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
      >
        {pending ? 'Uploading…' : 'Upload'}
      </button>
    </form>
  )
}
