'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Target, Loader2, TrendingUp, CheckCircle, PauseCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { THERAPY_DOMAINS } from '@/lib/constants'
import { cn, DOMAIN_COLORS } from '@/lib/utils'
import type { Goal, Child } from '@/types'

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [children, setChildren] = useState<Child[]>([])
  const [selectedChild, setSelectedChild] = useState('')
  const [selectedDomain, setSelectedDomain] = useState('')
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [{ data: ch }, { data: g }] = await Promise.all([
        supabase.from('children').select('*').eq('profile_id', user.id).eq('is_active', true),
        supabase.from('goals').select('*').eq('profile_id', user.id).order('created_at', { ascending: false }),
      ])

      if (ch) { setChildren(ch); if (ch.length === 1) setSelectedChild(ch[0].id) }
      if (g) setGoals(g)
      setLoading(false)
    }
    load()
  }, [])

  async function generateGoals() {
    if (!selectedChild || !selectedDomain) return
    setGenerating(true)
    try {
      const response = await fetch('/api/goals/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ childId: selectedChild, domain: selectedDomain }),
      })
      const data = await response.json()
      if (data.goals) {
        setGoals(prev => [...data.goals, ...prev])
      }
    } finally {
      setGenerating(false)
    }
  }

  const filteredGoals = goals.filter(g => {
    if (selectedChild && g.child_id !== selectedChild) return false
    if (selectedDomain && g.domain !== selectedDomain) return false
    return true
  })

  const activeGoals = filteredGoals.filter(g => g.status === 'active')
  const achievedGoals = filteredGoals.filter(g => g.status === 'achieved')

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Goals</h1>
          <p className="text-gray-500 mt-1">Track and manage therapy goals</p>
        </div>
        <Link href="/goals/new" className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Add Goal
        </Link>
      </div>

      {/* Filters & AI Generator */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-4 h-4 text-blue-600" />
          AI Goal Generator
        </h2>
        <div className="flex flex-wrap gap-3">
          {children.length > 1 && (
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All children</option>
              {children.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          )}
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All domains</option>
            {THERAPY_DOMAINS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
          <button
            onClick={generateGoals}
            disabled={!selectedChild || !selectedDomain || generating}
            className="flex items-center gap-2 bg-purple-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : '✨'}
            Generate AI Goals
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      ) : filteredGoals.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">No goals yet</h3>
          <p className="text-gray-500 text-sm mb-4">Create goals manually or use AI to generate personalized goals.</p>
          <Link href="/goals/new" className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            Create First Goal
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {activeGoals.length > 0 && (
            <div>
              <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                Active Goals ({activeGoals.length})
              </h2>
              <div className="grid gap-3">
                {activeGoals.map((goal) => (
                  <GoalCard key={goal.id} goal={goal} children={children} onUpdate={(updated) => setGoals(prev => prev.map(g => g.id === updated.id ? updated : g))} />
                ))}
              </div>
            </div>
          )}
          {achievedGoals.length > 0 && (
            <div>
              <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Achieved Goals ({achievedGoals.length})
              </h2>
              <div className="grid gap-3">
                {achievedGoals.map((goal) => (
                  <GoalCard key={goal.id} goal={goal} children={children} onUpdate={(updated) => setGoals(prev => prev.map(g => g.id === updated.id ? updated : g))} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function GoalCard({ goal, children, onUpdate }: { goal: Goal; children: Child[]; onUpdate: (g: Goal) => void }) {
  const child = children.find(c => c.id === goal.child_id)
  const domainColors = DOMAIN_COLORS[goal.domain] || 'text-gray-600 bg-gray-50 border-gray-200'

  async function updateProgress(value: number) {
    const supabase = createClient()
    const { data } = await supabase.from('goals').update({ progress_percentage: value, status: value >= 100 ? 'achieved' : 'active' }).eq('id', goal.id).select().single()
    if (data) onUpdate(data)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full border capitalize', domainColors)}>
              {goal.domain}
            </span>
            {goal.ai_generated && (
              <span className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">✨ AI</span>
            )}
            {child && <span className="text-xs text-gray-400">{child.name}</span>}
          </div>
          <h3 className="font-semibold text-gray-900">{goal.title}</h3>
          {goal.description && <p className="text-sm text-gray-500 mt-1">{goal.description}</p>}
        </div>
        {goal.status === 'achieved' && <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />}
        {goal.status === 'paused' && <PauseCircle className="w-5 h-5 text-yellow-500 shrink-0" />}
      </div>

      {goal.baseline && (
        <div className="flex gap-4 text-xs text-gray-500 mb-3">
          <span>Baseline: <strong className="text-gray-700">{goal.baseline}</strong></span>
          <span>Target: <strong className="text-gray-700">{goal.target}</strong></span>
          {goal.timeline_weeks && <span>Timeline: <strong className="text-gray-700">{goal.timeline_weeks}w</strong></span>}
        </div>
      )}
      {goal.measurement_criteria && (
        <div className="bg-blue-50 rounded-lg px-3 py-2 mb-3 flex items-start gap-2">
          <span className="text-base shrink-0">📏</span>
          <div>
            <p className="text-xs font-medium text-blue-700 mb-0.5">How to measure</p>
            <p className="text-xs text-blue-600">{goal.measurement_criteria}</p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${goal.progress_percentage}%` }} />
        </div>
        <span className="text-sm font-medium text-gray-700 w-10 text-right">{goal.progress_percentage}%</span>
      </div>

      {goal.status === 'active' && (
        <div className="flex gap-2 mt-3">
          {[25, 50, 75, 100].map(v => (
            <button
              key={v}
              onClick={() => updateProgress(v)}
              className={cn(
                'text-xs px-2 py-1 rounded-lg transition-colors',
                goal.progress_percentage >= v ? 'bg-blue-100 text-blue-700' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
              )}
            >
              {v}%
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
