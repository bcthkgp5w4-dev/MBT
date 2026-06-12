'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Loader2, Printer } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getChildAge, formatDate } from '@/lib/utils'

export default function PassportPage() {
  const [children, setChildren] = useState<any[]>([])
  const [selectedChild, setSelectedChild] = useState<any>(null)
  const [goals, setGoals] = useState<any[]>([])
  const [screenings, setScreenings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [snapshot, setSnapshot] = useState<any>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: ch } = await supabase.from('children').select('*').eq('profile_id', user.id).eq('is_active', true)
      if (ch) { setChildren(ch); if (ch.length > 0) setSelectedChild(ch[0]) }
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    if (!selectedChild) return
    async function loadData() {
      const supabase = createClient()
      const [{ data: g }, { data: s }] = await Promise.all([
        supabase.from('goals').select('*').eq('child_id', selectedChild.id),
        supabase.from('screening_results').select('*').eq('child_id', selectedChild.id).order('created_at', { ascending: false }).limit(5),
      ])
      if (g) setGoals(g)
      if (s) setScreenings(s)
    }
    loadData()
    setSnapshot(null)
  }, [selectedChild])

  async function generateSnapshot() {
    setGenerating(true)
    try {
      const res = await fetch('/api/children/snapshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ childId: selectedChild.id }),
      })
      const data = await res.json()
      setSnapshot(data)
    } finally {
      setGenerating(false)
    }
  }

  function handlePrint() {
    window.print()
  }

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>

  if (!selectedChild) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No children found. <Link href="/children/new" className="text-blue-600">Create a child profile</Link> first.</p>
      </div>
    )
  }

  const activeGoals = goals.filter(g => g.status === 'active')

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6 no-print">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Digital Autism Passport</h1>
          <p className="text-gray-500 mt-1">Portable child summary for professionals and schools</p>
        </div>
        <div className="flex gap-2">
          {children.length > 1 && (
            <select
              value={selectedChild?.id}
              onChange={(e) => setSelectedChild(children.find(c => c.id === e.target.value))}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm"
            >
              {children.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          )}
          <button onClick={handlePrint} className="flex items-center gap-2 border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50">
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button onClick={generateSnapshot} disabled={generating} className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : '✨'}
            Generate AI Summary
          </button>
        </div>
      </div>

      {/* Passport */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-white/20 text-white text-3xl font-bold flex items-center justify-center">
              {selectedChild.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-3xl font-bold">{selectedChild.name}</h2>
              <p className="text-blue-100 mt-1">{getChildAge(selectedChild.date_of_birth)} old · {selectedChild.gender}</p>
              <div className="flex gap-3 mt-2">
                <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full capitalize">
                  {selectedChild.diagnosis_status?.replace(/_/g, ' ')}
                </span>
                <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full capitalize">
                  {selectedChild.communication_level?.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
            <div className="ml-auto text-right">
              <p className="text-blue-100 text-sm">MBT Autism Passport</p>
              <p className="text-blue-100 text-xs mt-1">Generated {formatDate(new Date().toISOString())}</p>
            </div>
          </div>
        </div>

        <div className="p-8 grid sm:grid-cols-2 gap-6">
          {/* Strengths */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-green-500">✓</span> Strengths
            </h3>
            {selectedChild.strengths?.length > 0 ? (
              <ul className="space-y-1">
                {selectedChild.strengths.map((s: string, i: number) => (
                  <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    {s}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400">Not specified</p>
            )}
          </div>

          {/* Challenges */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-orange-500">!</span> Support Needs
            </h3>
            {selectedChild.challenges?.length > 0 ? (
              <ul className="space-y-1">
                {selectedChild.challenges.map((c: string, i: number) => (
                  <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    {c}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400">Not specified</p>
            )}
          </div>

          {/* Interests */}
          {selectedChild.interests?.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">❤️ Interests & Motivators</h3>
              <div className="flex flex-wrap gap-2">
                {selectedChild.interests.map((interest: string, i: number) => (
                  <span key={i} className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full">{interest}</span>
                ))}
              </div>
            </div>
          )}

          {/* Sensory */}
          {selectedChild.sensory_sensitivities?.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">🔊 Sensory Considerations</h3>
              <div className="flex flex-wrap gap-2">
                {selectedChild.sensory_sensitivities.map((s: string, i: number) => (
                  <span key={i} className="bg-purple-50 text-purple-700 text-xs px-3 py-1 rounded-full">{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Active Goals */}
          {activeGoals.length > 0 && (
            <div className="sm:col-span-2">
              <h3 className="font-semibold text-gray-900 mb-3">🎯 Current Goals</h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {activeGoals.slice(0, 6).map((goal) => (
                  <div key={goal.id} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                    <span className="text-xs text-gray-500 capitalize">[{goal.domain}]</span>
                    <span className="text-sm text-gray-800 flex-1 truncate">{goal.title}</span>
                    <span className="text-xs font-medium text-blue-600">{goal.progress_percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Therapies */}
          {selectedChild.therapies?.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">🏥 Current Therapies</h3>
              <div className="flex flex-wrap gap-2">
                {selectedChild.therapies.map((t: string, i: number) => (
                  <span key={i} className="bg-teal-50 text-teal-700 text-xs px-3 py-1 rounded-full">{t}</span>
                ))}
              </div>
            </div>
          )}

          {/* School */}
          {selectedChild.school_name && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">🏫 School</h3>
              <p className="text-sm text-gray-700">{selectedChild.school_name}</p>
            </div>
          )}

          {/* AI Snapshot */}
          {snapshot && (
            <div className="sm:col-span-2 bg-purple-50 rounded-xl p-5 border border-purple-100">
              <h3 className="font-semibold text-purple-900 mb-3">✨ AI-Generated Summary</h3>
              {snapshot.developmental_level && (
                <p className="text-sm text-purple-800 mb-3">{snapshot.developmental_level}</p>
              )}
              {snapshot.immediate_recommendations?.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-purple-700 mb-2">Recommendations for professionals:</p>
                  <ul className="space-y-1">
                    {snapshot.immediate_recommendations.map((r: string, i: number) => (
                      <li key={i} className="text-sm text-purple-800">• {r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-8 py-4 bg-gray-50">
          <p className="text-xs text-gray-400 text-center">
            Generated by MBT – Mind, Behavior & Therapy · {formatDate(new Date().toISOString())} ·
            This document is for informational purposes. Not a diagnostic report.
          </p>
        </div>
      </div>
    </div>
  )
}
