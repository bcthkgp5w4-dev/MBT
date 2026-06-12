import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Edit, ClipboardCheck, Target, BookOpen, AlertTriangle,
  TrendingUp, Calendar, CheckCircle, Clock, Zap, Brain, Activity,
  MessageSquare, Plus, ChevronRight, ShieldAlert,
} from 'lucide-react'
import { getChildAge, formatDate } from '@/lib/utils'
import { DOMAINS } from '@/lib/assessment/questions'

// ─── helpers ───────────────────────────────────────────────────────────────

const DOMAIN_EMOJI: Record<string, string> = Object.fromEntries(
  DOMAINS.map(d => [d.id, d.emoji])
)

const LEVEL_BAR: Record<string, string> = {
  emerging: 'bg-red-400',
  developing: 'bg-yellow-400',
  consolidating: 'bg-blue-400',
  established: 'bg-green-500',
}

const LEVEL_BADGE: Record<string, string> = {
  emerging: 'bg-red-100 text-red-700',
  developing: 'bg-yellow-100 text-yellow-700',
  consolidating: 'bg-blue-100 text-blue-700',
  established: 'bg-green-100 text-green-700',
}

const MOOD_EMOJI: Record<string, string> = {
  great: '😄', good: '🙂', neutral: '😐', difficult: '😟', crisis: '🆘',
}

const GOAL_STATUS_COLOR: Record<string, string> = {
  active: 'bg-blue-100 text-blue-700',
  achieved: 'bg-green-100 text-green-700',
  paused: 'bg-yellow-100 text-yellow-700',
  discontinued: 'bg-gray-100 text-gray-500',
}

const DIAGNOSIS_LABEL: Record<string, string> = {
  diagnosed: 'Diagnosed',
  suspected: 'Suspected ASD',
  assessment_pending: 'Assessment Pending',
  no_diagnosis: 'No Diagnosis',
}

const COMM_LABEL: Record<string, string> = {
  nonverbal: 'Non-verbal',
  single_words: 'Single Words',
  two_word_phrases: '2-Word Phrases',
  simple_sentences: 'Simple Sentences',
  conversational: 'Conversational',
}

function Section({ title, icon: Icon, color, children, action }: {
  title: string
  icon: any
  color: string
  children: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className={`flex items-center justify-between px-5 py-4 border-b border-gray-50`}>
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
            <Icon className="w-4 h-4" />
          </div>
          <h2 className="font-semibold text-gray-900">{title}</h2>
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function EmptyState({ icon, message, action }: { icon: string; message: string; action?: React.ReactNode }) {
  return (
    <div className="text-center py-6">
      <div className="text-3xl mb-2">{icon}</div>
      <p className="text-sm text-gray-500 mb-3">{message}</p>
      {action}
    </div>
  )
}

// ─── page ──────────────────────────────────────────────────────────────────

export default async function ChildProfilePage({
  params,
}: {
  params: Promise<{ childId: string }>
}) {
  const { childId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch everything in parallel
  const [
    { data: child },
    { data: assessments },
    { data: goals },
    { data: journals },
    { data: behaviors },
    { data: progressData },
  ] = await Promise.all([
    supabase.from('children').select('*').eq('id', childId).eq('profile_id', user.id).single(),
    supabase.from('functional_assessments')
      .select('id, overall_level, domain_scores, safety_flags, prioritized_domains, created_at')
      .eq('child_id', childId).eq('profile_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase.from('goals')
      .select('*')
      .eq('child_id', childId).eq('profile_id', user.id)
      .order('created_at', { ascending: false }),
    supabase.from('journal_entries')
      .select('id, content, mood, milestones, successes, challenges, ai_analysis, ai_patterns, created_at')
      .eq('child_id', childId).eq('profile_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase.from('behavior_entries')
      .select('id, behavior, intensity, occurred_at')
      .eq('child_id', childId).eq('profile_id', user.id)
      .order('occurred_at', { ascending: false })
      .limit(10),
    supabase.from('progress_data')
      .select('date, value, goal_id')
      .eq('child_id', childId).eq('profile_id', user.id)
      .order('date', { ascending: false })
      .limit(30),
  ])

  if (!child) notFound()

  // Fetch dev profile for latest assessment
  const latestAssessment = assessments?.[0] ?? null
  const { data: latestDevProfile } = latestAssessment
    ? await supabase.from('developmental_profiles').select('*').eq('assessment_id', latestAssessment.id).single()
    : { data: null }

  const activeGoals = (goals || []).filter((g: any) => g.status === 'active')
  const achievedGoals = (goals || []).filter((g: any) => g.status === 'achieved')
  const avgGoalProgress = activeGoals.length > 0
    ? Math.round(activeGoals.reduce((s: number, g: any) => s + (g.progress_percentage || 0), 0) / activeGoals.length)
    : 0

  const safetyFlags = (latestAssessment?.safety_flags || []) as string[]
  const domainScores = (latestAssessment?.domain_scores || {}) as Record<string, any>
  const prioritizedDomains = (latestAssessment?.prioritized_domains || []) as string[]
  const top3Domains = prioritizedDomains.slice(0, 3)

  // Journal milestones aggregated
  const allMilestones = (journals || []).flatMap((j: any) => j.milestones || [])
  const allAiPatterns = (journals || []).flatMap((j: any) => j.ai_patterns || [])

  // Goal domains for progress section
  const goalsByDomain = (goals || []).reduce((acc: Record<string, any[]>, g: any) => {
    if (!acc[g.domain]) acc[g.domain] = []
    acc[g.domain].push(g)
    return acc
  }, {})

  const age = getChildAge(child.date_of_birth)

  return (
    <div className="max-w-5xl mx-auto pb-16">
      {/* ── Header ── */}
      <div className="flex items-start gap-3 mb-6">
        <Link href="/children" className="p-2 rounded-lg hover:bg-gray-100 mt-1">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          {/* Child hero card */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-6 text-white">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold text-white">
                  {child.name.charAt(0)}
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{child.name}</h1>
                  <p className="text-blue-200 text-sm">{age} old · {child.gender}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="bg-white/20 text-xs font-medium px-2.5 py-1 rounded-full">
                      {DIAGNOSIS_LABEL[child.diagnosis_status] || child.diagnosis_status}
                    </span>
                    <span className="bg-white/20 text-xs font-medium px-2.5 py-1 rounded-full">
                      {COMM_LABEL[child.communication_level] || child.communication_level}
                    </span>
                    {child.school_name && (
                      <span className="bg-white/20 text-xs font-medium px-2.5 py-1 rounded-full">
                        📚 {child.school_name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <Link
                href={`/children/${childId}/edit`}
                className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-medium px-3 py-1.5 rounded-lg"
              >
                <Edit className="w-3.5 h-3.5" /> Edit
              </Link>
            </div>

            {/* Quick stats row */}
            <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-white/20">
              <div className="text-center">
                <p className="text-2xl font-bold">{latestAssessment ? `${latestAssessment.overall_level}%` : '—'}</p>
                <p className="text-blue-200 text-xs mt-0.5">Overall Level</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{activeGoals.length}</p>
                <p className="text-blue-200 text-xs mt-0.5">Active Goals</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{achievedGoals.length}</p>
                <p className="text-blue-200 text-xs mt-0.5">Goals Achieved</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Safety flags ── */}
      {safetyFlags.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900 text-sm mb-1">Safety Concerns Flagged</p>
            {safetyFlags.map((f, i) => <p key={i} className="text-xs text-red-700">{f}</p>)}
          </div>
        </div>
      )}

      {/* ── Two-column grid ── */}
      <div className="grid lg:grid-cols-2 gap-4">

        {/* ── Assessment Summary ── */}
        <Section
          title="Assessment Summary"
          icon={ClipboardCheck}
          color="bg-blue-50 text-blue-600"
          action={
            <Link
              href={`/assessment/${childId}`}
              className="text-xs text-blue-600 hover:underline font-medium flex items-center gap-1"
            >
              {latestAssessment ? 'Reassess' : 'Start'} <ChevronRight className="w-3 h-3" />
            </Link>
          }
        >
          {latestAssessment ? (
            <>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{latestAssessment.overall_level}%</p>
                  <p className="text-xs text-gray-400">Latest · {formatDate(latestAssessment.created_at)}</p>
                </div>
                {assessments && assessments.length > 1 && (
                  <div className="text-right">
                    <p className="text-xs text-gray-400">{assessments.length} assessments total</p>
                    {assessments.length >= 2 && (
                      <p className={`text-xs font-semibold ${
                        latestAssessment.overall_level >= assessments[1].overall_level ? 'text-green-600' : 'text-red-500'
                      }`}>
                        {latestAssessment.overall_level >= assessments[1].overall_level ? '▲' : '▼'}{' '}
                        {Math.abs(latestAssessment.overall_level - assessments[1].overall_level)}% vs prev
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                  style={{ width: `${latestAssessment.overall_level}%` }}
                />
              </div>

              {/* Domain mini cards */}
              <div className="space-y-2">
                {Object.entries(domainScores)
                  .sort((a, b) => (a[1].priorityRank || 99) - (b[1].priorityRank || 99))
                  .slice(0, 4)
                  .map(([domainId, score]: [string, any]) => {
                    const domain = DOMAINS.find(d => d.id === domainId)
                    return (
                      <div key={domainId} className="flex items-center gap-2">
                        <span className="text-sm w-4">{domain?.emoji || '•'}</span>
                        <div className="flex-1">
                          <div className="flex justify-between text-xs mb-0.5">
                            <span className="text-gray-600 font-medium">{domain?.label || domainId}</span>
                            <span className="text-gray-400">{score.percentage}%</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${LEVEL_BAR[score.level] || 'bg-gray-300'}`}
                              style={{ width: `${score.percentage}%` }}
                            />
                          </div>
                        </div>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${LEVEL_BADGE[score.level] || 'bg-gray-100 text-gray-500'}`}>
                          {score.level}
                        </span>
                      </div>
                    )
                  })}
              </div>

              {top3Domains.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-50">
                  <p className="text-xs text-gray-400 mb-1.5">Top priority areas:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {top3Domains.map((d, i) => (
                      <span key={d} className="text-xs bg-orange-50 text-orange-700 font-medium px-2 py-0.5 rounded-full">
                        #{i + 1} {DOMAINS.find(x => x.id === d)?.label || d}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <Link
                href={`/assessment/${childId}/results?assessmentId=${latestAssessment.id}`}
                className="mt-3 flex items-center justify-center gap-1 text-xs text-blue-600 font-medium hover:underline"
              >
                View full results <ChevronRight className="w-3 h-3" />
              </Link>
            </>
          ) : (
            <EmptyState
              icon="📋"
              message="No assessment completed yet. Start a functional assessment to get AI-generated goals and therapy plan."
              action={
                <Link
                  href={`/assessment/${childId}`}
                  className="inline-flex items-center gap-1.5 bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-3.5 h-3.5" /> Start Assessment
                </Link>
              }
            />
          )}
        </Section>

        {/* ── AI Analysis ── */}
        <Section
          title="AI Analysis"
          icon={Brain}
          color="bg-purple-50 text-purple-600"
        >
          {latestDevProfile ? (
            <div className="space-y-4">
              {/* Strengths */}
              {(latestDevProfile.strengths || []).length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500" /> Strengths
                  </p>
                  <ul className="space-y-1">
                    {(latestDevProfile.strengths as string[]).slice(0, 3).map((s, i) => (
                      <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                        <span className="text-green-500 shrink-0">✓</span>{s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Challenges */}
              {(latestDevProfile.challenges || []).length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-orange-500" /> Challenges
                  </p>
                  <ul className="space-y-1">
                    {(latestDevProfile.challenges as string[]).slice(0, 3).map((c, i) => (
                      <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                        <span className="text-orange-400 shrink-0">•</span>{c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Emerging */}
              {(latestDevProfile.emerging_skills || []).length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-yellow-500" /> Emerging Skills
                  </p>
                  <ul className="space-y-1">
                    {(latestDevProfile.emerging_skills as string[]).slice(0, 2).map((s, i) => (
                      <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                        <span className="text-yellow-500 shrink-0">→</span>{s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Dev trends from journal */}
              {allAiPatterns.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-blue-500" /> Observed Patterns
                  </p>
                  <ul className="space-y-1">
                    {allAiPatterns.slice(0, 3).map((p: string, i: number) => (
                      <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                        <span className="text-blue-400 shrink-0">◆</span>{p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Link
                href={`/assessment/${childId}/plan?assessmentId=${latestAssessment?.id}`}
                className="flex items-center justify-center gap-1 text-xs text-purple-600 font-medium hover:underline"
              >
                View full therapy plan <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          ) : (
            <EmptyState
              icon="🧠"
              message="Complete an assessment to generate AI-powered insights about your child's development."
              action={
                <Link href={`/assessment/${childId}`} className="inline-flex items-center gap-1.5 bg-purple-600 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-purple-700">
                  <Plus className="w-3.5 h-3.5" /> Start Assessment
                </Link>
              }
            />
          )}
        </Section>

        {/* ── Goals ── */}
        <Section
          title="Goals"
          icon={Target}
          color="bg-green-50 text-green-600"
          action={
            <Link href="/goals/new" className="text-xs text-green-600 hover:underline font-medium flex items-center gap-1">
              Add <Plus className="w-3 h-3" />
            </Link>
          }
        >
          {(goals || []).length === 0 ? (
            <EmptyState
              icon="🎯"
              message="No goals yet. Complete an assessment to auto-generate goals, or add one manually."
              action={
                <div className="flex gap-2 justify-center">
                  <Link href={`/assessment/${childId}`} className="inline-flex items-center gap-1.5 bg-blue-600 text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-blue-700">
                    Start Assessment
                  </Link>
                  <Link href="/goals/new" className="inline-flex items-center gap-1.5 border border-gray-200 text-gray-600 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-gray-50">
                    Add Goal
                  </Link>
                </div>
              }
            />
          ) : (
            <>
              {/* Progress summary */}
              <div className="flex items-center gap-4 mb-4 p-3 bg-green-50 rounded-xl">
                <div className="text-center">
                  <p className="text-xl font-bold text-green-700">{avgGoalProgress}%</p>
                  <p className="text-xs text-green-600">Avg Progress</p>
                </div>
                <div className="flex-1 h-2 bg-green-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${avgGoalProgress}%` }} />
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-700">{achievedGoals.length}</p>
                  <p className="text-xs text-gray-500">Achieved</p>
                </div>
              </div>

              {/* Active goals list */}
              <div className="space-y-2">
                {activeGoals.slice(0, 4).map((g: any) => (
                  <div key={g.id} className="border border-gray-100 rounded-xl p-3">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <p className="text-xs font-semibold text-gray-800 leading-tight">{g.title}</p>
                      <span className={`shrink-0 text-xs font-medium px-1.5 py-0.5 rounded-full ${GOAL_STATUS_COLOR[g.status]}`}>
                        {g.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-400 rounded-full"
                          style={{ width: `${g.progress_percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 w-8 text-right">{g.progress_percentage}%</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 capitalize">{g.domain} · {g.timeline_weeks}w</p>
                  </div>
                ))}
                {activeGoals.length > 4 && (
                  <Link href="/goals" className="text-xs text-green-600 hover:underline block text-center py-1">
                    +{activeGoals.length - 4} more goals
                  </Link>
                )}
              </div>
            </>
          )}
        </Section>

        {/* ── Therapy Plan ── */}
        <Section
          title="Therapy Plan"
          icon={Calendar}
          color="bg-orange-50 text-orange-600"
          action={
            latestAssessment ? (
              <Link
                href={`/assessment/${childId}/plan?assessmentId=${latestAssessment.id}`}
                className="text-xs text-orange-600 hover:underline font-medium flex items-center gap-1"
              >
                View Full <ChevronRight className="w-3 h-3" />
              </Link>
            ) : undefined
          }
        >
          {latestDevProfile ? (
            <div className="space-y-4">
              {/* Daily plan preview */}
              {latestDevProfile.daily_plan && Object.keys(latestDevProfile.daily_plan).length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Daily Sessions</p>
                  <div className="grid grid-cols-3 gap-2">
                    {(['30_min', '60_min', '90_min'] as const).map(key => {
                      const plan = (latestDevProfile.daily_plan as any)[key]
                      const count = plan?.sessions?.length || 0
                      return count > 0 ? (
                        <div key={key} className="bg-orange-50 rounded-xl p-2.5 text-center">
                          <p className="text-sm font-bold text-orange-700">{key.replace('_min', '')}</p>
                          <p className="text-xs text-orange-500">min</p>
                          <p className="text-xs text-gray-500 mt-0.5">{count} activities</p>
                        </div>
                      ) : null
                    })}
                  </div>
                </div>
              )}

              {/* Therapy recommendations */}
              {(latestDevProfile.therapy_recommendations as any[] || []).length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Recommended Therapies</p>
                  <div className="space-y-2">
                    {(latestDevProfile.therapy_recommendations as any[]).slice(0, 3).map((rec: any, i: number) => (
                      <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                        <div>
                          <p className="text-xs font-medium text-gray-800">{rec.therapy_type}</p>
                          <p className="text-xs text-gray-400">{rec.frequency}</p>
                        </div>
                        <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
                          rec.priority === 'high' ? 'bg-red-100 text-red-600' :
                          rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-gray-100 text-gray-500'
                        }`}>{rec.priority}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Current therapies from child profile */}
              {child.therapies?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Current Therapies</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(child.therapies as string[]).map((t, i) => (
                      <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <EmptyState
              icon="📅"
              message="No therapy plan yet. Complete an assessment to generate a personalized plan."
              action={
                <Link href={`/assessment/${childId}`} className="inline-flex items-center gap-1.5 bg-orange-500 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-orange-600">
                  Generate Therapy Plan
                </Link>
              }
            />
          )}
        </Section>

        {/* ── Progress Dashboard ── */}
        <Section
          title="Progress Dashboard"
          icon={TrendingUp}
          color="bg-teal-50 text-teal-600"
          action={
            <Link href="/progress" className="text-xs text-teal-600 hover:underline font-medium flex items-center gap-1">
              Full Report <ChevronRight className="w-3 h-3" />
            </Link>
          }
        >
          {Object.keys(goalsByDomain).length === 0 ? (
            <EmptyState icon="📈" message="Progress data will appear here once you have active goals." />
          ) : (
            <div className="space-y-3">
              {(Object.entries(goalsByDomain) as [string, any[]][]).slice(0, 5).map(([domain, dGoals]) => {
                const avg = Math.round(dGoals.reduce((s, g) => s + (g.progress_percentage || 0), 0) / dGoals.length)
                const achieved = dGoals.filter(g => g.status === 'achieved').length
                return (
                  <div key={domain}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-gray-700 capitalize flex items-center gap-1">
                        {DOMAIN_EMOJI[domain] || '•'} {domain}
                      </span>
                      <span className="text-gray-400">{avg}% · {achieved}/{dGoals.length} achieved</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-teal-400 to-teal-600 rounded-full"
                        style={{ width: `${avg}%` }}
                      />
                    </div>
                  </div>
                )
              })}

              {/* Behavior trend */}
              {behaviors && behaviors.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-50">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Recent Behavior Events</p>
                  <div className="space-y-1">
                    {behaviors.slice(0, 3).map((b: any) => (
                      <div key={b.id} className="flex items-center justify-between">
                        <p className="text-xs text-gray-600 truncate flex-1">{b.behavior}</p>
                        <div className="flex gap-0.5 ml-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < b.intensity ? 'bg-red-400' : 'bg-gray-200'}`} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Section>

        {/* ── Journal Summary ── */}
        <Section
          title="Parent Journal"
          icon={BookOpen}
          color="bg-pink-50 text-pink-600"
          action={
            <Link href="/journal" className="text-xs text-pink-600 hover:underline font-medium flex items-center gap-1">
              Add Entry <Plus className="w-3 h-3" />
            </Link>
          }
        >
          {(journals || []).length === 0 ? (
            <EmptyState
              icon="📓"
              message="No journal entries yet. Log observations, milestones, and challenges to track your child's journey."
              action={
                <Link href="/journal" className="inline-flex items-center gap-1.5 bg-pink-500 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-pink-600">
                  <Plus className="w-3.5 h-3.5" /> Write First Entry
                </Link>
              }
            />
          ) : (
            <div className="space-y-3">
              {/* Milestones */}
              {allMilestones.length > 0 && (
                <div className="bg-yellow-50 rounded-xl p-3">
                  <p className="text-xs font-semibold text-yellow-700 mb-1.5">🏆 Recent Milestones</p>
                  <ul className="space-y-1">
                    {allMilestones.slice(0, 3).map((m: string, i: number) => (
                      <li key={i} className="text-xs text-gray-700 flex items-start gap-1.5">
                        <span className="text-yellow-500">★</span>{m}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recent entries */}
              <div className="space-y-2">
                {(journals as any[]).slice(0, 3).map((j: any) => (
                  <div key={j.id} className="border border-gray-100 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">{MOOD_EMOJI[j.mood] || '📝'}</span>
                      <span className="text-xs text-gray-400">{formatDate(j.created_at)}</span>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">{j.content}</p>
                    {j.ai_analysis && (
                      <p className="text-xs text-purple-600 mt-1.5 flex items-start gap-1">
                        <Brain className="w-3 h-3 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{j.ai_analysis}</span>
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* AI patterns */}
              {allAiPatterns.length > 0 && (
                <div className="bg-purple-50 rounded-xl p-3">
                  <p className="text-xs font-semibold text-purple-700 mb-1.5">🤖 AI Insights from Journal</p>
                  <ul className="space-y-1">
                    {allAiPatterns.slice(0, 3).map((p: string, i: number) => (
                      <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                        <span className="text-purple-400">◆</span>{p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </Section>

      </div>

      {/* ── Child Details ── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mt-4">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-gray-400" /> Child Information
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {child.interests?.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 mb-1.5">Interests</p>
              <div className="flex flex-wrap gap-1">
                {(child.interests as string[]).map((t, i) => (
                  <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{t}</span>
                ))}
              </div>
            </div>
          )}
          {child.sensory_sensitivities?.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 mb-1.5">Sensory Sensitivities</p>
              <div className="flex flex-wrap gap-1">
                {(child.sensory_sensitivities as string[]).map((s, i) => (
                  <span key={i} className="text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full">{s}</span>
                ))}
              </div>
            </div>
          )}
          {child.therapies?.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 mb-1.5">Therapies</p>
              <div className="flex flex-wrap gap-1">
                {(child.therapies as string[]).map((t, i) => (
                  <span key={i} className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{t}</span>
                ))}
              </div>
            </div>
          )}
          {child.medications?.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 mb-1.5">Medications</p>
              <div className="flex flex-wrap gap-1">
                {(child.medications as string[]).map((m, i) => (
                  <span key={i} className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-full">{m}</span>
                ))}
              </div>
            </div>
          )}
          {child.notes && (
            <div className="sm:col-span-3">
              <p className="text-xs text-gray-400 mb-1">Notes</p>
              <p className="text-xs text-gray-600">{child.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        {[
          { href: `/assessment/${childId}`, icon: ClipboardCheck, label: 'Assess', color: 'bg-blue-600 hover:bg-blue-700' },
          { href: '/goals/new', icon: Target, label: 'Add Goal', color: 'bg-green-600 hover:bg-green-700' },
          { href: '/journal', icon: BookOpen, label: 'Journal', color: 'bg-pink-500 hover:bg-pink-600' },
          { href: `/coach`, icon: MessageSquare, label: 'AI Coach', color: 'bg-purple-600 hover:bg-purple-700' },
        ].map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center justify-center gap-2 text-white text-sm font-semibold py-3 rounded-xl ${item.color}`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
