'use client'

import { useEffect, useState } from 'react'
import { Calendar, Loader2, Sparkles, CheckCircle, Clock, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'

export default function TherapyPage() {
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [children, setChildren] = useState<any[]>([])
  const [selectedChild, setSelectedChild] = useState('')
  const [plans, setPlans] = useState<any[]>([])
  const [todayPlan, setTodayPlan] = useState<any>(null)
  const [activities, setActivities] = useState<any[]>([])

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [{ data: ch }, { data: acts }] = await Promise.all([
        supabase.from('children').select('id, name').eq('profile_id', user.id).eq('is_active', true),
        supabase.from('therapy_activities').select('*').eq('is_active', true).limit(20),
      ])

      if (ch) { setChildren(ch); if (ch.length > 0) setSelectedChild(ch[0].id) }
      if (acts) setActivities(acts)
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    if (!selectedChild) return
    async function loadPlan() {
      const supabase = createClient()
      const { data: plan } = await supabase
        .from('daily_plans')
        .select('*, daily_plan_activities(*)')
        .eq('child_id', selectedChild)
        .eq('date', today)
        .single()
      setTodayPlan(plan)
    }
    loadPlan()
  }, [selectedChild, today])

  async function generatePlan() {
    setGenerating(true)
    try {
      const res = await fetch('/api/therapy/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ childId: selectedChild, date: today }),
      })
      const data = await res.json()
      if (data.plan) setTodayPlan(data.plan)
    } finally {
      setGenerating(false)
    }
  }

  async function toggleActivity(activityId: string, completed: boolean) {
    const supabase = createClient()
    await supabase.from('daily_plan_activities').update({ completed }).eq('id', activityId)
    setTodayPlan((prev: any) => ({
      ...prev,
      daily_plan_activities: prev.daily_plan_activities.map((a: any) =>
        a.id === activityId ? { ...a, completed } : a
      ),
    }))
  }

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>

  const planActivities = todayPlan?.daily_plan_activities || []
  const completedCount = planActivities.filter((a: any) => a.completed).length

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Therapy Planner</h1>
          <p className="text-gray-500 mt-1">Daily and weekly therapy activities</p>
        </div>
        {children.length > 1 && (
          <select value={selectedChild} onChange={(e) => setSelectedChild(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-xl text-sm">
            {children.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        )}
      </div>

      {/* Today's plan */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            Today&apos;s Plan — {formatDate(today)}
          </h2>
          {planActivities.length > 0 && (
            <span className="text-sm text-gray-500">
              {completedCount}/{planActivities.length} completed
            </span>
          )}
        </div>

        {!todayPlan ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">📅</div>
            <p className="text-gray-500 mb-4">No plan for today yet. Generate one with AI or add activities manually.</p>
            <button
              onClick={generatePlan}
              disabled={generating || !selectedChild}
              className="flex items-center gap-2 bg-purple-600 text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-purple-700 disabled:opacity-50 mx-auto"
            >
              {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Generate AI Daily Plan
            </button>
          </div>
        ) : (
          <>
            {planActivities.length > 0 && (
              <div className="mb-3">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${(completedCount / planActivities.length) * 100}%` }} />
                </div>
              </div>
            )}
            <div className="space-y-3">
              {planActivities.map((act: any) => (
                <div
                  key={act.id}
                  className={`flex items-start gap-3 p-4 rounded-xl border transition-colors ${
                    act.completed ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-100'
                  }`}
                >
                  <button
                    onClick={() => toggleActivity(act.id, !act.completed)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      act.completed ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    {act.completed && <CheckCircle className="w-4 h-4 text-white" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm ${act.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                      {act.custom_title || 'Activity'}
                    </p>
                    {act.duration_minutes && (
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {act.duration_minutes} min
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={generatePlan}
              disabled={generating}
              className="mt-4 flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800"
            >
              {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Regenerate Plan
            </button>
          </>
        )}
      </div>

      {/* Activity Library Preview */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Activity Library</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {activities.slice(0, 6).map((act) => (
            <div key={act.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50">
              <div>
                <p className="text-sm font-medium text-gray-900">{act.title}</p>
                <p className="text-xs text-gray-500">{act.domain} · {act.duration_minutes}min · {act.difficulty}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
