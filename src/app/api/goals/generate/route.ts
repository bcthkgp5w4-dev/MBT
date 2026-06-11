import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateJSON } from '@/lib/ai/openai'
import { goalGenerationPrompt } from '@/lib/ai/prompts'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { childId, domain } = await req.json()

  const { data: child } = await supabase.from('children').select('*').eq('id', childId).eq('profile_id', user.id).single()
  if (!child) return NextResponse.json({ error: 'Child not found' }, { status: 404 })

  const prompt = goalGenerationPrompt(child, domain)
  const result = await generateJSON<{ goals: any[] }>(prompt)

  const goalsToInsert = (result.goals || []).slice(0, 3).map((g: any) => ({
    child_id: childId,
    profile_id: user.id,
    domain,
    title: g.title,
    description: g.description,
    baseline: g.baseline,
    target: g.target,
    timeline_weeks: g.timeline_weeks || 12,
    measurement_criteria: g.measurement_criteria,
    rationale: g.rationale,
    ai_generated: true,
    status: 'active',
    progress_percentage: 0,
  }))

  const { data: inserted, error } = await supabase.from('goals').insert(goalsToInsert).select()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ goals: inserted })
}
