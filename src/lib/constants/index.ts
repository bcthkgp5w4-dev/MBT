export const MCHAT_QUESTIONS = [
  {
    id: 1,
    question: 'If you point at something across the room, does your child look at it?',
    type: 'yes_no',
    critical: true,
  },
  {
    id: 2,
    question: 'Have you ever wondered if your child might be deaf?',
    type: 'yes_no',
    critical: false,
  },
  {
    id: 3,
    question: 'Does your child play pretend or make-believe?',
    type: 'yes_no',
    critical: true,
  },
  {
    id: 4,
    question: 'Does your child like climbing on things?',
    type: 'yes_no',
    critical: false,
  },
  {
    id: 5,
    question: 'Does your child make unusual finger movements near his/her eyes?',
    type: 'yes_no',
    critical: false,
  },
  {
    id: 6,
    question: 'Does your child point with one finger to ask for something or to get help?',
    type: 'yes_no',
    critical: true,
  },
  {
    id: 7,
    question: 'Does your child point with one finger to show you something interesting?',
    type: 'yes_no',
    critical: true,
  },
  {
    id: 8,
    question: 'Is your child interested in other children?',
    type: 'yes_no',
    critical: true,
  },
  {
    id: 9,
    question: 'Does your child show you things by bringing them to you or holding them up for you to see?',
    type: 'yes_no',
    critical: true,
  },
  {
    id: 10,
    question: 'Does your child respond to his/her name when you call?',
    type: 'yes_no',
    critical: true,
  },
  {
    id: 11,
    question: 'When you smile at your child, does he/she smile back at you?',
    type: 'yes_no',
    critical: false,
  },
  {
    id: 12,
    question: 'Does your child get upset by everyday noises?',
    type: 'yes_no',
    critical: false,
  },
  {
    id: 13,
    question: 'Does your child walk?',
    type: 'yes_no',
    critical: false,
  },
  {
    id: 14,
    question: 'Does your child look you in the eye when you are talking to him/her, playing with him/her, or dressing him/her?',
    type: 'yes_no',
    critical: false,
  },
  {
    id: 15,
    question: 'Does your child try to copy what you do?',
    type: 'yes_no',
    critical: false,
  },
  {
    id: 16,
    question: 'If you turn your head to look at something, does your child look around to see what you are looking at?',
    type: 'yes_no',
    critical: false,
  },
  {
    id: 17,
    question: 'Does your child try to get you to watch him/her?',
    type: 'yes_no',
    critical: false,
  },
  {
    id: 18,
    question: 'Does your child understand when you tell him/her to do something?',
    type: 'yes_no',
    critical: false,
  },
  {
    id: 19,
    question: 'If something new happens, does your child look at your face to see how you feel about it?',
    type: 'yes_no',
    critical: false,
  },
  {
    id: 20,
    question: 'Does your child like movement activities?',
    type: 'yes_no',
    critical: false,
  },
]

export const SENSORY_QUESTIONS = [
  { id: 1, question: 'Does your child cover their ears to block out sounds?', domain: 'auditory' },
  { id: 2, question: 'Is your child bothered by certain clothing textures?', domain: 'tactile' },
  { id: 3, question: 'Does your child seek out spinning or swinging activities?', domain: 'vestibular' },
  { id: 4, question: 'Is your child sensitive to bright lights or certain visual patterns?', domain: 'visual' },
  { id: 5, question: 'Does your child have strong reactions to certain smells?', domain: 'olfactory' },
  { id: 6, question: 'Is your child a very picky eater based on food textures?', domain: 'gustatory' },
  { id: 7, question: 'Does your child seek deep pressure (tight hugs, heavy blankets)?', domain: 'proprioceptive' },
  { id: 8, question: 'Does your child seem unaware of pain or temperature?', domain: 'interoceptive' },
]

export const THERAPY_DOMAINS = [
  { value: 'communication', label: 'Communication', icon: '💬' },
  { value: 'social', label: 'Social Skills', icon: '👥' },
  { value: 'behavior', label: 'Behavior', icon: '🧠' },
  { value: 'adaptive', label: 'Adaptive Skills', icon: '🛠️' },
  { value: 'academic', label: 'Academic', icon: '📚' },
  { value: 'motor', label: 'Motor Skills', icon: '🏃' },
  { value: 'emotional', label: 'Emotional Regulation', icon: '❤️' },
]

export const COMMUNICATION_LEVELS = [
  { value: 'nonverbal', label: 'Nonverbal', description: 'Does not use words' },
  { value: 'single_words', label: 'Single Words', description: 'Uses individual words' },
  { value: 'two_word_phrases', label: 'Two-Word Phrases', description: 'Combines two words' },
  { value: 'simple_sentences', label: 'Simple Sentences', description: '3-5 word sentences' },
  { value: 'conversational', label: 'Conversational', description: 'Full conversations' },
]

export const SUBSCRIPTION_TIERS = {
  free: {
    name: 'Free',
    price: 0,
    features: [
      '1 child profile',
      'Basic screening (M-CHAT-R)',
      '5 AI coach messages/month',
      'Basic activity library',
      'Daily journal',
    ],
  },
  basic: {
    name: 'Basic',
    price: 19,
    features: [
      '2 child profiles',
      'All screenings',
      '50 AI coach messages/month',
      'Full activity library',
      'Goal tracking',
      'Progress dashboard',
      'Daily/weekly plans',
    ],
  },
  pro: {
    name: 'Pro',
    price: 49,
    features: [
      'Unlimited children',
      'Unlimited AI coach',
      'All features',
      'Behavior analysis',
      'Parent Training Academy',
      'Digital Autism Passport',
      'Professional marketplace',
      'Priority support',
    ],
  },
  clinic: {
    name: 'Clinic',
    price: 199,
    features: [
      'Everything in Pro',
      'Multiple therapist accounts',
      'Client management',
      'Progress reports',
      'Custom branding',
      'API access',
      'Dedicated support',
    ],
  },
}

export const TRAINING_CATEGORIES = [
  'Autism Basics',
  'ABA Fundamentals',
  'Home Speech Therapy',
  'Occupational Therapy Basics',
  'Behavior Management',
  'School Readiness',
  'Sibling Support',
  'Self-Care Strategies',
]

export const KNOWLEDGE_CATEGORIES = [
  'Autism Basics',
  'Assessments & Diagnosis',
  'Therapies',
  'Education & School',
  'Behavior',
  'Sleep',
  'Feeding & Nutrition',
  'Social Skills',
  'Communication',
  'Family & Caregiving',
]

export const DISCLAIMER = 'MBT is not a substitute for professional diagnosis, treatment, or medical advice. Always consult qualified healthcare professionals for your child\'s care.'
