'use client'

import { useEffect, useRef, useState } from 'react'
import { Plus, BookOpen, Loader2, Sparkles, Mic, MicOff, Video, VideoOff, Upload, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatDate, cn } from '@/lib/utils'
import type { JournalEntry } from '@/types'

const MOOD_CONFIG = {
  great: { emoji: '🌟', label: 'Great', color: 'bg-yellow-50 text-yellow-700' },
  good: { emoji: '😊', label: 'Good', color: 'bg-green-50 text-green-700' },
  neutral: { emoji: '😐', label: 'Neutral', color: 'bg-gray-50 text-gray-700' },
  difficult: { emoji: '😔', label: 'Difficult', color: 'bg-orange-50 text-orange-700' },
  crisis: { emoji: '🆘', label: 'Crisis', color: 'bg-red-50 text-red-700' },
}

function isVideo(url: string) {
  return /\.(mp4|mov|webm|mkv)(\?|$)/i.test(url) || url.includes('video')
}

interface PendingMedia {
  file: File
  previewUrl: string
  type: 'audio' | 'video'
}

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [newEntry, setNewEntry] = useState('')
  const [mood, setMood] = useState<string>('neutral')
  const [submitting, setSubmitting] = useState(false)
  const [children, setChildren] = useState<any[]>([])
  const [selectedChild, setSelectedChild] = useState('')

  // Media state
  const [pendingMedia, setPendingMedia] = useState<PendingMedia[]>([])
  const [recordingAudio, setRecordingAudio] = useState(false)
  const [recordingVideo, setRecordingVideo] = useState(false)
  const [uploadingMedia, setUploadingMedia] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [{ data: ch }, { data: e }] = await Promise.all([
        supabase.from('children').select('id, name').eq('profile_id', user.id).eq('is_active', true),
        supabase.from('journal_entries').select('*').eq('profile_id', user.id).order('created_at', { ascending: false }).limit(20),
      ])

      if (ch) { setChildren(ch); if (ch.length === 1) setSelectedChild(ch[0].id) }
      if (e) setEntries(e)
      setLoading(false)
    }
    load()
  }, [])

  function stopCurrentRecording() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream?.getTracks().forEach(t => t.stop())
    }
  }

  async function startAudioRecording() {
    if (recordingAudio) {
      stopCurrentRecording()
      setRecordingAudio(false)
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      chunksRef.current = []
      const mr = new MediaRecorder(stream)
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const file = new File([blob], `audio-${Date.now()}.webm`, { type: 'audio/webm' })
        const previewUrl = URL.createObjectURL(blob)
        setPendingMedia(prev => [...prev, { file, previewUrl, type: 'audio' }])
        setRecordingAudio(false)
      }
      mediaRecorderRef.current = mr
      mr.start()
      setRecordingAudio(true)
    } catch {
      alert('Microphone access denied.')
    }
  }

  async function startVideoRecording() {
    if (recordingVideo) {
      stopCurrentRecording()
      setRecordingVideo(false)
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream
        videoPreviewRef.current.play()
      }
      chunksRef.current = []
      const mr = new MediaRecorder(stream)
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' })
        const file = new File([blob], `video-${Date.now()}.webm`, { type: 'video/webm' })
        const previewUrl = URL.createObjectURL(blob)
        setPendingMedia(prev => [...prev, { file, previewUrl, type: 'video' }])
        setRecordingVideo(false)
        if (videoPreviewRef.current) videoPreviewRef.current.srcObject = null
      }
      mediaRecorderRef.current = mr
      mr.start()
      setRecordingVideo(true)
    } catch {
      alert('Camera/microphone access denied.')
    }
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    files.forEach(file => {
      const type = file.type.startsWith('video') ? 'video' : 'audio'
      const previewUrl = URL.createObjectURL(file)
      setPendingMedia(prev => [...prev, { file, previewUrl, type }])
    })
    e.target.value = ''
  }

  function removeMedia(index: number) {
    setPendingMedia(prev => {
      URL.revokeObjectURL(prev[index].previewUrl)
      return prev.filter((_, i) => i !== index)
    })
  }

  async function uploadMediaFiles(userId: string, entryId: string): Promise<string[]> {
    if (pendingMedia.length === 0) return []
    const supabase = createClient()
    const urls: string[] = []

    for (const item of pendingMedia) {
      const path = `${userId}/${entryId}/${item.file.name}`
      const { error } = await supabase.storage.from('journal-media').upload(path, item.file, { upsert: true })
      if (!error) {
        const { data } = supabase.storage.from('journal-media').getPublicUrl(path)
        urls.push(data.publicUrl)
      }
    }
    return urls
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!newEntry.trim() || !selectedChild) return
    setSubmitting(true)
    setUploadingMedia(pendingMedia.length > 0)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: entry, error } = await supabase.from('journal_entries').insert({
        child_id: selectedChild,
        profile_id: user.id,
        content: newEntry,
        mood,
      }).select().single()

      if (error) throw error

      let mediaUrls: string[] = []
      if (pendingMedia.length > 0) {
        mediaUrls = await uploadMediaFiles(user.id, entry.id)
        if (mediaUrls.length > 0) {
          await supabase.from('journal_entries').update({ media_urls: mediaUrls }).eq('id', entry.id)
        }
      }

      setEntries(prev => [{ ...entry, media_urls: mediaUrls }, ...prev])
      setNewEntry('')
      setPendingMedia([])

      fetch('/api/journal/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entryId: entry.id }),
      })
    } finally {
      setSubmitting(false)
      setUploadingMedia(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daily Journal</h1>
          <p className="text-gray-500 mt-1">Record observations, milestones, and challenges</p>
        </div>
      </div>

      {/* New Entry */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <form onSubmit={handleSubmit}>
          {children.length > 1 && (
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select child...</option>
              {children.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          )}

          <textarea
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            placeholder="What happened today? Any behaviors, milestones, challenges, or successes to note..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-3"
          />

          {/* Media toolbar */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Add media:</span>
            <button
              type="button"
              onClick={startAudioRecording}
              className={cn(
                'flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors',
                recordingAudio
                  ? 'bg-red-100 text-red-600 ring-2 ring-red-400 animate-pulse'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {recordingAudio ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              {recordingAudio ? 'Stop' : 'Record Audio'}
            </button>
            <button
              type="button"
              onClick={startVideoRecording}
              className={cn(
                'flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors',
                recordingVideo
                  ? 'bg-red-100 text-red-600 ring-2 ring-red-400 animate-pulse'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {recordingVideo ? <VideoOff className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5" />}
              {recordingVideo ? 'Stop' : 'Record Video'}
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload File
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*,video/*"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          {/* Live video preview while recording */}
          {recordingVideo && (
            <div className="mb-3 rounded-xl overflow-hidden bg-black">
              <video ref={videoPreviewRef} muted className="w-full max-h-48 object-cover" />
            </div>
          )}

          {/* Pending media previews */}
          {pendingMedia.length > 0 && (
            <div className="space-y-2 mb-3">
              {pendingMedia.map((item, i) => (
                <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-xl p-2">
                  <div className="flex-1">
                    {item.type === 'audio' ? (
                      <audio src={item.previewUrl} controls className="w-full h-8" />
                    ) : (
                      <video src={item.previewUrl} controls className="w-full max-h-40 rounded-lg" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeMedia(i)}
                    className="text-gray-400 hover:text-red-500 p-1 shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <span className="text-sm text-gray-500 mr-2">Mood:</span>
              {Object.entries(MOOD_CONFIG).map(([key, config]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setMood(key)}
                  className={cn(
                    'text-lg p-1.5 rounded-lg transition-colors',
                    mood === key ? 'bg-blue-100 ring-2 ring-blue-500' : 'hover:bg-gray-50'
                  )}
                  title={config.label}
                >
                  {config.emoji}
                </button>
              ))}
            </div>
            <button
              type="submit"
              disabled={submitting || !newEntry.trim() || !selectedChild}
              className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {uploadingMedia ? 'Uploading…' : 'Saving…'}
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add Entry
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Entries */}
      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>
      ) : entries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Start your journal</h3>
          <p className="text-gray-500 text-sm">Write your first entry above. Our AI will analyze patterns and provide insights.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => {
            const moodConfig = MOOD_CONFIG[entry.mood as keyof typeof MOOD_CONFIG]
            return (
              <div key={entry.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-gray-900">{formatDate(entry.created_at, 'EEEE, MMM d yyyy')}</p>
                  {moodConfig && (
                    <span className={cn('text-xs font-medium px-2 py-1 rounded-full', moodConfig.color)}>
                      {moodConfig.emoji} {moodConfig.label}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{entry.content}</p>

                {/* Media playback */}
                {entry.media_urls && entry.media_urls.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {entry.media_urls.map((url, i) => (
                      <div key={i} className="rounded-xl overflow-hidden bg-gray-50 p-2">
                        {isVideo(url) ? (
                          <video src={url} controls className="w-full max-h-56 rounded-lg" />
                        ) : (
                          <audio src={url} controls className="w-full h-10" />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {entry.ai_analysis && (
                  <div className="mt-4 bg-purple-50 rounded-xl p-4 border border-purple-100">
                    <p className="text-xs font-medium text-purple-600 mb-2 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      AI Insights
                    </p>
                    <p className="text-sm text-purple-800">{entry.ai_analysis}</p>
                    {entry.ai_recommendations && entry.ai_recommendations.length > 0 && (
                      <div className="mt-2">
                        {entry.ai_recommendations.slice(0, 2).map((rec: string, i: number) => (
                          <p key={i} className="text-xs text-purple-700 mt-1">• {rec}</p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
