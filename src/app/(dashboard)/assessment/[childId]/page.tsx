'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, ArrowRight, Loader2, Languages, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { DOMAINS, QUESTIONS, RESPONSE_LABELS, RESPONSE_LABELS_UR, type ResponseValue, type DomainId } from '@/lib/assessment/questions'

const RESPONSE_COLORS: Record<ResponseValue, string> = {
  always: 'bg-green-500 border-green-500 text-white',
  often: 'bg-blue-500 border-blue-500 text-white',
  sometimes: 'bg-yellow-400 border-yellow-400 text-white',
  never: 'bg-gray-400 border-gray-400 text-white',
}
const RESPONSE_HOVER: Record<ResponseValue, string> = {
  always: 'hover:bg-green-50 hover:border-green-400 text-gray-700',
  often: 'hover:bg-blue-50 hover:border-blue-400 text-gray-700',
  sometimes: 'hover:bg-yellow-50 hover:border-yellow-300 text-gray-700',
  never: 'hover:bg-gray-100 hover:border-gray-300 text-gray-700',
}
const RESPONSES: ResponseValue[] = ['always', 'often', 'sometimes', 'never']

export default function AssessmentWizard() {
  const router = useRouter()
  const { childId } = useParams() as { childId: string }
  const [lang, setLang] = useState<'en' | 'ur'>('en')
  const [child, setChild] = useState<any>(null)
  const [step, setStep] = useState<'intro' | 'assessment' | 'submitting'>('intro')
  const [domainIdx, setDomainIdx] = useState(0)
  const [questionIdx, setQuestionIdx] = useState(0)
  const [responses, setResponses] = useState<Record<number, ResponseValue>>({})
  const [submitting, setSubmitting] = useState(false)

  const currentDomain = DOMAINS[domainIdx]
  const domainQuestions = QUESTIONS.filter(q => q.domain === currentDomain?.id)
  const currentQuestion = domainQuestions[questionIdx]

  const totalAnswered = Object.keys(responses).length
  const totalQuestions = QUESTIONS.length
  const progress = (totalAnswered / totalQuestions) * 100

  useEffect(() => {
    createClient().from('children').select('id, name, date_of_birth, communication_level, diagnosis_status, therapies')
      .eq('id', childId).single()
      .then(({ data }) => setChild(data))
  }, [childId])

  function selectResponse(value: ResponseValue) {
    setResponses(prev => ({ ...prev, [currentQuestion.id]: value }))
    // Auto-advance
    setTimeout(() => {
      if (questionIdx < domainQuestions.length - 1) {
        setQuestionIdx(i => i + 1)
      } else if (domainIdx < DOMAINS.length - 1) {
        setDomainIdx(i => i + 1)
        setQuestionIdx(0)
      }
      // last domain last question — user clicks Submit
    }, 200)
  }

  function goBack() {
    if (questionIdx > 0) {
      setQuestionIdx(i => i - 1)
    } else if (domainIdx > 0) {
      setDomainIdx(i => i - 1)
      const prevDomainQs = QUESTIONS.filter(q => q.domain === DOMAINS[domainIdx - 1].id)
      setQuestionIdx(prevDomainQs.length - 1)
    } else {
      setStep('intro')
    }
  }

  async function handleSubmit() {
    const unanswered = QUESTIONS.filter(q => responses[q.id] === undefined)
    if (unanswered.length > 0) {
      toast.error(`Please answer all questions. ${unanswered.length} remaining.`)
      // Navigate to first unanswered
      const firstUnanswered = unanswered[0]
      const dIdx = DOMAINS.findIndex(d => d.id === firstUnanswered.domain)
      const dQuestions = QUESTIONS.filter(q => q.domain === firstUnanswered.domain)
      const qIdx = dQuestions.findIndex(q => q.id === firstUnanswered.id)
      setDomainIdx(dIdx)
      setQuestionIdx(qIdx)
      return
    }

    setSubmitting(true)
    setStep('submitting')
    try {
      const res = await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ childId, responses }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      router.push(`/assessment/${childId}/results?assessmentId=${data.assessmentId}`)
    } catch (err: any) {
      toast.error(err.message || 'Submission failed')
      setStep('assessment')
    } finally {
      setSubmitting(false)
    }
  }

  const LangToggle = () => (
    <button onClick={() => setLang(l => l === 'en' ? 'ur' : 'en')}
      className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50">
      <Languages className="w-3.5 h-3.5" />
      {lang === 'en' ? 'اردو' : 'English'}
    </button>
  )

  if (!child) return (
    <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>
  )

  if (step === 'submitting') return (
    <div className="max-w-xl mx-auto flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        {lang === 'en' ? 'Analyzing your responses...' : 'جوابات کا تجزیہ ہو رہا ہے...'}
      </h2>
      <p className="text-gray-500 text-sm">
        {lang === 'en'
          ? 'Generating your child\'s developmental profile, priority areas, goals, and therapy plan. This takes about 10–15 seconds.'
          : 'آپ کے بچے کا ترقیاتی پروفائل، اہداف اور علاج کا منصوبہ بنایا جا رہا ہے۔'}
      </p>
    </div>
  )

  if (step === 'intro') return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {lang === 'en' ? 'Developmental Assessment' : 'ترقیاتی جائزہ'}
            </h1>
            <p className="text-sm text-gray-500">{child.name}</p>
          </div>
        </div>
        <LangToggle />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-4">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🧠</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {lang === 'en' ? `Let\'s understand ${child.name}\'s current abilities` : `آئیے ${child.name} کی موجودہ صلاحیتیں سمجھتے ہیں`}
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            {lang === 'en'
              ? 'This is not a diagnosis tool. It identifies where your child is today and creates a personalized therapy plan for what to teach next.'
              : 'یہ تشخیصی آلہ نہیں ہے۔ یہ آپ کے بچے کی موجودہ سطح جانتا ہے اور آگے کیا سکھانا ہے اس کا منصوبہ بناتا ہے۔'}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 mb-8">
          {DOMAINS.map(d => (
            <div key={d.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <span className="text-2xl">{d.emoji}</span>
              <div>
                <p className="text-sm font-medium text-gray-900">{lang === 'en' ? d.label : d.label_ur}</p>
                <p className="text-xs text-gray-400">{lang === 'en' ? d.description : ''}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-blue-800" dir={lang === 'ur' ? 'rtl' : 'ltr'}>
            {lang === 'en'
              ? '64 questions across 8 areas · 15–20 minutes · Answer based on what your child can do consistently right now.'
              : '8 شعبوں میں 64 سوالات · 15-20 منٹ · جواب اس بنیاد پر دیں جو آپ کا بچہ ابھی مستقل طور پر کر سکتا ہے۔'}
          </p>
        </div>

        <button
          onClick={() => setStep('assessment')}
          className="w-full bg-blue-600 text-white font-semibold py-4 rounded-xl hover:bg-blue-700 flex items-center justify-center gap-2 text-base"
        >
          {lang === 'en' ? 'Begin Assessment' : 'جائزہ شروع کریں'}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )

  // Assessment screen
  const isLastQuestion = domainIdx === DOMAINS.length - 1 && questionIdx === domainQuestions.length - 1
  const domainAnswered = domainQuestions.filter(q => responses[q.id] !== undefined).length

  return (
    <div className="max-w-xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={goBack} className="p-2 rounded-lg hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <p className="text-xs text-gray-400">{lang === 'en' ? 'Question' : 'سوال'} {totalAnswered + (responses[currentQuestion?.id] !== undefined ? 0 : 0)} / {totalQuestions}</p>
        </div>
        <LangToggle />
      </div>

      {/* Overall progress */}
      <div className="h-1.5 bg-gray-100 rounded-full mb-4 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      {/* Domain tabs */}
      <div className="flex gap-1.5 mb-6 overflow-x-auto pb-1">
        {DOMAINS.map((d, i) => {
          const dQs = QUESTIONS.filter(q => q.domain === d.id)
          const answered = dQs.filter(q => responses[q.id] !== undefined).length
          const isActive = i === domainIdx
          const isDone = answered === dQs.length
          return (
            <button
              key={d.id}
              onClick={() => { setDomainIdx(i); setQuestionIdx(0) }}
              className={`shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                isActive ? 'bg-blue-600 text-white' : isDone ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <span>{d.emoji}</span>
              <span className="hidden sm:inline">{lang === 'en' ? d.label : d.label_ur}</span>
              {isDone && <span>✓</span>}
            </button>
          )
        })}
      </div>

      {/* Question card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
        {/* Domain header */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">{currentDomain.emoji}</span>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              {lang === 'en' ? currentDomain.label : currentDomain.label_ur}
            </p>
            <p className="text-xs text-gray-400">{domainAnswered}/{domainQuestions.length} {lang === 'en' ? 'answered' : 'جوابات'}</p>
          </div>
        </div>

        {/* Question */}
        <h2
          className={`text-lg font-semibold text-gray-900 mb-6 leading-relaxed ${lang === 'ur' ? 'text-right' : ''}`}
          dir={lang === 'ur' ? 'rtl' : 'ltr'}
        >
          {lang === 'en' ? currentQuestion?.text : currentQuestion?.text_ur}
        </h2>

        {/* Response options */}
        <div className="grid grid-cols-2 gap-3">
          {RESPONSES.map(r => {
            const isSelected = responses[currentQuestion?.id] === r
            return (
              <button
                key={r}
                onClick={() => selectResponse(r)}
                className={`py-4 rounded-2xl font-semibold text-sm border-2 transition-all ${
                  isSelected ? RESPONSE_COLORS[r] : `border-gray-200 ${RESPONSE_HOVER[r]}`
                }`}
              >
                {lang === 'en' ? RESPONSE_LABELS[r] : RESPONSE_LABELS_UR[r]}
              </button>
            )
          })}
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-3 mt-6">
          {questionIdx > 0 || domainIdx > 0 ? (
            <button onClick={goBack} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
              <ArrowLeft className="w-4 h-4" />
              {lang === 'en' ? 'Back' : 'واپس'}
            </button>
          ) : <div />}

          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              disabled={submitting || responses[currentQuestion?.id] === undefined}
              className="ml-auto flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {lang === 'en' ? 'Generate My Plan' : 'میرا منصوبہ بنائیں'}
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : responses[currentQuestion?.id] !== undefined ? (
            <button
              onClick={() => {
                if (questionIdx < domainQuestions.length - 1) setQuestionIdx(i => i + 1)
                else { setDomainIdx(i => i + 1); setQuestionIdx(0) }
              }}
              className="ml-auto flex items-center gap-1 text-sm text-blue-600 font-medium hover:text-blue-800"
            >
              {lang === 'en' ? 'Next' : 'اگلا'}
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Domain progress mini-bar */}
      <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-400 rounded-full transition-all"
          style={{ width: `${(domainAnswered / domainQuestions.length) * 100}%` }}
        />
      </div>
      <p className="text-xs text-gray-400 text-center mt-1">
        {lang === 'en' ? currentDomain.description : ''}
      </p>
    </div>
  )
}
