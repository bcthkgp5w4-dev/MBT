import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, AlertTriangle, CheckCircle, Target, TrendingUp, Zap, XCircle, ChevronRight } from 'lucide-react'
import { DOMAINS } from '@/lib/assessment/questions'

const LEVEL_CONFIG = {
  emerging: { label: 'Emerging', color: 'bg-red-100 text-red-700', bar: 'bg-red-400' },
  developing: { label: 'Developing', color: 'bg-yellow-100 text-yellow-700', bar: 'bg-yellow-400' },
  consolidating: { label: 'Consolidating', color: 'bg-blue-100 text-blue-700', bar: 'bg-blue-400' },
  established: { label: 'Established', color: 'bg-green-100 text-green-700', bar: 'bg-green-500' },
}

export default async function AssessmentResultsPage({
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

  const [{ data: assessment }, { data: devProfile }, { data: child }] = await Promise.all([
    supabase.from('functional_assessments').select('*').eq('id', assessmentId).eq('profile_id', user.id).single(),
    supabase.from('developmental_profiles').select('*').eq('assessment_id', assessmentId).single(),
    supabase.from('children').select('id, name, date_of_birth').eq('id', childId).single(),
  ])

  if (!assessment || !child) notFound()

  const domainScores = assessment.domain_scores as Record<string, any>
  const safetyFlags = assessment.safety_flags as string[]
  const prioritizedDomains = assessment.prioritized_domains as string[]

  // Build sorted domain score list
  const domainList = DOMAINS.map(d => ({
    ...d,
    score: domainScores[d.id] || { percentage: 0, level: 'emerging', skillAgeEstimate: 'unknown', priorityRank: 99 },
  })).sort((a, b) => a.score.priorityRank - b.score.priorityRank)

  const strengths = (devProfile?.strengths || assessment.domain_scores ? [] : []) as string[]
  const challenges = (devProfile?.challenges || []) as string[]
  const emergingSkills = (devProfile?.emerging_skills || []) as string[]
  const missingSkills = (devProfile?.missing_skills || []) as string[]
  const priorityAreas = (devProfile?.priority_areas || []) as any[]
  const shortTermGoals = (devProfile?.short_term_goals || []) as any[]
  const mediumTermGoals = (devProfile?.medium_term_goals || []) as any[]
  const longTermGoals = (devProfile?.long_term_goals || []) as any[]
  const therapyRecs = (devProfile?.therapy_recommendations || []) as any[]

  return (
    <div className="max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/assessment`} className="p-2 rounded-lg hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Assessment Results</h1>
          <p className="text-sm text-gray-500">{child.name} · {new Date(assessment.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
        <Link
          href={`/assessment/${childId}/plan?assessmentId=${assessmentId}`}
          className="flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-blue-700"
        >
          View Full Plan <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Safety flags */}
      {safetyFlags && safetyFlags.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h2 className="font-semibold text-red-900">Priority Safety Concerns</h2>
          </div>
          <ul className="space-y-1">
            {safetyFlags.map((flag, i) => (
              <li key={i} className="text-sm text-red-800 flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>{flag}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Overall score */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Overall Developmental Level</h2>
          <span className="text-3xl font-bold text-blue-600">{assessment.overall_level}%</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
            style={{ width: `${assessment.overall_level}%` }}
          />
        </div>
        <p className="text-xs text-gray-500">Based on {Object.keys(assessment.responses || {}).length} answered questions across 8 developmental domains</p>
      </div>

      {/* Domain scores grid */}
      <div className="grid sm:grid-cols-2 gap-3 mb-6">
        {domainList.map(d => {
          const cfg = LEVEL_CONFIG[d.score.level as keyof typeof LEVEL_CONFIG] || LEVEL_CONFIG.emerging
          return (
            <div key={d.id} className="bg-white rounded-2xl border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{d.emoji}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{d.label}</p>
                    <p className="text-xs text-gray-400">{d.score.skillAgeEstimate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.color}`}>{cfg.label}</span>
                  <p className="text-sm font-bold text-gray-700 mt-1">{d.score.percentage}%</p>
                </div>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full ${cfg.bar} rounded-full`} style={{ width: `${d.score.percentage}%` }} />
              </div>
              {d.score.priorityRank <= 3 && (
                <p className="text-xs text-orange-600 font-medium mt-1.5">Priority #{d.score.priorityRank}</p>
              )}
            </div>
          )
        })}
      </div>

      {/* Priority areas */}
      {priorityAreas.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-orange-500" />
            <h2 className="font-semibold text-gray-900">Priority Focus Areas</h2>
          </div>
          <div className="space-y-3">
            {priorityAreas.slice(0, 4).map((area: any, i: number) => (
              <div key={i} className="flex gap-3 p-3 bg-orange-50 rounded-xl">
                <div className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center shrink-0">{area.rank || i + 1}</div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{area.domain}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{area.reason}</p>
                  {area.current_level && <p className="text-xs text-gray-400 mt-0.5 italic">{area.current_level}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strengths & Challenges */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <h3 className="font-semibold text-gray-900 text-sm">Strengths</h3>
          </div>
          <ul className="space-y-2">
            {(devProfile?.strengths || []).map((s: string, i: number) => (
              <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                <span className="text-green-500 mt-0.5 shrink-0">✓</span>{s}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-3">
            <XCircle className="w-4 h-4 text-red-400" />
            <h3 className="font-semibold text-gray-900 text-sm">Areas of Challenge</h3>
          </div>
          <ul className="space-y-2">
            {(devProfile?.challenges || []).map((c: string, i: number) => (
              <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                <span className="text-red-400 mt-0.5 shrink-0">•</span>{c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Emerging / Missing skills */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-yellow-500" />
            <h3 className="font-semibold text-gray-900 text-sm">Emerging Skills</h3>
          </div>
          <ul className="space-y-2">
            {(devProfile?.emerging_skills || []).map((s: string, i: number) => (
              <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                <span className="text-yellow-500 mt-0.5 shrink-0">→</span>{s}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-purple-500" />
            <h3 className="font-semibold text-gray-900 text-sm">Skills to Build</h3>
          </div>
          <ul className="space-y-2">
            {(devProfile?.missing_skills || []).map((s: string, i: number) => (
              <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                <span className="text-purple-400 mt-0.5 shrink-0">+</span>{s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Goals summary */}
      {shortTermGoals.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Generated Goals</h2>
            <Link href="/goals" className="text-sm text-blue-600 hover:underline">View in Goals →</Link>
          </div>

          <div className="space-y-4">
            {/* Short term */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Short-Term (0–8 weeks)</p>
              <div className="space-y-2">
                {shortTermGoals.map((g: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                    <div className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{g.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{g.target}</p>
                      {g.measurement_method && <p className="text-xs text-blue-600 mt-1">📏 {g.measurement_method}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {mediumTermGoals.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Medium-Term (8–16 weeks)</p>
                <div className="space-y-2">
                  {mediumTermGoals.map((g: any, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-purple-50 rounded-xl">
                      <div className="w-5 h-5 rounded-full bg-purple-500 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{g.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{g.target}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {longTermGoals.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Long-Term (16–24 weeks)</p>
                <div className="space-y-2">
                  {longTermGoals.map((g: any, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
                      <div className="w-5 h-5 rounded-full bg-green-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{g.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{g.target}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Therapy recommendations */}
      {therapyRecs.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Therapy Recommendations</h2>
          <div className="space-y-3">
            {therapyRecs.map((rec: any, i: number) => (
              <div key={i} className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-gray-900">{rec.therapy_type}</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                    rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>{rec.priority}</span>
                </div>
                <p className="text-xs text-gray-500 mb-1">{rec.frequency} · {rec.reason}</p>
                {rec.home_support && <p className="text-xs text-blue-600">Home: {rec.home_support}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <h2 className="text-lg font-bold mb-1">Ready to start the plan?</h2>
        <p className="text-blue-100 text-sm mb-4">View the full daily schedule, weekly plan, activities, and parent coaching tips.</p>
        <Link
          href={`/assessment/${childId}/plan?assessmentId=${assessmentId}`}
          className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-blue-50"
        >
          View Full Therapy Plan <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
