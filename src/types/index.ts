export type UserRole = 'parent' | 'therapist' | 'school' | 'admin'

export type CommunicationLevel =
  | 'nonverbal'
  | 'single_words'
  | 'two_word_phrases'
  | 'simple_sentences'
  | 'conversational'

export type DiagnosisStatus =
  | 'diagnosed'
  | 'suspected'
  | 'assessment_pending'
  | 'no_diagnosis'

export interface Profile {
  id: string
  email: string
  full_name: string
  role: UserRole
  avatar_url?: string
  phone?: string
  timezone?: string
  subscription_tier: 'free' | 'basic' | 'pro' | 'clinic'
  subscription_status: 'active' | 'inactive' | 'trialing' | 'canceled'
  stripe_customer_id?: string
  created_at: string
  updated_at: string
}

export interface Child {
  id: string
  profile_id: string
  name: string
  date_of_birth: string
  gender: 'male' | 'female' | 'other'
  diagnosis_status: DiagnosisStatus
  diagnosis_date?: string
  communication_level: CommunicationLevel
  sensory_sensitivities?: string[]
  interests?: string[]
  strengths?: string[]
  challenges?: string[]
  school_name?: string
  grade_level?: string
  therapies?: string[]
  medications?: string[]
  avatar_url?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface ScreeningResult {
  id: string
  child_id: string
  profile_id: string
  screening_type: 'mchat_r' | 'developmental' | 'sensory' | 'communication'
  responses: Record<string, any>
  score?: number
  risk_level?: 'low' | 'medium' | 'high'
  summary?: string
  recommendations?: string[]
  completed_at: string
  created_at: string
}

export interface Goal {
  id: string
  child_id: string
  profile_id: string
  domain: 'communication' | 'social' | 'behavior' | 'adaptive' | 'academic' | 'motor' | 'emotional'
  title: string
  description: string
  baseline: string
  target: string
  timeline_weeks: number
  measurement_criteria: string
  status: 'active' | 'achieved' | 'paused' | 'discontinued'
  progress_percentage: number
  ai_generated: boolean
  created_at: string
  updated_at: string
}

export interface TherapyActivity {
  id: string
  title: string
  description: string
  domain: string
  sub_domain?: string
  objective: string
  materials: string[]
  instructions: string[]
  duration_minutes: number
  expected_outcome: string
  data_collection_method: string
  age_range_min: number
  age_range_max: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  video_url?: string
  evidence_base?: string
  created_at: string
}

export interface DailyPlan {
  id: string
  child_id: string
  profile_id: string
  date: string
  activities: DailyPlanActivity[]
  ai_generated: boolean
  completed: boolean
  notes?: string
  created_at: string
}

export interface DailyPlanActivity {
  id: string
  plan_id: string
  activity_id: string
  activity?: TherapyActivity
  scheduled_time?: string
  duration_minutes: number
  completed: boolean
  data_collected?: string
  notes?: string
  goal_id?: string
}

export interface JournalEntry {
  id: string
  child_id: string
  profile_id: string
  content: string
  mood?: 'great' | 'good' | 'neutral' | 'difficult' | 'crisis'
  behaviors?: string[]
  milestones?: string[]
  challenges?: string[]
  successes?: string[]
  ai_analysis?: string
  ai_patterns?: string[]
  ai_recommendations?: string[]
  created_at: string
  updated_at: string
}

export interface BehaviorEntry {
  id: string
  child_id: string
  profile_id: string
  behavior: string
  antecedent: string
  consequence: string
  intensity: 1 | 2 | 3 | 4 | 5
  duration_minutes?: number
  location?: string
  time_of_day?: string
  possible_function?: string
  intervention_used?: string
  outcome?: string
  occurred_at: string
  created_at: string
}

export interface ProgressData {
  id: string
  child_id: string
  goal_id: string
  date: string
  value: number
  notes?: string
  created_at: string
}

export interface DietEntry {
  id: string
  child_id: string
  profile_id: string
  date: string
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  foods: string[]
  water_intake_ml?: number
  notes?: string
  created_at: string
}

export interface SleepEntry {
  id: string
  child_id: string
  profile_id: string
  date: string
  bedtime: string
  wake_time: string
  duration_hours: number
  night_wakings: number
  quality: 1 | 2 | 3 | 4 | 5
  notes?: string
  created_at: string
}

export interface TrainingCourse {
  id: string
  title: string
  description: string
  category: string
  duration_minutes: number
  lessons: TrainingLesson[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  certificate: boolean
  thumbnail_url?: string
  created_at: string
}

export interface TrainingLesson {
  id: string
  course_id: string
  title: string
  content: string
  video_url?: string
  duration_minutes: number
  order: number
  quiz?: Quiz
}

export interface Quiz {
  questions: QuizQuestion[]
  passing_score: number
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correct_index: number
}

export interface UserCourseProgress {
  id: string
  profile_id: string
  course_id: string
  completed_lessons: string[]
  quiz_scores: Record<string, number>
  completed: boolean
  certificate_issued: boolean
  certificate_url?: string
  completed_at?: string
  created_at: string
}

export interface Therapist {
  id: string
  profile_id: string
  specialty: string[]
  credentials: string[]
  bio: string
  years_experience: number
  location: string
  telehealth: boolean
  languages: string[]
  hourly_rate?: number
  availability?: string
  rating?: number
  review_count?: number
  verified: boolean
  created_at: string
}

export interface KnowledgeArticle {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  author?: string
  read_time_minutes: number
  featured: boolean
  video_url?: string
  created_at: string
  updated_at: string
}

export interface CoachMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface Subscription {
  tier: 'free' | 'basic' | 'pro' | 'clinic'
  features: string[]
  price_monthly: number
  price_yearly: number
}
