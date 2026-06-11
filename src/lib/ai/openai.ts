// Mock AI module - no API key required
// Replace these mock responses with real OpenAI calls when ready

export async function generateJSON<T>(prompt: string, _systemPrompt?: string): Promise<T> {
  // Returns structured mock data based on the prompt content
  return getMockJSON(prompt) as T
}

export async function generateText(prompt: string, _systemPrompt?: string): Promise<string> {
  return getMockText(prompt)
}

export async function streamChat(
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>
): Promise<AsyncIterable<{ choices: Array<{ delta: { content?: string } }> }>> {
  const lastMessage = messages[messages.length - 1]?.content || ''
  const response = getMockCoachResponse(lastMessage)

  // Simulate streaming by yielding words one at a time
  async function* stream() {
    const words = response.split(' ')
    for (const word of words) {
      yield { choices: [{ delta: { content: word + ' ' } }] }
      await new Promise(r => setTimeout(r, 30))
    }
  }

  return stream()
}

function getMockCoachResponse(message: string): string {
  const lower = message.toLowerCase()

  if (lower.includes('scream') || lower.includes('meltdown') || lower.includes('tantrum')) {
    return `I understand how challenging this can be. Here are some evidence-based strategies:

**Understanding the behavior:**
This is often a communication attempt. When a child screams or has a meltdown, they may be expressing frustration, overstimulation, or unmet needs.

**Immediate strategies:**
• Stay calm — your calm energy helps regulate their nervous system
• Reduce demands temporarily
• Offer a quiet, low-stimulation space
• Use simple, short language or visuals

**Longer-term approaches:**
• Teach a replacement behavior (e.g., handing you a "break" card)
• Use visual schedules to prepare for transitions
• Identify triggers using an ABC log

**Important note:** If meltdowns are frequent or intense, a consultation with a Board Certified Behavior Analyst (BCBA) can help create a personalized Behavior Intervention Plan.

*MBT provides educational support only — not medical diagnosis or treatment.*`
  }

  if (lower.includes('nonverbal') || lower.includes('speech') || lower.includes('communication') || lower.includes('talk')) {
    return `Communication development is one of the most important areas to support. Here's what the evidence shows:

**For nonverbal or minimally verbal children:**
• AAC (Augmentative & Alternative Communication) devices and apps are highly effective — they do NOT prevent speech development
• PECS (Picture Exchange Communication System) is a great starting point
• Model language constantly — narrate everything you do

**At-home strategies:**
• Follow your child's lead in play
• Create communication opportunities (put desired items just out of reach)
• Celebrate ALL communication attempts — gestures, sounds, eye contact
• Use simple, clear language at or just above their current level

**Recommended apps:** Proloquo2Go, TouchChat, or free options like LetMeTalk

A Speech-Language Pathologist (SLP) assessment is strongly recommended for a personalized communication plan.

*MBT provides educational support only — not medical diagnosis or treatment.*`
  }

  if (lower.includes('sleep')) {
    return `Sleep challenges are very common in autism — studies show 40-80% of autistic children experience sleep difficulties.

**Common causes:**
• Melatonin regulation differences
• Sensory sensitivities (textures, sounds, light)
• Anxiety and difficulty transitioning
• Irregular circadian rhythms

**Evidence-based strategies:**
• Consistent bedtime routine (same steps, same time every night)
• Dim lights 1 hour before bed — screens off
• Weighted blankets can help with sensory regulation
• White noise machines to block environmental sounds
• Keep the room cool and dark

**Talk to your doctor about:** Melatonin supplementation has strong evidence for autism — but dosage should be guided by a physician.

*MBT provides educational support only — not medical diagnosis or treatment.*`
  }

  if (lower.includes('food') || lower.includes('eat') || lower.includes('diet') || lower.includes('picky')) {
    return `Feeding challenges affect about 70% of autistic children. This is real and valid — it's not "picky eating" in the typical sense.

**Why this happens:**
• Sensory sensitivities to texture, smell, temperature, or appearance
• Anxiety around new foods
• Gastrointestinal issues are more common in autism

**Strategies that work:**
• Food chaining — gradually expanding from accepted foods to similar ones
• Repeated exposure without pressure — it can take 15-20+ exposures before acceptance
• Make mealtimes low-stress and predictable
• Involve your child in food preparation
• Don't force or pressure — this can increase anxiety

**Seek support from:** A feeding therapist (often an OT or SLP) if food variety is very limited or if the child is losing weight.

*MBT provides educational support only — not medical diagnosis or treatment.*`
  }

  return `Thank you for reaching out. Here are some general principles for supporting a child with autism:

**Key evidence-based approaches:**
• **ABA (Applied Behavior Analysis):** Focus on positive reinforcement, skill-building, and functional communication
• **DIR/Floortime:** Child-led play that builds emotional connection and developmental capacities
• **ESDM (Early Start Denver Model):** Combines ABA and developmental approaches — especially effective for young children

**What works across all approaches:**
• Consistency between home, school, and therapy
• Visual supports (schedules, choice boards, social stories)
• Sensory accommodations
• Focusing on the child's strengths and interests
• Building predictability and routine

**For families:**
• Self-care is not optional — supporting a child with autism is demanding work
• Connect with other autism families (local support groups, online communities)
• Keep a journal to track patterns and progress

Feel free to ask a more specific question and I can provide more targeted guidance.

*MBT provides educational support only — not medical diagnosis or treatment.*`
}

function getMockJSON(prompt: string): Record<string, unknown> {
  if (prompt.includes('SMART') || prompt.includes('goal') || prompt.includes('Goal')) {
    return {
      goals: [
        {
          title: 'Request preferred items using words or AAC',
          description: 'Child will independently request desired items using verbal words, signs, or AAC device across 3 different settings.',
          baseline: 'Currently uses crying or pulling to communicate wants',
          target: 'Independently requests items in 4 out of 5 opportunities',
          timeline_weeks: 12,
          measurement_criteria: 'Record number of independent requests per session using data sheet',
          rationale: 'Functional communication reduces frustration and challenging behaviors while building language foundations',
        },
        {
          title: 'Greet familiar adults spontaneously',
          description: 'Child will greet familiar adults (parents, teachers, therapists) without prompting when they enter the room.',
          baseline: 'Does not initiate greetings; responds inconsistently when prompted',
          target: 'Spontaneous greeting in 3 out of 4 daily opportunities',
          timeline_weeks: 8,
          measurement_criteria: 'Daily tally of spontaneous vs. prompted greetings',
          rationale: 'Social initiations are foundational for peer relationships and school success',
        },
        {
          title: 'Follow 2-step instructions in natural settings',
          description: 'Child will follow two-step related instructions during daily routines without physical prompting.',
          baseline: 'Follows 1-step simple instructions with verbal prompt',
          target: 'Follows 2-step instructions independently in 4 of 5 trials',
          timeline_weeks: 16,
          measurement_criteria: 'Prompt level tracking (independent, verbal, physical) during structured and natural opportunities',
          rationale: 'Following multi-step instructions is essential for classroom participation and daily independence',
        },
      ],
    }
  }

  if (prompt.includes('activity') || prompt.includes('plan') || prompt.includes('therapy')) {
    return {
      activities: [
        {
          title: 'Bubble Request Activity',
          domain: 'communication',
          objective: 'Practice requesting using words or pointing',
          materials: ['Bubble wand', 'Bubble solution'],
          instructions: ['Hold bubbles out of reach', 'Wait for child to request', 'Reward immediately with bubbles', 'Repeat 5-8 times'],
          duration_minutes: 10,
          expected_outcome: 'Child attempts verbal or gestural request',
          data_collection_method: 'Tally independent vs prompted requests',
          difficulty: 'beginner',
        },
        {
          title: 'Turn-Taking Board Game',
          domain: 'social',
          objective: 'Practice waiting and taking turns in a structured game',
          materials: ['Simple board game', 'Timer (optional)'],
          instructions: ['Explain turn-taking visually', 'Play 2-3 rounds', 'Praise waiting behavior', 'Keep sessions short and positive'],
          duration_minutes: 15,
          expected_outcome: 'Child waits for their turn with minimal prompting',
          data_collection_method: 'Note number of prompts needed per game',
          difficulty: 'beginner',
        },
        {
          title: 'Sensory Play: Kinetic Sand',
          domain: 'adaptive',
          objective: 'Improve tactile tolerance and fine motor skills',
          materials: ['Kinetic sand', 'Molds', 'Small toys to hide'],
          instructions: ['Allow free exploration first', 'Model play actions', 'Introduce simple tasks (fill/empty)', 'End before overstimulation'],
          duration_minutes: 15,
          expected_outcome: 'Tolerates tactile input and engages with materials for full duration',
          data_collection_method: 'Duration of engagement, tolerance level (1-5)',
          difficulty: 'beginner',
        },
        {
          title: 'Following Routine Visual Schedule',
          domain: 'adaptive',
          objective: 'Build independence in daily transitions using visual supports',
          materials: ['Visual schedule cards', 'Velcro board'],
          instructions: ['Review schedule together each morning', 'Child removes each completed card', 'Provide praise for independent transitions', 'Use first-then board for difficult transitions'],
          duration_minutes: 5,
          expected_outcome: 'Child transitions between 3 activities using visual schedule',
          data_collection_method: 'Track number of independent vs prompted transitions daily',
          difficulty: 'beginner',
        },
      ],
    }
  }

  if (prompt.includes('journal') || prompt.includes('entry') || prompt.includes('observation')) {
    return {
      observations: 'The journal entry shows active parental involvement and detailed observation of the child\'s behaviors and progress. Several positive indicators and specific challenges were noted.',
      patterns: [
        'Challenging behaviors tend to occur during transition times',
        'Child responds positively to preferred activities and sensory play',
        'Communication attempts are increasing based on recent entries',
      ],
      recommendations: [
        'Use a visual transition warning (5-minute timer) before ending preferred activities',
        'Document the specific time of day when difficult behaviors occur to identify patterns',
        'Build on the child\'s strengths identified in today\'s entry to introduce new skills',
      ],
      encouragement: 'Your consistent observation and documentation is one of the most powerful things you can do for your child\'s progress. Every detail you notice helps build a clearer picture of their needs and strengths.',
    }
  }

  if (prompt.includes('behavior') || prompt.includes('ABC') || prompt.includes('antecedent')) {
    return {
      common_triggers: [
        'Transitions between activities (especially ending preferred activities)',
        'Requests to complete non-preferred tasks',
        'Waiting situations without visual support',
        'Sensory overload in noisy or crowded environments',
      ],
      behavioral_functions: [
        'Escape/avoidance: Avoiding non-preferred demands',
        'Access to tangibles: Seeking preferred items (screens, toys)',
        'Sensory: Self-regulation during overwhelm',
      ],
      patterns: [
        'Higher frequency in afternoon (possibly related to fatigue)',
        'Reduced incidents when preferred activities are used as reinforcement',
        'Positive response to advance warning before transitions',
      ],
      interventions: [
        'Implement a First-Then visual board for non-preferred tasks',
        'Use a countdown timer (visual) before transitions',
        'Create a calm-down corner with sensory tools',
        'Teach a functional replacement behavior (e.g., "break" card)',
        'Increase predictability with consistent daily schedule',
      ],
      replacement_behaviors: [
        'Handing over a "break" card instead of screaming',
        'Using AAC to say "all done" instead of throwing',
        'Going to the calm corner instead of hitting',
      ],
    }
  }

  if (prompt.includes('snapshot') || prompt.includes('developmental') || prompt.includes('passport')) {
    return {
      strengths: [
        'Strong visual memory and pattern recognition',
        'Excellent focus on areas of special interest',
        'Responsive to consistent routines and structure',
        'Shows clear preferences and communicates them',
        'Good gross motor skills',
      ],
      challenges: [
        'Transitions between activities',
        'Expressive communication in stressful moments',
        'Joint attention and shared enjoyment',
        'Tolerating changes in routine',
        'Social initiations with peers',
      ],
      priority_areas: [
        'Functional communication',
        'Social interaction skills',
        'Emotional regulation and coping strategies',
      ],
      developmental_level: 'This child demonstrates a unique developmental profile with notable strengths in visual processing and routine-based learning. Support needs are primarily in communication, social engagement, and flexible thinking.',
      immediate_recommendations: [
        'Establish a consistent daily visual schedule',
        'Introduce AAC or PECS if not already in place',
        'Request a speech-language pathology evaluation',
        'Connect with local early intervention services',
      ],
      professional_services_needed: [
        'Speech-Language Pathology',
        'Occupational Therapy (sensory)',
        'Applied Behavior Analysis',
        'Developmental Pediatrician evaluation',
      ],
    }
  }

  // Default fallback
  return {
    result: 'Mock response — connect OpenAI API key to enable AI features',
    data: [],
  }
}

function getMockText(_prompt: string): string {
  return 'AI features are currently in demo mode. Add your OpenAI API key to enable full AI-powered responses.'
}
