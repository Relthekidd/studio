import Layout from '@/components/Layout'
import UploadTabs from '@/components/upload/UploadTabs'

export default function UploadPage() {
  return (
    <Layout>
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight">Upload Music</h1>
        <UploadTabs />
      </div>
    </Layout>
  )
}
