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

const categoryColorMap = {
  primary: { badge: 'bg-primary text-on-primary', card: 'bg-surface-container-high' },
  secondary: { badge: 'bg-secondary text-on-secondary', card: 'bg-secondary-container' },
  tertiary: { badge: 'bg-tertiary text-on-tertiary', card: 'bg-tertiary-container' },
};

export default function Home() {
  const [articlesList, setArticlesList] = useState<Article[]>([]);
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

  // Strict non-overlapping article slicing so nothing appears twice
  const coverStory = articlesList[0];
  const executiveBriefs = articlesList.slice(1, 3);
  const moreStories = articlesList.slice(3, 7);

  const briefCardColors = [
    'bg-secondary-container',
    'bg-tertiary-container',
  ];
  const briefTextColors = [
    { num: 'text-on-surface', title: 'text-on-surface group-hover:text-primary', meta: 'text-on-surface' },
    { num: 'text-on-tertiary-container', title: 'text-on-tertiary-container group-hover:text-tertiary-fixed', meta: 'text-on-tertiary-container opacity-90' },
  ];

  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-14 flex flex-col gap-16 md:gap-24">
      {/* 1. Explicit Home Section & Portal Masthead */}
      <section id="home" className="flex flex-col gap-6 animate-fade-in-up">
        {/* Section Header */}
        <div className="flex items-center justify-between border-b-4 border-on-surface pb-4">
          <div className="flex items-center gap-3">
            <span className="bg-primary text-on-primary px-3.5 py-1 rounded-full text-label-bold font-label-bold uppercase text-xs flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(28,27,27,1)]">
              <span className="material-symbols-outlined text-[16px]">home</span>
              Home
            </span>
            <h2 className="text-display-lg-mobile md:text-headline-xl font-display-lg-mobile md:font-headline-xl text-on-surface uppercase leading-none">
              IEDC Innovation Portal
            </h2>
          </div>
          <span className="hidden sm:inline text-xs font-label-bold uppercase text-secondary">
            Govt. Engineering College Thrissur
          </span>
        </div>

        {/* Master Portal Hero Card */}
        <div className="bg-surface rounded-3xl border-4 border-on-surface p-6 sm:p-10 md:p-12 shadow-[8px_8px_0px_0px_rgba(28,27,27,1)] md:shadow-[12px_12px_0px_0px_rgba(28,27,27,1)] flex flex-col gap-8">
          {/* Top Badges */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-on-surface/15 pb-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-primary text-on-primary px-3.5 py-1 rounded-full text-xs font-label-bold uppercase border border-on-surface shadow-[2px_2px_0px_0px_rgba(28,27,27,1)]">
                {currentEditionInfo.edition}
              </span>
              <span className="bg-surface-container-high text-on-surface px-3 py-1 rounded-full text-xs font-label-bold uppercase border border-on-surface">
                {currentEditionInfo.monthYear} Edition
              </span>
              <span className="text-secondary font-label-bold uppercase text-xs hidden sm:inline">
                • Official Newsletter Dispatch
              </span>
            </div>

            <a
              href="#newsletter"
              className="bg-on-surface text-surface px-5 py-2.5 rounded-full text-label-bold font-label-bold uppercase text-xs hover:bg-primary hover:text-on-primary transition-all border-2 border-on-surface shadow-[3px_3px_0px_0px_rgba(28,27,27,1)] flex items-center gap-1.5 whitespace-nowrap ml-auto sm:ml-0"
            >
              <span>📬 Subscribe to Digest</span>
            </a>
          </div>

        {/* Hero Title and Description */}
        <div className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 bg-secondary text-on-secondary px-3.5 py-1 rounded-full text-xs font-label-bold uppercase self-start border border-on-surface shadow-[2px_2px_0px_0px_rgba(28,27,27,1)]">
            <span>Official Student Innovation Journal</span>
          </div>
          <h1 className="text-display-lg-mobile md:text-[56px] lg:text-[68px] font-display-lg font-headline-xl uppercase leading-none text-on-surface tracking-tight">
            IEDC GECT Innovation Chronicle
          </h1>
          <p className="text-body-lg md:text-xl text-on-surface-variant max-w-3xl leading-relaxed">
            Govt. Engineering College Thrissur's premier dispatch on cutting-edge student hardware prototypes, deeptech breakthroughs, verified venture funding calls, and campus maker culture.
          </p>
        </div>

        {/* Edition Theme Highlight Banner */}
        <div className="bg-tertiary-container/40 rounded-2xl p-5 md:p-6 border-2 border-on-surface flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-label-bold uppercase text-secondary">Current Monthly Theme</span>
            <div className="text-headline-md font-headline-md text-on-surface uppercase">{currentEditionInfo.theme}</div>
            <p className="text-xs text-on-surface-variant font-body-md max-w-2xl">{currentEditionInfo.summary}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <a
              href="#cover-story"
              className="bg-surface hover:bg-surface-container-high text-on-surface px-4 py-2 rounded-full text-xs font-label-bold uppercase border border-on-surface shadow-[2px_2px_0px_0px_rgba(28,27,27,1)] transition-all"
            >
              Cover Story ↓
            </a>
            <Link
              to="/projects"
              className="bg-surface hover:bg-surface-container-high text-on-surface px-4 py-2 rounded-full text-xs font-label-bold uppercase border border-on-surface shadow-[2px_2px_0px_0px_rgba(28,27,27,1)] transition-all"
            >
              Projects →
            </Link>
            <Link
              to="/opportunities"
              className="bg-surface hover:bg-surface-container-high text-on-surface px-4 py-2 rounded-full text-xs font-label-bold uppercase border border-on-surface shadow-[2px_2px_0px_0px_rgba(28,27,27,1)] transition-all"
            >
              Grants Radar →
            </Link>
          </div>
        </div>
      </div>
    </section>

      {/* 2. Editorial Lead: Cover Story & Executive Briefs (Unique - never repeated below) */}
      {coverStory && (
        <section id="cover-story" className="flex flex-col gap-8 animate-fade-in-up">
          <div className="border-b-4 border-on-surface pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="bg-primary text-on-primary px-3.5 py-1 rounded-full text-label-bold font-label-bold uppercase text-xs">
                Editorial Lead
              </span>
              <h2 className="text-display-lg-mobile md:text-headline-xl font-display-lg-mobile md:font-headline-xl text-on-surface uppercase leading-none">
                Cover Story & Key Dispatches
              </h2>
            </div>
            <Link to="/top-stories" className="hidden sm:flex items-center gap-1 text-xs font-label-bold uppercase text-primary hover:underline">
              <span>All Top Stories</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-gutter">
            {/* Primary Cover Story (Hero Card) */}
            <Link to={`/article/${coverStory.id}`} className="lg:col-span-8 flex flex-col gap-6 group cursor-pointer">
              <div className="w-full aspect-[4/3] md:aspect-[16/9] overflow-hidden rounded-2xl bg-primary border-4 border-on-surface shadow-[8px_8px_0px_0px_rgba(28,27,27,1)] relative transition-transform duration-300 group-hover:-translate-y-2 group-hover:-translate-x-2 group-hover:shadow-[16px_16px_0px_0px_rgba(28,27,27,1)]">
                <img className="w-full h-full object-cover mix-blend-luminosity opacity-90 group-hover:scale-105 transition-transform duration-500" alt={coverStory.title} src={coverStory.imageUrl}/>
                <div className="absolute top-5 right-5 bg-secondary text-on-secondary text-label-bold font-label-bold uppercase px-4 py-2 rounded-full border-2 border-on-surface shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] rotate-2">
                  ⭐ Edition Cover Story
                </div>
              </div>
              <div className="flex flex-col gap-3 max-w-3xl">
                <div className="flex items-center gap-3 text-label-bold font-label-bold text-on-surface uppercase tracking-wider text-xs">
                  <span className="bg-tertiary text-on-tertiary px-3 py-1 rounded-full">{coverStory.category}</span>
                  <span>•</span>
                  <span>{coverStory.date}</span>
                  <span>•</span>
                  <span>{coverStory.readTime}</span>
                </div>
                <h3 className="text-display-lg-mobile md:text-display-lg font-display-lg-mobile md:font-display-lg text-on-surface group-hover:text-primary transition-colors duration-300 uppercase leading-none">
                  {coverStory.title}
                </h3>
                <p className="text-body-lg font-body-lg text-on-surface-variant leading-relaxed">
                  {coverStory.subtitle}
                </p>
                <div className="flex items-center gap-3 pt-2 text-xs font-label-bold text-secondary uppercase">
                  <span>Reported by {coverStory.author.name}</span>
                  <span>•</span>
                  <span className="text-primary font-bold">Read Full Story →</span>
                </div>
              </div>
            </Link>
            
            {/* Curated Executive Briefs Sidebar */}
            <div className="lg:col-span-4 flex flex-col gap-6 lg:pl-6 lg:border-l-2 border-on-surface">
              <div className="flex items-center justify-between border-b-2 border-on-surface pb-3">
                <h3 className="text-headline-md font-headline-md text-on-surface uppercase">
                  Executive Briefs
                </h3>
                <span className="text-xs font-label-bold uppercase text-secondary">Issue #09</span>
              </div>

              <div className="flex flex-col gap-6">
                {executiveBriefs.map((article, index) => (
                  <Link
                    key={article.id}
                    to={`/article/${article.id}`}
                    className={`flex flex-col gap-3 group cursor-pointer ${briefCardColors[index] || 'bg-surface-container-high'} p-6 rounded-2xl border-4 border-on-surface shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] hover:shadow-[8px_8px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-1 transition-all`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-headline-lg font-black ${briefTextColors[index]?.num || 'text-on-surface'}`}>
                        #0{index + 2}
                      </span>
                      <span className="bg-surface text-on-surface px-2.5 py-0.5 rounded-full text-[10px] font-label-bold uppercase border border-on-surface">
                        {article.category}
                      </span>
                    </div>

                    <h4 className={`text-headline-md font-headline-md ${briefTextColors[index]?.title || 'text-on-surface group-hover:text-primary'} transition-colors leading-tight uppercase`}>
                      {article.title}
                    </h4>

                    <p className="text-body-sm text-on-surface-variant line-clamp-2 leading-relaxed">
                      {article.subtitle}
                    </p>

                    <div className={`flex items-center gap-2 text-label-bold font-label-bold ${briefTextColors[index]?.meta || 'text-on-surface'} uppercase text-xs pt-2 border-t border-on-surface/15`}>
                      <span>{article.date}</span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. Campus Innovation Impact: Numbers Ticker */}
      <NumbersTicker />

      {/* 4. Visual Digest: Month in Moments (Campus in Pictures) */}
      <MonthInMoments />

      {/* 5. Verified Grants & Funding: Opportunity Radar */}
      <OpportunityRadar />

      {/* 6. Venture & Lab Prototype: Startup Spotlight */}
      <StartupSpotlightSection />

      {/* 7. Upcoming Events Calendar: Coming Up at IEDC (Featuring the Meme Card) */}
      <ComingUpSection />

      {/* 8. More Stories from the Desk (Curated non-overlapping articles) */}
      {moreStories.length > 0 && (
        <section className="flex flex-col gap-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b-4 border-on-surface pb-6 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-tertiary text-on-tertiary px-3.5 py-1 rounded-full text-label-bold font-label-bold uppercase text-xs">
                  Dispatches & Archive
                </span>
                <span className="text-secondary font-label-bold uppercase text-xs">• Deeptech & Culture</span>
              </div>
              <h2 className="text-display-lg-mobile md:text-headline-xl font-display-lg-mobile md:font-headline-xl text-on-surface uppercase leading-none">
                More Campus Stories
              </h2>
            </div>
            <Link
              to="/archive"
              className="text-label-bold font-label-bold uppercase text-primary hover:text-on-surface transition-colors flex items-center gap-1.5 text-sm"
            >
              <span>Explore Complete Archive ({articlesList.length} stories)</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {moreStories.map((article) => {
              const colors = categoryColorMap[article.categoryColor] || categoryColorMap.primary;
              return (
                <Link
                  key={article.id}
                  to={`/article/${article.id}`}
                  className="bg-surface rounded-2xl border-4 border-on-surface p-7 shadow-[6px_6px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-1.5 hover:shadow-[12px_12px_0px_0px_rgba(28,27,27,1)] transition-all flex flex-col justify-between group cursor-pointer"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className={`${colors.badge} px-3 py-1 rounded-full text-xs font-label-bold uppercase border border-on-surface`}>
                        {article.category}
                      </span>
                      <span className="text-xs font-label-bold text-secondary uppercase">
                        {article.readTime}
                      </span>
                    </div>

                    {article.imageUrl && (
                      <div className="w-full aspect-[16/9] rounded-xl overflow-hidden border-2 border-on-surface bg-primary">
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="w-full h-full object-cover mix-blend-luminosity opacity-85 group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    <h3 className="text-headline-md font-headline-md text-on-surface group-hover:text-primary transition-colors leading-tight uppercase">
                      {article.title}
                    </h3>
                    <p className="text-body-md text-on-surface-variant line-clamp-3 leading-relaxed">
                      {article.subtitle}
                    </p>
                  </div>

                  <div className="pt-4 border-t-2 border-on-surface/10 mt-6 flex items-center justify-between text-xs font-label-bold text-secondary uppercase">
                    <span>{article.date}</span>
                    <span className="text-primary font-bold group-hover:underline flex items-center gap-1">
                      Read Article <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* 9. Interactive Newsletter Signup Engine */}
      <section ref={newsletterRef} id="newsletter" className="max-w-4xl mx-auto w-full bg-tertiary-container rounded-[2rem] p-10 sm:p-14 md:p-20 text-center border-4 border-on-surface shadow-[12px_12px_0px_0px_rgba(28,27,27,1)] animate-fade-in-up">
        <div className="inline-flex items-center gap-2 bg-on-surface text-surface px-4 py-1.5 rounded-full text-xs font-label-bold uppercase mb-6">
          <span>📬 Monthly In Your Inbox</span>
        </div>
        <h2 className="text-display-lg-mobile md:text-headline-xl font-display-lg-mobile md:font-headline-xl mb-4 text-on-tertiary-container uppercase leading-none">
          Stay Ahead with IEDC GECT
        </h2>
        <p className="text-body-lg font-body-lg text-on-tertiary-container/90 mb-10 max-w-2xl mx-auto">
          Get upcoming hackathons, verified KSUM grant deadlines, student startup breakthroughs, and workshop alerts delivered once every month. Zero spam, pure engineering signal.
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
