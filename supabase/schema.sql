-- ==============================================================================
-- IEDC Newsletter - Supabase Database Schema
-- Run this SQL in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Create the articles table
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

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- 3. Create Public Access Policies (Allow reading and admin publishing)
DROP POLICY IF EXISTS "Public Read Access" ON public.articles;
CREATE POLICY "Public Read Access" 
ON public.articles FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Public Insert Access" ON public.articles;
CREATE POLICY "Public Insert Access" 
ON public.articles FOR INSERT 
WITH CHECK (true);

DROP POLICY IF EXISTS "Public Update Access" ON public.articles;
CREATE POLICY "Public Update Access" 
ON public.articles FOR UPDATE 
USING (true);

DROP POLICY IF EXISTS "Public Delete Access" ON public.articles;
CREATE POLICY "Public Delete Access" 
ON public.articles FOR DELETE 
USING (true);

-- 4. Enable Supabase Realtime (Instant push notifications to visitor devices)
ALTER PUBLICATION supabase_realtime ADD TABLE public.articles;

-- 5. Create storage bucket for cover images (article-covers)
INSERT INTO storage.buckets (id, name, public)
VALUES ('article-covers', 'article-covers', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Storage Read" ON storage.objects;
CREATE POLICY "Public Storage Read" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'article-covers');

DROP POLICY IF EXISTS "Public Storage Upload" ON storage.objects;
CREATE POLICY "Public Storage Upload" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'article-covers');
