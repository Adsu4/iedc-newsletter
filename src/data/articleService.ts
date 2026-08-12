import { articles as initialArticles, type Article } from './articles';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const LOCAL_STORAGE_KEY = 'iedc_published_articles';
const DELETED_IDS_KEY = 'iedc_deleted_article_ids';

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

// --- Cross-tab sync ---
export function onArticlesChange(callback: () => void): () => void {
  const handler = (e: StorageEvent) => {
    if (e.key === LOCAL_STORAGE_KEY || e.key === DELETED_IDS_KEY) {
      callback();
    }
  };
  window.addEventListener('storage', handler);
  return () => window.removeEventListener('storage', handler);
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
  let list: Article[] = [];

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('createdAt', { ascending: false });

      if (!error && data && data.length > 0) {
        list = data.map(mapSupabaseRow);
      } else {
        list = getLocalArticles();
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local:', err);
      list = getLocalArticles();
    }
  } else {
    list = getLocalArticles();
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
}

export async function publishArticle(payload: CreateArticlePayload): Promise<Article> {
  const newId = String(Date.now());
  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const totalWords = [...payload.paragraphs, payload.title, payload.subtitle].join(' ').split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(totalWords / 200));
  const readTime = `${minutes} min read`;

  const newArticle: Article = {
    id: newId,
    title: sanitizeHtml(payload.title || 'Untitled Story'),
    subtitle: sanitizeHtml(payload.subtitle || 'No subtitle provided.'),
    category: payload.category || 'Tech Update',
    categoryColor: payload.categoryColor || 'primary',
    date: formattedDate,
    readTime,
    imageUrl: payload.imageUrl || '',
    featured: false,
    status: payload.status || 'published',
    scheduledFor: payload.scheduledFor || undefined,
    content: {
      paragraphs: payload.paragraphs.length > 0 ? sanitizeParagraphs(payload.paragraphs) : ['No content provided.'],
      subheadings: payload.subheadings || [],
      blockquote: payload.blockquote ? sanitizeHtml(payload.blockquote) : undefined,
    },
    author: {
      name: payload.authorName || 'Admin User',
      role: payload.authorRole || 'IEDC Editorial',
      avatarUrl: payload.authorAvatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDp6-LO5wbh6CTC36gJGeJayrbGtizLZWUlH9INz99YIJjIvsgYIZWEI3FCpw0i_0qiTUtAr6wPwhbUntODV_DKp16HJ_i97nWITmL3RCUSGrO0UEQgfLjdcaub8MJ1eBmE7L8UKpcRIhK6qh2roHWO8mK9WHTiHouOVak3xxVFkkI027MEgVlLW2Wt-YE2_7_p67F0NuRnWR6AOvYY3tYmko7Kd-N5jpyO_R33j4KF_IVtKvrukoEY2Q',
    },
    createdAt: now.toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('articles').insert([toSupabaseRow(newArticle)]);
      if (error) console.error('Supabase insert error:', error);
    } catch (err) {
      console.error('Supabase insert exception:', err);
    }
  }

  const currentLocal = getLocalArticles();
  saveLocalArticles([newArticle, ...currentLocal]);
  return newArticle;
}

// --- Update ---
export async function updateArticle(id: string, payload: Partial<CreateArticlePayload>): Promise<Article | null> {
  const targetId = String(id);
  const all = await getAllArticlesAdmin();
  const idx = all.findIndex((a) => String(a.id) === targetId);
  if (idx === -1) return null;

  const existing = all[idx];
  const updated: Article = {
    ...existing,
    title: payload.title !== undefined ? sanitizeHtml(payload.title) : existing.title,
    subtitle: payload.subtitle !== undefined ? sanitizeHtml(payload.subtitle) : existing.subtitle,
    category: payload.category ?? existing.category,
    categoryColor: payload.categoryColor ?? existing.categoryColor,
    imageUrl: payload.imageUrl ?? existing.imageUrl,
    status: payload.status ?? existing.status,
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

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('articles')
        .update(toSupabaseRow(updated))
        .eq('id', targetId);
      if (error) console.error('Supabase update error:', error);
    } catch (err) {
      console.error('Supabase update exception:', err);
    }
  }

  all[idx] = updated;
  saveLocalArticles(all);
  return updated;
}

// --- Delete ---
export async function deleteArticle(id: string): Promise<boolean> {
  const targetId = String(id);

  // Mark as deleted in local persistent tracking
  addDeletedId(targetId);

  // Update local storage array
  const allLocal = getLocalArticles();
  const filteredLocal = allLocal.filter((a) => String(a.id) !== targetId);
  saveLocalArticles(filteredLocal);

  // Delete from Supabase cloud table if connected
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('articles').delete().eq('id', targetId);
      if (error) console.error('Supabase delete error:', error);
    } catch (err) {
      console.error('Supabase delete exception:', err);
    }
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

      const { error: uploadError } = await supabase.storage
        .from('article-covers')
        .upload(filePath, file);

      if (!uploadError) {
        const { data } = supabase.storage.from('article-covers').getPublicUrl(filePath);
        return data.publicUrl;
      }
      console.error('Storage upload error:', uploadError);
    } catch (e) {
      console.error('Storage upload exception:', e);
    }
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}
