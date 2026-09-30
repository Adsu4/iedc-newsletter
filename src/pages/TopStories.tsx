import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllArticles, getLocalArticlesSync, onArticlesChange } from '../data/articleService';
import type { Article } from '../data/articles';

export default function TopStories() {
  const [articlesList, setArticlesList] = useState<Article[]>(() => getLocalArticlesSync());

  useEffect(() => {
    getAllArticles().then(setArticlesList);

    const unsubscribe = onArticlesChange(() => {
      setArticlesList(getLocalArticlesSync());
    });

    return unsubscribe;
  }, []);

  // Helper to identify Monthly Newsletter
  const isMonthlyNewsletter = (a: Article) => {
    const cat = a.category?.trim().toLowerCase();
    return cat === 'monthly newsletter' || cat === 'newsletter' || cat === 'latest edition';
  };

  // 1. Top Pick (#1): Prioritize explicit rank 1
  const rankedTopPick = articlesList.find((a) => a.topStoryRank === 1);
  const latestNewsletter = articlesList.find(isMonthlyNewsletter);
  const topPick = rankedTopPick || latestNewsletter || articlesList[0];

  // 2. Spotlight Stories (#2, #3, #4, #5...): Prioritize explicitly ranked articles
  const otherRanked = articlesList
    .filter((a) => a.id !== topPick?.id && a.topStoryRank && a.topStoryRank > 1)
    .sort((a, b) => (a.topStoryRank || 999) - (b.topStoryRank || 999));

  const unrankedStories = articlesList.filter(
    (a) => a.id !== topPick?.id && (!a.topStoryRank || a.topStoryRank <= 1)
  );

  const spotlightStories = [...otherRanked, ...unrankedStories].slice(0, 4);

  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-14 flex flex-col gap-8 md:gap-12">
      {/* Header Banner */}
      <div className="border-b-2 border-on-surface pb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-primary text-on-primary px-3 py-0.5 rounded-full text-label-bold font-label-bold uppercase text-[11px]">
            Editorial Picks
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-headline-xl uppercase text-on-surface leading-tight">
          Top Stories
        </h1>
        <p className="text-sm sm:text-base text-on-surface-variant max-w-2xl mt-2 leading-relaxed">
          The most impactful tech breakthroughs, student achievements, and campus innovation highlights selected by our editorial team.
        </p>
      </div>

      {/* Featured Big Story */}
      {topPick && (
        <Link to={`/article/${topPick.id}`} className="group cursor-pointer">
          <div className="bg-surface-container-high rounded-2xl border-2 border-on-surface p-6 sm:p-8 md:p-10 shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] group-hover:-translate-y-1 group-hover:shadow-[6px_6px_0px_0px_rgba(28,27,27,1)] transition-all flex flex-col lg:flex-row gap-8 items-center">
            <div className="w-full lg:w-1/2 aspect-[16/10] rounded-xl overflow-hidden border-2 border-on-surface bg-surface-container-high shadow-[2px_2px_0px_0px_rgba(28,27,27,1)]">
              {topPick.imageUrl ? (
                <img src={topPick.imageUrl} alt={topPick.title} className="w-full h-full object-cover img-editorial" />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-6 bg-tertiary text-on-tertiary">
                  <span className="text-xl font-bold font-sans text-center">{topPick.title}</span>
                </div>
              )}
            </div>
            <div className="w-full lg:w-1/2 flex flex-col gap-3.5">
              <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant">
                <span className="bg-tertiary text-on-tertiary px-2.5 py-0.5 rounded-full text-[10px] font-label-bold uppercase">{topPick.category}</span>
                <span>•</span>
                <span>{topPick.date}</span>
                <span>•</span>
                <span>{topPick.readTime}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-sans text-on-surface group-hover:text-primary transition-colors leading-snug">
                {topPick.title}
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                {topPick.subtitle}
              </p>
              <div className="flex items-center gap-2.5 pt-3 border-t border-on-surface/15">
                <img src={topPick.author.avatarUrl} alt={topPick.author.name} className="w-8 h-8 rounded-full border border-on-surface object-cover" />
                <div>
                  <div className="text-xs font-bold text-on-surface">{topPick.author.name}</div>
                  <div className="text-[11px] text-secondary">{topPick.author.role}</div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Grid of Top Stories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {spotlightStories.map((article, idx) => (
          <Link
            key={article.id}
            to={`/article/${article.id}`}
            className="flex flex-col gap-4 group cursor-pointer bg-surface p-5 sm:p-6 rounded-xl border-2 border-on-surface shadow-[3px_3px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-1 hover:shadow-[5px_5px_0px_0px_rgba(28,27,27,1)] transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold font-headline-md text-primary">
                #{String(article.topStoryRank || idx + 2).padStart(2, '0')}
              </span>
              <span className="bg-surface-container-high text-on-surface px-2.5 py-0.5 rounded-full text-[10px] font-label-bold uppercase border border-on-surface">
                {article.category}
              </span>
            </div>
            {article.imageUrl && (
              <div className="w-full aspect-[16/9] rounded-lg overflow-hidden border border-on-surface bg-surface-container-high">
                <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover img-editorial group-hover:scale-105 transition-transform duration-300" />
              </div>
            )}
            <div className="flex flex-col gap-2">
              <h3 className="text-lg sm:text-xl font-bold font-sans text-on-surface group-hover:text-primary transition-colors leading-snug">
                {article.title}
              </h3>
              <p className="text-xs sm:text-sm text-on-surface-variant line-clamp-2 leading-relaxed">
                {article.subtitle}
              </p>
            </div>
            <div className="flex items-center justify-between text-xs font-medium text-secondary pt-3 border-t border-on-surface/10 mt-auto">
              <span>{article.date}</span>
              <span className="text-primary font-bold group-hover:underline flex items-center gap-1">
                Read story <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
