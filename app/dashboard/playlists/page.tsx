'use client';
import Layout from '@/components/Layout';
import PlaylistsTable from '@/components/PlaylistsTable';

export default function PlaylistsPage() {
  return (
    <Layout>
      <h1 className="mb-4 text-xl font-bold">Playlists</h1>
      <PlaylistsTable />
    </Layout>
  );
}
