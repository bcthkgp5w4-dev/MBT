'use client'

import { useEffect, useState } from 'react'
import { Plus, Moon, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function SleepPage() {
  const [entries, setEntries] = useState<any[]>([])
  const [_children, setChildren] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    child_id: '',
    date: new Date().toISOString().split('T')[0],
    bedtime: '20:00',
    wake_time: '07:00',
    night_wakings: 0,
    quality: 3,
    notes: '',
  })

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [{ data: ch }, { data: e }] = await Promise.all([
        supabase.from('children').select('id, name').eq('profile_id', user.id).eq('is_active', true),
        supabase.from('sleep_entries').select('*').eq('profile_id', user.id).order('date', { ascending: false }).limit(14),
      ])

      if (ch) {
        setChildren(ch)
        if (ch.length > 0) setForm(f => ({ ...f, child_id: ch[0].id }))
      }
      if (e) setEntries(e)
      setLoading(false)
    }
    load()
  }, [])

  function calcDuration(bedtime: string, wakeTime: string): number {
    const [bh, bm] = bedtime.split(':').map(Number)
    const [wh, wm] = wakeTime.split(':').map(Number)
    let duration = (wh * 60 + wm) - (bh * 60 + bm)
    if (duration < 0) duration += 24 * 60
    return Math.round(duration / 60 * 10) / 10
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      const duration = calcDuration(form.bedtime, form.wake_time)

      const { data, error } = await supabase.from('sleep_entries').upsert({
        ...form,
        profile_id: user?.id,
        duration_hours: duration,
      }, { onConflict: 'child_id,date' }).select().single()

      if (error) throw error
      setEntries(prev => {
        const filtered = prev.filter(e => e.date !== form.date)
        return [data, ...filtered]
      })
      setShowForm(false)
    } finally {
      setSubmitting(false)
    }
  }

  const chartData = entries.slice(0, 7).reverse().map(e => ({
    date: formatDate(e.date, 'MMM d'),
    hours: e.duration_hours,
    wakings: e.night_wakings,
  }))

  const avgSleep = entries.length > 0
    ? Math.round(entries.slice(0, 7).reduce((sum, e) => sum + (e.duration_hours || 0), 0) / Math.min(entries.length, 7) * 10) / 10
    : 0

  const QUALITY_LABELS = { 1: 'Very Poor', 2: 'Poor', 3: 'Fair', 4: 'Good', 5: 'Excellent' }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sleep Tracker</h1>
          <p className="text-gray-500 mt-1">Monitor sleep patterns and quality</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Log Sleep
        </button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Avg Sleep (7d)', value: avgSleep > 0 ? `${avgSleep}h` : '—', emoji: '🌙' },
          { label: 'Nights Tracked', value: entries.length, emoji: '📅' },
          { label: 'Last Night', value: entries[0] ? `${entries[0].duration_hours}h` : '—', emoji: '⭐' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5">
            <span className="text-3xl">{stat.emoji}</span>
            <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Sleep Duration (last 7 nights)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis domain={[0, 12]} className="text-xs" />
              <Tooltip formatter={(v) => [`${v}h`, 'Sleep Duration']} />
              <Bar dataKey="hours" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Log Sleep</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Date</label>
                <input type="date" value={form.date} onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Bedtime</label>
                <input type="time" value={form.bedtime} onChange={(e) => setForm(f => ({ ...f, bedtime: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Wake Time</label>
                <input type="time" value={form.wake_time} onChange={(e) => setForm(f => ({ ...f, wake_time: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Night Wakings</label>
                <input type="number" min={0} max={20} value={form.night_wakings} onChange={(e) => setForm(f => ({ ...f, night_wakings: parseInt(e.target.value) }))} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Sleep Quality: {QUALITY_LABELS[form.quality as keyof typeof QUALITY_LABELS]}</label>
              <input type="range" min={1} max={5} value={form.quality} onChange={(e) => setForm(f => ({ ...f, quality: parseInt(e.target.value) }))} className="w-full" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Notes</label>
              <input type="text" value={form.notes} onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm" placeholder="Sleep environment, routines, observations..." />
            </div>
            <div className="text-sm text-gray-500">
              Duration: {calcDuration(form.bedtime, form.wake_time)} hours
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 py-2.5 rounded-xl text-sm font-medium">Cancel</button>
              <button type="submit" disabled={submitting} className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Entries */}
      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>
      ) : entries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <Moon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Start tracking sleep</h3>
          <p className="text-gray-500 text-sm">Log sleep data to discover patterns and improve routines.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div key={entry.id} className="bg-white rounded-2xl border border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Moon className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">{formatDate(entry.date)}</p>
                    <p className="text-xs text-gray-500">{entry.bedtime} → {entry.wake_time} · {entry.duration_hours}h</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className={`w-2 h-2 rounded-full ${i < entry.quality ? 'bg-blue-500' : 'bg-gray-100'}`} />
                    ))}
                  </div>
                  {entry.night_wakings > 0 && (
                    <p className="text-xs text-orange-500 mt-1">{entry.night_wakings} wakings</p>
                  )}
                </div>
              </div>
              {entry.notes && <p className="text-xs text-gray-500 mt-2">{entry.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
