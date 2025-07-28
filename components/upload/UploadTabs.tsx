'use client'
import * as Tabs from '@radix-ui/react-tabs'
import { motion } from 'framer-motion'
import UploadSingleForm from './UploadSingleForm'
import UploadAlbumForm from './UploadAlbumForm'

export default function UploadTabs() {
  return (
    <Tabs.Root defaultValue="single" className="w-full space-y-4">
      <Tabs.List className="flex w-fit rounded-md bg-muted p-1 text-muted-foreground">
        <Tabs.Trigger
          value="single"
          className="rounded-sm px-3 py-1 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground"
        >
          Upload Single
        </Tabs.Trigger>
        <Tabs.Trigger
          value="album"
          className="rounded-sm px-3 py-1 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground"
        >
          Upload Album
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="single">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-card/50 p-4 shadow backdrop-blur"
        >
          <UploadSingleForm />
        </motion.div>
      </Tabs.Content>
      <Tabs.Content value="album">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-card/50 p-4 shadow backdrop-blur"
        >
          <UploadAlbumForm />
        </motion.div>
      </Tabs.Content>
    </Tabs.Root>
  )
}
