import { articles as initialArticles, type Article } from './articles';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const LOCAL_STORAGE_KEY = 'iedc_published_articles';

// Helper to initialize local storage with seed data if empty
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

export async function getAllArticles(): Promise<Article[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('createdAt', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((item) => ({
          id: item.id,
          title: item.title,
          subtitle: item.subtitle,
          category: item.category,
          categoryColor: item.category_color || 'primary',
          date: item.date,
          readTime: item.read_time,
          imageUrl: item.image_url,
          featured: item.featured,
          content: typeof item.content === 'string' ? JSON.parse(item.content) : item.content,
          author: typeof item.author === 'string' ? JSON.parse(item.author) : item.author,
          createdAt: item.createdAt,
        }));
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local store:', err);
    }
  }

  return getLocalArticles();
}

export async function fetchArticleById(id: string): Promise<Article | undefined> {
  const all = await getAllArticles();
  return all.find((a) => String(a.id) === String(id));
}

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
}

export async function publishArticle(payload: CreateArticlePayload): Promise<Article> {
  const newId = String(Date.now());
  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  // Calculate estimated read time based on word count
  const totalWords = [...payload.paragraphs, payload.title, payload.subtitle].join(' ').split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(totalWords / 200));
  const readTime = `${minutes} min read`;

  const newArticle: Article = {
    id: newId,
    title: payload.title || 'Untitled Story',
    subtitle: payload.subtitle || 'No subtitle provided.',
    category: payload.category || 'Tech Update',
    categoryColor: payload.categoryColor || 'primary',
    date: formattedDate,
    readTime,
    imageUrl: payload.imageUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGMRl1dRUP3Cr1L5leksQUJB_6c_VVlTZv2dO5tLx-fYZZ6gkVzoYboO4xveDoPswMmnl3c8I5P7Zs0FOstO6anVNSlLGGkKjxmSZmMFxT2vM5j55AgK_RV3dHFlZlLa1roL2etkVICbJUdYD2VxeoOv4vXpxWS35HSK9-7X_KMcqfjIKEhG7QdX5Xw-ulKANh_szfaD9A7hlUqSc2kXDv4gkcJDrEhKUwLLjbUkk4VLMdGa4yKJ7vHA',
    featured: false,
    content: {
      paragraphs: payload.paragraphs.length > 0 ? payload.paragraphs : ['No content provided.'],
      subheadings: payload.subheadings || [],
      blockquote: payload.blockquote,
    },
    author: {
      name: payload.authorName || 'Admin User',
      role: payload.authorRole || 'IEDC Editorial',
      avatarUrl: payload.authorAvatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDp6-LO5wbh6CTC36gJGeJayrbGtizLZWUlH9INz99YIJjIvsgYIZWEI3FCpw0i_0qiTUtAr6wPwhbUntODV_DKp16HJ_i97nWITmL3RCUSGrO0UEQgfLjdcaub8MJ1eBmE7L8UKpcRIhK6qh2roHWO8mK9WHTiHouOVak3xxVFkkI027MEgVlLW2Wt-YE2_7_p67F0NuRnWR6AOvYY3tYmko7Kd-N5jpyO_R33j4KF_IVtKvrukoEY2Q',
    },
    createdAt: now.toISOString(),
  };

  // If Supabase is connected, insert to cloud database
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('articles').insert([{
        id: newArticle.id,
        title: newArticle.title,
        subtitle: newArticle.subtitle,
        category: newArticle.category,
        category_color: newArticle.categoryColor,
        date: newArticle.date,
        read_time: newArticle.readTime,
        image_url: newArticle.imageUrl,
        featured: false,
        content: JSON.stringify(newArticle.content),
        author: JSON.stringify(newArticle.author),
        createdAt: newArticle.createdAt,
      }]);

      if (error) {
        console.error('Error inserting to Supabase:', error);
      }
    } catch (err) {
      console.error('Supabase insert exception:', err);
    }
  }

  // Always save locally as well for instant local responsiveness
  const currentLocal = getLocalArticles();
  const updated = [newArticle, ...currentLocal];
  saveLocalArticles(updated);

  return newArticle;
}

// Upload image helper function (Supabase Storage with fallback to object URL/URL string)
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

  // Fallback: Convert to Data URL for local preview/persistence
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(file);
  });
}
