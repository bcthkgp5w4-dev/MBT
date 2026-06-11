'use client'

import { useEffect, useState } from 'react'
import { Loader2, BarChart2, TrendingUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from 'recharts'
import { THERAPY_DOMAINS } from '@/lib/constants'

export default function ProgressPage() {
  const [loading, setLoading] = useState(true)
  const [children, setChildren] = useState<any[]>([])
  const [selectedChild, setSelectedChild] = useState('')
  const [goals, setGoals] = useState<any[]>([])
  const [progressData, setProgressData] = useState<any[]>([])
  const [journalMoods, setJournalMoods] = useState<any[]>([])

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: ch } = await supabase.from('children').select('id, name').eq('profile_id', user.id).eq('is_active', true)
      if (ch) { setChildren(ch); if (ch.length > 0) setSelectedChild(ch[0].id) }
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    if (!selectedChild) return
    async function loadChildData() {
      const supabase = createClient()

      const [{ data: g }, { data: pd }, { data: jm }] = await Promise.all([
        supabase.from('goals').select('*').eq('child_id', selectedChild).eq('status', 'active'),
        supabase.from('progress_data').select('*').eq('child_id', selectedChild).order('date', { ascending: true }).limit(30),
        supabase.from('journal_entries').select('mood, created_at').eq('child_id', selectedChild).order('created_at', { ascending: false }).limit(14),
      ])

      if (g) setGoals(g)
      if (pd) setProgressData(pd)
      if (jm) setJournalMoods(jm)
    }
    loadChildData()
  }, [selectedChild])

  // Domain radar data
  const domainData = THERAPY_DOMAINS.map(domain => {
    const domainGoals = goals.filter(g => g.domain === domain.value)
    const avg = domainGoals.length > 0
      ? Math.round(domainGoals.reduce((sum, g) => sum + g.progress_percentage, 0) / domainGoals.length)
      : 0
    return { domain: domain.label.split(' ')[0], value: avg, fullMark: 100 }
  })

  // Mood data for chart
  const moodValues: Record<string, number> = { great: 5, good: 4, neutral: 3, difficult: 2, crisis: 1 }
  const moodChartData = journalMoods.slice(0, 7).reverse().map((entry, i) => ({
    day: `Day ${i + 1}`,
    mood: moodValues[entry.mood] || 3,
  }))

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Progress Dashboard</h1>
          <p className="text-gray-500 mt-1">Track developmental progress across all domains</p>
        </div>
        {children.length > 1 && (
          <select
            value={selectedChild}
            onChange={(e) => setSelectedChild(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {children.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>
      ) : (
        <div className="grid gap-6">
          {/* Domain Overview */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-blue-600" />
                Domain Progress
              </h2>
              {goals.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No active goals to display</p>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart data={domainData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="domain" className="text-xs" />
                    <Radar name="Progress" dataKey="value" stroke="#2563eb" fill="#2563eb" fillOpacity={0.2} />
                  </RadarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                Daily Mood
              </h2>
              {moodChartData.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No journal entries yet</p>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={moodChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" className="text-xs" />
                    <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} className="text-xs" />
                    <Tooltip formatter={(v) => ['😊🌟😐😔🆘'.split('')[5 - (v as number)], 'Mood']} />
                    <Line type="monotone" dataKey="mood" stroke="#16a34a" strokeWidth={2} dot={{ fill: '#16a34a' }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Goals Progress */}
          {goals.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Goal Progress</h2>
              <div className="space-y-4">
                {goals.map((goal) => (
                  <div key={goal.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{goal.title}</span>
                      <span className="text-sm text-gray-500">{goal.progress_percentage}%</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${goal.progress_percentage}%`,
                          backgroundColor: goal.progress_percentage >= 75 ? '#16a34a' : goal.progress_percentage >= 40 ? '#2563eb' : '#f59e0b',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats summary */}
          <div className="grid sm:grid-cols-4 gap-4">
            {[
              { label: 'Active Goals', value: goals.length, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Avg Progress', value: `${goals.length ? Math.round(goals.reduce((s, g) => s + g.progress_percentage, 0) / goals.length) : 0}%`, color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Journal Entries', value: journalMoods.length, color: 'text-purple-600', bg: 'bg-purple-50' },
              { label: 'Progress Records', value: progressData.length, color: 'text-orange-600', bg: 'bg-orange-50' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
