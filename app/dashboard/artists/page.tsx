'use client';
import Layout from '@/components/Layout';
import ArtistsTable from '@/components/ArtistsTable';

export default function ArtistsPage() {
  return (
    <Layout>
      <h1 className="mb-4 text-xl font-bold">Artists</h1>
      <ArtistsTable />
    </Layout>
  );
}
