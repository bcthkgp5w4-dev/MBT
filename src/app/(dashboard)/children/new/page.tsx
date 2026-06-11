'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, Plus, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { COMMUNICATION_LEVELS } from '@/lib/constants'

export default function NewChildPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [newInterest, setNewInterest] = useState('')
  const [newStrength, setNewStrength] = useState('')
  const [newChallenge, setNewChallenge] = useState('')

  const [form, setForm] = useState({
    name: '',
    date_of_birth: '',
    gender: 'male',
    diagnosis_status: 'suspected',
    communication_level: 'single_words',
    interests: [] as string[],
    strengths: [] as string[],
    challenges: [] as string[],
    sensory_sensitivities: [] as string[],
    school_name: '',
    therapies: [] as string[],
    notes: '',
  })

  function update(key: string, value: any) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function addToArray(key: string, value: string, setter: (v: string) => void) {
    if (!value.trim()) return
    setForm(prev => ({ ...prev, [key]: [...(prev[key as keyof typeof prev] as string[]), value.trim()] }))
    setter('')
  }

  function removeFromArray(key: string, index: number) {
    setForm(prev => ({ ...prev, [key]: (prev[key as keyof typeof prev] as string[]).filter((_, i) => i !== index) }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (step < 3) { setStep(prev => prev + 1); return }

    setLoading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase.from('children').insert({
        ...form,
        profile_id: user.id,
      })
      if (error) throw error

      toast.success(`${form.name}'s profile created!`)
      router.push('/children')
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const SENSORY_OPTIONS = [
    'Sound sensitive', 'Light sensitive', 'Touch sensitive',
    'Seeks movement', 'Food texture aversions', 'Smell sensitive', 'Proprioceptive seeking',
  ]

  const THERAPY_OPTIONS = [
    'ABA', 'Speech Therapy', 'Occupational Therapy', 'Physical Therapy',
    'Play Therapy', 'Social Skills Group', 'Music Therapy', 'Art Therapy',
  ]

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/children" className="p-2 rounded-lg hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Child Profile</h1>
          <p className="text-gray-500 text-sm">Step {step} of 3</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`flex-1 h-2 rounded-full transition-colors ${s <= step ? 'bg-blue-600' : 'bg-gray-100'}`} />
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {step === 1 && (
            <>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Child&apos;s Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    required
                    value={form.date_of_birth}
                    onChange={(e) => update('date_of_birth', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                  <select
                    value={form.gender}
                    onChange={(e) => update('gender', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis Status</label>
                <select
                  value={form.diagnosis_status}
                  onChange={(e) => update('diagnosis_status', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="diagnosed">Diagnosed with ASD</option>
                  <option value="suspected">Suspected / Concerns</option>
                  <option value="assessment_pending">Assessment Pending</option>
                  <option value="no_diagnosis">No Diagnosis</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Communication Level</label>
                <div className="grid gap-2">
                  {COMMUNICATION_LEVELS.map((level) => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => update('communication_level', level.value)}
                      className={`flex items-center justify-between p-3 rounded-xl border-2 text-left transition-colors ${
                        form.communication_level === level.value
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <span className={`font-medium text-sm ${form.communication_level === level.value ? 'text-blue-700' : 'text-gray-700'}`}>
                        {level.label}
                      </span>
                      <span className="text-xs text-gray-400">{level.description}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Strengths & Challenges</h2>

              {/* Interests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Interests & Motivators</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('interests', newInterest, setNewInterest))}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. trains, dinosaurs..."
                  />
                  <button type="button" onClick={() => addToArray('interests', newInterest, setNewInterest)} className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.interests.map((item, i) => (
                    <span key={i} className="flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-3 py-1.5 rounded-full">
                      {item}
                      <button type="button" onClick={() => removeFromArray('interests', i)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Strengths */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Strengths</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newStrength}
                    onChange={(e) => setNewStrength(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('strengths', newStrength, setNewStrength))}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. visual memory, music..."
                  />
                  <button type="button" onClick={() => addToArray('strengths', newStrength, setNewStrength)} className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.strengths.map((item, i) => (
                    <span key={i} className="flex items-center gap-1 bg-green-50 text-green-700 text-xs px-3 py-1.5 rounded-full">
                      {item}
                      <button type="button" onClick={() => removeFromArray('strengths', i)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Challenges */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Challenges</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newChallenge}
                    onChange={(e) => setNewChallenge(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('challenges', newChallenge, setNewChallenge))}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. transitions, eye contact..."
                  />
                  <button type="button" onClick={() => addToArray('challenges', newChallenge, setNewChallenge)} className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.challenges.map((item, i) => (
                    <span key={i} className="flex items-center gap-1 bg-orange-50 text-orange-700 text-xs px-3 py-1.5 rounded-full">
                      {item}
                      <button type="button" onClick={() => removeFromArray('challenges', i)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Sensory */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sensory Needs</label>
                <div className="flex flex-wrap gap-2">
                  {SENSORY_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        const arr = form.sensory_sensitivities
                        if (arr.includes(opt)) removeFromArray('sensory_sensitivities', arr.indexOf(opt))
                        else setForm(prev => ({ ...prev, sensory_sensitivities: [...arr, opt] }))
                      }}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                        form.sensory_sensitivities.includes(opt)
                          ? 'bg-purple-50 border-purple-300 text-purple-700'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">School & Therapy</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                <input
                  type="text"
                  value={form.school_name}
                  onChange={(e) => update('school_name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="School name (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Therapies</label>
                <div className="flex flex-wrap gap-2">
                  {THERAPY_OPTIONS.map((therapy) => (
                    <button
                      key={therapy}
                      type="button"
                      onClick={() => {
                        const arr = form.therapies
                        if (arr.includes(therapy)) removeFromArray('therapies', arr.indexOf(therapy))
                        else setForm(prev => ({ ...prev, therapies: [...arr, therapy] }))
                      }}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                        form.therapies.includes(therapy)
                          ? 'bg-teal-50 border-teal-300 text-teal-700'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {therapy}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => update('notes', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Any other information about your child..."
                />
              </div>
            </>
          )}

          <div className="flex gap-3 pt-2">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(s => s - 1)}
                className="flex-1 border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            )}
            <button
              type="submit"
              disabled={loading || (step === 1 && !form.name)}
              className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {step < 3 ? 'Continue' : 'Create Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
