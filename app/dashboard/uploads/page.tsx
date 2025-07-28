import Layout from '@/components/Layout'
import UploadsTable from '@/components/UploadsTable'

export default function UploadsListPage() {
  return (
    <Layout>
      <h1 className="mb-4 text-xl font-bold">My Uploads</h1>
      <UploadsTable />
    </Layout>
  )
}
