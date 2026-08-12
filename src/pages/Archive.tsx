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
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-20 flex flex-col gap-12">
      {/* Header */}
      <div className="border-b-4 border-on-surface pb-8">
        <h1 className="text-display-lg-mobile md:text-display-lg font-display-lg-mobile md:font-display-lg text-on-surface uppercase leading-none mb-4">
          Archive
        </h1>
        <p className="text-body-lg text-on-surface-variant max-w-2xl">
          Browse the complete collection of articles, news editions, hackathon reports, and student startup showcases published by IEDC GECT.
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-stretch lg:items-center">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-label-bold font-label-bold uppercase text-xs transition-all border-2 ${
                selectedCategory === cat
                  ? 'bg-on-surface text-surface border-on-surface shadow-[4px_4px_0px_0px_rgba(28,27,27,1)]'
                  : 'bg-surface text-on-surface border-outline-variant hover:border-on-surface'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full lg:w-80">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-secondary">search</span>
          <input
            type="text"
            placeholder="Search stories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-3 rounded-full border-2 border-on-surface bg-surface text-body-md font-body-md focus:border-primary focus:outline-none transition-colors shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] placeholder-on-surface/50"
          />
        </div>
      </div>

      {/* Articles Count */}
      <div className="text-label-bold font-label-bold uppercase text-secondary text-sm">
        Showing {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'}
      </div>

      {/* Articles Feed */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-24 bg-surface rounded-2xl border-4 border-on-surface">
          <span className="material-symbols-outlined text-6xl text-secondary mb-4 block">search_off</span>
          <h2 className="text-headline-md font-headline-md text-on-surface uppercase mb-2">No matching stories found</h2>
          <p className="text-body-md text-secondary">Try adjusting your search query or selected category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <Link
              key={article.id}
              to={`/article/${article.id}`}
              className="flex flex-col group cursor-pointer bg-surface rounded-2xl border-4 border-on-surface shadow-[6px_6px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[12px_12px_0px_0px_rgba(28,27,27,1)] transition-all overflow-hidden"
            >
              {article.imageUrl ? (
                <div className="w-full aspect-[16/10] bg-primary border-b-4 border-on-surface overflow-hidden">
                  <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover mix-blend-luminosity opacity-90 group-hover:scale-105 transition-transform duration-300" />
                </div>
              ) : (
                <div className="w-full aspect-[16/10] bg-tertiary-container border-b-4 border-on-surface p-6 flex items-center justify-center">
                  <span className="text-headline-md font-headline-md uppercase text-center text-on-tertiary-container">{article.title}</span>
                </div>
              )}
              <div className="p-6 flex flex-col flex-1 gap-4">
                <div className="flex items-center gap-2 text-label-bold font-label-bold uppercase text-xs">
                  <span className="bg-tertiary text-on-tertiary px-3 py-1 rounded-full">{article.category}</span>
                  <span className="text-secondary">•</span>
                  <span className="text-secondary">{article.date}</span>
                </div>
                <h3 className="text-headline-md font-headline-md text-on-surface group-hover:text-primary transition-colors uppercase leading-tight">
                  {article.title}
                </h3>
                <p className="text-body-md text-on-surface-variant line-clamp-3 leading-relaxed flex-1">
                  {article.subtitle}
                </p>
                <div className="pt-4 border-t border-on-surface/10 flex justify-between items-center text-xs font-label-bold uppercase text-secondary">
                  <span>{article.readTime}</span>
                  <span className="text-primary font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
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
