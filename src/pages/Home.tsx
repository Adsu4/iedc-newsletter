import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getAllArticles } from '../data/articleService';
import type { Article } from '../data/articles';

const INITIAL_VISIBLE = 4;
const LOAD_MORE_COUNT = 2;

const categoryColorMap = {
  primary: { badge: 'bg-primary text-on-primary', card: 'bg-surface-container-high' },
  secondary: { badge: 'bg-secondary text-on-secondary', card: 'bg-secondary-container' },
  tertiary: { badge: 'bg-tertiary text-on-tertiary', card: 'bg-tertiary-container' },
};

export default function Home() {
  const [articlesList, setArticlesList] = useState<Article[]>([]);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const newsletterRef = useRef<HTMLElement>(null);

  useEffect(() => {
    getAllArticles().then(setArticlesList);
  }, []);

  const featured = articlesList.find((a) => a.featured) || articlesList[0];
  const trending = articlesList.filter((a) => a.id !== featured?.id).slice(0, 3);
  const archive = articlesList.filter((a) => a.id !== featured?.id);

  const visibleArchive = archive.slice(0, visibleCount);
  const hasMore = visibleCount < archive.length;

  const trendingCardColors = [
    'bg-secondary-container',
    'bg-tertiary-container',
    'bg-surface-container-high',
  ];
  const trendingTextColors = [
    { num: 'text-on-surface', title: 'text-on-surface group-hover:text-primary', meta: 'text-on-surface' },
    { num: 'text-on-tertiary-container', title: 'text-on-tertiary-container group-hover:text-tertiary-fixed', meta: 'text-on-tertiary-container opacity-90' },
    { num: 'text-on-surface', title: 'text-on-surface group-hover:text-primary', meta: 'text-on-surface' },
  ];

  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-20 flex flex-col gap-20 md:gap-32">
      {/* Top Stories Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-gutter border-b-2 border-on-surface pb-20">
        {/* Hero Article */}
        {featured && (
          <Link to={`/article/${featured.id}`} className="lg:col-span-8 flex flex-col gap-8 group cursor-pointer">
            <div className="w-full aspect-[4/3] md:aspect-[16/9] overflow-hidden rounded-2xl bg-primary border-4 border-on-surface shadow-[8px_8px_0px_0px_rgba(28,27,27,1)] relative transition-transform duration-300 group-hover:-translate-y-2 group-hover:-translate-x-2 group-hover:shadow-[16px_16px_0px_0px_rgba(28,27,27,1)]">
              <img className="w-full h-full object-cover mix-blend-luminosity opacity-90" alt={featured.title} src={featured.imageUrl}/>
              <div className="absolute top-6 right-6 bg-secondary text-on-secondary text-label-bold font-label-bold uppercase px-4 py-2 rounded-full border-2 border-on-surface shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] rotate-3">
                Featured Report
              </div>
            </div>
            <div className="flex flex-col gap-4 max-w-3xl">
              <div className="flex items-center gap-3 text-label-bold font-label-bold text-on-surface uppercase tracking-wider">
                <span className="bg-tertiary text-on-tertiary px-3 py-1 rounded-full text-xs">{featured.category}</span>
                <span>•</span>
                <span>{featured.date}</span>
                <span>•</span>
                <span>{featured.readTime}</span>
              </div>
              <h1 className="text-display-lg-mobile md:text-display-lg font-display-lg-mobile md:font-display-lg text-on-surface group-hover:text-primary transition-colors duration-300 uppercase leading-none">{featured.title}</h1>
              <p className="text-body-lg font-body-lg text-on-surface-variant leading-relaxed">{featured.subtitle}</p>
            </div>
          </Link>
        )}
        
        {/* Trending Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-10 lg:pl-10 lg:border-l-2 border-on-surface">
          <h2 className="text-headline-md font-headline-md text-on-surface uppercase border-b-2 border-on-surface pb-6">Trending on Campus</h2>
          <div className="flex flex-col gap-10">
            {trending.map((article, index) => (
              <Link
                key={article.id}
                to={`/article/${article.id}`}
                className={`flex gap-6 group cursor-pointer ${trendingCardColors[index] || 'bg-surface-container-high'} p-6 rounded-2xl border-2 border-on-surface shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] hover:shadow-[8px_8px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-1 transition-all`}
              >
                <span className={`text-headline-xl font-headline-xl ${trendingTextColors[index]?.num || 'text-on-surface'} mt-[-4px]`}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="flex flex-col gap-3">
                  <h3 className={`text-body-lg font-headline-md ${trendingTextColors[index]?.title || 'text-on-surface group-hover:text-primary'} transition-colors leading-tight uppercase`}>
                    {article.title}
                  </h3>
                  <div className={`flex items-center gap-2 text-label-bold font-label-bold ${trendingTextColors[index]?.meta || 'text-on-surface'} uppercase text-xs`}>
                    <span>{article.date}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Vertical Feed (Archive) */}
      <section className="max-w-4xl mx-auto w-full flex flex-col gap-16 md:gap-24">
        <div className="flex items-center justify-between border-b-2 border-on-surface pb-6 mb-8">
          <h2 className="text-headline-xl font-headline-xl text-on-surface uppercase">Latest Articles</h2>
        </div>
        
        {visibleArchive.map((article, index) => {
          const colors = categoryColorMap[article.categoryColor] || categoryColorMap.primary;
          const hasImage = !!article.imageUrl;
          const isEven = index % 2 === 0;

          if (isEven && hasImage) {
            return (
              <Link key={article.id} to={`/article/${article.id}`} className="flex flex-col md:flex-row gap-8 md:gap-16 items-center group cursor-pointer">
                <div className="flex-1 flex flex-col gap-4 order-2 md:order-1 w-full">
                  <div className="flex items-center gap-3 text-label-bold font-label-bold text-on-surface uppercase">
                    <span className={`${colors.badge} px-3 py-1 rounded-full text-xs`}>{article.category}</span>
                    <span>•</span>
                    <span>{article.date}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="text-headline-md md:text-headline-xl font-headline-md md:font-headline-xl text-on-surface group-hover:text-primary transition-colors leading-none uppercase">{article.title}</h3>
                  <p className="text-body-lg font-body-lg text-on-surface-variant line-clamp-2 md:line-clamp-3 leading-relaxed">{article.subtitle}</p>
                </div>
                <div className="w-full md:w-64 lg:w-80 aspect-[4/3] rounded-2xl overflow-hidden order-1 md:order-2 shrink-0 bg-primary-fixed border-4 border-on-surface shadow-[8px_8px_0px_0px_rgba(28,27,27,1)] group-hover:-translate-y-2 group-hover:-translate-x-2 group-hover:shadow-[16px_16px_0px_0px_rgba(28,27,27,1)] transition-all">
                  <img className="w-full h-full object-cover mix-blend-luminosity" alt={article.title} src={article.imageUrl}/>
                </div>
              </Link>
            );
          } else {
            return (
              <Link key={article.id} to={`/article/${article.id}`} className={`flex flex-col md:flex-row gap-8 md:gap-16 items-center group cursor-pointer ${colors.card} p-8 md:p-12 rounded-2xl border-4 border-on-surface shadow-[8px_8px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[16px_16px_0px_0px_rgba(28,27,27,1)] transition-all`}>
                <div className="flex-1 flex flex-col gap-4 w-full">
                  <div className="flex items-center gap-3 text-label-bold font-label-bold text-on-surface uppercase">
                    <span className={`${colors.badge} px-3 py-1 rounded-full text-xs`}>{article.category}</span>
                    <span>•</span>
                    <span>{article.date}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="text-headline-md md:text-headline-xl font-headline-md md:font-headline-xl text-on-surface group-hover:text-primary transition-colors leading-none uppercase">{article.title}</h3>
                  <p className="text-body-lg font-body-lg text-on-surface-variant line-clamp-2 md:line-clamp-3 leading-relaxed">{article.subtitle}</p>
                </div>
              </Link>
            );
          }
        })}
        
        {hasMore && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setVisibleCount((c) => c + LOAD_MORE_COUNT)}
              className="bg-transparent border-4 border-on-surface text-on-surface px-12 py-4 rounded-full text-label-bold font-label-bold uppercase hover:bg-on-surface hover:text-surface transition-colors duration-200 shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] active:translate-y-1 active:shadow-none"
            >
              Load More Stories
            </button>
          </div>
        )}
      </section>

      {/* Newsletter Signup */}
      <section ref={newsletterRef} id="newsletter" className="max-w-4xl mx-auto w-full bg-tertiary-container rounded-[2rem] p-12 md:p-24 text-center mt-12 border-4 border-on-surface shadow-[12px_12px_0px_0px_rgba(28,27,27,1)]">
        <h2 className="text-display-lg-mobile md:text-headline-xl font-display-lg-mobile md:font-headline-xl mb-6 text-on-tertiary-container uppercase leading-none">Stay Ahead of the Curve</h2>
        <p className="text-body-lg font-body-lg text-on-tertiary-container/90 mb-12 max-w-2xl mx-auto">Get the latest updates, tech deep-dives, and campus innovation news delivered straight to your inbox every month.</p>
        <form className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto" onSubmit={(e) => e.preventDefault()}>
          <input className="flex-1 px-8 py-5 rounded-full border-4 border-on-surface bg-surface text-body-md font-body-md focus:border-primary focus:outline-none transition-colors placeholder-on-surface/50 shadow-[4px_4px_0px_0px_rgba(28,27,27,1)]" placeholder="Enter your college email" type="email"/>
          <button className="bg-on-surface text-surface px-10 py-5 rounded-full text-label-bold font-label-bold uppercase hover:bg-primary hover:text-on-primary transition-colors duration-200 whitespace-nowrap shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] border-4 border-on-surface" type="submit">
            Subscribe
          </button>
        </form>
      </section>
    </main>
  );
}
