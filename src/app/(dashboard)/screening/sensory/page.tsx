'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Loader2, CheckCircle, Languages } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

type Frequency = 'never' | 'sometimes' | 'often' | 'always'

const SECTIONS = [
  {
    id: 'auditory',
    label: 'Auditory (Sound)',
    label_ur: 'سماعت (آواز)',
    color: 'text-blue-600 bg-blue-50',
    questions: [
      { id: 1, en: 'Covers ears to block out sounds', ur: 'آوازوں کو روکنے کے لیے کان ڈھانپتا ہے' },
      { id: 2, en: 'Gets very upset by loud or unexpected noises', ur: 'تیز یا اچانک آوازوں سے بہت پریشان ہو جاتا ہے' },
      { id: 3, en: 'Is distracted or over-excited by background noises others don\'t notice', ur: 'ایسی پس منظر کی آوازوں سے پریشان ہوتا ہے جو دوسرے نہیں سنتے' },
      { id: 4, en: 'Seeks out loud sounds or music and wants it very loud', ur: 'تیز آوازیں یا موسیقی ڈھونڈتا ہے اور بہت اونچی آواز چاہتا ہے' },
      { id: 5, en: 'Has difficulty filtering background noise in groups or classrooms', ur: 'گروپ یا کلاس میں پس منظر کی آواز کو فلٹر کرنے میں مشکل ہوتی ہے' },
    ],
  },
  {
    id: 'tactile',
    label: 'Tactile (Touch)',
    label_ur: 'لمس',
    color: 'text-purple-600 bg-purple-50',
    questions: [
      { id: 6, en: 'Is bothered by certain clothing textures (tags, seams, fabrics)', ur: 'کپڑوں کی کچھ ساختوں سے پریشان ہوتا ہے جیسے ٹیگ یا سلائی' },
      { id: 7, en: 'Dislikes being touched, hugged, or has hair/face washed', ur: 'چھونا، گلے لگانا یا بال/چہرہ دھونا پسند نہیں کرتا' },
      { id: 8, en: 'Doesn\'t notice when face or hands are dirty', ur: 'چہرہ یا ہاتھ گندے ہونے پر نہیں پتہ چلتا' },
      { id: 9, en: 'Touches everything and everyone constantly', ur: 'ہر چیز اور ہر شخص کو مسلسل چھوتا رہتا ہے' },
      { id: 10, en: 'Has strong reactions to specific temperatures (too hot/cold)', ur: 'مخصوص درجہ حرارت پر بہت زیادہ ردعمل ظاہر کرتا ہے' },
    ],
  },
  {
    id: 'visual',
    label: 'Visual (Sight)',
    label_ur: 'بصارت',
    color: 'text-green-600 bg-green-50',
    questions: [
      { id: 11, en: 'Is bothered by bright lights or sunlight', ur: 'تیز روشنی یا دھوپ سے پریشان ہوتا ہے' },
      { id: 12, en: 'Stares at lights, spinning objects, or moving patterns', ur: 'روشنیوں، گھومتی چیزوں یا حرکت کرتے نمونوں کو گھورتا ہے' },
      { id: 13, en: 'Is sensitive to certain colors or busy visual environments', ur: 'مخصوص رنگوں یا بھری بصری ماحول سے حساس ہے' },
      { id: 14, en: 'Has difficulty with visual tracking (following moving objects)', ur: 'حرکت کرتی چیزوں کو آنکھوں سے فالو کرنے میں مشکل ہے' },
      { id: 15, en: 'Looks at things from unusual angles or very close to eyes', ur: 'چیزوں کو غیر معمولی زاویوں سے یا آنکھوں کے بہت قریب سے دیکھتا ہے' },
    ],
  },
  {
    id: 'vestibular',
    label: 'Vestibular (Movement/Balance)',
    label_ur: 'توازن اور حرکت',
    color: 'text-orange-600 bg-orange-50',
    questions: [
      { id: 16, en: 'Seeks out intense movement (spinning, swinging, rocking)', ur: 'تیز حرکت ڈھونڈتا ہے جیسے گھومنا، جھولنا، ہلنا' },
      { id: 17, en: 'Gets car sick or dizzy very easily', ur: 'گاڑی میں یا گھوم کر بہت جلدی بیمار ہو جاتا ہے' },
      { id: 18, en: 'Avoids playground equipment, swings, or slides', ur: 'کھیل کے میدان کی چیزوں، جھولوں یا سلائیڈ سے بچتا ہے' },
      { id: 19, en: 'Has poor balance or seems clumsy and bumps into things', ur: 'توازن کمزور ہے یا اناڑی لگتا ہے اور چیزوں سے ٹکراتا ہے' },
      { id: 20, en: 'Cannot sit still and is always on the move', ur: 'ایک جگہ بیٹھ نہیں سکتا اور ہمیشہ حرکت میں رہتا ہے' },
    ],
  },
  {
    id: 'proprioceptive',
    label: 'Proprioceptive (Body Awareness)',
    label_ur: 'جسمانی احساس',
    color: 'text-teal-600 bg-teal-50',
    questions: [
      { id: 21, en: 'Seeks out tight hugs, deep pressure, or weighted items', ur: 'مضبوط گلے لگانا، گہرا دباؤ یا بھاری چیزیں ڈھونڈتا ہے' },
      { id: 22, en: 'Seems unaware of own body in space (bumps into others, misjudges distance)', ur: 'جگہ میں اپنے جسم سے بے خبر لگتا ہے، دوسروں سے ٹکراتا ہے' },
      { id: 23, en: 'Uses too much or too little force (breaks things, writes too hard/soft)', ur: 'بہت زیادہ یا بہت کم طاقت لگاتا ہے' },
      { id: 24, en: 'Chews on non-food items (clothing, pencils)', ur: 'غیر خوراکی چیزیں چباتا ہے جیسے کپڑے یا پنسل' },
      { id: 25, en: 'Engages in rough play that seems excessive', ur: 'بہت زیادہ لگتا ہے ایسے کھردرے کھیل میں' },
    ],
  },
  {
    id: 'olfactory_gustatory',
    label: 'Smell & Taste',
    label_ur: 'سونگھنا اور ذائقہ',
    color: 'text-pink-600 bg-pink-50',
    questions: [
      { id: 26, en: 'Has strong reactions to certain smells others don\'t notice', ur: 'ایسی بو سے بہت ردعمل ظاہر کرتا ہے جو دوسروں کو نہیں آتی' },
      { id: 27, en: 'Is a very picky eater based on food textures or smells', ur: 'کھانے کی ساخت یا بو کی وجہ سے بہت زیادہ ناخوش کھانے والا ہے' },
      { id: 28, en: 'Smells non-food objects frequently', ur: 'اکثر غیر خوراکی چیزوں کو سونگھتا ہے' },
      { id: 29, en: 'Has a very limited diet (less than 20 foods)', ur: 'بہت محدود خوراک ہے (20 سے کم کھانے)' },
      { id: 30, en: 'Gags easily with certain food textures', ur: 'کچھ کھانوں کی ساخت سے آسانی سے متلی محسوس ہوتی ہے' },
    ],
  },
]

const ALL_QUESTIONS = SECTIONS.flatMap(s => s.questions.map(q => ({ ...q, sectionId: s.id })))
const FREQ_LABELS = { never: 'Never', sometimes: 'Sometimes', often: 'Often', always: 'Always' }
const FREQ_LABELS_UR = { never: 'کبھی نہیں', sometimes: 'کبھی کبھی', often: 'اکثر', always: 'ہمیشہ' }
const FREQ_SCORES = { never: 0, sometimes: 1, often: 2, always: 3 }

function scoreResults(responses: Record<number, Frequency>) {
  const domainScores: Record<string, number> = {}
  for (const s of SECTIONS) {
    const total = s.questions.reduce((sum, q) => sum + (FREQ_SCORES[responses[q.id]] ?? 0), 0)
    const max = s.questions.length * 3
    domainScores[s.id] = Math.round((total / max) * 100)
  }
  const avgScore = Object.values(domainScores).reduce((a, b) => a + b, 0) / SECTIONS.length
  const risk: 'low' | 'medium' | 'high' = avgScore < 30 ? 'low' : avgScore < 60 ? 'medium' : 'high'
  return { domainScores, avgScore: Math.round(avgScore), risk }
}

export default function SensoryPage() {
  const router = useRouter()
  const [lang, setLang] = useState<'en' | 'ur'>('en')
  const [step, setStep] = useState<'select' | 'screening' | 'complete'>('select')
  const [children, setChildren] = useState<any[]>([])
  const [childId, setChildId] = useState('')
  const [currentIdx, setCurrentIdx] = useState(0)
  const [responses, setResponses] = useState<Record<number, Frequency>>({})
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  useState(() => {
    createClient().from('children').select('id, name').then(({ data }) => {
      if (data) { setChildren(data); if (data.length === 1) setChildId(data[0].id) }
    })
  })

  function selectFreq(freq: Frequency) {
    const q = ALL_QUESTIONS[currentIdx]
    setResponses(prev => ({ ...prev, [q.id]: freq }))
    if (currentIdx < ALL_QUESTIONS.length - 1) setCurrentIdx(i => i + 1)
  }

  async function handleSubmit() {
    setLoading(true)
    try {
      const { domainScores, avgScore, risk } = scoreResults(responses)
      const supabase = createClient()
      const userId = (await supabase.auth.getUser()).data.user?.id

      const highDomains = Object.entries(domainScores).filter(([, v]) => v >= 60).map(([k]) => k)
      const { error } = await supabase.from('screening_results').insert({
        child_id: childId,
        profile_id: userId,
        screening_type: 'sensory',
        responses,
        score: avgScore,
        risk_level: risk,
        summary: `Sensory profile complete. Average sensory challenge score: ${avgScore}%. ${highDomains.length > 0 ? `High impact areas: ${highDomains.join(', ')}.` : 'No high-impact sensory areas identified.'}`,
        recommendations: risk === 'low'
          ? ['Sensory processing appears typical', 'Continue environmental awareness', 'Monitor for changes as child develops']
          : risk === 'medium'
          ? ['Consult an occupational therapist for sensory evaluation', 'Create a sensory-friendly environment at home', 'Consider sensory diet strategies']
          : ['Urgent occupational therapy evaluation recommended', 'Implement sensory diet with OT guidance', 'Consider sensory integration therapy', 'Modify environment to reduce sensory triggers'],
        ai_analysis: { domainScores, highDomains },
      })
      if (error) throw error
      setResult({ domainScores, avgScore, risk })
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
          <h1 className="text-2xl font-bold text-gray-900">{lang === 'en' ? 'Sensory Profile' : 'حسی پروفائل'}</h1>
        </div>
        <LangToggle />
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🌈</div>
          <h2 className="text-lg font-semibold text-gray-900">{lang === 'en' ? 'Sensory Processing Assessment' : 'حسی پروسیسنگ کا جائزہ'}</h2>
          <p className="text-gray-500 text-sm mt-2">{lang === 'en' ? '30 questions · 10-15 min · All ages' : '30 سوالات · 10-15 منٹ · تمام عمر'}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-blue-800" dir={lang === 'ur' ? 'rtl' : 'ltr'}>
            {lang === 'en'
              ? 'Rate how often your child shows each behavior: Never, Sometimes, Often, or Always.'
              : 'ہر رویے کی تعدد بتائیں: کبھی نہیں، کبھی کبھی، اکثر، یا ہمیشہ۔'}
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
          className="w-full bg-green-600 text-white font-semibold py-3 rounded-xl hover:bg-green-700 disabled:opacity-50">
          {lang === 'en' ? 'Begin Assessment' : 'جائزہ شروع کریں'}
        </button>
      </div>
    </div>
  )

  if (step === 'complete' && result) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-end mb-4"><LangToggle /></div>
        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          <div className="text-center mb-6">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-gray-900">{lang === 'en' ? 'Sensory Profile Complete' : 'حسی پروفائل مکمل'}</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            {SECTIONS.map(s => {
              const score = result.domainScores[s.id]
              return (
                <div key={s.id} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-gray-700">{lang === 'en' ? s.label : s.label_ur}</span>
                    <span className={`text-xs font-bold ${score >= 60 ? 'text-red-600' : score >= 30 ? 'text-yellow-600' : 'text-green-600'}`}>{score}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${score >= 60 ? 'bg-red-500' : score >= 30 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${score}%` }} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {score >= 60 ? (lang === 'en' ? 'High impact' : 'زیادہ اثر') : score >= 30 ? (lang === 'en' ? 'Moderate' : 'درمیانہ') : (lang === 'en' ? 'Typical' : 'معمول')}
                  </p>
                </div>
              )
            })}
          </div>
          <div className="flex gap-3">
            <button onClick={() => router.push('/screening')} className="flex-1 border border-gray-200 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">
              {lang === 'en' ? 'Back' : 'واپس'}
            </button>
            <button onClick={() => router.push('/goals')} className="flex-1 bg-green-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-green-700">
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
        <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
      </div>
      <p className="text-xs text-center mb-6">
        <span className={`font-medium px-2 py-0.5 rounded-full ${currentSection.color}`}>
          {lang === 'en' ? currentSection.label : currentSection.label_ur}
        </span>
      </p>

      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <p className="text-xs text-gray-400 mb-2">{lang === 'en' ? 'How often does your child...' : 'آپ کا بچہ کتنی بار...'}</p>
        <h2 className={`text-xl font-semibold text-gray-900 mb-8 leading-relaxed ${lang === 'ur' ? 'text-right' : ''}`} dir={lang === 'ur' ? 'rtl' : 'ltr'}>
          {lang === 'en' ? current.en : current.ur}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {(['never', 'sometimes', 'often', 'always'] as Frequency[]).map(freq => (
            <button key={freq} onClick={() => selectFreq(freq)}
              className={`py-4 rounded-2xl font-medium text-sm border-2 transition-colors capitalize ${
                responses[current.id] === freq
                  ? freq === 'never' ? 'bg-green-500 border-green-500 text-white'
                    : freq === 'sometimes' ? 'bg-yellow-400 border-yellow-400 text-white'
                    : freq === 'often' ? 'bg-orange-500 border-orange-500 text-white'
                    : 'bg-red-500 border-red-500 text-white'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}>
              {lang === 'en' ? FREQ_LABELS[freq] : FREQ_LABELS_UR[freq]}
            </button>
          ))}
        </div>
        {currentIdx === ALL_QUESTIONS.length - 1 && responses[current.id] && (
          <button onClick={handleSubmit} disabled={loading}
            className="w-full mt-6 bg-green-600 text-white font-semibold py-3 rounded-xl hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {lang === 'en' ? 'Get Results' : 'نتائج دیکھیں'} <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
