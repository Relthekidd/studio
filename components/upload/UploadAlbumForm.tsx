'use client'
import { useEffect, useState, useTransition } from 'react'
import { supabaseBrowser } from '@/lib/supabase'
import { uploadAlbumAction } from '@/app/actions/upload'
import { Image as ImageIcon, FileAudio, CalendarDays } from 'lucide-react'

interface Artist { id: string; name: string }
interface Track { title: string; file: File | null; lyrics: string }

export default function UploadAlbumForm() {
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [artists, setArtists] = useState<Artist[]>([])
  const [cover, setCover] = useState<File | null>(null)
  const [releaseDate, setReleaseDate] = useState('')
  const [genre, setGenre] = useState('')
  const [description, setDescription] = useState('')
  const [albumId, setAlbumId] = useState('')
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
    formData.append('description', description)
    formData.append('albumId', albumId)
    formData.append('releaseDate', releaseDate)
    formData.append('cover', cover)
    formData.append('tracks', JSON.stringify(tracks.map(({ title, lyrics }) => ({ title, lyrics }))))
    tracks.forEach((t, i) => {
      if (t.file) formData.append(`file_${i}`, t.file)
    })
    startTransition(() => uploadAlbumAction(formData))
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
          Album Title
        </label>
      </div>
      <div className="relative">
        <input
          id="artist"
          list="artist-album-list"
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
        <datalist id="artist-album-list">
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
          onChange={(e) => setCover(e.target.files?.[0] || null)}
        />
        <label
          htmlFor="cover"
          className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground"
        >
          {cover ? (
            <span>{cover.name}</span>
          ) : (
            <span className="flex flex-col items-center gap-2"><ImageIcon className="h-6 w-6" /> Cover Image</span>
          )}
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
          Album ID
        </label>
      </div>
      <div className="space-y-2">
        {tracks.map((track, i) => (
          <div key={i} className="rounded-md bg-muted/50 p-3">
            <div className="relative mb-2">
              <input
                id={`title_${i}`}
                required
                placeholder=" "
                value={track.title}
                onChange={(e) => updateTrack(i, 'title', e.target.value)}
                className="peer w-full rounded-md border bg-background/60 p-2 pt-6 backdrop-blur"
              />
              <label
                htmlFor={`title_${i}`}
                className="absolute left-2 top-2 text-xs text-muted-foreground transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs"
              >
                Track Title
              </label>
            </div>
            <input
              id={`file_${i}`}
              type="file"
              accept="audio/*"
              hidden
              onChange={(e) => updateTrack(i, 'file', e.target.files?.[0] || null)}
            />
            <label
              htmlFor={`file_${i}`}
              className="mb-2 flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed p-2 text-sm text-muted-foreground"
            >
              <FileAudio className="h-4 w-4" /> {track.file ? track.file.name : 'Audio File'}
            </label>
            <textarea
              placeholder="Lyrics"
              value={track.lyrics}
              onChange={(e) => updateTrack(i, 'lyrics', e.target.value)}
              className="w-full rounded-md border bg-background/60 p-2 backdrop-blur"
            />
          </div>
        ))}
        <button type="button" onClick={addTrack} className="text-sm underline">
          + Add Another Song
        </button>
      </div>
      <button
        disabled={pending}
        className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
      >
        {pending ? 'Uploading…' : 'Upload Album'}
      </button>
    </form>
  )
}
