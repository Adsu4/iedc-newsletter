import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getAllArticles, getLocalArticlesSync, onArticlesChange } from '../data/articleService';
import { subscribe } from '../data/subscriptionService';
import { currentEditionInfo, type NewsletterEditionInfo } from '../data/newsletterData';
import { fetchCurrentEdition } from '../data/editionService';
// Archived for upcoming numbers update:
// import NumbersTicker from '../components/NumbersTicker';
import ComingUpSection from '../components/ComingUpSection';
import OpportunityRadar from '../components/OpportunityRadar';
import type { Article } from '../data/articles';

const categoryColorMap = {
  primary: { badge: 'bg-primary text-on-primary', card: 'bg-surface-container-high' },
  secondary: { badge: 'bg-secondary text-on-secondary', card: 'bg-secondary-container' },
  tertiary: { badge: 'bg-tertiary text-on-tertiary', card: 'bg-tertiary-container' },
};

function formatFullMonthYear(dateStr?: string): string {
  if (!dateStr) {
    return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }
  const monthMap: Record<string, string> = {
    jan: 'January', feb: 'February', mar: 'March', apr: 'April',
    may: 'May', jun: 'June', jul: 'July', aug: 'August',
    sep: 'September', oct: 'October', nov: 'November', dec: 'December'
  };
  const parts = dateStr.trim().split(/\s+/);
  if (parts.length === 2) {
    const key = parts[0].toLowerCase().slice(0, 3);
    if (monthMap[key]) {
      return `${monthMap[key]} ${parts[1]}`;
    }
  }
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) {
    return parsed.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }
  return dateStr;
}

export default function Home() {
  const [articlesList, setArticlesList] = useState<Article[]>(() => getLocalArticlesSync());
  const [editionInfo, setEditionInfo] = useState<NewsletterEditionInfo>(currentEditionInfo);
  const [subEmail, setSubEmail] = useState('');
  const [subStatus, setSubStatus] = useState<'idle' | 'sending' | 'success' | 'already_subscribed' | 'resubscribed' | 'error'>('idle');
  const newsletterRef = useRef<HTMLElement>(null);

  useEffect(() => {
    getAllArticles().then(setArticlesList);
    fetchCurrentEdition().then(setEditionInfo);

    const unsubscribe = onArticlesChange(() => {
      setArticlesList(getLocalArticlesSync());
    });

    if (window.location.hash === '#newsletter') {
      setTimeout(() => {
        newsletterRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    }

    return unsubscribe;
  }, []);

  // Helper to identify Monthly Newsletter articles
  const isMonthlyNewsletter = (a?: Article | null): boolean => {
    if (!a || !a.category) return false;
    const cat = a.category.trim().toLowerCase();
    return cat === 'monthly newsletter' || cat === 'newsletter' || cat === 'latest edition';
  };

  // STRICT: Only articles with 'Monthly Newsletter' tag, sorted by newest first
  const monthlyNewsletters = articlesList
    .filter(isMonthlyNewsletter)
    .sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : Number(a.id) || 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : Number(b.id) || 0;
      return timeB - timeA;
    });

  // The latest published Monthly Newsletter edition (null if none published yet)
  const latestMonthlyNewsletter = monthlyNewsletters[0] || null;

  // TOP STORIES RESOLUTION (#1, #2, #3...):
  // #1 Story: If admin explicitly assigned rank 1, that is Cover Story.
  // Otherwise, default to latestMonthlyNewsletter, or articlesList[0].
  const rankedStory1 = articlesList.find((a) => a.topStoryRank === 1);
  const coverStory = rankedStory1 || latestMonthlyNewsletter || articlesList[0] || null;

  // Executive Briefs (#02, #03): Prioritize explicit rank 2 and rank 3
  const rankedStory2 = articlesList.find((a) => a.topStoryRank === 2 && a.id !== coverStory?.id);
  const rankedStory3 = articlesList.find((a) => a.topStoryRank === 3 && a.id !== coverStory?.id && a.id !== rankedStory2?.id);

  // Pool of remaining stories
  const remainingStories = articlesList.filter(
    (a) => a.id !== coverStory?.id && a.id !== rankedStory2?.id && a.id !== rankedStory3?.id
  );

  const executiveBriefs: Article[] = [];
  if (rankedStory2) executiveBriefs.push(rankedStory2);
  if (rankedStory3) executiveBriefs.push(rankedStory3);

  // Fill any empty brief slots from remaining stories
  while (executiveBriefs.length < 2 && remainingStories.length > 0) {
    const nextStory = remainingStories.shift();
    if (nextStory) executiveBriefs.push(nextStory);
  }

  const moreStories = remainingStories.slice(0, 4);

  // Dynamic Month & Edition resolution (Zero hardcoding)
  const activeMonthYear = formatFullMonthYear(latestMonthlyNewsletter?.date || coverStory?.date || editionInfo?.monthYear);
  const activeEdition = editionInfo?.edition && editionInfo.edition !== 'Vol. 32'
    ? editionInfo.edition
    : `Vol. ${monthlyNewsletters.length > 0 ? monthlyNewsletters.length : 1}`;

  // STRICT REQUIREMENT: Only the latest article tagged with 'Monthly Newsletter' appears in this headline slot!
  const heroEditionTitle = latestMonthlyNewsletter
    ? latestMonthlyNewsletter.title
    : (editionInfo?.theme || 'Campus Innovation & Tech Dispatch');
  const heroEditionSummary = latestMonthlyNewsletter
    ? latestMonthlyNewsletter.subtitle
    : (editionInfo?.summary || "Govt. Engineering College Thrissur's official monthly report on student projects, grants, and startup breakthroughs.");

  const briefCardColors = [
    'bg-secondary-container',
    'bg-tertiary-container',
  ];
  const briefTextColors = [
    { num: 'text-on-surface', title: 'text-on-surface group-hover:text-primary', meta: 'text-on-surface' },
    { num: 'text-on-tertiary-container', title: 'text-on-tertiary-container group-hover:text-tertiary-fixed', meta: 'text-on-tertiary-container opacity-90' },
  ];

  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-6 md:py-10 flex flex-col gap-12 md:gap-16">
      {/* 1. Home Section & Portal Masthead */}
      <section id="home" className="flex flex-col gap-4 animate-fade-in-up">
        {/* Section Header */}
        <div className="flex items-center justify-between border-b-2 border-on-surface pb-3">
          <div className="flex items-center gap-2.5">
            <span className="bg-primary text-on-primary px-3 py-0.5 rounded-full text-label-bold font-label-bold uppercase text-[11px] flex items-center gap-1 shadow-[1px_1px_0px_0px_rgba(28,27,27,1)]">
              <span className="material-symbols-outlined text-[14px]">home</span>
              Home
            </span>
            <span className="hidden sm:inline text-xs font-medium text-secondary">
              Govt. Engineering College Thrissur
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-surface-container-high text-on-surface px-2.5 py-0.5 rounded-full text-[11px] font-medium border border-on-surface">
              {activeMonthYear}
            </span>
          </div>
        </div>

        {/* Master Portal Hero Card */}
        <div className="bg-surface rounded-2xl border-2 border-on-surface p-6 sm:p-8 md:p-10 shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] flex flex-col gap-5">
          {/* Top Row: Edition & Action */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-on-surface/15 pb-4">
            <div className="flex items-center gap-2">
              <span className="bg-primary text-on-primary px-3 py-0.5 rounded-full text-[11px] font-label-bold uppercase border border-on-surface shadow-[1px_1px_0px_0px_rgba(28,27,27,1)]">
                {activeEdition}
              </span>
              <span className="text-secondary font-medium text-xs">
                Official Newsletter Dispatch
              </span>
            </div>

            <a
              href="#newsletter"
              className="bg-on-surface text-surface px-4 py-2 rounded-full text-label-bold font-label-bold uppercase text-xs hover:bg-primary hover:text-on-primary transition-all border border-on-surface shadow-[2px_2px_0px_0px_rgba(28,27,27,1)] flex items-center gap-1.5 whitespace-nowrap ml-auto sm:ml-0"
            >
              <span>📬 Subscribe to Digest</span>
            </a>
          </div>

          {/* Hero Title and Description */}
          <div className="flex flex-col gap-2.5">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-headline-xl uppercase leading-tight text-on-surface tracking-tight">
              IEDC GECT Innovation Chronicle
            </h1>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-3xl leading-relaxed">
              Govt. Engineering College Thrissur's premier dispatch on cutting-edge student hardware prototypes, deeptech breakthroughs, verified venture funding calls, and campus maker culture.
            </p>
          </div>

          {/* Edition Theme Highlight Banner */}
          <div className="bg-tertiary-container/30 rounded-xl p-4 sm:p-5 border border-on-surface flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] font-label-bold uppercase text-secondary">
                {latestMonthlyNewsletter ? 'Monthly Edition Headline' : 'Current Monthly Theme'}
              </span>
              <div className="text-lg sm:text-xl font-bold font-sans text-on-surface">
                {heroEditionTitle}
              </div>
              <p className="text-xs text-on-surface-variant max-w-2xl leading-relaxed">
                {heroEditionSummary}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {latestMonthlyNewsletter ? (
                <Link
                  to={`/article/${latestMonthlyNewsletter.id}`}
                  className="bg-primary text-on-primary hover:opacity-90 px-3.5 py-1.5 rounded-full text-xs font-label-bold uppercase border border-on-surface shadow-[1px_1px_0px_0px_rgba(28,27,27,1)] transition-all flex items-center gap-1"
                >
                  <span>Read Edition →</span>
                </Link>
              ) : (
                <Link
                  to="/archive"
                  className="bg-primary text-on-primary hover:opacity-90 px-3.5 py-1.5 rounded-full text-xs font-label-bold uppercase border border-on-surface shadow-[1px_1px_0px_0px_rgba(28,27,27,1)] transition-all flex items-center gap-1"
                >
                  <span>Explore Archive →</span>
                </Link>
              )}
              <a
                href="#cover-story"
                className="bg-surface hover:bg-surface-container-high text-on-surface px-3.5 py-1.5 rounded-full text-xs font-medium border border-on-surface shadow-[1px_1px_0px_0px_rgba(28,27,27,1)] transition-all"
              >
                Cover Story ↓
              </a>
              <Link
                to="/projects"
                className="bg-surface hover:bg-surface-container-high text-on-surface px-3.5 py-1.5 rounded-full text-xs font-medium border border-on-surface shadow-[1px_1px_0px_0px_rgba(28,27,27,1)] transition-all"
              >
                Projects →
              </Link>
              <Link
                to="/opportunities"
                className="bg-surface hover:bg-surface-container-high text-on-surface px-3.5 py-1.5 rounded-full text-xs font-medium border border-on-surface shadow-[1px_1px_0px_0px_rgba(28,27,27,1)] transition-all"
              >
                Grants Radar →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Editorial Lead: Cover Story & Executive Briefs (Unique - never repeated below) */}
      {coverStory && (
        <section id="cover-story" className="flex flex-col gap-6 animate-fade-in-up">
          <div className="border-b-2 border-on-surface pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="bg-primary text-on-primary px-3 py-0.5 rounded-full text-label-bold font-label-bold uppercase text-[11px]">
                Editorial Lead
              </span>
              <h2 className="text-2xl md:text-3xl font-bold font-headline-md text-on-surface leading-tight">
                Cover Story & Key Dispatches
              </h2>
            </div>
            <Link to="/top-stories" className="hidden sm:flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              <span>All Top Stories</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Primary Cover Story (Hero Card) */}
            <Link to={`/article/${coverStory.id}`} className="lg:col-span-8 flex flex-col gap-4 group cursor-pointer">
              <div className="w-full aspect-[4/3] md:aspect-[16/9] overflow-hidden rounded-xl bg-surface-container-high border-2 border-on-surface shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] relative transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[6px_6px_0px_0px_rgba(28,27,27,1)]">
                <img className="w-full h-full object-cover img-editorial group-hover:scale-105 transition-transform duration-500" alt={coverStory.title} src={coverStory.imageUrl} />
                <div className="absolute top-4 right-4 bg-secondary text-on-secondary text-xs font-label-bold uppercase px-3 py-1 rounded-full border border-on-surface shadow-[2px_2px_0px_0px_rgba(28,27,27,1)]">
                  ⭐ Edition Cover Story
                </div>
              </div>
              <div className="flex flex-col gap-2.5 max-w-3xl">
                <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant">
                  <span className="bg-tertiary text-on-tertiary px-2.5 py-0.5 rounded-full font-label-bold uppercase text-[10px]">{coverStory.category}</span>
                  <span>•</span>
                  <span>{coverStory.date}</span>
                  <span>•</span>
                  <span>{coverStory.readTime}</span>
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold font-sans text-on-surface group-hover:text-primary transition-colors duration-200 leading-snug">
                  {coverStory.title}
                </h3>
                <p className="text-sm md:text-base font-normal text-on-surface-variant leading-relaxed">
                  {coverStory.subtitle}
                </p>
                <div className="flex items-center gap-2 pt-1 text-xs text-secondary font-medium">
                  <span>Reported by {coverStory.author.name}</span>
                  <span>•</span>
                  <span className="text-primary font-bold group-hover:underline">Read full story →</span>
                </div>
              </div>
            </Link>

            {/* Curated Executive Briefs Sidebar */}
            <div className="lg:col-span-4 flex flex-col gap-4 lg:pl-6 lg:border-l border-on-surface/20">
              <div className="flex items-center justify-between border-b border-on-surface/20 pb-2">
                <h3 className="text-lg font-bold font-headline-md text-on-surface">
                  Executive Briefs
                </h3>
                <span className="text-xs font-medium text-secondary">Curated</span>
              </div>

              <div className="flex flex-col gap-4">
                {executiveBriefs.map((article, index) => (
                  <Link
                    key={article.id}
                    to={`/article/${article.id}`}
                    className={`flex flex-col gap-2.5 group cursor-pointer ${briefCardColors[index] || 'bg-surface-container-high'} p-4 sm:p-5 rounded-xl border-2 border-on-surface shadow-[3px_3px_0px_0px_rgba(28,27,27,1)] hover:shadow-[5px_5px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-0.5 transition-all`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-base font-bold ${briefTextColors[index]?.num || 'text-on-surface'}`}>
                        #0{index + 2}
                      </span>
                      <span className="bg-surface text-on-surface px-2 py-0.5 rounded-full text-[10px] font-label-bold uppercase border border-on-surface">
                        {article.category}
                      </span>
                    </div>

                    <h4 className={`text-base sm:text-lg font-bold font-sans ${briefTextColors[index]?.title || 'text-on-surface group-hover:text-primary'} transition-colors leading-snug`}>
                      {article.title}
                    </h4>

                    <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                      {article.subtitle}
                    </p>

                    <div className={`flex items-center gap-2 ${briefTextColors[index]?.meta || 'text-on-surface-variant'} text-[11px] pt-1.5 border-t border-on-surface/10`}>
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

      {/* 3. Campus Innovation Impact: Numbers Ticker (Archived temporarily for upcoming data update) */}
      {/* <NumbersTicker /> */}

      {/* 4. Verified Grants & Funding: Opportunity Radar */}
      <OpportunityRadar />

      {/* 6. Upcoming Events Calendar: Coming Up at IEDC (Featuring the Meme Card) */}
      <ComingUpSection />

      {/* 7. More Stories from the Desk (Curated non-overlapping articles) */}
      {moreStories.length > 0 && (
        <section className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b-2 border-on-surface pb-3 gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-tertiary text-on-tertiary px-3 py-0.5 rounded-full text-label-bold font-label-bold uppercase text-[11px]">
                  Dispatches
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold font-headline-md text-on-surface leading-tight">
                More Stories
              </h2>
            </div>
            <Link
              to="/archive"
              className="text-xs font-medium text-primary hover:text-on-surface transition-colors flex items-center gap-1"
            >
              <span>Explore complete archive ({articlesList.length} stories)</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {moreStories.map((article) => {
              const colors = categoryColorMap[article.categoryColor] || categoryColorMap.primary;
              return (
                <Link
                  key={article.id}
                  to={`/article/${article.id}`}
                  className="bg-surface rounded-xl border-2 border-on-surface p-5 sm:p-6 shadow-[3px_3px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-1 hover:shadow-[5px_5px_0px_0px_rgba(28,27,27,1)] transition-all flex flex-col justify-between group cursor-pointer"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className={`${colors.badge} px-2.5 py-0.5 rounded-full text-[10px] font-label-bold uppercase border border-on-surface`}>
                        {article.category}
                      </span>
                      <span className="text-xs font-medium text-secondary">
                        {article.readTime}
                      </span>
                    </div>

                    {article.imageUrl && (
                      <div className="w-full aspect-[16/9] rounded-lg overflow-hidden border border-on-surface bg-surface-container-high">
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="w-full h-full object-cover img-editorial group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    <h3 className="text-lg md:text-xl font-bold font-sans text-on-surface group-hover:text-primary transition-colors leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-on-surface-variant line-clamp-2 leading-relaxed">
                      {article.subtitle}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-on-surface/10 mt-4 flex items-center justify-between text-xs text-secondary font-medium">
                    <span>{article.date}</span>
                    <span className="text-primary font-bold group-hover:underline flex items-center gap-1">
                      Read article <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* 8. Interactive Newsletter Signup Engine */}
      <section ref={newsletterRef} id="newsletter" className="max-w-3xl mx-auto w-full bg-tertiary-container/30 rounded-2xl p-6 sm:p-8 md:p-10 text-center border-2 border-on-surface shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] animate-fade-in-up">
        <div className="inline-flex items-center gap-1.5 bg-on-surface text-surface px-3 py-1 rounded-full text-[11px] font-label-bold uppercase mb-4">
          <span>📬 Monthly In Your Inbox</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold font-headline-md mb-2 text-on-surface leading-tight">
          Stay Ahead with IEDC GECT
        </h2>
        <p className="text-sm md:text-base text-on-surface-variant mb-6 max-w-xl mx-auto leading-relaxed">
          Get upcoming hackathons, verified KSUM grant deadlines, student startup breakthroughs, and workshop alerts delivered once every month. Zero spam, pure engineering signal.
        </p>

        {subStatus === 'success' ? (
          <div className="bg-surface rounded-xl p-6 border-2 border-on-surface shadow-[3px_3px_0px_0px_rgba(28,27,27,1)] max-w-md mx-auto animate-scale-in">
            <span className="text-3xl mb-2 block">🎉</span>
            <p className="text-lg font-bold font-sans text-on-surface mb-1">You're in!</p>
            <p className="text-xs text-secondary mb-4">Check your inbox for upcoming edition updates and grant alerts.</p>
            <button
              onClick={() => { setSubStatus('idle'); setSubEmail(''); }}
              className="text-xs font-semibold text-primary hover:text-on-surface transition-colors uppercase"
            >
              ← Subscribe another email
            </button>
          </div>
        ) : subStatus === 'resubscribed' ? (
          <div className="bg-surface rounded-xl p-6 border-2 border-on-surface shadow-[3px_3px_0px_0px_rgba(28,27,27,1)] max-w-md mx-auto animate-scale-in">
            <span className="text-3xl mb-2 block">🎉</span>
            <p className="text-lg font-bold font-sans text-on-surface mb-1">Welcome back!</p>
            <p className="text-xs text-secondary mb-4">You've been re-subscribed to the newsletter.</p>
            <button
              onClick={() => { setSubStatus('idle'); setSubEmail(''); }}
              className="text-xs font-semibold text-primary hover:text-on-surface transition-colors uppercase"
            >
              ← Subscribe another email
            </button>
          </div>
        ) : subStatus === 'already_subscribed' ? (
          <div className="bg-surface rounded-xl p-6 border-2 border-on-surface shadow-[3px_3px_0px_0px_rgba(28,27,27,1)] max-w-md mx-auto animate-scale-in">
            <span className="text-3xl mb-2 block">📬</span>
            <p className="text-lg font-bold font-sans text-on-surface mb-1">You're already subscribed!</p>
            <p className="text-xs text-secondary mb-4">Your email is already on our active newsletter list. You'll receive all upcoming editions!</p>
            <button
              onClick={() => { setSubStatus('idle'); setSubEmail(''); }}
              className="text-xs font-semibold text-primary hover:text-on-surface transition-colors uppercase"
            >
              ← Try a different email
            </button>
          </div>
        ) : (
          <>
            <form className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto" onSubmit={async (e) => {
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
                className="flex-1 px-5 py-3 rounded-full border-2 border-on-surface bg-surface text-sm font-sans focus:border-primary focus:outline-none transition-colors placeholder-on-surface/50 shadow-[2px_2px_0px_0px_rgba(28,27,27,1)]"
                placeholder="Enter your college email"
                type="email"
                value={subEmail}
                onChange={(e) => setSubEmail(e.target.value)}
                required
              />
              <button
                className="bg-on-surface text-surface px-6 py-3 rounded-full text-label-bold font-label-bold uppercase text-xs hover:bg-primary hover:text-on-primary transition-colors duration-200 whitespace-nowrap shadow-[2px_2px_0px_0px_rgba(28,27,27,1)] border-2 border-on-surface disabled:opacity-50 flex items-center justify-center gap-2"
                type="submit"
                disabled={subStatus === 'sending'}
              >
                {subStatus === 'sending' ? (
                  <>
                    <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                    Subscribing...
                  </>
                ) : 'Subscribe'}
              </button>
            </form>
            {subStatus === 'error' && (
              <p className="text-error font-medium text-xs mt-3 animate-scale-in">Something went wrong. Please try again.</p>
            )}
          </>
        )}
      </section>
    </main>
  );
}
