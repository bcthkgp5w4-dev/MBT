import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateJSON } from '@/lib/ai/openai'
import { developmentalSnapshotPrompt } from '@/lib/ai/prompts'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { childId } = await req.json()

  const [{ data: child }, { data: assessments }] = await Promise.all([
    supabase.from('children').select('*').eq('id', childId).eq('profile_id', user.id).single(),
    supabase.from('screening_results').select('*').eq('child_id', childId).order('created_at', { ascending: false }).limit(3),
  ])

  if (!child) return NextResponse.json({ error: 'Child not found' }, { status: 404 })

  const snapshot = await generateJSON(developmentalSnapshotPrompt(child, assessments || []))
  return NextResponse.json(snapshot)
}
