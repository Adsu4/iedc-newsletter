import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllArticles } from '../data/articleService';
import { upcomingEvents, opportunitiesList, startupSpotlights } from '../data/newsletterData';
import type { Article } from '../data/articles';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  badgeColor: string;
  link: string;
  type: 'Article' | 'Event' | 'Grant' | 'Startup';
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [articlesList, setArticlesList] = useState<Article[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      setQuery('');
      getAllArticles().then(setArticlesList);
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const allSearchItems: SearchItem[] = [
    ...articlesList.map((a) => ({
      id: `art-${a.id}`,
      title: a.title,
      subtitle: a.subtitle,
      category: a.category,
      badgeColor: 'bg-primary text-on-primary',
      link: `/article/${a.id}`,
      type: 'Article' as const,
    })),
    ...upcomingEvents.map((e) => ({
      id: `ev-${e.id}`,
      title: e.title,
      subtitle: `${e.date} • ${e.venue}`,
      category: e.category,
      badgeColor: 'bg-tertiary text-on-tertiary',
      link: '/coming-up',
      type: 'Event' as const,
    })),
    ...opportunitiesList.map((o) => ({
      id: `op-${o.id}`,
      title: o.title,
      subtitle: `${o.provider} • ${o.grantAmount || o.deadline}`,
      category: o.category,
      badgeColor: 'bg-secondary text-on-secondary',
      link: '/opportunities',
      type: 'Grant' as const,
    })),
    ...startupSpotlights.map((s) => ({
      id: `sp-${s.id}`,
      title: s.name,
      subtitle: `${s.tagline} • ${s.highlightMetric}`,
      category: s.sector,
      badgeColor: 'bg-surface-container-high text-on-surface',
      link: s.articleId ? `/article/${s.articleId}` : '/projects',
      type: 'Startup' as const,
    })),
  ];

  const q = query.trim().toLowerCase();
  const results = q
    ? allSearchItems.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.type.toLowerCase().includes(q)
      )
    : allSearchItems.slice(0, 5);

  return (
    <div
      className="fixed inset-0 bg-on-surface/75 backdrop-blur-sm z-[100] flex items-start justify-center pt-16 md:pt-28 px-4"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-[2rem] border-4 border-on-surface shadow-[16px_16px_0px_0px_rgba(28,27,27,1)] max-w-2xl w-full p-8 flex flex-col gap-6 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center justify-between gap-4 border-b-2 border-on-surface pb-4">
          <div className="flex items-center gap-3 flex-1">
            <span className="material-symbols-outlined text-headline-md text-primary">search</span>
            <input
              type="text"
              placeholder="Search newsletter, events, grants & startups..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              className="w-full bg-transparent text-headline-md font-headline-md text-on-surface border-none focus:ring-0 p-0 placeholder:text-surface-variant uppercase"
            />
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full border-2 border-on-surface flex items-center justify-center hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between text-xs font-label-bold uppercase text-secondary">
          <span>{query.trim() ? `Search Results (${results.length})` : 'Popular Highlights & Sections'}</span>
          <span className="text-[11px] text-secondary">Press Esc to close</span>
        </div>

        {/* Results List */}
        <div className="max-h-[50vh] overflow-y-auto flex flex-col gap-3 pr-2">
          {results.length === 0 ? (
            <div className="text-center py-12 text-secondary">
              <p className="text-body-lg">No matches found for "{query}"</p>
              <p className="text-xs text-on-surface-variant mt-1">Try searching for "hackathon", "grant", "AI", or "robotics"</p>
            </div>
          ) : (
            results.map((item) => (
              <Link
                key={item.id}
                to={item.link}
                onClick={onClose}
                className="flex items-center justify-between p-4 rounded-xl border-2 border-outline-variant hover:border-on-surface hover:bg-surface-container transition-all group"
              >
                <div className="flex flex-col gap-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 text-xs font-label-bold uppercase">
                    <span className={`${item.badgeColor} px-2 py-0.5 rounded text-[10px] border border-on-surface`}>
                      {item.type}
                    </span>
                    <span className="text-secondary">•</span>
                    <span className="text-primary">{item.category}</span>
                  </div>
                  <h4 className="text-body-lg font-headline-md text-on-surface group-hover:text-primary transition-colors truncate uppercase">
                    {item.title}
                  </h4>
                  <p className="text-xs text-on-surface-variant truncate">
                    {item.subtitle}
                  </p>
                </div>
                <span className="material-symbols-outlined text-secondary group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0">
                  arrow_forward
                </span>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
