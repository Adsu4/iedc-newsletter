import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAllArticles } from '../data/articleService';
import type { Article } from '../data/articles';

export default function Archive() {
  const [articlesList, setArticlesList] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    getAllArticles().then(setArticlesList);
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(articlesList.map((a) => a.category));
    return ['All', ...Array.from(cats)];
  }, [articlesList]);

  const filteredArticles = useMemo(() => {
    return articlesList.filter((a) => {
      const matchesCategory = selectedCategory === 'All' || a.category === selectedCategory;
      const matchesSearch =
        searchQuery === '' ||
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [articlesList, selectedCategory, searchQuery]);

  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-14 flex flex-col gap-8 md:gap-10">
      {/* Header */}
      <div className="border-b-2 border-on-surface pb-5">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-headline-xl uppercase text-on-surface leading-tight mb-2">
          Archive
        </h1>
        <p className="text-sm sm:text-base text-on-surface-variant max-w-2xl leading-relaxed">
          Browse the complete collection of articles, news editions, hackathon reports, and student startup showcases published by IEDC GECT.
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border ${
                selectedCategory === cat
                  ? 'bg-on-surface text-surface border-on-surface font-bold shadow-[2px_2px_0px_0px_rgba(28,27,27,1)]'
                  : 'bg-surface text-on-surface border-outline-variant hover:border-on-surface'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full lg:w-80">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary text-[20px]">search</span>
          <input
            type="text"
            placeholder="Search stories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-on-surface bg-surface text-sm font-sans focus:border-primary focus:outline-none transition-colors shadow-[2px_2px_0px_0px_rgba(28,27,27,1)] placeholder-on-surface/50"
          />
        </div>
      </div>

      {/* Articles Count */}
      <div className="text-xs font-medium text-secondary">
        Showing {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'}
      </div>

      {/* Articles Feed */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-16 bg-surface rounded-xl border-2 border-on-surface">
          <span className="material-symbols-outlined text-5xl text-secondary mb-3 block">search_off</span>
          <h2 className="text-xl font-bold font-sans text-on-surface mb-1">No matching stories found</h2>
          <p className="text-sm text-secondary">Try adjusting your search query or selected category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <Link
              key={article.id}
              to={`/article/${article.id}`}
              className="flex flex-col group cursor-pointer bg-surface rounded-xl border-2 border-on-surface shadow-[3px_3px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-1 hover:shadow-[5px_5px_0px_0px_rgba(28,27,27,1)] transition-all overflow-hidden"
            >
              {article.imageUrl ? (
                <div className="w-full aspect-[16/10] bg-surface-container-high border-b-2 border-on-surface overflow-hidden">
                  <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover img-editorial group-hover:scale-105 transition-transform duration-300" />
                </div>
              ) : (
                <div className="w-full aspect-[16/10] bg-tertiary-container border-b-2 border-on-surface p-5 flex items-center justify-center">
                  <span className="text-base font-bold font-sans text-center text-on-tertiary-container">{article.title}</span>
                </div>
              )}
              <div className="p-4 sm:p-5 flex flex-col flex-1 gap-2.5">
                <div className="flex items-center gap-2 text-xs font-medium">
                  <span className="bg-tertiary text-on-tertiary px-2.5 py-0.5 rounded-full text-[10px] font-label-bold uppercase">{article.category}</span>
                  <span className="text-secondary">•</span>
                  <span className="text-secondary">{article.date}</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold font-sans text-on-surface group-hover:text-primary transition-colors leading-snug">
                  {article.title}
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant line-clamp-2 leading-relaxed flex-1">
                  {article.subtitle}
                </p>
                <div className="pt-3 border-t border-on-surface/10 flex justify-between items-center text-xs text-secondary font-medium">
                  <span>{article.readTime}</span>
                  <span className="text-primary font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    Read <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
