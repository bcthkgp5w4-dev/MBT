import type { Child, ScreeningResult, Goal, JournalEntry, BehaviorEntry } from '@/types'

export const SYSTEM_PROMPT = `You are the MBT AI Autism Coach — a compassionate, evidence-based assistant supporting families of children with Autism Spectrum Disorder (ASD).

CORE RULES:
- You NEVER diagnose autism or any other condition
- You always recommend professional evaluation when appropriate
- You base all advice on evidence-based practices (ABA, PECS, DIR/Floortime, ESDM)
- You are warm, supportive, non-judgmental, and empowering
- You use plain, accessible language
- You ALWAYS include: "MBT is not a substitute for professional diagnosis, treatment, or medical advice."

YOUR EXPERTISE:
- Applied Behavior Analysis (ABA)
- Speech and Language Pathology
- Occupational Therapy
- Early Intervention
- Autism-specific teaching strategies
- Parent coaching and support

RESPONSE FORMAT:
- Be concise but thorough
- Use bullet points for recommendations
- Explain the WHY behind every recommendation
- Offer 2-3 practical, actionable steps
- End with an encouraging note`

export function buildChildContext(child: Child): string {
  return `
CHILD PROFILE:
Name: ${child.name}
Age: ${child.date_of_birth}
Communication Level: ${child.communication_level?.replace(/_/g, ' ')}
Diagnosis Status: ${child.diagnosis_status?.replace(/_/g, ' ')}
Strengths: ${child.strengths?.join(', ') || 'Not specified'}
Challenges: ${child.challenges?.join(', ') || 'Not specified'}
Interests: ${child.interests?.join(', ') || 'Not specified'}
Sensory Needs: ${child.sensory_sensitivities?.join(', ') || 'Not specified'}
Current Therapies: ${child.therapies?.join(', ') || 'None listed'}
`
}

export function buildScreeningContext(results: ScreeningResult[]): string {
  if (!results?.length) return ''
  const latest = results[0]
  return `
LATEST SCREENING:
Type: ${latest.screening_type?.toUpperCase()}
Risk Level: ${latest.risk_level || 'N/A'}
Summary: ${latest.summary || 'N/A'}
Date: ${latest.completed_at}
`
}

export function buildGoalContext(goals: Goal[]): string {
  if (!goals?.length) return ''
  const active = goals.filter(g => g.status === 'active').slice(0, 5)
  return `
ACTIVE GOALS:
${active.map(g => `- [${g.domain}] ${g.title} (${g.progress_percentage}% complete)`).join('\n')}
`
}

export function goalGenerationPrompt(child: Child, domain: string): string {
  return `${buildChildContext(child)}

Generate 3 SMART therapy goals for the domain: ${domain.toUpperCase()}

For each goal provide:
1. title: Clear, measurable goal title
2. description: Detailed description
3. baseline: Current performance level
4. target: Target performance to achieve
5. timeline_weeks: Number of weeks (realistic: 8-24)
6. measurement_criteria: How to measure progress
7. rationale: Why this goal is important

Format as JSON array. Base goals on child's communication level and current challenges.`
}

export function therapyPlanPrompt(child: Child, goals: Goal[]): string {
  return `${buildChildContext(child)}
${buildGoalContext(goals)}

Generate a daily therapy activity plan for today.

Create 4-6 activities covering these domains: communication, social skills, play, adaptive skills.

For each activity provide:
- title
- objective
- materials (list)
- instructions (step-by-step list)
- duration_minutes
- expected_outcome
- data_collection_method
- domain
- difficulty (beginner/intermediate/advanced)

Consider the child's interests and sensory needs. Make activities fun and engaging.
Format as JSON array.`
}

export function journalAnalysisPrompt(entry: JournalEntry, recentEntries: JournalEntry[]): string {
  const patterns = recentEntries.slice(0, 7).map(e => e.content).join('\n---\n')
  return `Analyze this parent journal entry for a child with autism:

TODAY'S ENTRY:
${entry.content}

RECENT ENTRIES (last 7 days):
${patterns || 'No recent entries'}

Provide:
1. Key observations from today's entry
2. Patterns you notice across entries
3. 2-3 specific recommendations based on what you see
4. One encouraging observation about progress

Format as JSON with keys: observations, patterns, recommendations, encouragement`
}

export function behaviorAnalysisPrompt(entries: BehaviorEntry[]): string {
  const summary = entries.slice(0, 20).map(e =>
    `Behavior: ${e.behavior} | Antecedent: ${e.antecedent} | Consequence: ${e.consequence} | Intensity: ${e.intensity}/5`
  ).join('\n')

  return `Analyze these ABC (Antecedent-Behavior-Consequence) behavior records:

${summary}

Provide:
1. Most common antecedents (triggers)
2. Identified behavioral functions (attention, escape, sensory, tangible)
3. Patterns and trends
4. Evidence-based intervention recommendations
5. Replacement behaviors to teach

Format as JSON with keys: common_triggers, behavioral_functions, patterns, interventions, replacement_behaviors`
}

export function screeningInterpretationPrompt(
  screeningType: string,
  responses: Record<string, any>,
  score: number
): string {
  return `You are analyzing a ${screeningType} screening for a child.

Score: ${score}
Responses: ${JSON.stringify(responses, null, 2)}

Provide:
1. Risk level interpretation (low/medium/high)
2. Key areas of concern (if any)
3. Developmental summary
4. Specific recommendations
5. Professional evaluation guidance

IMPORTANT: State clearly this is a screening tool, NOT a diagnosis.
Format as JSON with keys: risk_level, areas_of_concern, summary, recommendations, professional_guidance`
}

export function coachResponsePrompt(
  message: string,
  child: Child | null,
  conversationHistory: string
): string {
  const childContext = child ? buildChildContext(child) : 'No child profile selected.'

  return `${SYSTEM_PROMPT}

${childContext}

CONVERSATION HISTORY:
${conversationHistory}

PARENT'S MESSAGE:
${message}

Respond as the MBT AI Coach. Be specific to this child's profile if available.`
}

export function developmentalSnapshotPrompt(child: Child, assessments: ScreeningResult[]): string {
  return `${buildChildContext(child)}
${buildScreeningContext(assessments)}

Generate a comprehensive developmental snapshot for this child.

Provide:
1. strengths: List of identified strengths (5-8 items)
2. challenges: List of current challenges (5-8 items)
3. priority_areas: Top 3 areas to focus on (ordered by importance)
4. developmental_level: Overall developmental summary
5. immediate_recommendations: 3 actionable recommendations for parents
6. professional_services_needed: List of recommended professional services

Format as JSON.`
}
