import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateJSON } from '@/lib/ai/openai'
import { journalAnalysisPrompt } from '@/lib/ai/prompts'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { entryId } = await req.json()

  const { data: entry } = await supabase.from('journal_entries').select('*').eq('id', entryId).single()
  if (!entry) return NextResponse.json({ error: 'Entry not found' }, { status: 404 })

  const { data: recentEntries } = await supabase
    .from('journal_entries')
    .select('content')
    .eq('child_id', entry.child_id)
    .neq('id', entryId)
    .order('created_at', { ascending: false })
    .limit(7)

  const recentContents = (recentEntries || []).map(e => ({ ...entry, content: e.content }))
  const analysis = await generateJSON<{
    observations: string
    patterns: string[]
    recommendations: string[]
    encouragement: string
  }>(journalAnalysisPrompt(entry, recentContents))

  await supabase.from('journal_entries').update({
    ai_analysis: analysis.observations,
    ai_patterns: analysis.patterns,
    ai_recommendations: analysis.recommendations,
  }).eq('id', entryId)

  return NextResponse.json({ success: true })
}
