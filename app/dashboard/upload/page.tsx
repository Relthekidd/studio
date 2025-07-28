import Layout from '@/components/Layout'
import UploadTabs from '@/components/upload/UploadTabs'

export default function UploadPage() {
  return (
    <Layout>
      <div className="mx-auto w-full max-w-3xl space-y-6 p-4">
        <header className="space-y-1">
          <h1 className="text-4xl font-bold">Upload Music</h1>
          <p className="text-muted-foreground">
            Add a new single or album to the platform
          </p>
        </header>
        <UploadTabs />
        <div className="mt-4 text-right">
          <a href="/dashboard/uploads" className="text-sm underline">
            View My Uploads
          </a>
        </div>
      </div>
    </Layout>
  )
}
