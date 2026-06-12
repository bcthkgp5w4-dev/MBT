-- ============================================================
-- FUNCTIONAL ASSESSMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS functional_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  responses JSONB NOT NULL DEFAULT '{}',
  domain_scores JSONB NOT NULL DEFAULT '{}',
  overall_level INTEGER DEFAULT 0,
  safety_flags TEXT[] DEFAULT '{}',
  prioritized_domains TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('in_progress', 'completed')),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- DEVELOPMENTAL PROFILES (AI-generated output)
-- ============================================================
CREATE TABLE IF NOT EXISTS developmental_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID NOT NULL REFERENCES functional_assessments(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  strengths TEXT[] DEFAULT '{}',
  challenges TEXT[] DEFAULT '{}',
  emerging_skills TEXT[] DEFAULT '{}',
  missing_skills TEXT[] DEFAULT '{}',
  priority_areas JSONB DEFAULT '[]',
  therapy_recommendations JSONB DEFAULT '[]',
  daily_plan JSONB DEFAULT '{}',
  weekly_schedule JSONB DEFAULT '{}',
  parent_coaching_tips TEXT[] DEFAULT '{}',
  short_term_goals JSONB DEFAULT '[]',
  medium_term_goals JSONB DEFAULT '[]',
  long_term_goals JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- RLS
-- ============================================================
ALTER TABLE functional_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE developmental_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own assessments"
  ON functional_assessments FOR ALL USING (auth.uid() = profile_id);

CREATE POLICY "Users can manage own profiles"
  ON developmental_profiles FOR ALL USING (auth.uid() = profile_id);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_assessments_child ON functional_assessments(child_id);
CREATE INDEX IF NOT EXISTS idx_assessments_profile ON functional_assessments(profile_id);
CREATE INDEX IF NOT EXISTS idx_dev_profiles_assessment ON developmental_profiles(assessment_id);
CREATE INDEX IF NOT EXISTS idx_dev_profiles_child ON developmental_profiles(child_id);

-- ============================================================
-- TRIGGER
-- ============================================================
CREATE TRIGGER update_dev_profiles_updated_at
  BEFORE UPDATE ON developmental_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
