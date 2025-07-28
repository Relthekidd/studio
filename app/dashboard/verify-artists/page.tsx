import Layout from '@/components/Layout'
import VerifyArtistsTable from '@/components/VerifyArtistsTable'

export default function VerifyArtistsPage() {
  return (
    <Layout>
      <h1 className="mb-4 text-xl font-bold">Verify Artists</h1>
      <VerifyArtistsTable />
    </Layout>
  )
}
