'use client';
import { useEffect, useState } from 'react';
import { supabaseAdmin } from '@/lib/supabase';

export default function PlaylistsTable() {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const supabase = supabaseAdmin();
      const { data } = await supabase.from('playlists').select('*');
      setPlaylists(data || []);
      setLoading(false);
    };
    load();
  }, []);

  const addPlaylist = async () => {
    if (!name) return;
    setSaving(true);
    const supabase = supabaseAdmin();
    const { data, error } = await supabase.from('playlists').insert({ name }).select().single();
    if (!error && data) setPlaylists((p) => [...p, data]);
    setName('');
    setSaving(false);
  };

  if (loading) return <div>Loading playlists...</div>;

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Playlist name"
          className="flex-1 rounded border p-2"
        />
        <button
          onClick={addPlaylist}
          disabled={saving}
          className="rounded bg-primary px-3 text-primary-foreground"
        >
          Add
        </button>
      </div>
      <ul className="space-y-1">
        {playlists.map((pl) => (
          <li key={pl.id} className="border-b p-2">
            {pl.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
