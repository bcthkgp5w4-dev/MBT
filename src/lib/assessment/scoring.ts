import { QUESTIONS, DOMAINS, RESPONSE_SCORES, type ResponseValue, type DomainId } from './questions'

export interface DomainScore {
  domainId: DomainId
  label: string
  rawScore: number
  maxScore: number
  percentage: number
  level: 'emerging' | 'developing' | 'consolidating' | 'established'
  priorityRank: number
  skillAgeEstimate: string
}

export interface AssessmentProfile {
  domainScores: DomainScore[]
  prioritizedDomains: DomainId[]
  strengths: string[]
  challenges: string[]
  emergingSkills: string[]
  missingSkills: string[]
  safetyFlags: string[]
  overallLevel: number
}

const LEVEL_THRESHOLDS = { emerging: 40, developing: 65, consolidating: 80 }

function getLevel(pct: number): DomainScore['level'] {
  if (pct < LEVEL_THRESHOLDS.emerging) return 'emerging'
  if (pct < LEVEL_THRESHOLDS.developing) return 'developing'
  if (pct < LEVEL_THRESHOLDS.consolidating) return 'consolidating'
  return 'established'
}

function getSkillAgeEstimate(domainId: DomainId, pct: number): string {
  const ageRanges: Record<DomainId, string[]> = {
    communication: ['under 12 months', '12–18 months', '18–24 months', '2–3 years', '3–5 years'],
    social: ['under 12 months', '12–18 months', '2–3 years', '3–4 years', '4–6 years'],
    play: ['under 12 months', '12–18 months', '2–3 years', '3–4 years', '4–6 years'],
    behavior: ['significant concerns', 'moderate concerns', 'some concerns', 'mild concerns', 'age-appropriate'],
    attention: ['under 12 months', '12–18 months', '2–3 years', '3–4 years', '4–6 years'],
    sensory: ['significant impact', 'high impact', 'moderate impact', 'mild impact', 'minimal impact'],
    adaptive: ['under 18 months', '18–24 months', '2–3 years', '3–4 years', '4–6 years'],
    academic: ['pre-readiness', '3–4 years', '4–5 years', '5–6 years', 'school-ready'],
  }
  const idx = Math.min(Math.floor(pct / 20), 4)
  return ageRanges[domainId][idx]
}

export function scoreAssessment(responses: Record<number, ResponseValue>): AssessmentProfile {
  // Calculate domain scores
  const domainScores: DomainScore[] = DOMAINS.map(domain => {
    const domainQuestions = QUESTIONS.filter(q => q.domain === domain.id)
    let rawScore = 0
    let maxScore = 0
    for (const q of domainQuestions) {
      const response = responses[q.id]
      if (response === undefined) continue
      const baseScore = RESPONSE_SCORES[response]
      const score = q.reversed ? (3 - baseScore) : baseScore
      rawScore += score
      maxScore += 3
    }
    const percentage = maxScore > 0 ? Math.round((rawScore / maxScore) * 100) : 0
    return {
      domainId: domain.id,
      label: domain.label,
      rawScore,
      maxScore,
      percentage,
      level: getLevel(percentage),
      priorityRank: 0,
      skillAgeEstimate: getSkillAgeEstimate(domain.id, percentage),
    }
  })

  // Safety flags — self-injury (q27) or aggression (q28) at often/always
  const safetyFlags: string[] = []
  if (responses[27] === 'always' || responses[27] === 'often') {
    safetyFlags.push('Self-injurious behavior reported — this is the highest clinical priority')
  }
  if (responses[28] === 'always' || responses[28] === 'often') {
    safetyFlags.push('Aggressive behavior toward others reported — behavior support is urgent')
  }

  // Priority algorithm
  // Rule 1: Safety overrides all
  // Rule 2: Communication is highest non-safety priority
  // Rule 3: Adaptive gets boosted if severely delayed
  // Rule 4: Otherwise rank by lowest score first
  const sorted = [...domainScores].sort((a, b) => {
    const safetyDomains = safetyFlags.length > 0 ? ['behavior'] : []
    const aIsSafety = safetyDomains.includes(a.domainId)
    const bIsSafety = safetyDomains.includes(b.domainId)
    if (aIsSafety && !bIsSafety) return -1
    if (!aIsSafety && bIsSafety) return 1

    // Communication always next
    if (a.domainId === 'communication' && b.domainId !== 'communication') return -1
    if (b.domainId === 'communication' && a.domainId !== 'communication') return 1

    // Severely delayed adaptive (< 40%) gets high priority
    if (a.domainId === 'adaptive' && a.percentage < 40) return -1
    if (b.domainId === 'adaptive' && b.percentage < 40) return 1

    // Otherwise: lowest score = highest priority
    return a.percentage - b.percentage
  })

  const prioritizedDomains = sorted.map((d, i) => {
    d.priorityRank = i + 1
    return d.domainId
  })
  // Update priority ranks in original array
  domainScores.forEach(d => {
    d.priorityRank = prioritizedDomains.indexOf(d.domainId) + 1
  })

  // Build profile narrative
  const strengths: string[] = []
  const challenges: string[] = []
  const emergingSkills: string[] = []
  const missingSkills: string[] = []

  for (const ds of domainScores) {
    const domain = DOMAINS.find(d => d.id === ds.domainId)!
    if (ds.level === 'established') {
      strengths.push(`${domain.label}: skills are well-established (${ds.percentage}%)`)
    } else if (ds.level === 'consolidating') {
      strengths.push(`${domain.label}: most skills are in place (${ds.percentage}%)`)
      emergingSkills.push(`${domain.label}: approaching independence, needs occasional support`)
    } else if (ds.level === 'developing') {
      emergingSkills.push(`${domain.label}: some skills present but inconsistent (${ds.percentage}%)`)
      challenges.push(`${domain.label}: skills are emerging and need structured support`)
    } else {
      missingSkills.push(`${domain.label}: significant skill gaps identified (${ds.percentage}%)`)
      challenges.push(`${domain.label}: foundational skills need to be built — estimated level ${ds.skillAgeEstimate}`)
    }
  }

  const overallLevel = Math.round(domainScores.reduce((a, b) => a + b.percentage, 0) / domainScores.length)

  return { domainScores, prioritizedDomains, strengths, challenges, emergingSkills, missingSkills, safetyFlags, overallLevel }
}

export function buildAssessmentPrompt(child: any, profile: AssessmentProfile): string {
  const topDomains = profile.prioritizedDomains.slice(0, 4)
  const domainDetails = profile.domainScores
    .sort((a, b) => a.priorityRank - b.priorityRank)
    .map(d => `${d.label}: ${d.percentage}% (${d.level}, estimated ${d.skillAgeEstimate})`)
    .join('\n')

  return `You are an expert autism support specialist and behavior analyst. Generate a complete therapy planning report for a child based on their functional assessment results.

Child: ${child.name}, age ${child.date_of_birth ? Math.floor((Date.now() - new Date(child.date_of_birth).getTime()) / (365.25 * 24 * 3600 * 1000)) : 'unknown'} years
Communication level: ${child.communication_level || 'unknown'}
Diagnosis: ${child.diagnosis_status || 'unknown'}
Current therapies: ${(child.therapies || []).join(', ') || 'none'}

DOMAIN SCORES (lowest % = most need):
${domainDetails}

SAFETY FLAGS: ${profile.safetyFlags.length > 0 ? profile.safetyFlags.join('; ') : 'none'}
TOP PRIORITY AREAS: ${topDomains.join(', ')}
OVERALL LEVEL: ${profile.overallLevel}%

Generate a structured therapy plan as JSON with exactly this structure:
{
  "strengths": ["string - 3-5 specific strength statements"],
  "challenges": ["string - 3-5 specific challenge statements"],
  "emerging_skills": ["string - 3-4 skills the child is starting to show"],
  "missing_skills": ["string - 3-4 foundational skills not yet present"],
  "priority_areas": [
    {
      "rank": 1,
      "domain": "domain name",
      "reason": "why this is the priority",
      "current_level": "description of where child is now"
    }
  ],
  "short_term_goals": [
    {
      "domain": "domain name",
      "title": "goal title",
      "baseline": "current ability",
      "target": "what success looks like",
      "success_criteria": "measurable criteria",
      "measurement_method": "how to track",
      "timeline_weeks": 8,
      "activities": [
        {
          "name": "activity name",
          "purpose": "why this helps",
          "materials": ["item1", "item2"],
          "instructions": ["step 1", "step 2", "step 3"],
          "duration_minutes": 10,
          "difficulty": "beginner",
          "data_collection": "how parent tracks progress"
        }
      ]
    }
  ],
  "medium_term_goals": [same structure, timeline 8-16 weeks],
  "long_term_goals": [same structure, timeline 16-24 weeks],
  "therapy_recommendations": [
    {
      "therapy_type": "Speech-Language Therapy",
      "priority": "high",
      "frequency": "2x per week",
      "reason": "why recommended",
      "home_support": "what parents can do"
    }
  ],
  "daily_plan": {
    "30_min": { "sessions": [{"domain": "name", "activity": "description", "duration_min": 10}] },
    "60_min": { "sessions": [{"domain": "name", "activity": "description", "duration_min": 15}] },
    "90_min": { "sessions": [{"domain": "name", "activity": "description", "duration_min": 20}] }
  },
  "weekly_schedule": {
    "monday": ["Morning: activity", "Evening: activity"],
    "tuesday": ["Morning: activity"],
    "wednesday": ["Morning: activity", "Evening: activity"],
    "thursday": ["Morning: activity"],
    "friday": ["Morning: activity", "Evening: activity"],
    "saturday": ["Activity 1", "Activity 2"],
    "sunday": ["Rest + informal play"]
  },
  "parent_coaching_tips": ["tip 1", "tip 2", "tip 3", "tip 4", "tip 5"]
}`
}
