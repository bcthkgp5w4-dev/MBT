export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateJSON } from '@/lib/ai/openai'
import { scoreAssessment, buildAssessmentPrompt } from '@/lib/assessment/scoring'
import type { ResponseValue } from '@/lib/assessment/questions'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { childId, responses } = await req.json() as {
    childId: string
    responses: Record<number, ResponseValue>
  }

  const { data: child } = await supabase
    .from('children').select('*').eq('id', childId).eq('profile_id', user.id).single()
  if (!child) return NextResponse.json({ error: 'Child not found' }, { status: 404 })

  // Score the assessment
  const profile = scoreAssessment(responses)

  // Store assessment
  const domainScoresMap = Object.fromEntries(
    profile.domainScores.map(d => [d.domainId, { percentage: d.percentage, level: d.level, priorityRank: d.priorityRank, skillAgeEstimate: d.skillAgeEstimate }])
  )

  const { data: assessment, error: assessmentError } = await supabase
    .from('functional_assessments')
    .insert({
      child_id: childId,
      profile_id: user.id,
      responses,
      domain_scores: domainScoresMap,
      overall_level: profile.overallLevel,
      safety_flags: profile.safetyFlags,
      prioritized_domains: profile.prioritizedDomains,
      status: 'completed',
    })
    .select()
    .single()

  if (assessmentError) return NextResponse.json({ error: assessmentError.message }, { status: 500 })

  // Generate AI therapy plan
  const prompt = buildAssessmentPrompt(child, profile)
  const aiResult = await generateJSON<any>(prompt)

  // Store developmental profile
  const { data: devProfile, error: profileError } = await supabase
    .from('developmental_profiles')
    .insert({
      assessment_id: assessment.id,
      child_id: childId,
      profile_id: user.id,
      strengths: aiResult.strengths || profile.strengths,
      challenges: aiResult.challenges || profile.challenges,
      emerging_skills: aiResult.emerging_skills || profile.emergingSkills,
      missing_skills: aiResult.missing_skills || profile.missingSkills,
      priority_areas: aiResult.priority_areas || [],
      therapy_recommendations: aiResult.therapy_recommendations || [],
      daily_plan: aiResult.daily_plan || {},
      weekly_schedule: aiResult.weekly_schedule || {},
      parent_coaching_tips: aiResult.parent_coaching_tips || [],
      short_term_goals: aiResult.short_term_goals || [],
      medium_term_goals: aiResult.medium_term_goals || [],
      long_term_goals: aiResult.long_term_goals || [],
    })
    .select()
    .single()

  if (profileError) return NextResponse.json({ error: profileError.message }, { status: 500 })

  // Create goals in the goals table from short-term goals
  const goalsToInsert = (aiResult.short_term_goals || []).slice(0, 5).map((g: any) => ({
    child_id: childId,
    profile_id: user.id,
    domain: g.domain?.toLowerCase().replace(/[^a-z]/g, '').substring(0, 20) || 'communication',
    title: g.title,
    description: g.baseline,
    baseline: g.baseline,
    target: g.target,
    timeline_weeks: g.timeline_weeks || 8,
    measurement_criteria: g.measurement_method,
    rationale: `Generated from functional assessment — ${(g.success_criteria || '').substring(0, 100)}`,
    status: 'active',
    progress_percentage: 0,
    ai_generated: true,
  }))

  if (goalsToInsert.length > 0) {
    await supabase.from('goals').insert(goalsToInsert)
  }

  return NextResponse.json({
    assessmentId: assessment.id,
    profileId: devProfile.id,
    overallLevel: profile.overallLevel,
    safetyFlags: profile.safetyFlags,
  })
}
