'use client'

import { useEffect, useState } from 'react'
import { Plus, AlertTriangle, Loader2, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import type { BehaviorEntry } from '@/types'

const INTENSITY_LABELS = { 1: 'Minimal', 2: 'Mild', 3: 'Moderate', 4: 'Severe', 5: 'Extreme' }
const INTENSITY_COLORS = { 1: 'bg-green-100 text-green-700', 2: 'bg-yellow-100 text-yellow-700', 3: 'bg-orange-100 text-orange-700', 4: 'bg-red-100 text-red-700', 5: 'bg-red-200 text-red-800' }

export default function BehaviorPage() {
  const [entries, setEntries] = useState<BehaviorEntry[]>([])
  const [children, setChildren] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)
  const [analyzing, setAnalyzing] = useState(false)

  const [form, setForm] = useState({
    child_id: '',
    behavior: '',
    antecedent: '',
    consequence: '',
    intensity: 3,
    duration_minutes: '',
    location: '',
    time_of_day: '',
    intervention_used: '',
    outcome: '',
  })

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [{ data: ch }, { data: e }] = await Promise.all([
        supabase.from('children').select('id, name').eq('profile_id', user.id).eq('is_active', true),
        supabase.from('behavior_entries').select('*').eq('profile_id', user.id).order('occurred_at', { ascending: false }).limit(30),
      ])

      if (ch) { setChildren(ch); if (ch.length === 1) setForm(f => ({ ...f, child_id: ch[0].id })) }
      if (e) setEntries(e)
      setLoading(false)
    }
    load()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      const { data, error } = await supabase.from('behavior_entries').insert({
        ...form,
        profile_id: user?.id,
        duration_minutes: form.duration_minutes ? parseInt(form.duration_minutes) : null,
        occurred_at: new Date().toISOString(),
      }).select().single()

      if (error) throw error
      setEntries(prev => [data, ...prev])
      setForm(f => ({ ...f, behavior: '', antecedent: '', consequence: '', intervention_used: '', outcome: '' }))
      setShowForm(false)
    } finally {
      setSubmitting(false)
    }
  }

  async function runAnalysis() {
    setAnalyzing(true)
    try {
      const res = await fetch('/api/behavior/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ childId: form.child_id || children[0]?.id }) })
      const data = await res.json()
      setAnalysis(data)
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Behavior Tracker</h1>
          <p className="text-gray-500 mt-1">ABC (Antecedent-Behavior-Consequence) analysis</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={runAnalysis}
            disabled={analyzing || entries.length < 3}
            className="flex items-center gap-2 border border-purple-200 text-purple-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-purple-50 disabled:opacity-50"
          >
            {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            AI Analysis
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Record Behavior
          </button>
        </div>
      </div>

      {/* AI Analysis Results */}
      {analysis && (
        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-6 mb-6">
          <h2 className="font-semibold text-purple-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            AI Behavior Analysis
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {analysis.common_triggers && (
              <div>
                <h3 className="text-sm font-medium text-purple-800 mb-2">Common Triggers</h3>
                <ul className="space-y-1">
                  {analysis.common_triggers.map((t: string, i: number) => (
                    <li key={i} className="text-sm text-purple-700">• {t}</li>
                  ))}
                </ul>
              </div>
            )}
            {analysis.interventions && (
              <div>
                <h3 className="text-sm font-medium text-purple-800 mb-2">Recommended Interventions</h3>
                <ul className="space-y-1">
                  {analysis.interventions.map((t: string, i: number) => (
                    <li key={i} className="text-sm text-purple-700">• {t}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* New Entry Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Record Behavior (ABC)</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              {children.length > 1 && (
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Child</label>
                  <select value={form.child_id} onChange={(e) => setForm(f => ({ ...f, child_id: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm">
                    {children.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Antecedent (What happened before?)</label>
                <input type="text" value={form.antecedent} onChange={(e) => setForm(f => ({ ...f, antecedent: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm" placeholder="e.g. TV was turned off" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Behavior *</label>
                <input type="text" required value={form.behavior} onChange={(e) => setForm(f => ({ ...f, behavior: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm" placeholder="e.g. Screaming, hitting" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Consequence (What happened after?)</label>
                <input type="text" value={form.consequence} onChange={(e) => setForm(f => ({ ...f, consequence: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm" placeholder="e.g. Given the tablet back" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Intensity: {INTENSITY_LABELS[form.intensity as keyof typeof INTENSITY_LABELS]}</label>
                <input type="range" min={1} max={5} value={form.intensity} onChange={(e) => setForm(f => ({ ...f, intensity: parseInt(e.target.value) }))} className="w-full" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Location</label>
                <input type="text" value={form.location} onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm" placeholder="e.g. Living room, school" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Intervention Used</label>
                <input type="text" value={form.intervention_used} onChange={(e) => setForm(f => ({ ...f, intervention_used: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm" placeholder="e.g. Visual schedule shown" />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={submitting || !form.behavior} className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Entry
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Entries list */}
      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>
      ) : entries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">No behavior records yet</h3>
          <p className="text-gray-500 text-sm">Start tracking behaviors to get AI-powered insights and intervention recommendations.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div key={entry.id} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{entry.behavior}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(entry.occurred_at, 'MMM d, yyyy h:mm a')}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${INTENSITY_COLORS[entry.intensity as keyof typeof INTENSITY_COLORS]}`}>
                  {INTENSITY_LABELS[entry.intensity as keyof typeof INTENSITY_LABELS]}
                </span>
              </div>
              <div className="grid sm:grid-cols-3 gap-3 text-sm">
                {entry.antecedent && (
                  <div>
                    <p className="text-xs text-gray-400 font-medium">A – Before</p>
                    <p className="text-gray-700">{entry.antecedent}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-400 font-medium">B – Behavior</p>
                  <p className="text-gray-700">{entry.behavior}</p>
                </div>
                {entry.consequence && (
                  <div>
                    <p className="text-xs text-gray-400 font-medium">C – After</p>
                    <p className="text-gray-700">{entry.consequence}</p>
                  </div>
                )}
              </div>
              {entry.intervention_used && (
                <p className="text-xs text-gray-500 mt-2">Intervention: {entry.intervention_used}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
