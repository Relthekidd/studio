'use client';
import { useEffect, useState } from 'react';
import { supabaseAdmin } from '@/lib/supabase';

export default function ArtistsTable() {
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const supabase = supabaseAdmin();
      const { data } = await supabase.from('artists').select('*');
      setArtists(data || []);
      setLoading(false);
    };
    load();
  }, []);

  const addArtist = async () => {
    if (!name) return;
    setSaving(true);
    const supabase = supabaseAdmin();
    const { data, error } = await supabase.from('artists').insert({ name }).select().single();
    if (!error && data) setArtists((a) => [...a, data]);
    setName('');
    setSaving(false);
  };

  if (loading) return <div>Loading artists...</div>;

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Artist name"
          className="flex-1 rounded border p-2"
        />
        <button
          onClick={addArtist}
          disabled={saving}
          className="rounded bg-primary px-3 text-primary-foreground"
        >
          Add
        </button>
      </div>
      <ul className="space-y-1">
        {artists.map((artist) => (
          <li key={artist.id} className="border-b p-2">
            {artist.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
