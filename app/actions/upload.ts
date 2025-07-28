'use server'

import slugify from 'slugify'
import { supabaseAdmin } from '@/lib/supabase'

export async function uploadSingleAction(formData: FormData) {
  const supabase = supabaseAdmin()
  const title = formData.get('title') as string
  const artist = formData.get('artist') as string
  const genre = formData.get('genre') as string
  const mood = formData.get('mood') as string
  const lyrics = formData.get('lyrics') as string
  const releaseDate = formData.get('releaseDate') as string
  const albumId = formData.get('albumId') as string | null
  const published = formData.get('published') === 'on'
  const audio = formData.get('audio') as File | null
  const cover = formData.get('cover') as File | null
  if (!audio || !cover) return
  const slug = slugify(title, { lower: true })
  const audioPath = `${Date.now()}-${audio.name}`
  const coverPath = `${Date.now()}-${cover.name}`
  await supabase.storage.from('audio-files').upload(audioPath, audio)
  await supabase.storage.from('images').upload(coverPath, cover)
  await supabase.from('tracks').insert({
    title,
    slug,
    artist_name: artist,
    genre,
    mood,
    lyrics,
    release_date: releaseDate || null,
    audio_path: audioPath,
    cover_path: coverPath,
    album_id: albumId || null,
    is_published: published,
  })
  return { success: true }
}

export async function uploadAlbumAction(formData: FormData) {
  const supabase = supabaseAdmin()
  const title = formData.get('title') as string
  const artist = formData.get('artist') as string
  const genre = formData.get('genre') as string
  const releaseDate = formData.get('releaseDate') as string
  const description = formData.get('description') as string
  const published = formData.get('published') === 'on'
  const cover = formData.get('cover') as File | null
  const tracksMeta = JSON.parse(formData.get('tracks') as string) as {
    title: string
    lyrics: string
  }[]
  const files: File[] = tracksMeta.map((_, i) => formData.get(`file_${i}`) as File)
  if (!cover || files.some((f) => !f)) return
  const slug = slugify(title, { lower: true })
  const coverPath = `${Date.now()}-${cover.name}`
  await supabase.storage.from('images').upload(coverPath, cover)
  const { data: album } = await supabase
    .from('albums')
    .insert({
      title,
      slug,
      artist_name: artist,
      genre,
      description,
      release_date: releaseDate || null,
      cover_path: coverPath,
      is_published: published,
    })
    .select()
    .single()
  if (!album) return
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const meta = tracksMeta[i]
    const audioPath = `${Date.now()}-${file.name}`
    await supabase.storage.from('audio-files').upload(audioPath, file)
    await supabase.from('tracks').insert({
      title: meta.title,
      lyrics: meta.lyrics,
      audio_path: audioPath,
      album_id: album.id,
      artist_name: artist,
      is_published: published,
    })
  }
  return { success: true }
}
