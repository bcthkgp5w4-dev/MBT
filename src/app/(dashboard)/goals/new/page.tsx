'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { THERAPY_DOMAINS } from '@/lib/constants'

export default function NewGoalPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingChildren, setLoadingChildren] = useState(true)
  const [children, setChildren] = useState<any[]>([])
  const [form, setForm] = useState({
    child_id: '',
    domain: 'communication',
    title: '',
    description: '',
    baseline: '',
    target: '',
    timeline_weeks: 12,
    measurement_criteria: '',
  })

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('children')
        .select('id, name')
        .eq('profile_id', user.id)
      if (data) {
        setChildren(data)
        if (data.length === 1) setForm(prev => ({ ...prev, child_id: data[0].id }))
      }
      setLoadingChildren(false)
    }
    load()
  }, [])

  function update(key: string, value: any) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.child_id) { toast.error('Please select a child'); return }
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase.from('goals').insert({
        ...form,
        profile_id: user.id,
        timeline_weeks: Number(form.timeline_weeks),
      })
      if (error) throw error

      toast.success('Goal created!')
      router.push('/goals')
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/goals" className="p-2 rounded-lg hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Goal</h1>
          <p className="text-gray-500 text-sm">Define a new therapy goal</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Child */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Child *</label>
            {loadingChildren ? (
              <div className="flex items-center gap-2 text-sm text-gray-400"><Loader2 className="w-4 h-4 animate-spin" /> Loading...</div>
            ) : children.length === 0 ? (
              <p className="text-sm text-gray-500">No children found. <Link href="/children/new" className="text-blue-600 underline">Add a child first.</Link></p>
            ) : (
              <select
                required
                value={form.child_id}
                onChange={(e) => update('child_id', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select child</option>
                {children.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            )}
          </div>

          {/* Domain */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Domain *</label>
            <select
              value={form.domain}
              onChange={(e) => update('domain', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {THERAPY_DOMAINS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Goal Title *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Use 2-word combinations to request items"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Describe the goal in more detail..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Baseline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Baseline</label>
              <input
                type="text"
                value={form.baseline}
                onChange={(e) => update('baseline', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Current level"
              />
            </div>

            {/* Target */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target</label>
              <input
                type="text"
                value={form.target}
                onChange={(e) => update('target', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Desired outcome"
              />
            </div>
          </div>

          {/* Timeline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Timeline (weeks)</label>
            <input
              type="number"
              min={1}
              max={52}
              value={form.timeline_weeks}
              onChange={(e) => update('timeline_weeks', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Measurement */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">How will you measure progress?</label>
            <input
              type="text"
              value={form.measurement_criteria}
              onChange={(e) => update('measurement_criteria', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 4 out of 5 trials, 3 days per week"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Link
              href="/goals"
              className="flex-1 border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || !form.title || !form.child_id}
              className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Create Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
