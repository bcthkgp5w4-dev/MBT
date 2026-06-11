'use client'

import { useEffect, useState } from 'react'
import { Plus, Apple, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack']

export default function DietPage() {
  const [entries, setEntries] = useState<any[]>([])
  const [children, setChildren] = useState<any[]>([])
  const [selectedChild, setSelectedChild] = useState('')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    child_id: '',
    date: new Date().toISOString().split('T')[0],
    meal_type: 'breakfast',
    foods: '',
    water_intake_ml: '',
    notes: '',
  })

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [{ data: ch }, { data: e }] = await Promise.all([
        supabase.from('children').select('id, name').eq('profile_id', user.id).eq('is_active', true),
        supabase.from('diet_entries').select('*').eq('profile_id', user.id).order('date', { ascending: false }).limit(21),
      ])

      if (ch) {
        setChildren(ch)
        if (ch.length > 0) {
          setSelectedChild(ch[0].id)
          setForm(f => ({ ...f, child_id: ch[0].id }))
        }
      }
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

      const { data, error } = await supabase.from('diet_entries').insert({
        ...form,
        profile_id: user?.id,
        foods: form.foods.split(',').map(f => f.trim()).filter(Boolean),
        water_intake_ml: form.water_intake_ml ? parseInt(form.water_intake_ml) : null,
      }).select().single()

      if (error) throw error
      setEntries(prev => [data, ...prev])
      setShowForm(false)
      setForm(f => ({ ...f, foods: '', notes: '', water_intake_ml: '' }))
    } finally {
      setSubmitting(false)
    }
  }

  const todayEntries = entries.filter(e => e.date === new Date().toISOString().split('T')[0])
  const totalWater = todayEntries.reduce((sum, e) => sum + (e.water_intake_ml || 0), 0)
  const totalFoods = Array.from(new Set(todayEntries.flatMap(e => e.foods || []))).length

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Diet & Nutrition</h1>
          <p className="text-gray-500 mt-1">Track food preferences and nutritional intake</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Log Meal
        </button>
      </div>

      {/* Today's summary */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Today's Meals", value: todayEntries.length, emoji: '🍽️' },
          { label: 'Water Today', value: totalWater > 0 ? `${totalWater}ml` : '—', emoji: '💧' },
          { label: 'Foods Tried', value: totalFoods, emoji: '🥗' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5">
            <span className="text-3xl">{stat.emoji}</span>
            <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Log a Meal</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              {children.length > 1 && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Child</label>
                  <select value={form.child_id} onChange={(e) => setForm(f => ({ ...f, child_id: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm">
                    {children.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Date</label>
                <input type="date" value={form.date} onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Meal Type</label>
                <select value={form.meal_type} onChange={(e) => setForm(f => ({ ...f, meal_type: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm">
                  {MEAL_TYPES.map(m => <option key={m} value={m} className="capitalize">{m.charAt(0).toUpperCase() + m.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Water (ml)</label>
                <input type="number" value={form.water_intake_ml} onChange={(e) => setForm(f => ({ ...f, water_intake_ml: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm" placeholder="e.g. 200" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Foods (comma-separated)</label>
              <input type="text" required value={form.foods} onChange={(e) => setForm(f => ({ ...f, foods: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm" placeholder="e.g. rice, chicken, broccoli" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Notes</label>
              <input type="text" value={form.notes} onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm" placeholder="Reactions, appetite, textures accepted..." />
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
          <Apple className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Start tracking nutrition</h3>
          <p className="text-gray-500 text-sm">Log meals to track food variety and nutritional patterns.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div key={entry.id} className="bg-white rounded-2xl border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{entry.meal_type === 'breakfast' ? '🌅' : entry.meal_type === 'lunch' ? '☀️' : entry.meal_type === 'dinner' ? '🌙' : '🍎'}</span>
                  <span className="font-medium text-gray-900 capitalize">{entry.meal_type}</span>
                </div>
                <span className="text-xs text-gray-400">{formatDate(entry.date)}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(entry.foods || []).map((food: string, i: number) => (
                  <span key={i} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">{food}</span>
                ))}
              </div>
              {entry.water_intake_ml && <p className="text-xs text-gray-400 mt-2">💧 {entry.water_intake_ml}ml water</p>}
              {entry.notes && <p className="text-xs text-gray-500 mt-1">{entry.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
