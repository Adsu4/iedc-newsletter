import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllArticles } from '../data/articleService';
import type { Article } from '../data/articles';

export default function TopStories() {
  const [articlesList, setArticlesList] = useState<Article[]>([]);

  useEffect(() => {
    getAllArticles().then(setArticlesList);
  }, []);

  const topPick = articlesList[0];
  const spotlightStories = articlesList.slice(1, 5);

  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-20 flex flex-col gap-16">
      {/* Header Banner */}
      <div className="border-b-4 border-on-surface pb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="bg-primary text-on-primary px-4 py-1.5 rounded-full text-label-bold font-label-bold uppercase text-xs">
            Editorial Picks
          </span>
          <span className="text-secondary font-label-bold uppercase text-xs">• Updated Daily</span>
        </div>
        <h1 className="text-display-lg-mobile md:text-display-lg font-display-lg-mobile md:font-display-lg text-on-surface uppercase leading-none">
          Top Stories
        </h1>
        <p className="text-body-lg text-on-surface-variant max-w-2xl mt-4">
          The most impactful tech breakthroughs, student achievements, and campus innovation highlights selected by our editorial team.
        </p>
      </div>

      {/* Featured Big Story */}
      {topPick && (
        <Link to={`/article/${topPick.id}`} className="group cursor-pointer">
          <div className="bg-surface-container-high rounded-[2rem] border-4 border-on-surface p-8 md:p-14 shadow-[12px_12px_0px_0px_rgba(28,27,27,1)] group-hover:-translate-y-2 group-hover:-translate-x-2 group-hover:shadow-[18px_18px_0px_0px_rgba(28,27,27,1)] transition-all flex flex-col lg:flex-row gap-12 items-center">
            <div className="w-full lg:w-1/2 aspect-[16/10] rounded-2xl overflow-hidden border-4 border-on-surface bg-primary shadow-[4px_4px_0px_0px_rgba(28,27,27,1)]">
              {topPick.imageUrl ? (
                <img src={topPick.imageUrl} alt={topPick.title} className="w-full h-full object-cover mix-blend-luminosity opacity-90" />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-8 bg-tertiary text-on-tertiary">
                  <span className="text-headline-xl font-headline-xl uppercase text-center">{topPick.title}</span>
                </div>
              )}
            </div>
            <div className="w-full lg:w-1/2 flex flex-col gap-6">
              <div className="flex items-center gap-3 text-label-bold font-label-bold text-on-surface uppercase">
                <span className="bg-tertiary text-on-tertiary px-3 py-1 rounded-full text-xs">{topPick.category}</span>
                <span>•</span>
                <span>{topPick.date}</span>
                <span>•</span>
                <span>{topPick.readTime}</span>
              </div>
              <h2 className="text-headline-xl font-headline-xl text-on-surface group-hover:text-primary transition-colors uppercase leading-none">
                {topPick.title}
              </h2>
              <p className="text-body-lg text-on-surface-variant leading-relaxed">
                {topPick.subtitle}
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-on-surface/20">
                <img src={topPick.author.avatarUrl} alt={topPick.author.name} className="w-10 h-10 rounded-full border-2 border-on-surface object-cover" />
                <div>
                  <div className="text-label-bold font-label-bold text-on-surface uppercase text-xs">{topPick.author.name}</div>
                  <div className="text-xs text-secondary">{topPick.author.role}</div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Grid of Top Stories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {spotlightStories.map((article, idx) => (
          <Link
            key={article.id}
            to={`/article/${article.id}`}
            className="flex flex-col gap-6 group cursor-pointer bg-surface p-8 rounded-2xl border-4 border-on-surface shadow-[8px_8px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[14px_14px_0px_0px_rgba(28,27,27,1)] transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-headline-xl font-headline-xl text-primary font-black">#0{idx + 2}</span>
              <span className="bg-surface-container-high text-on-surface px-3 py-1 rounded-full text-xs font-label-bold uppercase border border-on-surface">
                {article.category}
              </span>
            </div>
            {article.imageUrl && (
              <div className="w-full aspect-[16/9] rounded-xl overflow-hidden border-2 border-on-surface bg-secondary">
                <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover mix-blend-luminosity opacity-85" />
              </div>
            )}
            <div className="flex flex-col gap-3">
              <h3 className="text-headline-md font-headline-md text-on-surface group-hover:text-primary transition-colors uppercase leading-tight">
                {article.title}
              </h3>
              <p className="text-body-md text-on-surface-variant line-clamp-2 leading-relaxed">
                {article.subtitle}
              </p>
            </div>
            <div className="flex items-center justify-between text-xs font-label-bold text-secondary uppercase pt-4 border-t border-on-surface/10">
              <span>{article.date}</span>
              <span>{article.readTime}</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
