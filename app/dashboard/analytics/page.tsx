import Layout from '@/components/Layout'
import { motion } from 'framer-motion'
import Skeleton from '@/components/Skeleton'

export default function AnalyticsPage() {
  return (
    <Layout>
      <h1 className="mb-4 text-xl font-bold">Analytics</h1>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </motion.div>
    </Layout>
  )
}
