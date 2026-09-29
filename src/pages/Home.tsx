import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getAllArticles } from '../data/articleService';
import { subscribe } from '../data/subscriptionService';
import { currentEditionInfo } from '../data/newsletterData';
import NumbersTicker from '../components/NumbersTicker';
import ComingUpSection from '../components/ComingUpSection';
import OpportunityRadar from '../components/OpportunityRadar';
import StartupSpotlightSection from '../components/StartupSpotlightSection';
import MonthInMoments from '../components/MonthInMoments';
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
  const [subEmail, setSubEmail] = useState('');
  const [subStatus, setSubStatus] = useState<'idle' | 'sending' | 'success' | 'already_subscribed' | 'resubscribed' | 'error'>('idle');
  const newsletterRef = useRef<HTMLElement>(null);

  useEffect(() => {
    getAllArticles().then(setArticlesList);
    if (window.location.hash === '#newsletter') {
      setTimeout(() => {
        newsletterRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    }
  }, []);

  const visibleArchive = articlesList.slice(0, visibleCount);
  const hasMore = visibleCount < articlesList.length;

  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-10 md:py-16 flex flex-col gap-20 md:gap-28">
      {/* Monthly Newsletter Edition Header Ribbon */}
      <div className="bg-surface rounded-2xl border-4 border-on-surface p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(28,27,27,1)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in-up">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs font-label-bold uppercase text-secondary tracking-widest">
            <span className="bg-primary text-on-primary px-3 py-1 rounded-full">{currentEditionInfo.edition}</span>
            <span>•</span>
            <span className="text-on-surface">{currentEditionInfo.monthYear} Edition</span>
          </div>
          <h2 className="text-headline-md font-headline-md text-on-surface uppercase leading-tight mt-1">
            Theme: {currentEditionInfo.theme}
          </h2>
          <p className="text-xs text-on-surface-variant max-w-2xl font-body-md mt-1">
            {currentEditionInfo.summary}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="#newsletter"
            className="bg-on-surface text-surface px-6 py-3 rounded-full text-label-bold font-label-bold uppercase text-xs hover:bg-primary hover:text-on-primary transition-colors border-2 border-on-surface shadow-[3px_3px_0px_0px_rgba(28,27,27,1)] whitespace-nowrap"
          >
            📬 Subscribe to Monthly Digest
          </a>
        </div>
      </div>

      {/* Pillar 2: IEDC by the Numbers */}
      <NumbersTicker />

      {/* Pillar 3: Coming Up (Events & Hackathons) */}
      <ComingUpSection />

      {/* Pillar 4: Opportunity Radar (Grants & Schemes) */}
      <OpportunityRadar />

      {/* Pillar 5: Startup & Innovation Spotlight */}
      <StartupSpotlightSection />

      {/* Pillar 6: Month in Moments (Photo Collage) */}
      <MonthInMoments />

      {/* Vertical Feed: Full Archive Articles */}
      <section className="max-w-4xl mx-auto w-full flex flex-col gap-12 md:gap-16">
        <div className="flex items-center justify-between border-b-4 border-on-surface pb-6">
          <div className="flex items-center gap-3">
            <span className="bg-primary text-on-primary px-3.5 py-1 rounded-full text-label-bold font-label-bold uppercase text-xs">
              Archive
            </span>
            <h2 className="text-headline-xl font-headline-xl text-on-surface uppercase">
              All Newsletter Stories
            </h2>
          </div>
          <Link to="/archive" className="text-xs font-label-bold uppercase text-primary hover:underline">
            View Full Archive →
          </Link>
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
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setVisibleCount((c) => c + LOAD_MORE_COUNT)}
              className="bg-transparent border-4 border-on-surface text-on-surface px-12 py-4 rounded-full text-label-bold font-label-bold uppercase hover:bg-on-surface hover:text-surface transition-colors duration-200 shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] active:translate-y-1 active:shadow-none"
            >
              Load More Stories
            </button>
          </div>
        )}
      </section>

      {/* Newsletter Signup Engine */}
      <section ref={newsletterRef} id="newsletter" className="max-w-4xl mx-auto w-full bg-tertiary-container rounded-[2rem] p-12 md:p-24 text-center mt-8 border-4 border-on-surface shadow-[12px_12px_0px_0px_rgba(28,27,27,1)] animate-fade-in-up">
        <div className="inline-flex items-center gap-2 bg-on-surface text-surface px-4 py-1.5 rounded-full text-xs font-label-bold uppercase mb-6">
          <span>📬 Monthly In Your Inbox</span>
        </div>
        <h2 className="text-display-lg-mobile md:text-headline-xl font-display-lg-mobile md:font-headline-xl mb-6 text-on-tertiary-container uppercase leading-none">
          Stay Ahead with IEDC GECT
        </h2>
        <p className="text-body-lg font-body-lg text-on-tertiary-container/90 mb-12 max-w-2xl mx-auto">
          Get upcoming hackathons, verified KSUM grant deadlines, student startup breakthroughs, and workshop alerts delivered once every month.
        </p>
        
        {subStatus === 'success' ? (
          <div className="bg-surface rounded-2xl p-8 border-4 border-on-surface shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] max-w-md mx-auto animate-scale-in">
            <span className="text-4xl mb-4 block">🎉</span>
            <p className="text-headline-md font-headline-md text-on-surface uppercase mb-2">You're in!</p>
            <p className="text-body-md text-secondary mb-6">Check your inbox for upcoming edition updates and grant alerts.</p>
            <button
              onClick={() => { setSubStatus('idle'); setSubEmail(''); }}
              className="text-label-bold font-label-bold text-primary hover:text-on-surface transition-colors uppercase text-sm"
            >
              ← Subscribe another email
            </button>
          </div>
        ) : subStatus === 'resubscribed' ? (
          <div className="bg-surface rounded-2xl p-8 border-4 border-on-surface shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] max-w-md mx-auto animate-scale-in">
            <span className="text-4xl mb-4 block">🎉</span>
            <p className="text-headline-md font-headline-md text-on-surface uppercase mb-2">Welcome back!</p>
            <p className="text-body-md text-secondary mb-6">You've been re-subscribed to the newsletter.</p>
            <button
              onClick={() => { setSubStatus('idle'); setSubEmail(''); }}
              className="text-label-bold font-label-bold text-primary hover:text-on-surface transition-colors uppercase text-sm"
            >
              ← Subscribe another email
            </button>
          </div>
        ) : subStatus === 'already_subscribed' ? (
          <div className="bg-surface rounded-2xl p-8 border-4 border-on-surface shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] max-w-md mx-auto animate-scale-in">
            <span className="text-4xl mb-4 block">📬</span>
            <p className="text-headline-md font-headline-md text-on-surface uppercase mb-2">You're already subscribed!</p>
            <p className="text-body-md text-secondary mb-6">Your email is already on our active newsletter list. You'll receive all upcoming editions!</p>
            <button
              onClick={() => { setSubStatus('idle'); setSubEmail(''); }}
              className="text-label-bold font-label-bold text-primary hover:text-on-surface transition-colors uppercase text-sm"
            >
              ← Try a different email
            </button>
          </div>
        ) : (
          <>
            <form className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto" onSubmit={async (e) => {
              e.preventDefault();
              if (!subEmail.trim()) return;
              setSubStatus('sending');
              const res = await subscribe(subEmail.trim());
              if (res === 'created') {
                setSubStatus('success');
              } else if (res === 'already_subscribed' || res === 'resubscribed') {
                setSubStatus(res);
              } else {
                setSubStatus('error');
              }
            }}>
              <input 
                className="flex-1 px-8 py-5 rounded-full border-4 border-on-surface bg-surface text-body-md font-body-md focus:border-primary focus:outline-none transition-colors placeholder-on-surface/50 shadow-[4px_4px_0px_0px_rgba(28,27,27,1)]" 
                placeholder="Enter your college email" 
                type="email"
                value={subEmail}
                onChange={(e) => setSubEmail(e.target.value)}
                required
              />
              <button 
                className="bg-on-surface text-surface px-10 py-5 rounded-full text-label-bold font-label-bold uppercase hover:bg-primary hover:text-on-primary transition-colors duration-200 whitespace-nowrap shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] border-4 border-on-surface disabled:opacity-50 flex items-center justify-center gap-2" 
                type="submit"
                disabled={subStatus === 'sending'}
              >
                {subStatus === 'sending' ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                    Subscribing...
                  </>
                ) : 'Subscribe'}
              </button>
            </form>
            {subStatus === 'error' && (
              <p className="text-error font-label-bold mt-4 animate-scale-in">Something went wrong. Please try again.</p>
            )}
          </>
        )}
      </section>
    </main>
  );
}
