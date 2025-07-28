import Layout from '@/components/Layout'
import UploadForm from '@/components/UploadForm'

export default function UploadPage() {
  return (
    <Layout>
      <h1 className="mb-4 text-xl font-bold">Upload Song</h1>
      <UploadForm />
    </Layout>
  )
}
