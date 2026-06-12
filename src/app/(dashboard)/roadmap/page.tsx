'use client'

import { useEffect, useState } from 'react'
import { Loader2, CheckCircle, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const COMMUNICATION_ROADMAP = [
  { id: 1, label: 'No verbal communication', level: 'nonverbal', milestones: ['Eye contact', 'Joint attention', 'Pointing to request', 'Understanding simple commands'] },
  { id: 2, label: 'Single words', level: 'single_words', milestones: ['10+ words', 'Labeling objects', 'Requesting with single words', 'Greetings'] },
  { id: 3, label: 'Two-word phrases', level: 'two_word_phrases', milestones: ['"More juice"', '"Go park"', 'Describing with 2 words', 'Simple questions'] },
  { id: 4, label: 'Simple sentences', level: 'simple_sentences', milestones: ['3-5 word sentences', 'Asking questions', 'Describing events', 'Using pronouns'] },
  { id: 5, label: 'Conversational', level: 'conversational', milestones: ['Back-and-forth conversation', 'Topic maintenance', 'Perspective taking', 'Narrative skills'] },
]

const SOCIAL_ROADMAP = [
  { stage: 1, label: 'Awareness', description: 'Notices others exist', targets: ['Eye contact', 'Response to name', 'Parallel play'] },
  { stage: 2, label: 'Interaction', description: 'Shows interest in others', targets: ['Initiating contact', 'Sharing', 'Simple turn-taking'] },
  { stage: 3, label: 'Play Skills', description: 'Engages in play with others', targets: ['Functional play', 'Cooperative play', 'Imaginative play'] },
  { stage: 4, label: 'Friendship', description: 'Building peer relationships', targets: ['Initiating friendships', 'Conflict resolution', 'Group participation'] },
]

export default function RoadmapPage() {
  const [children, setChildren] = useState<any[]>([])
  const [selectedChild, setSelectedChild] = useState<any>(null)
  const [_goals, setGoals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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
    createClient().from('goals').select('*').eq('child_id', selectedChild.id).then(({ data }) => {
      if (data) setGoals(data)
    })
  }, [selectedChild])

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>

  const currentLevelIndex = COMMUNICATION_ROADMAP.findIndex(l => l.level === selectedChild?.communication_level)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Developmental Roadmap</h1>
          <p className="text-gray-500 mt-1">Visual progression of developmental milestones</p>
        </div>
        {children.length > 1 && (
          <select
            value={selectedChild?.id}
            onChange={(e) => setSelectedChild(children.find(c => c.id === e.target.value))}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm"
          >
            {children.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        )}
      </div>

      {/* Communication Roadmap */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
          💬 Communication Journey
          {selectedChild?.name && <span className="text-sm text-gray-400 font-normal">— {selectedChild.name}</span>}
        </h2>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-100" />
          <div className="space-y-6">
            {COMMUNICATION_ROADMAP.map((stage, i) => {
              const isCurrent = i === currentLevelIndex
              const isCompleted = i < currentLevelIndex
              const isFuture = i > currentLevelIndex

              return (
                <div key={stage.id} className={`relative flex gap-4 ${isFuture ? 'opacity-50' : ''}`}>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 z-10 ${
                    isCompleted ? 'bg-green-500 border-green-500' :
                    isCurrent ? 'bg-blue-500 border-blue-500' :
                    'bg-white border-gray-200'
                  }`}>
                    {isCompleted ? <CheckCircle className="w-4 h-4 text-white" /> : <span className="text-xs font-bold text-gray-400">{stage.id}</span>}
                  </div>
                  <div className={`flex-1 pb-2 ${isCurrent ? 'bg-blue-50 rounded-xl p-4 -mt-1' : ''}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold ${isCurrent ? 'text-blue-800' : 'text-gray-900'}`}>
                        {stage.label}
                      </h3>
                      {isCurrent && <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full font-medium">Current Level</span>}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {stage.milestones.map((m, j) => (
                        <span key={j} className={`text-xs px-2 py-1 rounded-full ${
                          isCompleted ? 'bg-green-50 text-green-700' :
                          isCurrent ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-50 text-gray-500'
                        }`}>
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Social Roadmap */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-6">👥 Social Skills Journey</h2>
        <div className="grid sm:grid-cols-4 gap-4">
          {SOCIAL_ROADMAP.map((stage, i) => (
            <div key={stage.stage} className="text-center">
              <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-700 font-bold text-lg flex items-center justify-center mx-auto mb-3">
                {stage.stage}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{stage.label}</h3>
              <p className="text-xs text-gray-500 mb-3">{stage.description}</p>
              <ul className="space-y-1">
                {stage.targets.map((t, j) => (
                  <li key={j} className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-lg">{t}</li>
                ))}
              </ul>
              {i < SOCIAL_ROADMAP.length - 1 && (
                <ArrowRight className="w-4 h-4 text-gray-300 mx-auto mt-3 hidden sm:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
