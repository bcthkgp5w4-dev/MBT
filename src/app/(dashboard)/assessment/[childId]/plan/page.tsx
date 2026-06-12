import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, Calendar, Lightbulb, Activity } from 'lucide-react'

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
const DAY_LABELS: Record<string, string> = {
  monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu',
  friday: 'Fri', saturday: 'Sat', sunday: 'Sun',
}

export default async function TherapyPlanPage({
  params,
  searchParams,
}: {
  params: Promise<{ childId: string }>
  searchParams: Promise<{ assessmentId?: string }>
}) {
  const { childId } = await params
  const { assessmentId } = await searchParams

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  if (!assessmentId) redirect(`/assessment/${childId}`)

  const [{ data: devProfile }, { data: child }, { data: assessment }] = await Promise.all([
    supabase.from('developmental_profiles').select('*').eq('assessment_id', assessmentId).single(),
    supabase.from('children').select('id, name').eq('id', childId).single(),
    supabase.from('functional_assessments').select('overall_level, created_at').eq('id', assessmentId).single(),
  ])

  if (!child || !assessment) notFound()

  const dailyPlan = (devProfile?.daily_plan || {}) as any
  const weeklySchedule = (devProfile?.weekly_schedule || {}) as any
  const coachingTips = (devProfile?.parent_coaching_tips || []) as string[]
  const shortTermGoals = (devProfile?.short_term_goals || []) as any[]

  return (
    <div className="max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/assessment/${childId}/results?assessmentId=${assessmentId}`} className="p-2 rounded-lg hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Therapy Plan</h1>
          <p className="text-sm text-gray-500">{child.name} · Overall level: {assessment.overall_level}%</p>
        </div>
      </div>

      {/* Daily plan options */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-blue-500" />
          <h2 className="font-semibold text-gray-900">Daily Session Plans</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {(['30_min', '60_min', '90_min'] as const).map(key => {
            const plan = dailyPlan[key]
            const label = key.replace('_min', ' min')
            const colors: Record<string, string> = {
              '30_min': 'border-blue-200 bg-blue-50',
              '60_min': 'border-purple-200 bg-purple-50',
              '90_min': 'border-green-200 bg-green-50',
            }
            const header: Record<string, string> = {
              '30_min': 'text-blue-700',
              '60_min': 'text-purple-700',
              '90_min': 'text-green-700',
            }
            return (
              <div key={key} className={`rounded-2xl border-2 p-4 ${colors[key]}`}>
                <p className={`font-bold text-sm mb-3 ${header[key]}`}>{label} Session</p>
                {plan?.sessions ? (
                  <div className="space-y-2">
                    {(plan.sessions as any[]).map((s: any, i: number) => (
                      <div key={i} className="bg-white rounded-lg p-2.5">
                        <p className="text-xs font-semibold text-gray-800">{s.domain}</p>
                        <p className="text-xs text-gray-500">{s.activity}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{s.duration_min} min</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">No sessions generated</p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Weekly schedule */}
      {Object.keys(weeklySchedule).length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-purple-500" />
            <h2 className="font-semibold text-gray-900">Weekly Schedule</h2>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {DAY_ORDER.map(day => {
              const activities = weeklySchedule[day] as string[] | undefined
              const isWeekend = day === 'saturday' || day === 'sunday'
              return (
                <div key={day} className={`rounded-xl p-2 min-h-[80px] ${isWeekend ? 'bg-purple-50' : 'bg-gray-50'}`}>
                  <p className={`text-xs font-bold mb-2 ${isWeekend ? 'text-purple-600' : 'text-gray-500'}`}>{DAY_LABELS[day]}</p>
                  {activities?.map((a, i) => (
                    <p key={i} className="text-xs text-gray-600 mb-1 leading-tight">{a}</p>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Goal activities */}
      {shortTermGoals.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-orange-500" />
            <h2 className="font-semibold text-gray-900">Therapy Activities by Goal</h2>
          </div>
          <div className="space-y-5">
            {shortTermGoals.map((goal: any, gi: number) => (
              <div key={gi}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center">{gi + 1}</div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{goal.title}</p>
                    <p className="text-xs text-gray-500">{goal.domain} · {goal.timeline_weeks} weeks</p>
                  </div>
                </div>
                <div className="pl-8 space-y-3">
                  <div className="grid sm:grid-cols-2 gap-2 text-xs text-gray-600 mb-2">
                    <div className="bg-gray-50 rounded-lg p-2"><span className="font-medium">Baseline:</span> {goal.baseline}</div>
                    <div className="bg-green-50 rounded-lg p-2"><span className="font-medium">Target:</span> {goal.target}</div>
                  </div>
                  {goal.measurement_method && (
                    <p className="text-xs text-blue-600 bg-blue-50 rounded-lg px-2 py-1.5">📏 Measure: {goal.measurement_method}</p>
                  )}
                  {(goal.activities || []).map((act: any, ai: number) => (
                    <div key={ai} className="border border-gray-100 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold text-gray-900">{act.name}</p>
                        <span className="text-xs text-gray-400">{act.duration_minutes} min · {act.difficulty}</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{act.purpose}</p>
                      {act.materials?.length > 0 && (
                        <p className="text-xs text-gray-400 mb-2">Materials: {act.materials.join(', ')}</p>
                      )}
                      {act.instructions?.length > 0 && (
                        <div className="mb-2">
                          <p className="text-xs font-medium text-gray-600 mb-1">Steps:</p>
                          <ol className="list-decimal list-inside space-y-0.5">
                            {act.instructions.map((step: string, si: number) => (
                              <li key={si} className="text-xs text-gray-600">{step}</li>
                            ))}
                          </ol>
                        </div>
                      )}
                      {act.data_collection && (
                        <p className="text-xs text-purple-600 bg-purple-50 rounded px-2 py-1">📊 Track: {act.data_collection}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Parent coaching tips */}
      {coachingTips.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-amber-600" />
            <h2 className="font-semibold text-gray-900">Parent Coaching Tips</h2>
          </div>
          <div className="space-y-3">
            {coachingTips.map((tip, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</div>
                <p className="text-sm text-gray-700">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
