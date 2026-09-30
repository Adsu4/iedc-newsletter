import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { currentEditionInfo, type NewsletterEditionInfo } from './newsletterData';

const LOCAL_STORAGE_KEY = 'iedc_editions_v1';

function getLocalEditions(): NewsletterEditionInfo[] {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to read editions from localStorage:', e);
  }
  return [currentEditionInfo];
}

export function saveLocalEditions(editions: NewsletterEditionInfo[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(editions));
  } catch (e) {
    console.error('Failed to save editions to localStorage:', e);
  }
}

export async function fetchCurrentEdition(): Promise<NewsletterEditionInfo> {
  const localEditions = getLocalEditions();
  const defaultEdition = localEditions[0] || currentEditionInfo;

  if (isSupabaseConfigured && supabase) {
    try {
      const editionPromise = supabase
        .from('editions')
        .select('*')
        .order('createdAt', { ascending: false })
        .limit(1)
        .single();

      const timeoutPromise = new Promise<{ data: any; error: any }>((_, reject) =>
        setTimeout(() => reject(new Error('Edition fetch timeout')), 1000)
      );

      const { data, error } = await Promise.race([editionPromise, timeoutPromise]);

      if (!error && data) {
        return {
          edition: data.edition,
          monthYear: data.month_year || data.monthYear,
          theme: data.theme,
          summary: data.summary,
        };
      }
    } catch (err) {
      console.warn('Supabase fetch failed or timed out for editions, using local:', err);
    }
  }
  
  return defaultEdition;
}
