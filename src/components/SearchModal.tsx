import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllArticles } from '../data/articleService';
import type { Article } from '../data/articles';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
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

  const results = query.trim()
    ? articlesList.filter(
        (a) =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          a.category.toLowerCase().includes(query.toLowerCase())
      )
    : articlesList.slice(0, 4);

  return (
    <div
      className="fixed inset-0 bg-on-surface/70 backdrop-blur-sm z-[100] flex items-start justify-center pt-16 md:pt-28 px-4"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-[2rem] border-4 border-on-surface shadow-[16px_16px_0px_0px_rgba(28,27,27,1)] max-w-2xl w-full p-8 flex flex-col gap-6 animate-[slideDown_0.2s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center justify-between gap-4 border-b-2 border-on-surface pb-4">
          <div className="flex items-center gap-3 flex-1">
            <span className="material-symbols-outlined text-headline-md text-primary">search</span>
            <input
              type="text"
              placeholder="Search all articles, projects, and editions..."
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
        <div className="text-label-bold font-label-bold uppercase text-xs text-secondary">
          {query.trim() ? `Search Results (${results.length})` : 'Popular Articles'}
        </div>

        {/* Results List */}
        <div className="max-h-[50vh] overflow-y-auto flex flex-col gap-3 pr-2">
          {results.length === 0 ? (
            <div className="text-center py-12 text-secondary">
              <p className="text-body-lg">No articles found matching "{query}"</p>
            </div>
          ) : (
            results.map((article) => (
              <Link
                key={article.id}
                to={`/article/${article.id}`}
                onClick={onClose}
                className="flex items-center justify-between p-4 rounded-xl border-2 border-outline-variant hover:border-on-surface hover:bg-surface-container transition-all group"
              >
                <div className="flex flex-col gap-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 text-xs font-label-bold uppercase text-secondary">
                    <span className="text-primary">{article.category}</span>
                    <span>•</span>
                    <span>{article.date}</span>
                  </div>
                  <h4 className="text-body-lg font-headline-md text-on-surface group-hover:text-primary transition-colors truncate uppercase">
                    {article.title}
                  </h4>
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
