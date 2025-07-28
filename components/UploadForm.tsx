'use client';
import { useState } from 'react';
import slugify from 'slugify';
import { supabaseAdmin } from '@/lib/supabase';

export default function UploadForm() {
  const [title, setTitle] = useState('');
  const [audio, setAudio] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const [releaseDate, setReleaseDate] = useState('');
  const [genre, setGenre] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!audio || !cover || !title) return;
    setLoading(true);
    const supabase = supabaseAdmin();
    const slug = slugify(title, { lower: true });
    const audioPath = `${Date.now()}-${audio.name}`;
    const coverPath = `${Date.now()}-${cover.name}`;
    await supabase.storage.from('songs').upload(audioPath, audio);
    await supabase.storage.from('covers').upload(coverPath, cover);
    await supabase.from('tracks').insert({
      title,
      slug,
      audio_path: audioPath,
      cover_path: coverPath,
      release_date: releaseDate || null,
      genre,
      lyrics,
    });
    setLoading(false);
    setTitle('');
    setAudio(null);
    setCover(null);
    setReleaseDate('');
    setGenre('');
    setLyrics('');
  };

  return (
    <div className="space-y-2">
      <input
        type="text"
        placeholder="Song title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded border p-2"
      />
      <input type="file" accept="audio/*" onChange={(e) => setAudio(e.target.files?.[0] ?? null)} />
      <input type="file" accept="image/*" onChange={(e) => setCover(e.target.files?.[0] ?? null)} />
      <input
        type="date"
        value={releaseDate}
        onChange={(e) => setReleaseDate(e.target.value)}
        className="w-full rounded border p-2"
      />
      <input
        type="text"
        placeholder="Genre"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
        className="w-full rounded border p-2"
      />
      <textarea
        placeholder="Lyrics"
        value={lyrics}
        onChange={(e) => setLyrics(e.target.value)}
        className="w-full rounded border p-2"
      />
      <button
        onClick={handleUpload}
        disabled={loading}
        className="rounded bg-primary px-4 py-2 text-primary-foreground"
      >
        {loading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
}
