-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'parent' CHECK (role IN ('parent', 'therapist', 'school', 'admin')),
  avatar_url TEXT,
  phone TEXT,
  timezone TEXT DEFAULT 'UTC',
  subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'basic', 'pro', 'clinic')),
  subscription_status TEXT NOT NULL DEFAULT 'active' CHECK (subscription_status IN ('active', 'inactive', 'trialing', 'canceled')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CHILDREN
-- ============================================================
CREATE TABLE children (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  diagnosis_status TEXT NOT NULL DEFAULT 'suspected' CHECK (diagnosis_status IN ('diagnosed', 'suspected', 'assessment_pending', 'no_diagnosis')),
  diagnosis_date DATE,
  communication_level TEXT NOT NULL DEFAULT 'single_words' CHECK (communication_level IN ('nonverbal', 'single_words', 'two_word_phrases', 'simple_sentences', 'conversational')),
  sensory_sensitivities TEXT[] DEFAULT '{}',
  interests TEXT[] DEFAULT '{}',
  strengths TEXT[] DEFAULT '{}',
  challenges TEXT[] DEFAULT '{}',
  school_name TEXT,
  grade_level TEXT,
  therapies TEXT[] DEFAULT '{}',
  medications TEXT[] DEFAULT '{}',
  avatar_url TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SCREENING RESULTS
-- ============================================================
CREATE TABLE screening_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  screening_type TEXT NOT NULL CHECK (screening_type IN ('mchat_r', 'developmental', 'sensory', 'communication')),
  responses JSONB NOT NULL DEFAULT '{}',
  score NUMERIC,
  risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high')),
  summary TEXT,
  recommendations TEXT[] DEFAULT '{}',
  ai_analysis JSONB,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- GOALS
-- ============================================================
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  domain TEXT NOT NULL CHECK (domain IN ('communication', 'social', 'behavior', 'adaptive', 'academic', 'motor', 'emotional')),
  title TEXT NOT NULL,
  description TEXT,
  baseline TEXT,
  target TEXT,
  timeline_weeks INTEGER DEFAULT 12,
  measurement_criteria TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'achieved', 'paused', 'discontinued')),
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
  ai_generated BOOLEAN DEFAULT FALSE,
  rationale TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- THERAPY ACTIVITIES LIBRARY
-- ============================================================
CREATE TABLE therapy_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  domain TEXT NOT NULL,
  sub_domain TEXT,
  objective TEXT,
  materials TEXT[] DEFAULT '{}',
  instructions TEXT[] DEFAULT '{}',
  duration_minutes INTEGER DEFAULT 15,
  expected_outcome TEXT,
  data_collection_method TEXT,
  age_range_min INTEGER DEFAULT 0,
  age_range_max INTEGER DEFAULT 18,
  difficulty TEXT DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  video_url TEXT,
  evidence_base TEXT,
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- DAILY PLANS
-- ============================================================
CREATE TABLE daily_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  ai_generated BOOLEAN DEFAULT FALSE,
  completed BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(child_id, date)
);

CREATE TABLE daily_plan_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID NOT NULL REFERENCES daily_plans(id) ON DELETE CASCADE,
  activity_id UUID REFERENCES therapy_activities(id),
  custom_title TEXT,
  scheduled_time TIME,
  duration_minutes INTEGER DEFAULT 15,
  completed BOOLEAN DEFAULT FALSE,
  data_collected TEXT,
  notes TEXT,
  goal_id UUID REFERENCES goals(id),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- JOURNAL ENTRIES
-- ============================================================
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  mood TEXT CHECK (mood IN ('great', 'good', 'neutral', 'difficult', 'crisis')),
  behaviors TEXT[] DEFAULT '{}',
  milestones TEXT[] DEFAULT '{}',
  challenges TEXT[] DEFAULT '{}',
  successes TEXT[] DEFAULT '{}',
  ai_analysis TEXT,
  ai_patterns TEXT[] DEFAULT '{}',
  ai_recommendations TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- BEHAVIOR ENTRIES (ABC)
-- ============================================================
CREATE TABLE behavior_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  behavior TEXT NOT NULL,
  antecedent TEXT,
  consequence TEXT,
  intensity INTEGER DEFAULT 3 CHECK (intensity BETWEEN 1 AND 5),
  duration_minutes INTEGER,
  location TEXT,
  time_of_day TEXT,
  possible_function TEXT,
  intervention_used TEXT,
  outcome TEXT,
  occurred_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PROGRESS DATA
-- ============================================================
CREATE TABLE progress_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  value NUMERIC NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- DIET TRACKING
-- ============================================================
CREATE TABLE diet_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  foods TEXT[] NOT NULL DEFAULT '{}',
  water_intake_ml INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SLEEP TRACKING
-- ============================================================
CREATE TABLE sleep_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  bedtime TIME NOT NULL,
  wake_time TIME NOT NULL,
  duration_hours NUMERIC,
  night_wakings INTEGER DEFAULT 0,
  quality INTEGER DEFAULT 3 CHECK (quality BETWEEN 1 AND 5),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(child_id, date)
);

-- ============================================================
-- TRAINING COURSES
-- ============================================================
CREATE TABLE training_courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  difficulty TEXT DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  certificate BOOLEAN DEFAULT FALSE,
  thumbnail_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE training_lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES training_courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  video_url TEXT,
  duration_minutes INTEGER DEFAULT 10,
  order_index INTEGER DEFAULT 0,
  quiz JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_course_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES training_courses(id) ON DELETE CASCADE,
  completed_lessons TEXT[] DEFAULT '{}',
  quiz_scores JSONB DEFAULT '{}',
  completed BOOLEAN DEFAULT FALSE,
  certificate_issued BOOLEAN DEFAULT FALSE,
  certificate_url TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id, course_id)
);

-- ============================================================
-- KNOWLEDGE BASE
-- ============================================================
CREATE TABLE knowledge_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  author TEXT,
  read_time_minutes INTEGER DEFAULT 5,
  featured BOOLEAN DEFAULT FALSE,
  video_url TEXT,
  slug TEXT UNIQUE,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- THERAPIST PROFILES (MARKETPLACE)
-- ============================================================
CREATE TABLE therapist_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  specialty TEXT[] NOT NULL DEFAULT '{}',
  credentials TEXT[] DEFAULT '{}',
  bio TEXT,
  years_experience INTEGER DEFAULT 0,
  location TEXT,
  telehealth BOOLEAN DEFAULT TRUE,
  languages TEXT[] DEFAULT '{"English"}',
  hourly_rate NUMERIC,
  availability TEXT,
  rating NUMERIC DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE therapist_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  therapist_id UUID NOT NULL REFERENCES therapist_profiles(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AI COACH SESSIONS
-- ============================================================
CREATE TABLE coach_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  child_id UUID REFERENCES children(id) ON DELETE SET NULL,
  messages JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AUDIT LOGS
-- ============================================================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE screening_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_plan_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE behavior_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE diet_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE therapist_reviews ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only see/edit their own
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Children: users can only see/edit their own children
CREATE POLICY "Users can manage own children" ON children FOR ALL USING (auth.uid() = profile_id);

-- Screening results
CREATE POLICY "Users can manage own screening results" ON screening_results FOR ALL USING (auth.uid() = profile_id);

-- Goals
CREATE POLICY "Users can manage own goals" ON goals FOR ALL USING (auth.uid() = profile_id);

-- Daily plans
CREATE POLICY "Users can manage own daily plans" ON daily_plans FOR ALL USING (auth.uid() = profile_id);
CREATE POLICY "Users can manage own plan activities" ON daily_plan_activities FOR ALL
  USING (plan_id IN (SELECT id FROM daily_plans WHERE profile_id = auth.uid()));

-- Journal
CREATE POLICY "Users can manage own journal" ON journal_entries FOR ALL USING (auth.uid() = profile_id);

-- Behavior
CREATE POLICY "Users can manage own behavior entries" ON behavior_entries FOR ALL USING (auth.uid() = profile_id);

-- Progress
CREATE POLICY "Users can manage own progress" ON progress_data FOR ALL USING (auth.uid() = profile_id);

-- Diet & Sleep
CREATE POLICY "Users can manage own diet entries" ON diet_entries FOR ALL USING (auth.uid() = profile_id);
CREATE POLICY "Users can manage own sleep entries" ON sleep_entries FOR ALL USING (auth.uid() = profile_id);

-- Course progress
CREATE POLICY "Users can manage own course progress" ON user_course_progress FOR ALL USING (auth.uid() = profile_id);

-- Coach sessions
CREATE POLICY "Users can manage own coach sessions" ON coach_sessions FOR ALL USING (auth.uid() = profile_id);

-- Public read for content tables
CREATE POLICY "Anyone can read therapy activities" ON therapy_activities FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Anyone can read training courses" ON training_courses FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Anyone can read knowledge articles" ON knowledge_articles FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Anyone can read therapist profiles" ON therapist_profiles FOR SELECT USING (is_active = TRUE);

-- Therapist reviews
CREATE POLICY "Users can manage own reviews" ON therapist_reviews FOR ALL USING (auth.uid() = profile_id);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'parent')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_children_updated_at BEFORE UPDATE ON children FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON goals FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_journal_updated_at BEFORE UPDATE ON journal_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_children_profile_id ON children(profile_id);
CREATE INDEX idx_screening_child_id ON screening_results(child_id);
CREATE INDEX idx_goals_child_id ON goals(child_id);
CREATE INDEX idx_goals_status ON goals(status);
CREATE INDEX idx_daily_plans_child_date ON daily_plans(child_id, date);
CREATE INDEX idx_journal_child_id ON journal_entries(child_id);
CREATE INDEX idx_journal_created_at ON journal_entries(created_at DESC);
CREATE INDEX idx_behavior_child_id ON behavior_entries(child_id);
CREATE INDEX idx_behavior_occurred_at ON behavior_entries(occurred_at DESC);
CREATE INDEX idx_progress_child_id ON progress_data(child_id);
CREATE INDEX idx_progress_goal_id ON progress_data(goal_id);
CREATE INDEX idx_knowledge_category ON knowledge_articles(category);
CREATE INDEX idx_knowledge_slug ON knowledge_articles(slug);
CREATE INDEX idx_audit_logs_profile_id ON audit_logs(profile_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
