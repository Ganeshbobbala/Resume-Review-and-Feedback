-- =========================================================================
-- Supabase Schema for AI Resume Reviewer & Feedback Platform
-- Run this in your Supabase Project -> SQL Editor -> Click 'Run'
-- =========================================================================

-- 1. Create resume_reviews table
CREATE TABLE IF NOT EXISTS public.resume_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    filename TEXT,
    target_role TEXT,
    predicted_category TEXT,
    overall_score NUMERIC,
    detected_skills JSONB DEFAULT '[]'::jsonb,
    missing_skills JSONB DEFAULT '[]'::jsonb,
    strengths JSONB DEFAULT '[]'::jsonb,
    weaknesses JSONB DEFAULT '[]'::jsonb,
    recommendations JSONB DEFAULT '[]'::jsonb,
    bullet_rewrites JSONB DEFAULT '[]'::jsonb,
    format_analysis JSONB DEFAULT '{}'::jsonb,
    raw_text TEXT
);

-- 2. Create index on created_at for fast history queries
CREATE INDEX IF NOT EXISTS idx_resume_reviews_created_at ON public.resume_reviews (created_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.resume_reviews ENABLE ROW LEVEL SECURITY;

-- 4. Create policies allowing public select & insert via publishable/anon key
DROP POLICY IF EXISTS "Allow public read access" ON public.resume_reviews;
CREATE POLICY "Allow public read access" 
ON public.resume_reviews 
FOR SELECT 
TO anon, authenticated 
USING (true);

DROP POLICY IF EXISTS "Allow public insert access" ON public.resume_reviews;
CREATE POLICY "Allow public insert access" 
ON public.resume_reviews 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);
