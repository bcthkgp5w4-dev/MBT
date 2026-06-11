'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Loader2, CheckCircle, Languages } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

const SECTIONS = [
  {
    id: 'receptive',
    label: 'Receptive Language (Understanding)',
    label_ur: 'سمجھنے کی صلاحیت',
    color: 'text-blue-600 bg-blue-50',
    questions: [
      { id: 1, en: 'Responds to their own name', ur: 'اپنا نام سن کر جواب دیتا ہے', ageMonths: 9 },
      { id: 2, en: 'Understands "no" and simple commands like "come here"', ur: '"نہیں" اور سادہ حکم جیسے "یہاں آؤ" سمجھتا ہے', ageMonths: 12 },
      { id: 3, en: 'Points to familiar objects or people when named', ur: 'نام لینے پر مانوس چیزوں یا لوگوں کی طرف اشارہ کرتا ہے', ageMonths: 15 },
      { id: 4, en: 'Follows 2-step instructions (e.g., "get your shoes and bring them here")', ur: '2 مراحل کی ہدایت پر عمل کرتا ہے', ageMonths: 24 },
      { id: 5, en: 'Understands basic concepts: big/small, in/out, up/down', ur: 'بنیادی تصورات سمجھتا ہے جیسے بڑا/چھوٹا، اندر/باہر، اوپر/نیچے', ageMonths: 30 },
      { id: 6, en: 'Follows a 3-part command without visual cues', ur: 'بصری اشارے کے بغیر 3 حصوں کی ہدایت پر عمل کرتا ہے', ageMonths: 36 },
      { id: 7, en: 'Understands "who", "what", and "where" questions', ur: '"کون"، "کیا" اور "کہاں" کے سوالات سمجھتا ہے', ageMonths: 48 },
    ],
  },
  {
    id: 'expressive',
    label: 'Expressive Language (Speaking)',
    label_ur: 'بولنے کی صلاحیت',
    color: 'text-purple-600 bg-purple-50',
    questions: [
      { id: 8, en: 'Uses gestures to communicate (points, waves, reaches)', ur: 'بات چیت کے لیے اشارے کرتا ہے جیسے اشارہ کرنا، لہرانا', ageMonths: 12 },
      { id: 9, en: 'Uses at least 10 single words consistently', ur: 'مستقل طور پر کم از کم 10 الفاظ استعمال کرتا ہے', ageMonths: 18 },
      { id: 10, en: 'Uses 2-word combinations ("more juice", "daddy go")', ur: '2 الفاظ ملا کر بولتا ہے جیسے "اور جوس"، "ابو جاؤ"', ageMonths: 24 },
      { id: 11, en: 'Uses 3-4 word sentences', ur: '3-4 الفاظ کے جملے بولتا ہے', ageMonths: 30 },
      { id: 12, en: 'Uses pronouns (I, me, you, we)', ur: 'ضمائر استعمال کرتا ہے جیسے میں، مجھے، تم، ہم', ageMonths: 36 },
      { id: 13, en: 'Can retell a simple story or event', ur: 'ایک سادہ کہانی یا واقعہ دوبارہ سنا سکتا ہے', ageMonths: 48 },
      { id: 14, en: 'Uses language to ask questions, make requests, and comment', ur: 'سوال پوچھنے، درخواست کرنے اور تبصرہ کرنے کے لیے زبان استعمال کرتا ہے', ageMonths: 48 },
    ],
  },
  {
    id: 'pragmatic',
    label: 'Pragmatic Language (Social Use)',
    label_ur: 'سماجی بات چیت',
    color: 'text-green-600 bg-green-50',
    questions: [
      { id: 15, en: 'Makes eye contact during communication', ur: 'بات چیت کے دوران آنکھ ملاتا ہے', ageMonths: 12 },
      { id: 16, en: 'Initiates communication (starts conversations or interactions)', ur: 'بات چیت شروع کرتا ہے', ageMonths: 18 },
      { id: 17, en: 'Takes turns in conversation (listens, then responds)', ur: 'گفتگو میں باری لیتا ہے یعنی سنتا ہے پھر جواب دیتا ہے', ageMonths: 24 },
      { id: 18, en: 'Adjusts language for different listeners (speaks differently to adults vs. peers)', ur: 'مختلف لوگوں کے لیے زبان کو ڈھالتا ہے', ageMonths: 36 },
      { id: 19, en: 'Stays on topic in conversation', ur: 'گفتگو میں موضوع پر رہتا ہے', ageMonths: 42 },
      { id: 20, en: 'Uses appropriate greetings and farewells', ur: 'مناسب سلام اور الوداع کہتا ہے', ageMonths: 36 },
      { id: 21, en: 'Understands and uses non-literal language (jokes, sarcasm)', ur: 'لطیفے اور طنز جیسی غیر لفظی زبان سمجھتا اور استعمال کرتا ہے', ageMonths: 72 },
    ],
  },
  {
    id: 'phonological',
    label: 'Speech Clarity',
    label_ur: 'بولنے کی وضاحت',
    color: 'text-orange-600 bg-orange-50',
    questions: [
      { id: 22, en: 'Babbles with varied sounds (ba, da, ga, ma)', ur: 'مختلف آوازوں سے بڑبڑاتا ہے جیسے با، دا، گا، ما', ageMonths: 9 },
      { id: 23, en: 'Parents can understand most of what child says', ur: 'والدین بچے کی زیادہ تر باتیں سمجھ لیتے ہیں', ageMonths: 24 },
      { id: 24, en: 'Strangers can understand most of what child says', ur: 'انجان لوگ بچے کی زیادہ تر باتیں سمجھ لیتے ہیں', ageMonths: 36 },
      { id: 25, en: 'Produces most speech sounds correctly for their age', ur: 'اپنی عمر کے مطابق زیادہ تر آوازیں درست طریقے سے نکالتا ہے', ageMonths: 48 },
    ],
  },
]

const ALL_QUESTIONS = SECTIONS.flatMap(s => s.questions.map(q => ({ ...q, sectionId: s.id })))

function scoreResults(responses: Record<number, boolean>) {
  const domainScores: Record<string, { total: number; achieved: number }> = {}
  for (const s of SECTIONS) {
    const achieved = s.questions.filter(q => responses[q.id] === true).length
    domainScores[s.id] = { total: s.questions.length, achieved }
  }
  const totalAchieved = Object.values(domainScores).reduce((a, b) => a + b.achieved, 0)
  const totalQs = ALL_QUESTIONS.length
  const pct = Math.round((totalAchieved / totalQs) * 100)
  const concerns = totalQs - totalAchieved
  const risk: 'low' | 'medium' | 'high' = concerns <= 3 ? 'low' : concerns <= 8 ? 'medium' : 'high'
  return { domainScores, pct, concerns, risk }
}

export default function CommunicationPage() {
  const router = useRouter()
  const [lang, setLang] = useState<'en' | 'ur'>('en')
  const [step, setStep] = useState<'select' | 'screening' | 'complete'>('select')
  const [children, setChildren] = useState<any[]>([])
  const [childId, setChildId] = useState('')
  const [currentIdx, setCurrentIdx] = useState(0)
  const [responses, setResponses] = useState<Record<number, boolean>>({})
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  useState(() => {
    createClient().from('children').select('id, name').then(({ data }) => {
      if (data) { setChildren(data); if (data.length === 1) setChildId(data[0].id) }
    })
  })

  function answer(value: boolean) {
    const q = ALL_QUESTIONS[currentIdx]
    setResponses(prev => ({ ...prev, [q.id]: value }))
    if (currentIdx < ALL_QUESTIONS.length - 1) setCurrentIdx(i => i + 1)
  }

  async function handleSubmit() {
    setLoading(true)
    try {
      const { domainScores, pct, concerns, risk } = scoreResults(responses)
      const supabase = createClient()
      const userId = (await supabase.auth.getUser()).data.user?.id

      const weakDomains = Object.entries(domainScores)
        .filter(([, v]) => v.achieved < v.total * 0.7)
        .map(([k]) => k)

      const { error } = await supabase.from('screening_results').insert({
        child_id: childId,
        profile_id: userId,
        screening_type: 'communication',
        responses,
        score: pct,
        risk_level: risk,
        summary: `Communication assessment complete. ${pct}% of skills achieved. ${concerns} skill gap(s) identified.${weakDomains.length > 0 ? ` Focus areas: ${weakDomains.join(', ')}.` : ''}`,
        recommendations: risk === 'low'
          ? ['Communication development is on track', 'Continue reading and talking with your child daily', 'Attend regular well-child visits']
          : risk === 'medium'
          ? ['Consult a Speech-Language Pathologist for evaluation', 'Practice language activities at home daily', 'Read books together and narrate daily activities']
          : ['Immediate referral to Speech-Language Pathologist recommended', 'Consider AAC (Augmentative and Alternative Communication) evaluation', 'Early intervention speech therapy services', 'Language enrichment at home'],
        ai_analysis: { domainScores, weakDomains },
      })
      if (error) throw error
      setResult({ domainScores, pct, concerns, risk })
      setStep('complete')
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const LangToggle = () => (
    <button onClick={() => setLang(l => l === 'en' ? 'ur' : 'en')}
      className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50">
      <Languages className="w-3.5 h-3.5" />
      {lang === 'en' ? 'اردو' : 'English'}
    </button>
  )

  if (step === 'select') return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-gray-100"><ArrowLeft className="w-5 h-5" /></button>
          <h1 className="text-2xl font-bold text-gray-900">{lang === 'en' ? 'Communication Assessment' : 'بات چیت کا جائزہ'}</h1>
        </div>
        <LangToggle />
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">💬</div>
          <h2 className="text-lg font-semibold text-gray-900">{lang === 'en' ? 'Language & Communication Evaluation' : 'زبان اور بات چیت کا جائزہ'}</h2>
          <p className="text-gray-500 text-sm mt-2">{lang === 'en' ? '25 questions · 10-15 min · Ages 0-8 years' : '25 سوالات · 10-15 منٹ · عمر 0-8 سال'}</p>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-6">
          {SECTIONS.map(s => (
            <div key={s.id} className={`rounded-xl px-3 py-2 text-xs font-medium ${s.color}`}>
              {lang === 'en' ? s.label : s.label_ur}
            </div>
          ))}
        </div>
        <div className="bg-amber-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-amber-800" dir={lang === 'ur' ? 'rtl' : 'ltr'}>
            {lang === 'en'
              ? 'Answer "Yes" only if your child does this consistently, not just occasionally.'
              : 'صرف "ہاں" کہیں اگر آپ کا بچہ یہ مستقل طور پر کرتا ہے، نہ کہ کبھی کبھار۔'}
          </p>
        </div>
        {children.length > 1 && (
          <div className="mb-4">
            <select value={childId} onChange={e => setChildId(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm">
              <option value="">{lang === 'en' ? 'Choose a child...' : 'بچہ منتخب کریں...'}</option>
              {children.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        )}
        <button onClick={() => { if (childId) setStep('screening') }} disabled={!childId}
          className="w-full bg-orange-500 text-white font-semibold py-3 rounded-xl hover:bg-orange-600 disabled:opacity-50">
          {lang === 'en' ? 'Begin Assessment' : 'جائزہ شروع کریں'}
        </button>
      </div>
    </div>
  )

  if (step === 'complete' && result) {
    const riskColors = { low: 'bg-green-50 border-green-200', medium: 'bg-yellow-50 border-yellow-200', high: 'bg-red-50 border-red-200' }
    const riskText = { low: 'text-green-700', medium: 'text-yellow-700', high: 'text-red-700' }
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-end mb-4"><LangToggle /></div>
        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          <div className="text-center mb-6">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-gray-900">{lang === 'en' ? 'Assessment Complete' : 'جائزہ مکمل'}</h2>
          </div>

          <div className={`rounded-2xl border p-5 mb-6 ${riskColors[result.risk as keyof typeof riskColors]}`}>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-600">{lang === 'en' ? 'Overall Result' : 'مجموعی نتیجہ'}</span>
              <span className={`font-bold text-lg ${riskText[result.risk as keyof typeof riskText]}`}>
                {result.risk === 'low' ? (lang === 'en' ? 'On Track' : 'ٹھیک ہے') : result.risk === 'medium' ? (lang === 'en' ? 'Some Concerns' : 'کچھ تشویش') : (lang === 'en' ? 'Needs Support' : 'مدد کی ضرورت')}
              </span>
            </div>
            <div className="h-3 bg-white rounded-full overflow-hidden mb-2">
              <div className="h-full bg-orange-500 rounded-full" style={{ width: `${result.pct}%` }} />
            </div>
            <p className="text-xs text-gray-500">{lang === 'en' ? `${result.pct}% of communication skills on track` : `${result.pct}% مہارتیں درست سطح پر`}</p>
          </div>

          <div className="space-y-3 mb-6">
            {SECTIONS.map(s => {
              const scores = result.domainScores[s.id]
              const pct = Math.round((scores.achieved / scores.total) * 100)
              return (
                <div key={s.id} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">{lang === 'en' ? s.label : s.label_ur}</span>
                    <span className="text-xs text-gray-500">{scores.achieved}/{scores.total}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${pct >= 70 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex gap-3">
            <button onClick={() => router.push('/screening')} className="flex-1 border border-gray-200 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">
              {lang === 'en' ? 'Back' : 'واپس'}
            </button>
            <button onClick={() => router.push('/goals')} className="flex-1 bg-orange-500 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-orange-600">
              {lang === 'en' ? 'View Goals' : 'اہداف دیکھیں'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  const current = ALL_QUESTIONS[currentIdx]
  const currentSection = SECTIONS.find(s => s.id === current.sectionId)!
  const progress = (currentIdx / ALL_QUESTIONS.length) * 100

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => currentIdx > 0 ? setCurrentIdx(i => i - 1) : setStep('select')} className="p-2 rounded-lg hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-sm text-gray-500">{currentIdx + 1} / {ALL_QUESTIONS.length}</span>
        <LangToggle />
      </div>
      <div className="h-2 bg-gray-100 rounded-full mb-3 overflow-hidden">
        <div className="h-full bg-orange-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
      </div>
      <p className="text-xs text-center mb-6">
        <span className={`font-medium px-2 py-0.5 rounded-full ${currentSection.color}`}>
          {lang === 'en' ? currentSection.label : currentSection.label_ur}
        </span>
      </p>

      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <p className="text-xs text-gray-400 mb-2">{lang === 'en' ? `Typical age: ~${current.ageMonths} months` : `عام عمر: تقریباً ${current.ageMonths} ماہ`}</p>
        <h2 className={`text-xl font-semibold text-gray-900 mb-8 leading-relaxed ${lang === 'ur' ? 'text-right' : ''}`} dir={lang === 'ur' ? 'rtl' : 'ltr'}>
          {lang === 'en' ? current.en : current.ur}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => answer(true)}
            className={`py-5 rounded-2xl font-semibold text-lg border-2 transition-colors ${responses[current.id] === true ? 'bg-green-500 border-green-500 text-white' : 'border-gray-200 text-gray-700 hover:border-green-300 hover:bg-green-50'}`}>
            {lang === 'en' ? '✓ Yes' : '✓ ہاں'}
          </button>
          <button onClick={() => answer(false)}
            className={`py-5 rounded-2xl font-semibold text-lg border-2 transition-colors ${responses[current.id] === false ? 'bg-red-400 border-red-400 text-white' : 'border-gray-200 text-gray-700 hover:border-red-300 hover:bg-red-50'}`}>
            {lang === 'en' ? '✗ No' : '✗ نہیں'}
          </button>
        </div>
        {currentIdx === ALL_QUESTIONS.length - 1 && responses[current.id] !== undefined && (
          <button onClick={handleSubmit} disabled={loading}
            className="w-full mt-6 bg-orange-500 text-white font-semibold py-3 rounded-xl hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center gap-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {lang === 'en' ? 'Get Results' : 'نتائج دیکھیں'} <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
