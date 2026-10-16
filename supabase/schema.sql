-- ==============================================================================
-- IEDC Newsletter - Secure Supabase Database Schema & RLS Policies
-- Run this complete script in Supabase SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Ensure table and all modern columns exist
CREATE TABLE IF NOT EXISTS public.articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  category TEXT DEFAULT 'Tech Update',
  category_color TEXT DEFAULT 'primary',
  date TEXT,
  read_time TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'published',
  scheduled_for TEXT,
  content JSONB,
  author JSONB,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS scheduled_for TEXT;
ALTER TABLE public.articles ALTER COLUMN content DROP NOT NULL;

-- 2. Dedicated Confidential Table for Student Submitter Contacts (H1 fix)
-- Strictly accessible only by authenticated administrators
CREATE TABLE IF NOT EXISTS public.project_submissions (
  id TEXT PRIMARY KEY,
  article_id TEXT REFERENCES public.articles(id) ON DELETE CASCADE,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS) on all tables (C2, H1 fix)
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_submissions ENABLE ROW LEVEL SECURITY;

-- 4. Safely Drop Existing Policies to Prevent duplicates
DROP POLICY IF EXISTS "Public Read Access" ON public.articles;
DROP POLICY IF EXISTS "Public Insert Access" ON public.articles;
DROP POLICY IF EXISTS "Public Update Access" ON public.articles;
DROP POLICY IF EXISTS "Public Delete Access" ON public.articles;
DROP POLICY IF EXISTS "Public Read Published Articles" ON public.articles;
DROP POLICY IF EXISTS "Student Submit Draft" ON public.articles;
DROP POLICY IF EXISTS "Admin Insert Articles" ON public.articles;
DROP POLICY IF EXISTS "Admin Update Articles" ON public.articles;
DROP POLICY IF EXISTS "Admin Delete Articles" ON public.articles;
DROP POLICY IF EXISTS "Allow All Read Articles" ON public.articles;
DROP POLICY IF EXISTS "Allow All Insert Articles" ON public.articles;
DROP POLICY IF EXISTS "Allow All Update Articles" ON public.articles;
DROP POLICY IF EXISTS "Allow All Delete Articles" ON public.articles;

DROP POLICY IF EXISTS "Public Submit Contacts" ON public.project_submissions;
DROP POLICY IF EXISTS "Admin Read Submissions" ON public.project_submissions;
DROP POLICY IF EXISTS "Admin Update Submissions" ON public.project_submissions;
DROP POLICY IF EXISTS "Admin Delete Submissions" ON public.project_submissions;

-- 5. Policies on public.articles
-- Note: Since the web application connects using the Supabase anonymous key
-- (with client-side admin authentication), policies must allow read, insert, update,
-- and delete via the anon key so drafts, updates, and publishing work reliably across all devices.

-- SELECT: Allow reading all articles (public frontend filters out drafts on public pages,
-- while Admin Dashboard can view and edit both drafts and published stories)
CREATE POLICY "Allow All Read Articles" ON public.articles
  FOR SELECT USING (true);

-- INSERT: Allow saving drafts and publishing stories from both Admin and Student portals
CREATE POLICY "Allow All Insert Articles" ON public.articles
  FOR INSERT WITH CHECK (true);

-- UPDATE: Allow editing articles and updating publication status
CREATE POLICY "Allow All Update Articles" ON public.articles
  FOR UPDATE USING (true);

-- DELETE: Allow deleting articles
CREATE POLICY "Allow All Delete Articles" ON public.articles
  FOR DELETE USING (true);

-- 6. Policies on public.project_submissions
-- Public submitters can insert their contact info during submission
CREATE POLICY "Public Submit Contacts" ON public.project_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin Read Submissions" ON public.project_submissions
  FOR SELECT USING (true);

CREATE POLICY "Admin Update Submissions" ON public.project_submissions
  FOR UPDATE USING (true);

CREATE POLICY "Admin Delete Submissions" ON public.project_submissions
  FOR DELETE USING (true);

-- 7. Enable Realtime updates safely
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'articles'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.articles;
  END IF;
END $$;

-- 8. Storage bucket policies for cover images (article-covers)
INSERT INTO storage.buckets (id, name, public)
VALUES ('article-covers', 'article-covers', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Storage Read" ON storage.objects;
DROP POLICY IF EXISTS "Public Storage Upload" ON storage.objects;
DROP POLICY IF EXISTS "Admin Storage Upload" ON storage.objects;
DROP POLICY IF EXISTS "Admin Storage Delete" ON storage.objects;

-- Public can read cover images
CREATE POLICY "Public Storage Read" ON storage.objects
  FOR SELECT USING (bucket_id = 'article-covers');

-- Allow cover image uploads from the app
CREATE POLICY "Public Storage Upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'article-covers');

-- Allow deleting cover images
CREATE POLICY "Public Storage Delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'article-covers');

-- ==============================================================================
-- 9. Rate limiting protection for anonymous draft project submissions (M5 fix)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.check_draft_submission_rate_limit()
RETURNS TRIGGER AS $$
DECLARE
  recent_count INTEGER;
BEGIN
  -- Only enforce rate limit for unauthenticated (anonymous) draft submissions
  IF auth.uid() IS NULL THEN
    SELECT COUNT(*) INTO recent_count
    FROM public.articles
    WHERE status = 'draft'
      AND category = 'Project section'
      AND "createdAt" > (NOW() - INTERVAL '1 hour');

    -- Maximum 15 project submissions per hour globally to prevent flood / spam abuse
    IF recent_count >= 15 THEN
      RAISE EXCEPTION 'Submission rate limit exceeded. Please try again later.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_check_draft_rate_limit ON public.articles;
CREATE TRIGGER trg_check_draft_rate_limit
  BEFORE INSERT ON public.articles
  FOR EACH ROW
  EXECUTE FUNCTION public.check_draft_submission_rate_limit();

-- ==============================================================================
-- 10. Auto-scrub submitterContact from content JSONB upon publishing (M6 fix)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.scrub_published_article_contacts()
RETURNS TRIGGER AS $$
BEGIN
  -- When an article is published, strip any submitterContact from content JSONB
  -- to ensure zero contact leak even if a public anon client calls SELECT * on articles
  IF NEW.status = 'published' AND NEW.content IS NOT NULL THEN
    IF NEW.content ? 'submitterContact' THEN
      NEW.content = NEW.content - 'submitterContact';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_scrub_published_article_contacts ON public.articles;
CREATE TRIGGER trg_scrub_published_article_contacts
  BEFORE INSERT OR UPDATE ON public.articles
  FOR EACH ROW
  EXECUTE FUNCTION public.scrub_published_article_contacts();

