'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Loader2, CheckCircle, Languages, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { MCHAT_QUESTIONS } from '@/lib/constants'

const CRITICAL_ITEMS = [2, 5, 7, 9, 13, 14, 15]
const YES_CONCERN_ITEMS = [2, 5, 12]

function scoreMCHATR(responses: Record<number, boolean>): { score: number; risk: 'low' | 'medium' | 'high' } {
  let score = 0
  for (let i = 1; i <= 20; i++) {
    const answer = responses[i]
    const isConcern = YES_CONCERN_ITEMS.includes(i) ? answer === true : answer === false
    if (isConcern) score++
  }

  let risk: 'low' | 'medium' | 'high' = 'low'
  if (score >= 8) risk = 'high'
  else if (score >= 3) {
    const criticalConcerns = CRITICAL_ITEMS.filter(item =>
      YES_CONCERN_ITEMS.includes(item) ? responses[item] === true : responses[item] === false
    ).length
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
  const [generatingGoals, setGeneratingGoals] = useState(false)
  const [children, setChildren] = useState<any[]>([])
  const [step, setStep] = useState<'select' | 'screening' | 'complete'>('select')
  const [result, setResult] = useState<any>(null)
  const [generatedGoals, setGeneratedGoals] = useState<any[]>([])
  const [lang, setLang] = useState<'en' | 'ur'>('en')

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
      const summaries_ur: Record<string, string> = {
        low: 'آٹزم کا خطرہ کم ہے۔ ترقی کی نگرانی جاری رکھیں اور باقاعدہ چیک اپ میں اپنے ڈاکٹر سے مشورہ کریں۔',
        medium: 'درمیانی خطرہ پایا گیا۔ M-CHAT-R/F فالو اپ انٹرویو کی سفارش کی جاتی ہے۔ براہ کرم ترقیاتی ماہر اطفال سے مشورہ کریں۔',
        high: 'آٹزم کا زیادہ خطرہ ہے۔ ترقیاتی ماہر کو فوری طور پر ریفر کرنے کی سخت سفارش کی جاتی ہے۔',
      }

      const { data: _data, error } = await supabase.from('screening_results').insert({
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
      setResult({ score, risk, summary: summaries[risk], summary_ur: summaries_ur[risk] })
      setStep('complete')

      // Auto-generate goals for medium/high risk
      if (risk !== 'low') {
        setGeneratingGoals(true)
        fetch('/api/screening/generate-goals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ childId, responses, riskLevel: risk }),
        })
          .then(r => r.json())
          .then(d => { if (d.goals?.length) setGeneratedGoals(d.goals) })
          .finally(() => setGeneratingGoals(false))
      }
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const progress = (Object.keys(responses).length / MCHAT_QUESTIONS.length) * 100
  const currentQuestion = MCHAT_QUESTIONS[currentQ]

  const LangToggle = () => (
    <button
      onClick={() => setLang(l => l === 'en' ? 'ur' : 'en')}
      className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
    >
      <Languages className="w-3.5 h-3.5" />
      {lang === 'en' ? 'اردو' : 'English'}
    </button>
  )

  if (step === 'select') {
    return (
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-gray-100">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">M-CHAT-R Screening</h1>
          </div>
          <LangToggle />
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">🔍</div>
            <h2 className="text-lg font-semibold text-gray-900">
              {lang === 'en' ? 'Modified Checklist for Autism in Toddlers' : 'چھوٹے بچوں میں آٹزم کی جانچ'}
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              {lang === 'en' ? '20 questions · 5-10 minutes · Ages 16-30 months' : '20 سوالات · 5-10 منٹ · عمر 16-30 ماہ'}
            </p>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-amber-800" dir={lang === 'ur' ? 'rtl' : 'ltr'}>
              {lang === 'en'
                ? 'This screening identifies risk indicators only — it does not diagnose autism.'
                : 'یہ اسکریننگ صرف خطرے کی علامات کی نشاندہی کرتی ہے — یہ آٹزم کی تشخیص نہیں ہے۔'}
            </p>
          </div>
          {children.length > 1 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {lang === 'en' ? 'Select Child' : 'بچہ منتخب کریں'}
              </label>
              <select
                value={childId}
                onChange={(e) => setChildId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm"
              >
                <option value="">{lang === 'en' ? 'Choose a child...' : 'بچہ منتخب کریں...'}</option>
                {children.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          )}
          <button
            onClick={() => { if (childId) setStep('screening') }}
            disabled={!childId}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50"
          >
            {lang === 'en' ? 'Begin Screening' : 'اسکریننگ شروع کریں'}
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
    const riskText = { low: 'text-green-800', medium: 'text-yellow-800', high: 'text-red-800' }

    return (
      <div className="max-w-xl mx-auto">
        <div className="flex justify-end mb-4"><LangToggle /></div>
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            {lang === 'en' ? 'Screening Complete' : 'اسکریننگ مکمل'}
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            {lang === 'en' ? 'M-CHAT-R results for your child' : 'آپ کے بچے کے M-CHAT-R نتائج'}
          </p>

          <div className={`rounded-2xl border p-6 mb-6 text-left ${riskColors[result.risk as keyof typeof riskColors]}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                {lang === 'en' ? 'Risk Level' : 'خطرے کی سطح'}
              </span>
              <span className={`text-lg font-bold capitalize ${riskText[result.risk as keyof typeof riskText]}`}>
                {result.risk === 'low' ? (lang === 'en' ? 'Low Risk' : 'کم خطرہ')
                  : result.risk === 'medium' ? (lang === 'en' ? 'Medium Risk' : 'درمیانی خطرہ')
                  : (lang === 'en' ? 'High Risk' : 'زیادہ خطرہ')}
              </span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">
                {lang === 'en' ? 'Score' : 'اسکور'}
              </span>
              <span className="text-gray-800 font-semibold">{result.score} / 20</span>
            </div>
            <p className={`text-sm ${riskText[result.risk as keyof typeof riskText]}`} dir={lang === 'ur' ? 'rtl' : 'ltr'}>
              {lang === 'en' ? result.summary : result.summary_ur}
            </p>
          </div>

          {/* Auto-generated goals */}
          {(generatingGoals || generatedGoals.length > 0) && (
            <div className="bg-purple-50 rounded-2xl border border-purple-100 p-5 mb-6 text-left">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <h3 className="font-semibold text-purple-900 text-sm">
                  {lang === 'en' ? 'AI-Generated Goals Based on Results' : 'نتائج کی بنیاد پر AI اہداف'}
                </h3>
              </div>
              {generatingGoals ? (
                <div className="flex items-center gap-2 text-sm text-purple-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {lang === 'en' ? 'Generating personalized goals...' : 'ذاتی اہداف بنائے جا رہے ہیں...'}
                </div>
              ) : (
                <div className="space-y-2">
                  {generatedGoals.map((goal, i) => (
                    <div key={i} className="bg-white rounded-xl p-3 border border-purple-100">
                      <p className="text-sm font-medium text-gray-900">{goal.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 capitalize">{goal.domain} · {goal.timeline_weeks}w</p>
                      {goal.measurement_criteria && (
                        <p className="text-xs text-purple-700 mt-1">
                          📏 {lang === 'en' ? 'Measure:' : 'پیمائش:'} {goal.measurement_criteria}
                        </p>
                      )}
                    </div>
                  ))}
                  <p className="text-xs text-purple-600 mt-2">
                    {lang === 'en'
                      ? `${generatedGoals.length} goals added to your Goals page`
                      : `${generatedGoals.length} اہداف آپ کے Goals صفحے میں شامل کر دیے گئے`}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="text-left bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-xs text-gray-500 font-medium mb-1">
              {lang === 'en' ? 'IMPORTANT DISCLAIMER' : 'اہم نوٹ'}
            </p>
            <p className="text-xs text-gray-600" dir={lang === 'ur' ? 'rtl' : 'ltr'}>
              {lang === 'en'
                ? 'This M-CHAT-R screening is a risk identification tool, not a diagnosis. Please consult a qualified healthcare professional for proper evaluation.'
                : 'یہ M-CHAT-R اسکریننگ خطرے کی نشاندہی کا آلہ ہے، تشخیص نہیں۔ براہ کرم مناسب تشخیص کے لیے کسی قابل صحت کی دیکھ بھال پیشہ ور سے مشورہ کریں۔'}
            </p>
          </div>

          <div className="flex gap-3">
            <button onClick={() => router.push('/screening')} className="flex-1 border border-gray-200 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">
              {lang === 'en' ? 'Back to Screenings' : 'اسکریننگ پر واپس'}
            </button>
            <button onClick={() => router.push('/goals')} className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700">
              {lang === 'en' ? 'View Goals' : 'اہداف دیکھیں'}
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
        <LangToggle />
      </div>

      <div className="h-2 bg-gray-100 rounded-full mb-8 overflow-hidden">
        <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        {currentQuestion.critical && (
          <span className="inline-flex items-center text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full mb-4">
            {lang === 'en' ? 'Key question' : 'اہم سوال'}
          </span>
        )}
        <h2
          className={`text-xl font-semibold text-gray-900 mb-8 leading-relaxed ${lang === 'ur' ? 'text-right' : ''}`}
          dir={lang === 'ur' ? 'rtl' : 'ltr'}
        >
          {lang === 'en' ? currentQuestion.question : (currentQuestion as any).question_ur}
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
            {lang === 'en' ? '✓ Yes' : '✓ ہاں'}
          </button>
          <button
            onClick={() => answer(false)}
            className={`py-5 rounded-2xl font-semibold text-lg transition-colors border-2 ${
              responses[currentQ + 1] === false
                ? 'bg-red-400 border-red-400 text-white'
                : 'border-gray-200 text-gray-700 hover:border-red-300 hover:bg-red-50'
            }`}
          >
            {lang === 'en' ? '✗ No' : '✗ نہیں'}
          </button>
        </div>

        {currentQ === MCHAT_QUESTIONS.length - 1 && responses[currentQ + 1] !== undefined && (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-6 bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {lang === 'en' ? 'Get Results' : 'نتائج دیکھیں'}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
