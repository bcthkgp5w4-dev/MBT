'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Loader2, CheckCircle, Languages } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

const SECTIONS = [
  {
    id: 'gross_motor',
    label: 'Gross Motor',
    label_ur: 'بڑی حرکات',
    color: 'text-blue-600 bg-blue-50',
    questions: [
      { id: 1, en: 'Does your child hold their head steady when held upright?', ur: 'کیا آپ کا بچہ سیدھا پکڑنے پر اپنا سر مستحکم رکھتا ہے؟', ageMonths: 4 },
      { id: 2, en: 'Does your child roll from back to tummy and tummy to back?', ur: 'کیا آپ کا بچہ پیٹھ سے پیٹ اور پیٹ سے پیٹھ کی طرف پلٹ سکتا ہے؟', ageMonths: 6 },
      { id: 3, en: 'Does your child sit without support?', ur: 'کیا آپ کا بچہ بغیر سہارے کے بیٹھ سکتا ہے؟', ageMonths: 9 },
      { id: 4, en: 'Does your child pull to stand and cruise along furniture?', ur: 'کیا آپ کا بچہ کھڑا ہونے کے لیے سہارا لیتا ہے اور فرنیچر کے ساتھ چلتا ہے؟', ageMonths: 12 },
      { id: 5, en: 'Does your child walk independently?', ur: 'کیا آپ کا بچہ آزادانہ طور پر چل سکتا ہے؟', ageMonths: 15 },
      { id: 6, en: 'Does your child run without falling frequently?', ur: 'کیا آپ کا بچہ بار بار گرے بغیر دوڑ سکتا ہے؟', ageMonths: 24 },
      { id: 7, en: 'Does your child jump with both feet off the ground?', ur: 'کیا آپ کا بچہ دونوں پیروں سے اوپر کود سکتا ہے؟', ageMonths: 30 },
      { id: 8, en: 'Does your child climb stairs alternating feet?', ur: 'کیا آپ کا بچہ ایک ایک پاؤں سے سیڑھیاں چڑھ سکتا ہے؟', ageMonths: 36 },
    ],
  },
  {
    id: 'fine_motor',
    label: 'Fine Motor',
    label_ur: 'باریک حرکات',
    color: 'text-purple-600 bg-purple-50',
    questions: [
      { id: 9, en: 'Does your child reach for and grasp objects?', ur: 'کیا آپ کا بچہ چیزوں تک پہنچ کر انہیں پکڑ سکتا ہے؟', ageMonths: 4 },
      { id: 10, en: 'Does your child transfer objects from one hand to the other?', ur: 'کیا آپ کا بچہ چیزوں کو ایک ہاتھ سے دوسرے ہاتھ میں منتقل کر سکتا ہے؟', ageMonths: 7 },
      { id: 11, en: 'Does your child use a pincer grasp (thumb and forefinger)?', ur: 'کیا آپ کا بچہ انگوٹھے اور شہادت کی انگلی سے چیزیں اٹھاتا ہے؟', ageMonths: 10 },
      { id: 12, en: 'Does your child stack 2-3 blocks?', ur: 'کیا آپ کا بچہ 2-3 بلاکس ایک دوسرے پر رکھ سکتا ہے؟', ageMonths: 15 },
      { id: 13, en: 'Does your child scribble with a crayon?', ur: 'کیا آپ کا بچہ کریون سے کچھ بنا سکتا ہے؟', ageMonths: 18 },
      { id: 14, en: 'Does your child turn pages of a book one at a time?', ur: 'کیا آپ کا بچہ کتاب کے صفحات ایک ایک کر کے پلٹ سکتا ہے؟', ageMonths: 24 },
      { id: 15, en: 'Does your child draw a recognizable circle?', ur: 'کیا آپ کا بچہ پہچانے جانے والا دائرہ بنا سکتا ہے؟', ageMonths: 36 },
      { id: 16, en: 'Does your child use scissors with some control?', ur: 'کیا آپ کا بچہ قینچی کو کچھ حد تک کنٹرول سے استعمال کر سکتا ہے؟', ageMonths: 48 },
    ],
  },
  {
    id: 'language',
    label: 'Language & Communication',
    label_ur: 'زبان اور بات چیت',
    color: 'text-green-600 bg-green-50',
    questions: [
      { id: 17, en: 'Does your child coo and make vowel sounds?', ur: 'کیا آپ کا بچہ آوازیں نکالتا اور سروں کی آوازیں کرتا ہے؟', ageMonths: 3 },
      { id: 18, en: 'Does your child babble with consonant sounds (ba, da, ma)?', ur: 'کیا آپ کا بچہ با، دا، ما جیسی آوازیں نکالتا ہے؟', ageMonths: 7 },
      { id: 19, en: 'Does your child say "mama" or "dada" with meaning?', ur: 'کیا آپ کا بچہ سمجھ کر "ماما" یا "دادا" کہتا ہے؟', ageMonths: 12 },
      { id: 20, en: 'Does your child use at least 5-10 single words?', ur: 'کیا آپ کا بچہ کم از کم 5-10 الفاظ استعمال کرتا ہے؟', ageMonths: 15 },
      { id: 21, en: 'Does your child combine two words (e.g., "more milk", "go bye")?', ur: 'کیا آپ کا بچہ دو الفاظ ملا کر بولتا ہے جیسے "اور دودھ" یا "جاؤ"؟', ageMonths: 24 },
      { id: 22, en: 'Does your child use 3-word sentences?', ur: 'کیا آپ کا بچہ 3 الفاظ کے جملے بولتا ہے؟', ageMonths: 30 },
      { id: 23, en: 'Is your child\'s speech understood by strangers most of the time?', ur: 'کیا آپ کے بچے کی بات اجنبی لوگ زیادہ تر سمجھ لیتے ہیں؟', ageMonths: 36 },
      { id: 24, en: 'Does your child ask and answer simple questions?', ur: 'کیا آپ کا بچہ سادہ سوالات پوچھتا اور جواب دیتا ہے؟', ageMonths: 48 },
    ],
  },
  {
    id: 'cognitive',
    label: 'Cognitive Development',
    label_ur: 'ذہنی ترقی',
    color: 'text-orange-600 bg-orange-50',
    questions: [
      { id: 25, en: 'Does your child show object permanence (look for hidden objects)?', ur: 'کیا آپ کا بچہ چھپی ہوئی چیزوں کو ڈھونڈتا ہے؟', ageMonths: 9 },
      { id: 26, en: 'Does your child imitate simple actions?', ur: 'کیا آپ کا بچہ سادہ کاموں کی نقل کرتا ہے؟', ageMonths: 12 },
      { id: 27, en: 'Does your child engage in simple pretend play?', ur: 'کیا آپ کا بچہ سادہ بناوٹی کھیل کھیلتا ہے؟', ageMonths: 18 },
      { id: 28, en: 'Does your child sort objects by shape or color?', ur: 'کیا آپ کا بچہ چیزوں کو شکل یا رنگ کے مطابق ترتیب دیتا ہے؟', ageMonths: 24 },
      { id: 29, en: 'Does your child understand the concept of "one" vs "many"?', ur: 'کیا آپ کا بچہ "ایک" اور "بہت" کا فرق سمجھتا ہے؟', ageMonths: 30 },
      { id: 30, en: 'Does your child match pictures to real objects?', ur: 'کیا آپ کا بچہ تصویروں کو اصل چیزوں سے ملا سکتا ہے؟', ageMonths: 36 },
      { id: 31, en: 'Does your child count 3 or more objects correctly?', ur: 'کیا آپ کا بچہ 3 یا اس سے زیادہ چیزیں گن سکتا ہے؟', ageMonths: 42 },
      { id: 32, en: 'Does your child recognize and write some letters or numbers?', ur: 'کیا آپ کا بچہ کچھ حروف یا نمبر پہچانتا اور لکھتا ہے؟', ageMonths: 60 },
    ],
  },
  {
    id: 'social_emotional',
    label: 'Social & Emotional',
    label_ur: 'سماجی اور جذباتی',
    color: 'text-pink-600 bg-pink-50',
    questions: [
      { id: 33, en: 'Does your child smile in response to your smile?', ur: 'کیا آپ کا بچہ آپ کی مسکراہٹ کے جواب میں مسکراتا ہے؟', ageMonths: 3 },
      { id: 34, en: 'Does your child show attachment to familiar caregivers?', ur: 'کیا آپ کا بچہ جانے پہچانے لوگوں سے لگاؤ ظاہر کرتا ہے؟', ageMonths: 9 },
      { id: 35, en: 'Does your child show stranger anxiety (upset with unfamiliar people)?', ur: 'کیا آپ کا بچہ انجان لوگوں سے گھبراتا ہے؟', ageMonths: 12 },
      { id: 36, en: 'Does your child express emotions like happiness, sadness, or frustration?', ur: 'کیا آپ کا بچہ خوشی، غم یا ناراضگی جیسے جذبات ظاہر کرتا ہے؟', ageMonths: 18 },
      { id: 37, en: 'Does your child show empathy (comfort others who are upset)?', ur: 'کیا آپ کا بچہ ہمدردی ظاہر کرتا ہے اور پریشان لوگوں کو دلاسہ دیتا ہے؟', ageMonths: 24 },
      { id: 38, en: 'Does your child take turns in play?', ur: 'کیا آپ کا بچہ کھیل میں باری باری کھیلتا ہے؟', ageMonths: 30 },
      { id: 39, en: 'Does your child engage in cooperative play with peers?', ur: 'کیا آپ کا بچہ دوسرے بچوں کے ساتھ مل کر کھیلتا ہے؟', ageMonths: 36 },
      { id: 40, en: 'Does your child manage frustration without major tantrums most of the time?', ur: 'کیا آپ کا بچہ زیادہ تر غصے یا ناراضگی کو بڑے غصے کے بغیر سنبھال لیتا ہے؟', ageMonths: 48 },
    ],
  },
]

const ALL_QUESTIONS = SECTIONS.flatMap(s => s.questions.map(q => ({ ...q, sectionId: s.id, sectionLabel: s.label, sectionLabel_ur: s.label_ur })))

function scoreResults(responses: Record<number, boolean>) {
  const domainScores: Record<string, { total: number; concerns: number }> = {}
  for (const s of SECTIONS) {
    const sectionQs = s.questions
    const concerns = sectionQs.filter(q => responses[q.id] === false).length
    domainScores[s.id] = { total: sectionQs.length, concerns }
  }
  const totalConcerns = Object.values(domainScores).reduce((a, b) => a + b.concerns, 0)
  const totalQs = ALL_QUESTIONS.length
  const pct = ((totalQs - totalConcerns) / totalQs) * 100
  const risk: 'low' | 'medium' | 'high' = totalConcerns <= 4 ? 'low' : totalConcerns <= 10 ? 'medium' : 'high'
  return { domainScores, totalConcerns, pct: Math.round(pct), risk }
}

export default function DevelopmentalPage() {
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
      const { domainScores, totalConcerns, pct, risk } = scoreResults(responses)
      const supabase = createClient()
      const userId = (await supabase.auth.getUser()).data.user?.id

      const recommendations = risk === 'low'
        ? ['Continue regular developmental monitoring', 'Engage in age-appropriate play activities', 'Attend regular well-child checkups']
        : risk === 'medium'
        ? ['Consult your pediatrician about developmental concerns', 'Consider developmental therapy evaluation', 'Focus on areas with most concerns']
        : ['Urgent referral for comprehensive developmental evaluation', 'Discuss early intervention services with pediatrician', 'Consider occupational, speech, and physical therapy evaluations']

      const concernedDomains = Object.entries(domainScores)
        .filter(([, v]) => v.concerns > 0)
        .map(([k, v]) => `${k}: ${v.concerns}/${v.total} concerns`)

      const { error } = await supabase.from('screening_results').insert({
        child_id: childId,
        profile_id: userId,
        screening_type: 'developmental',
        responses,
        score: pct,
        risk_level: risk,
        summary: `Developmental assessment complete. ${totalConcerns} areas of concern identified across ${concernedDomains.length} domains. Overall milestone achievement: ${pct}%.`,
        recommendations,
        ai_analysis: { domainScores, concernedDomains },
      })
      if (error) throw error
      setResult({ domainScores, totalConcerns, pct, risk })
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
          <h1 className="text-2xl font-bold text-gray-900">{lang === 'en' ? 'Developmental Assessment' : 'ترقیاتی جائزہ'}</h1>
        </div>
        <LangToggle />
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🧩</div>
          <h2 className="text-lg font-semibold text-gray-900">{lang === 'en' ? 'Comprehensive Development Questionnaire' : 'جامع ترقیاتی سوالنامہ'}</h2>
          <p className="text-gray-500 text-sm mt-2">{lang === 'en' ? '40 questions · 15-20 min · Ages 0-6 years' : '40 سوالات · 15-20 منٹ · عمر 0-6 سال'}</p>
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
            {lang === 'en' ? 'Answer based on what your child can do consistently, not just once.' : 'جواب اس بنیاد پر دیں جو آپ کا بچہ مستقل طور پر کر سکتا ہے، صرف ایک بار نہیں۔'}
          </p>
        </div>
        {children.length > 1 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">{lang === 'en' ? 'Select Child' : 'بچہ منتخب کریں'}</label>
            <select value={childId} onChange={e => setChildId(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm">
              <option value="">{lang === 'en' ? 'Choose a child...' : 'بچہ منتخب کریں...'}</option>
              {children.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        )}
        <button onClick={() => { if (childId) setStep('screening') }} disabled={!childId}
          className="w-full bg-purple-600 text-white font-semibold py-3 rounded-xl hover:bg-purple-700 disabled:opacity-50">
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
            <p className="text-gray-500 text-sm">{lang === 'en' ? 'Developmental profile for your child' : 'آپ کے بچے کا ترقیاتی پروفائل'}</p>
          </div>

          <div className={`rounded-2xl border p-5 mb-6 ${riskColors[result.risk as keyof typeof riskColors]}`}>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-600">{lang === 'en' ? 'Overall Risk' : 'مجموعی خطرہ'}</span>
              <span className={`font-bold capitalize text-lg ${riskText[result.risk as keyof typeof riskText]}`}>
                {result.risk === 'low' ? (lang === 'en' ? 'Low' : 'کم') : result.risk === 'medium' ? (lang === 'en' ? 'Medium' : 'درمیانی') : (lang === 'en' ? 'High' : 'زیادہ')}
              </span>
            </div>
            <div className="h-3 bg-white rounded-full overflow-hidden mb-2">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${result.pct}%` }} />
            </div>
            <p className="text-xs text-gray-500">{lang === 'en' ? `${result.pct}% milestones on track` : `${result.pct}% سنگ ہائے میل پر`}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            {SECTIONS.map(s => {
              const scores = result.domainScores[s.id]
              const pct = Math.round(((scores.total - scores.concerns) / scores.total) * 100)
              return (
                <div key={s.id} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-gray-700">{lang === 'en' ? s.label : s.label_ur}</span>
                    <span className="text-xs font-bold text-gray-900">{pct}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${pct >= 75 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${pct}%` }} />
                  </div>
                  {scores.concerns > 0 && (
                    <p className="text-xs text-red-600 mt-1">{scores.concerns} {lang === 'en' ? 'concern(s)' : 'تشویش'}</p>
                  )}
                </div>
              )
            })}
          </div>

          <div className="flex gap-3">
            <button onClick={() => router.push('/screening')} className="flex-1 border border-gray-200 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">
              {lang === 'en' ? 'Back' : 'واپس'}
            </button>
            <button onClick={() => router.push('/goals')} className="flex-1 bg-purple-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-purple-700">
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

      <div className="h-2 bg-gray-100 rounded-full mb-2 overflow-hidden">
        <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
      </div>
      <p className="text-xs text-gray-400 mb-6 text-center">
        <span className={`font-medium ${currentSection.color} px-2 py-0.5 rounded-full`}>
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
            className="w-full mt-6 bg-purple-600 text-white font-semibold py-3 rounded-xl hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {lang === 'en' ? 'Get Results' : 'نتائج دیکھیں'} <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
