export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateJSON } from '@/lib/ai/openai'
import { goalGenerationPrompt } from '@/lib/ai/prompts'
import { MCHAT_QUESTIONS } from '@/lib/constants'

// Maps MCHAT item numbers to therapy domains
const ITEM_DOMAIN_MAP: Record<number, string> = {
  1: 'social', 2: 'communication', 3: 'social', 4: 'motor',
  5: 'behavior', 6: 'communication', 7: 'communication', 8: 'social',
  9: 'communication', 10: 'communication', 11: 'social', 12: 'behavior',
  13: 'motor', 14: 'social', 15: 'social', 16: 'social',
  17: 'communication', 18: 'communication', 19: 'social', 20: 'motor',
}

// Items where YES = concern (not NO)
const YES_CONCERN_ITEMS = [2, 5, 12]

function getAffectedDomains(responses: Record<number, boolean>): string[] {
  const domainScores: Record<string, number> = {}
  for (let i = 1; i <= 20; i++) {
    const answer = responses[i]
    if (answer === undefined) continue
    const isConcern = YES_CONCERN_ITEMS.includes(i) ? answer === true : answer === false
    if (isConcern) {
      const domain = ITEM_DOMAIN_MAP[i] || 'communication'
      domainScores[domain] = (domainScores[domain] || 0) + (
        MCHAT_QUESTIONS[i - 1]?.critical ? 2 : 1
      )
    }
  }
  return Object.entries(domainScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([domain]) => domain)
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { childId, responses, riskLevel } = await req.json()

  if (riskLevel === 'low') {
    return NextResponse.json({ goals: [], message: 'No goals needed for low risk' })
  }

  const { data: child } = await supabase
    .from('children').select('*').eq('id', childId).eq('profile_id', user.id).single()
  if (!child) return NextResponse.json({ error: 'Child not found' }, { status: 404 })

  const domains = getAffectedDomains(responses)
  if (domains.length === 0) return NextResponse.json({ goals: [] })

  const allInserted: any[] = []

  for (const domain of domains) {
    const prompt = goalGenerationPrompt(child, domain)
    const result = await generateJSON<{ goals: any[] }>(prompt)
    const goalsToInsert = (result.goals || []).slice(0, 2).map((g: any) => ({
      child_id: childId,
      profile_id: user.id,
      domain,
      title: g.title,
      description: g.description,
      baseline: g.baseline,
      target: g.target,
      timeline_weeks: g.timeline_weeks || 12,
      measurement_criteria: g.measurement_criteria,
      rationale: g.rationale || `Generated from M-CHAT-R screening (${riskLevel} risk)`,
      status: 'active',
      progress_percentage: 0,
      ai_generated: true,
    }))

    const { data: inserted } = await supabase.from('goals').insert(goalsToInsert).select()
    if (inserted) allInserted.push(...inserted)
  }

  return NextResponse.json({ goals: allInserted })
}
