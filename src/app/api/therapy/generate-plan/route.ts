import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateJSON } from '@/lib/ai/openai'
import { therapyPlanPrompt } from '@/lib/ai/prompts'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { childId, date } = await req.json()

  const [{ data: child }, { data: goals }] = await Promise.all([
    supabase.from('children').select('*').eq('id', childId).eq('profile_id', user.id).single(),
    supabase.from('goals').select('*').eq('child_id', childId).eq('status', 'active'),
  ])

  if (!child) return NextResponse.json({ error: 'Child not found' }, { status: 404 })

  const prompt = therapyPlanPrompt(child, goals || [])
  const result = await generateJSON<{ activities: any[] }>(prompt)

  // Upsert plan
  const { data: plan, error: planError } = await supabase
    .from('daily_plans')
    .upsert({
      child_id: childId,
      profile_id: user.id,
      date,
      ai_generated: true,
      completed: false,
    }, { onConflict: 'child_id,date' })
    .select()
    .single()

  if (planError) return NextResponse.json({ error: planError.message }, { status: 500 })

  // Delete existing activities
  await supabase.from('daily_plan_activities').delete().eq('plan_id', plan.id)

  // Insert new activities
  const activitiesData = (result.activities || []).slice(0, 6).map((act: any, i: number) => ({
    plan_id: plan.id,
    custom_title: act.title,
    duration_minutes: act.duration_minutes || 15,
    completed: false,
    order_index: i,
  }))

  await supabase.from('daily_plan_activities').insert(activitiesData)

  const { data: fullPlan } = await supabase
    .from('daily_plans')
    .select('*, daily_plan_activities(*)')
    .eq('id', plan.id)
    .single()

  return NextResponse.json({ plan: fullPlan })
}
