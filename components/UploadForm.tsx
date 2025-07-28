'use client'
import { useState } from 'react'
import { supabaseAdmin } from '@/lib/supabase'

export default function UploadForm() {
  const [title, setTitle] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)
    const supabase = supabaseAdmin()
    await supabase.storage.from('songs').upload(file.name, file)
    await supabase.from('songs').insert({ title, file_path: file.name })
    setLoading(false)
    setTitle('')
    setFile(null)
  }

  return (
    <div className="space-y-2">
      <input
        type="text"
        placeholder="Song title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded border p-2"
      />
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <button
        onClick={handleUpload}
        disabled={loading}
        className="rounded bg-primary px-4 py-2 text-primary-foreground"
      >
        Upload
      </button>
    </div>
  )
}
