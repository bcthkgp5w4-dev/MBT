'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, BookOpen, Loader2, Sparkles } from 'lucide-react'
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

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [newEntry, setNewEntry] = useState('')
  const [mood, setMood] = useState<string>('neutral')
  const [submitting, setSubmitting] = useState(false)
  const [children, setChildren] = useState<any[]>([])
  const [selectedChild, setSelectedChild] = useState('')

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!newEntry.trim() || !selectedChild) return
    setSubmitting(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      const { data: entry, error } = await supabase.from('journal_entries').insert({
        child_id: selectedChild,
        profile_id: user?.id,
        content: newEntry,
        mood,
      }).select().single()

      if (error) throw error
      setEntries(prev => [entry, ...prev])
      setNewEntry('')

      // Trigger AI analysis in background
      fetch('/api/journal/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entryId: entry.id }),
      })
    } finally {
      setSubmitting(false)
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
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Add Entry
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
