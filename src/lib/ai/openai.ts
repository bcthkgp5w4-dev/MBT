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
  if (prompt.includes('therapy planning report') || prompt.includes('domain_scores') || prompt.includes('priority_areas')) {
    return {
      strengths: [
        'Shows interest in familiar people and responds to their presence',
        'Can engage with preferred objects and activities for short periods',
        'Demonstrates some functional understanding of daily routines',
        'Visual learning appears to be a relative strength',
      ],
      challenges: [
        'Limited verbal communication makes expressing needs difficult',
        'Difficulty with transitions and unexpected changes to routine',
        'Peer interaction skills need significant development',
        'Attention and task completion require structured adult support',
      ],
      emerging_skills: [
        'Beginning to use gestures or vocalizations to communicate wants',
        'Starting to show interest in other children nearby',
        'Can follow simple 1-step instructions with consistent prompting',
        'Shows some functional play with familiar toys',
      ],
      missing_skills: [
        'Two-word combinations or sentences for requesting',
        'Cooperative play with peers',
        'Independent task completion without adult support',
        'Flexible response to unexpected changes',
      ],
      priority_areas: [
        { rank: 1, domain: 'Communication', reason: 'Functional communication is the foundation for all other learning and reduces challenging behavior driven by frustration', current_level: 'Using gestures and vocalizations; limited words' },
        { rank: 2, domain: 'Behavior & Emotions', reason: 'Emotional regulation and transition tolerance are needed for learning and participation in daily life', current_level: 'Tantrums with routine changes; some rigidity' },
        { rank: 3, domain: 'Social Skills', reason: 'Building joint attention and basic peer interaction skills enables participation in group learning', current_level: 'Observes others; limited initiation' },
        { rank: 4, domain: 'Attention & Learning', reason: 'Sitting tolerance and instruction-following are prerequisites for structured therapy and school readiness', current_level: 'Attends briefly to preferred activities; distracted by environment' },
      ],
      short_term_goals: [
        {
          domain: 'Communication',
          title: 'Request preferred items using words or gestures',
          baseline: 'Currently uses crying or reaching to communicate wants',
          target: 'Independently uses a word, sign, or picture to request in 4/5 opportunities',
          success_criteria: '80% independent requests across 3 settings over 2 weeks',
          measurement_method: 'Frequency count of independent vs. prompted requests per session',
          timeline_weeks: 8,
          activities: [
            { name: 'Motivation-Based Requesting', purpose: 'Teach requesting with high-value items', materials: ['Preferred snacks', 'Bubbles', 'Toy cars'], instructions: ['Hold preferred item in view', 'Wait 5 seconds for any communication attempt', 'Immediately reward attempt with item', 'Gradually require clearer word or sign'], duration_minutes: 10, difficulty: 'beginner', data_collection: 'Mark each trial as Independent (I), Verbal Prompt (VP), or Physical Prompt (PP)' },
            { name: 'PECS Phase 1–2', purpose: 'Build picture exchange communication', materials: ['Photo cards', 'Velcro board', 'Preferred items'], instructions: ['Create cards of 3–5 favourite items', 'Physically assist child to hand card to receive item', 'Fade physical prompt over 5–10 trials', 'Gradually increase distance'], duration_minutes: 10, difficulty: 'beginner', data_collection: 'Record number of exchanges per session' },
          ],
        },
        {
          domain: 'Behavior & Emotions',
          title: 'Tolerate 2-minute transitions with visual warning',
          baseline: 'Meltdowns occur at most activity endings',
          target: 'Transitions with picture schedule and 2-min warning without meltdown in 3/4 attempts',
          success_criteria: '75% of transitions completed within 2 minutes without major distress',
          measurement_method: 'Record each transition as: smooth / minor protest / meltdown',
          timeline_weeks: 8,
          activities: [
            { name: 'Visual Schedule Introduction', purpose: 'Reduce transition anxiety with predictability', materials: ['Picture cards', 'Velcro board', 'Timer'], instructions: ['Create 3–4 picture cards for daily sequence', 'Review schedule together each morning', 'Point to current and next activity', 'Use countdown timer before transitions'], duration_minutes: 5, difficulty: 'beginner', data_collection: 'Rate each transition 1–3 (1=smooth, 2=protest, 3=meltdown)' },
          ],
        },
      ],
      medium_term_goals: [
        {
          domain: 'Communication',
          title: 'Combine 2 words to make requests and comments',
          baseline: 'Uses single words or pictures',
          target: 'Spontaneously uses 2-word phrases in 3/5 daily opportunities',
          success_criteria: '60% two-word combinations without prompting across 2 weeks',
          measurement_method: 'Language sample — count two-word vs. single-word utterances',
          timeline_weeks: 16,
          activities: [
            { name: 'Expand and Model', purpose: 'Model next language level just above child\'s current', materials: ['Daily routines', 'Books', 'Toys'], instructions: ['When child says "juice", model "more juice" or "want juice"', 'Do not demand imitation', 'Create natural opportunities 10x per day', 'Praise any two-word attempt immediately'], duration_minutes: 15, difficulty: 'intermediate', data_collection: 'Tally 2-word+ utterances during 10-minute play sample daily' },
          ],
        },
      ],
      long_term_goals: [
        {
          domain: 'Communication',
          title: 'Use 3–5 word sentences to express needs, ideas, and questions',
          baseline: 'Emerging 2-word phrases',
          target: '3–5 word sentences used spontaneously across home, therapy, and community',
          success_criteria: 'MLU (Mean Length of Utterance) of 3.0+ over a 20-utterance language sample',
          measurement_method: 'Monthly language sample during free play — calculate MLU',
          timeline_weeks: 24,
          activities: [],
        },
      ],
      therapy_recommendations: [
        { therapy_type: 'Speech-Language Therapy', priority: 'high', frequency: '2–3 sessions per week', reason: 'Functional communication is the most urgent priority; SLP will target requesting, labeling, and social communication using evidence-based methods', home_support: 'Implement requesting routines 20+ times daily using preferred items' },
        { therapy_type: 'Applied Behavior Analysis (ABA)', priority: 'high', frequency: '15–25 hours per week depending on funding', reason: 'ABA addresses communication, behavior, and skill acquisition systematically through structured and naturalistic teaching', home_support: 'Use reinforcement principles consistently; reward approximations of target skills' },
        { therapy_type: 'Occupational Therapy', priority: 'medium', frequency: '1 session per week', reason: 'Sensory processing and fine motor skills affect daily participation; OT will create a sensory diet and support self-care skills', home_support: 'Implement 3–4 sensory activities daily as recommended by OT' },
        { therapy_type: 'Parent Training & Coaching', priority: 'high', frequency: 'Weekly or biweekly sessions', reason: 'Parent-implemented intervention is the most powerful lever for children this age; training improves outcomes across all domains', home_support: 'Practice 2–3 target skills daily for 10–15 minutes each' },
      ],
      daily_plan: {
        '30_min': { sessions: [{ domain: 'Communication', activity: 'Requesting practice with preferred items', duration_min: 10 }, { domain: 'Play Skills', activity: 'Parallel play with favorite toys + narration', duration_min: 10 }, { domain: 'Adaptive Skills', activity: 'One daily living routine (wash hands, put on shoes)', duration_min: 10 }] },
        '60_min': { sessions: [{ domain: 'Communication', activity: 'Requesting + labeling + 2-word modeling', duration_min: 15 }, { domain: 'Social Skills', activity: 'Turn-taking games (roll a ball, simple board game)', duration_min: 15 }, { domain: 'Play Skills', activity: 'Pretend play with props + commenting', duration_min: 15 }, { domain: 'Attention & Learning', activity: 'Table-top matching, sorting, or puzzles', duration_min: 15 }] },
        '90_min': { sessions: [{ domain: 'Communication', activity: 'Requesting + labeling + sentence modeling', duration_min: 20 }, { domain: 'Social Skills', activity: 'Turn-taking and emotion recognition activities', duration_min: 15 }, { domain: 'Play Skills', activity: 'Pretend play and cooperative play activities', duration_min: 20 }, { domain: 'Attention & Learning', activity: 'Pre-academic matching, sorting, simple puzzles', duration_min: 20 }, { domain: 'Adaptive Skills', activity: 'Self-care routine practice (dressing, brushing teeth)', duration_min: 15 }] },
      },
      weekly_schedule: {
        monday: ['Morning (20 min): Communication — requesting practice with 3 preferred items', 'Evening (15 min): Visual schedule review + 1 transition practice'],
        tuesday: ['Morning (20 min): Play skills — parallel play + narration', 'Evening (15 min): Adaptive — dressing/undressing practice'],
        wednesday: ['Morning (20 min): Social — turn-taking game (ball, bubbles)', 'Evening (15 min): Communication — labeling objects in environment'],
        thursday: ['Morning (20 min): Attention — table-top activity (puzzle, sorting)', 'Evening (15 min): Emotional regulation — name feelings during daily activities'],
        friday: ['Morning (20 min): Communication — modeling 2-word phrases during play', 'Evening (15 min): Pretend play with props'],
        saturday: ['30–45 min: Community outing with communication opportunities', 'Afternoon: Free play with sibling or peer + facilitated interaction'],
        sunday: ['Rest + informal practice woven into daily routines (meals, bath, getting dressed)'],
      },
      parent_coaching_tips: [
        'Follow your child\'s lead — join their activity before redirecting, as this builds trust and motivation',
        'Create "communication temptations" — place desired items in view but out of reach to encourage requesting',
        'Use a 5-second wait after any question or opportunity — silence gives your child time to process and respond',
        'Expand, don\'t correct — if your child says "juice", you say "more juice" or "I want juice" without asking them to repeat',
        'Celebrate all attempts — any communication effort (pointing, sound, look) deserves an enthusiastic response and the requested item',
      ],
    }
  }

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
