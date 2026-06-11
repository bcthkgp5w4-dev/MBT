'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Loader2, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { MCHAT_QUESTIONS } from '@/lib/constants'

const CRITICAL_ITEMS = [2, 5, 7, 9, 13, 14, 15]

function scoreMCHATR(responses: Record<number, boolean>): { score: number; risk: 'low' | 'medium' | 'high' } {
  let score = 0
  for (let i = 1; i <= 20; i++) {
    const q = MCHAT_QUESTIONS[i - 1]
    const answer = responses[i]
    // Most items: NO = concern; items 2, 5, 12 = YES = concern
    const concernAnswers = [2, 5, 12]
    const isConcern = concernAnswers.includes(i) ? answer === true : answer === false
    if (isConcern) score++
  }

  let risk: 'low' | 'medium' | 'high' = 'low'
  if (score >= 8) risk = 'high'
  else if (score >= 3) {
    const criticalConcerns = CRITICAL_ITEMS.filter(item => {
      const concernAnswers = [2, 5, 12]
      return concernAnswers.includes(item) ? responses[item] === true : responses[item] === false
    }).length
    risk = criticalConcerns >= 2 ? 'high' : 'medium'
  }

  return { score, risk }
}

export default function MCHATRPage() {
  const router = useRouter()
  const [currentQ, setCurrentQ] = useState(0)
  const [responses, setResponses] = useState<Record<number, boolean>>({})
  const [childId, setChildId] = useState('')
  const [loading, setLoading] = useState(false)
  const [children, setChildren] = useState<any[]>([])
  const [step, setStep] = useState<'select' | 'screening' | 'complete'>('select')
  const [result, setResult] = useState<any>(null)

  useState(() => {
    createClient().from('children').select('id, name').then(({ data }) => {
      if (data) setChildren(data)
      if (data?.length === 1) setChildId(data[0].id)
    })
  })

  function answer(value: boolean) {
    const qNum = currentQ + 1
    setResponses(prev => ({ ...prev, [qNum]: value }))
    if (currentQ < MCHAT_QUESTIONS.length - 1) {
      setCurrentQ(prev => prev + 1)
    }
  }

  async function handleSubmit() {
    if (Object.keys(responses).length < MCHAT_QUESTIONS.length) {
      toast.error('Please answer all questions')
      return
    }
    setLoading(true)
    try {
      const { score, risk } = scoreMCHATR(responses)
      const supabase = createClient()

      const summaries: Record<string, string> = {
        low: 'Low risk for autism. Continue monitoring development and consult your pediatrician at regular checkups.',
        medium: 'Medium risk identified. Follow-up M-CHAT-R/F interview recommended. Please consult a developmental pediatrician.',
        high: 'High risk for autism. Immediate referral to a developmental specialist is strongly recommended.',
      }

      const { data, error } = await supabase.from('screening_results').insert({
        child_id: childId,
        profile_id: (await supabase.auth.getUser()).data.user?.id,
        screening_type: 'mchat_r',
        responses,
        score,
        risk_level: risk,
        summary: summaries[risk],
        recommendations: risk === 'low'
          ? ['Continue regular developmental monitoring', 'Maintain well-child visits']
          : risk === 'medium'
          ? ['Schedule M-CHAT-R/F follow-up interview', 'Consult developmental pediatrician', 'Early intervention evaluation']
          : ['Urgent referral to developmental specialist', 'Early intervention services evaluation', 'Autism diagnostic evaluation', 'Connect with autism support resources'],
      }).select().single()

      if (error) throw error
      setResult({ score, risk, summary: summaries[risk] })
      setStep('complete')
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const progress = ((Object.keys(responses).length) / MCHAT_QUESTIONS.length) * 100
  const currentQuestion = MCHAT_QUESTIONS[currentQ]

  if (step === 'select') {
    return (
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">M-CHAT-R Screening</h1>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">🔍</div>
            <h2 className="text-lg font-semibold text-gray-900">Modified Checklist for Autism in Toddlers</h2>
            <p className="text-gray-500 text-sm mt-2">20 questions · 5-10 minutes · Ages 16-30 months</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-amber-800">This screening identifies risk indicators only — it does not diagnose autism.</p>
          </div>
          {children.length > 1 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Child</label>
              <select
                value={childId}
                onChange={(e) => setChildId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm"
              >
                <option value="">Choose a child...</option>
                {children.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          )}
          <button
            onClick={() => { if (childId) setStep('screening') }}
            disabled={!childId}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50"
          >
            Begin Screening
          </button>
        </div>
      </div>
    )
  }

  if (step === 'complete' && result) {
    const riskColors = {
      low: 'border-green-200 bg-green-50',
      medium: 'border-yellow-200 bg-yellow-50',
      high: 'border-red-200 bg-red-50',
    }
    const riskText = {
      low: 'text-green-800',
      medium: 'text-yellow-800',
      high: 'text-red-800',
    }

    return (
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-1">Screening Complete</h2>
          <p className="text-gray-500 text-sm mb-6">M-CHAT-R results for your child</p>

          <div className={`rounded-2xl border p-6 mb-6 text-left ${riskColors[result.risk as keyof typeof riskColors]}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Risk Level</span>
              <span className={`text-lg font-bold capitalize ${riskText[result.risk as keyof typeof riskText]}`}>
                {result.risk} Risk
              </span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">Score</span>
              <span className="text-gray-800 font-semibold">{result.score} / 20</span>
            </div>
            <p className={`text-sm ${riskText[result.risk as keyof typeof riskText]}`}>{result.summary}</p>
          </div>

          <div className="text-left bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-xs text-gray-500 font-medium mb-1">IMPORTANT DISCLAIMER</p>
            <p className="text-xs text-gray-600">
              This M-CHAT-R screening is a risk identification tool, not a diagnosis. Please consult a qualified
              healthcare professional — pediatrician, developmental pediatrician, or child psychologist — for proper evaluation.
            </p>
          </div>

          <div className="flex gap-3">
            <button onClick={() => router.push('/screening')} className="flex-1 border border-gray-200 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">
              Back to Screenings
            </button>
            <button onClick={() => router.push('/goals')} className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700">
              Create Goals
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => currentQ > 0 ? setCurrentQ(q => q - 1) : setStep('select')} className="p-2 rounded-lg hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-sm text-gray-500">{currentQ + 1} / {MCHAT_QUESTIONS.length}</span>
        <div />
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-100 rounded-full mb-8 overflow-hidden">
        <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        {currentQuestion.critical && (
          <span className="inline-flex items-center text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full mb-4">
            Key question
          </span>
        )}
        <h2 className="text-xl font-semibold text-gray-900 mb-8 leading-relaxed">
          {currentQuestion.question}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => answer(true)}
            className={`py-5 rounded-2xl font-semibold text-lg transition-colors border-2 ${
              responses[currentQ + 1] === true
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-200 text-gray-700 hover:border-green-300 hover:bg-green-50'
            }`}
          >
            ✓ Yes
          </button>
          <button
            onClick={() => answer(false)}
            className={`py-5 rounded-2xl font-semibold text-lg transition-colors border-2 ${
              responses[currentQ + 1] === false
                ? 'bg-red-400 border-red-400 text-white'
                : 'border-gray-200 text-gray-700 hover:border-red-300 hover:bg-red-50'
            }`}
          >
            ✗ No
          </button>
        </div>

        {currentQ === MCHAT_QUESTIONS.length - 1 && responses[currentQ + 1] !== undefined && (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-6 bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Get Results
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
