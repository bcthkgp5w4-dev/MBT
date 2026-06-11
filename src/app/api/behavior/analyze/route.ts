import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateJSON } from '@/lib/ai/openai'
import { behaviorAnalysisPrompt } from '@/lib/ai/prompts'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { childId } = await req.json()

  const { data: entries } = await supabase
    .from('behavior_entries')
    .select('*')
    .eq('child_id', childId)
    .eq('profile_id', user.id)
    .order('occurred_at', { ascending: false })
    .limit(20)

  if (!entries || entries.length < 3) {
    return NextResponse.json({ error: 'Need at least 3 entries for analysis' }, { status: 400 })
  }

  const analysis = await generateJSON(behaviorAnalysisPrompt(entries))
  return NextResponse.json(analysis)
}
