import { articles as initialArticles, type Article } from './articles';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const LOCAL_STORAGE_KEY = 'iedc_published_articles_v2';
const DELETED_IDS_KEY = 'iedc_deleted_article_ids_v2';
const UPDATE_EVENT = 'iedc_articles_updated';

// --- Fast Network Timeout Helper (Max 1200ms guard to prevent UI hanging) ---
function withTimeout<T = any>(promise: any, ms = 1200): Promise<T> {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Network timeout after ${ms}ms`)), ms)
    ),
  ]);
}

// --- HTML Sanitization ---
function sanitizeHtml(input: string): string {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

function sanitizeParagraphs(paragraphs: string[]): string[] {
  return paragraphs.map(sanitizeHtml);
}

// --- Deleted IDs helper ---
function getDeletedIds(): string[] {
  try {
    const stored = localStorage.getItem(DELETED_IDS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
}

function addDeletedId(id: string): void {
  try {
    const current = getDeletedIds();
    if (!current.includes(String(id))) {
      current.push(String(id));
      localStorage.setItem(DELETED_IDS_KEY, JSON.stringify(current));
    }
  } catch (e) {
    console.error('Failed to save deleted ID:', e);
  }
}

// --- Local Storage Helpers ---
function getLocalArticles(): Article[] {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to read from localStorage:', e);
  }
  return initialArticles;
}

function saveLocalArticles(articlesList: Article[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(articlesList));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

/** Instant synchronous retrieval of publicly visible articles (0ms, no network delay) */
export function getLocalArticlesSync(): Article[] {
  const deletedIds = getDeletedIds();
  const all = getLocalArticles();
  const now = new Date();
  return all
    .filter((a) => !deletedIds.includes(String(a.id)))
    .filter((a) => {
      if (a.status === 'draft') return false;
      if (a.status === 'scheduled') {
        if (!a.scheduledFor) return false;
        return new Date(a.scheduledFor) <= now;
      }
      return true;
    });
}

/** Instant synchronous retrieval of all articles for Admin (0ms, no network delay) */
export function getLocalArticlesAdminSync(): Article[] {
  const deletedIds = getDeletedIds();
  const all = getLocalArticles();
  return all.filter((a) => !deletedIds.includes(String(a.id)));
}

/** Notify active views across tabs and in the current window */
export function notifyArticlesUpdated(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
  }
}

// --- Cross-tab & In-App Sync ---
export function onArticlesChange(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = (e: StorageEvent) => {
    if (e.key === LOCAL_STORAGE_KEY || e.key === DELETED_IDS_KEY) {
      callback();
    }
  };
  const inAppHandler = () => callback();

  window.addEventListener('storage', handler);
  window.addEventListener(UPDATE_EVENT, inAppHandler);
  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener(UPDATE_EVENT, inAppHandler);
  };
}

// --- Supabase row mapper ---
function mapSupabaseRow(item: Record<string, unknown>): Article {
  return {
    id: String(item.id),
    title: (item.title as string) || '',
    subtitle: (item.subtitle as string) || '',
    category: (item.category as string) || 'Tech Update',
    categoryColor: (item.category_color as Article['categoryColor']) || 'primary',
    date: (item.date as string) || '',
    readTime: (item.read_time as string) || '',
    imageUrl: (item.image_url as string) || '',
    featured: (item.featured as boolean) || false,
    status: (item.status as Article['status']) || 'published',
    scheduledFor: (item.scheduled_for as string) || undefined,
    content: typeof item.content === 'string' ? JSON.parse(item.content as string) : (item.content as Article['content']),
    author: typeof item.author === 'string' ? JSON.parse(item.author as string) : (item.author as Article['author']),
    createdAt: (item.createdAt as string) || undefined,
  };
}

function toSupabaseRow(article: Article): Record<string, unknown> {
  return {
    id: String(article.id),
    title: article.title,
    subtitle: article.subtitle,
    category: article.category,
    category_color: article.categoryColor,
    date: article.date,
    read_time: article.readTime,
    image_url: article.imageUrl,
    featured: article.featured || false,
    status: article.status,
    scheduled_for: article.scheduledFor || null,
    content: JSON.stringify(article.content),
    author: JSON.stringify(article.author),
    createdAt: article.createdAt || new Date().toISOString(),
  };
}

// --- Public API ---

/** Get all articles for admin (filters out deleted IDs) */
export async function getAllArticlesAdmin(): Promise<Article[]> {
  const deletedIds = getDeletedIds();
  let list: Article[] = getLocalArticles();

  if (isSupabaseConfigured && supabase) {
    try {
      const res = await withTimeout<any>(
        supabase
          .from('articles')
          .select('*')
          .order('createdAt', { ascending: false }),
        1200
      );

      if (!res.error && res.data && res.data.length > 0) {
        list = res.data.map(mapSupabaseRow);
      }
    } catch (err) {
      console.warn('Supabase fetch failed or timed out, using local storage:', err);
    }
  }

  // Filter out any IDs marked as deleted
  return list.filter((a) => !deletedIds.includes(String(a.id)));
}

/** Get only publicly visible articles */
export async function getAllArticles(): Promise<Article[]> {
  const all = await getAllArticlesAdmin();
  const now = new Date();
  return all.filter((a) => {
    if (a.status === 'draft') return false;
    if (a.status === 'scheduled') {
      if (!a.scheduledFor) return false;
      return new Date(a.scheduledFor) <= now;
    }
    return true;
  });
}

export async function fetchArticleById(id: string): Promise<Article | undefined> {
  const all = await getAllArticles();
  return all.find((a) => String(a.id) === String(id));
}

export async function fetchArticleByIdAdmin(id: string): Promise<Article | undefined> {
  const all = await getAllArticlesAdmin();
  return all.find((a) => String(a.id) === String(id));
}

// --- Create ---
export interface CreateArticlePayload {
  title: string;
  subtitle: string;
  category: string;
  categoryColor: 'primary' | 'secondary' | 'tertiary';
  imageUrl: string;
  paragraphs: string[];
  subheadings: string[];
  blockquote?: string;
  authorName?: string;
  authorRole?: string;
  authorAvatar?: string;
  status?: Article['status'];
  scheduledFor?: string;
  featured?: boolean;
}

export async function publishArticle(payload: CreateArticlePayload): Promise<Article> {
  const newId = String(Date.now());
  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const totalWords = [...payload.paragraphs, payload.title, payload.subtitle].join(' ').split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(totalWords / 200));
  const readTime = `${minutes} min read`;

  const isNewsletter = payload.category === 'Monthly Newsletter' || payload.category === 'Newsletter' || payload.category === 'Latest Edition';

  const newArticle: Article = {
    id: newId,
    title: sanitizeHtml(payload.title || 'Untitled Story'),
    subtitle: sanitizeHtml(payload.subtitle || 'No subtitle provided.'),
    category: payload.category || 'Tech Update',
    categoryColor: payload.categoryColor || (isNewsletter ? 'primary' : 'primary'),
    date: formattedDate,
    readTime,
    imageUrl: payload.imageUrl || '',
    featured: isNewsletter || payload.featured || false,
    status: payload.status || 'published',
    scheduledFor: payload.scheduledFor || undefined,
    content: {
      paragraphs: payload.paragraphs.length > 0 ? sanitizeParagraphs(payload.paragraphs) : ['No content provided.'],
      subheadings: payload.subheadings || [],
      blockquote: payload.blockquote ? sanitizeHtml(payload.blockquote) : undefined,
    },
    author: {
      name: payload.authorName || 'Admin User',
      role: isNewsletter ? 'IEDC Chief Editor' : (payload.authorRole || 'IEDC Editorial'),
      avatarUrl: payload.authorAvatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDp6-LO5wbh6CTC36gJGeJayrbGtizLZWUlH9INz99YIJjIvsgYIZWEI3FCpw0i_0qiTUtAr6wPwhbUntODV_DKp16HJ_i97nWITmL3RCUSGrO0UEQgfLjdcaub8MJ1eBmE7L8UKpcRIhK6qh2roHWO8mK9WHTiHouOVak3xxVFkkI027MEgVlLW2Wt-YE2_7_p67F0NuRnWR6AOvYY3tYmko7Kd-N5jpyO_R33j4KF_IVtKvrukoEY2Q',
    },
    createdAt: now.toISOString(),
  };

  // 1. SAVE LOCALLY IMMEDIATELY (0ms, synchronous, instant UI!)
  const currentLocal = getLocalArticles();
  saveLocalArticles([newArticle, ...currentLocal]);
  notifyArticlesUpdated();

  // 2. BACKGROUND SYNC TO SUPABASE (Non-blocking with timeout)
  if (isSupabaseConfigured && supabase) {
    withTimeout(supabase.from('articles').insert([toSupabaseRow(newArticle)]), 2000)
      .catch((err) => console.warn('Background Supabase insert skipped/failed:', err));
  }

  return newArticle;
}

// --- Update ---
export async function updateArticle(id: string, payload: Partial<CreateArticlePayload>): Promise<Article | null> {
  const targetId = String(id);
  const all = getLocalArticles();
  const idx = all.findIndex((a) => String(a.id) === targetId);
  if (idx === -1) return null;

  const existing = all[idx];
  const isNewsletter = (payload.category || existing.category) === 'Monthly Newsletter' || (payload.category || existing.category) === 'Newsletter';

  const updated: Article = {
    ...existing,
    title: payload.title !== undefined ? sanitizeHtml(payload.title) : existing.title,
    subtitle: payload.subtitle !== undefined ? sanitizeHtml(payload.subtitle) : existing.subtitle,
    category: payload.category ?? existing.category,
    categoryColor: payload.categoryColor ?? existing.categoryColor,
    imageUrl: payload.imageUrl ?? existing.imageUrl,
    status: payload.status ?? existing.status,
    featured: isNewsletter ? true : (payload.featured ?? existing.featured),
    scheduledFor: payload.scheduledFor ?? existing.scheduledFor,
    content: payload.paragraphs ? {
      paragraphs: sanitizeParagraphs(payload.paragraphs),
      subheadings: payload.subheadings || existing.content.subheadings,
      blockquote: payload.blockquote !== undefined ? (payload.blockquote ? sanitizeHtml(payload.blockquote) : undefined) : existing.content.blockquote,
    } : existing.content,
  };

  if (payload.paragraphs) {
    const totalWords = [...updated.content.paragraphs, updated.title, updated.subtitle].join(' ').split(/\s+/).length;
    updated.readTime = `${Math.max(1, Math.ceil(totalWords / 200))} min read`;
  }

  // 1. Save locally immediately
  all[idx] = updated;
  saveLocalArticles(all);
  notifyArticlesUpdated();

  // 2. Background sync to Supabase
  if (isSupabaseConfigured && supabase) {
    withTimeout(
      supabase
        .from('articles')
        .update(toSupabaseRow(updated))
        .eq('id', targetId),
      2000
    ).catch((err) => console.warn('Background Supabase update skipped/failed:', err));
  }

  return updated;
}

// --- Delete ---
export async function deleteArticle(id: string): Promise<boolean> {
  const targetId = String(id);

  // Mark as deleted in local persistent tracking
  addDeletedId(targetId);

  // Update local storage array immediately
  const allLocal = getLocalArticles();
  const filteredLocal = allLocal.filter((a) => String(a.id) !== targetId);
  saveLocalArticles(filteredLocal);
  notifyArticlesUpdated();

  // Delete from Supabase in background
  if (isSupabaseConfigured && supabase) {
    withTimeout(supabase.from('articles').delete().eq('id', targetId), 2000)
      .catch((err) => console.warn('Background Supabase delete skipped/failed:', err));
  }

  return true;
}

// --- Image Upload ---
export async function uploadCoverImage(file: File): Promise<string> {
  if (isSupabaseConfigured && supabase) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `covers/${fileName}`;

      const uploadPromise = supabase.storage
        .from('article-covers')
        .upload(filePath, file);

      const res = await withTimeout(uploadPromise, 1500);

      if (!res.error) {
        const { data } = supabase.storage.from('article-covers').getPublicUrl(filePath);
        return data.publicUrl;
      }
    } catch (e) {
      console.warn('Storage upload fallback to base64 data URL:', e);
    }
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}
