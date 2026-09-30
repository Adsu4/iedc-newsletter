-- ==============================================================================
-- IEDC Newsletter - Supabase Database Schema & Fix
-- Run this complete script in Supabase SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Ensure table and all columns exist
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

-- Ensure all modern columns exist on existing tables
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS scheduled_for TEXT;
ALTER TABLE public.articles ALTER COLUMN content DROP NOT NULL;

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- 3. Safely Drop Existing Policies to Prevent "already exists" (42710) errors
DROP POLICY IF EXISTS "Public Read Access" ON public.articles;
DROP POLICY IF EXISTS "Public Insert Access" ON public.articles;
DROP POLICY IF EXISTS "Public Update Access" ON public.articles;
DROP POLICY IF EXISTS "Public Delete Access" ON public.articles;

-- 4. Recreate Policies for full read & admin publishing
CREATE POLICY "Public Read Access" ON public.articles FOR SELECT USING (true);
CREATE POLICY "Public Insert Access" ON public.articles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Access" ON public.articles FOR UPDATE USING (true);
CREATE POLICY "Public Delete Access" ON public.articles FOR DELETE USING (true);

-- 5. Enable Realtime updates safely
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'articles'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.articles;
  END IF;
END $$;

-- 6. Storage bucket for cover images (article-covers)
INSERT INTO storage.buckets (id, name, public)
VALUES ('article-covers', 'article-covers', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Storage Read" ON storage.objects;
CREATE POLICY "Public Storage Read" ON storage.objects FOR SELECT USING (bucket_id = 'article-covers');

DROP POLICY IF EXISTS "Public Storage Upload" ON storage.objects;
CREATE POLICY "Public Storage Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'article-covers');
