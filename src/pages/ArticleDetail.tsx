import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchArticleById, getAllArticles, getLocalArticlesSync } from '../data/articleService';
import type { Article } from '../data/articles';
import { getEmbedDetails, getDirectDriveImageUrl } from '../utils/embedHelper';

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null | undefined>(() => {
    if (!id) return undefined;
    return getLocalArticlesSync().find((a) => String(a.id) === String(id));
  });
  const [recommended, setRecommended] = useState<Article[]>(() => {
    return getLocalArticlesSync().filter((a) => String(a.id) !== String(id)).slice(0, 2);
  });

  useEffect(() => {
    if (id) {
      if (id === 'latest' || id === 'test-edition' || id === 'preview') {
        getAllArticles().then((all) => {
          const isNewsletter = (a: Article) => {
            const cat = a.category?.trim().toLowerCase();
            return cat === 'monthly newsletter' || cat === 'newsletter' || cat === 'latest edition';
          };
          const newsletters = all.filter(isNewsletter).sort((a, b) => {
            const timeA = a.createdAt ? new Date(a.createdAt).getTime() : Number(a.id) || 0;
            const timeB = b.createdAt ? new Date(b.createdAt).getTime() : Number(b.id) || 0;
            return timeB - timeA;
          });
          const newsletter = newsletters[0] || all[0];
          setArticle(newsletter || null);
          setRecommended(all.filter((a) => a.id !== newsletter?.id).slice(0, 2));
        });
        return;
      }

      const immediate = getLocalArticlesSync().find((a) => String(a.id) === String(id));
      if (immediate) setArticle(immediate);

      fetchArticleById(id).then((art) => {
        setArticle(art || null);
      });
      getAllArticles().then((all) => {
        setRecommended(all.filter((a) => String(a.id) !== String(id)).slice(0, 2));
      });
    }
  }, [id]);

  if (article === null) {
    return (
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-20 text-center flex flex-col items-center justify-center gap-4">
        <span className="material-symbols-outlined text-6xl text-secondary opacity-50">article</span>
        <h1 className="text-3xl font-headline-xl uppercase text-on-surface">Story Not Found</h1>
        <p className="text-secondary max-w-md">This edition may have been moved, updated, or not published yet.</p>
        <Link
          to="/"
          className="px-6 py-3 bg-primary text-on-primary rounded-full text-label-bold font-label-bold uppercase border-2 border-on-surface shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-1 transition-all mt-4"
        >
          Return to Portal
        </Link>
      </main>
    );
  }

  if (article === undefined) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="material-symbols-outlined text-4xl animate-spin text-primary">progress_activity</span>
      </div>
    );
  }

  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share && article) {
      try {
        await navigator.share({
          title: article.title,
          text: article.subtitle || article.title,
          url: window.location.href,
        });
      } catch {
        // Fallback or user dismissed
      }
    } else {
      handleCopyLink();
    }
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = article?.title || 'IEDC GECT Innovation Chronicle';
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareTitle}\n\nRead more on IEDC Chronicle: ${currentUrl}`)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(currentUrl)}`;

  const teamMembers = article?.teamMembers || article?.content?.teamMembers;
  const teamName = article?.teamName || article?.content?.teamName;
  const resources = article?.resources || article?.content?.resources;
  const isProject = (article?.category || '').trim().toLowerCase().includes('project') || Boolean(teamMembers && teamMembers.length > 0);

  return (
    <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 relative">
      {/* Toast Notification */}
      {copied && (
        <div className="fixed bottom-6 right-6 z-50 bg-on-surface text-surface px-4 py-2.5 rounded-xl text-xs font-label-bold uppercase tracking-wider shadow-2xl flex items-center gap-2 border border-outline-variant animate-bounce-short">
          <span className="material-symbols-outlined text-[18px] text-green-400">check_circle</span>
          <span>Story link copied to clipboard!</span>
        </div>
      )}

      {/* Back to Archive Link */}
      <div className="max-w-[700px] mx-auto mb-8">
        <Link to="/" className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group">
          <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
          <span className="font-label-bold text-label-bold uppercase">Back to Archive</span>
        </Link>
      </div>

      {/* Floating Share Toolbar (Desktop) */}
      <aside className="hidden lg:flex flex-col items-center gap-2.5 fixed left-[max(20px,calc((100vw-1180px)/2-72px))] top-[30%] z-40 bg-surface/90 backdrop-blur-md p-2 rounded-2xl border-2 border-on-surface shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] transition-all">
        <span className="text-[9px] font-label-bold uppercase tracking-widest text-secondary pt-1">Share</span>
        <div className="w-5 border-t border-outline-variant/60 my-0.5" />

        {/* Copy Link */}
        <div className="relative group">
          <button
            onClick={handleCopyLink}
            title="Copy Link"
            aria-label="Copy Link"
            className="w-10 h-10 rounded-xl border border-on-surface bg-surface hover:bg-surface-container-high flex items-center justify-center text-on-surface transition-all hover:-translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(28,27,27,1)] active:translate-y-0 active:shadow-none"
          >
            <span className={`material-symbols-outlined text-[18px] transition-colors ${copied ? 'text-green-600 font-bold' : 'group-hover:text-primary'}`}>
              {copied ? 'check' : 'link'}
            </span>
          </button>
          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-on-surface text-surface text-[11px] font-medium rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-md z-50">
            {copied ? 'Copied!' : 'Copy Link'}
          </div>
        </div>

        {/* WhatsApp */}
        <div className="relative group">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Share to WhatsApp"
            aria-label="Share to WhatsApp"
            className="w-10 h-10 rounded-xl border border-on-surface bg-surface hover:bg-[#25D366]/10 hover:border-[#25D366] hover:text-[#25D366] flex items-center justify-center text-on-surface transition-all hover:-translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(28,27,27,1)] active:translate-y-0 active:shadow-none"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.074-2.122-.516-1.748-.72-2.852-2.483-2.94-2.6-.088-.115-.71-1.002-.71-1.914 0-.912.477-1.357.646-1.541.169-.184.368-.23.491-.23.123 0 .245.002.353.007.113.005.263-.043.412.316.154.37.525 1.277.57 1.37.045.093.076.201.015.323-.061.123-.092.2-.184.307-.092.107-.193.24-.275.323-.092.092-.188.192-.081.376.107.184.477.788 1.023 1.274.704.628 1.297.822 1.481.914.184.092.292.077.4-.046.108-.123.461-.538.584-.723.123-.184.246-.153.415-.092.17.061 1.076.507 1.261.6.184.092.307.138.353.215.046.077.046.446-.098.851z"/>
            </svg>
          </a>
          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-on-surface text-surface text-[11px] font-medium rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-md z-50">
            WhatsApp
          </div>
        </div>

        {/* LinkedIn */}
        <div className="relative group">
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Share to LinkedIn"
            aria-label="Share to LinkedIn"
            className="w-10 h-10 rounded-xl border border-on-surface bg-surface hover:bg-[#0077B5]/10 hover:border-[#0077B5] hover:text-[#0077B5] flex items-center justify-center text-on-surface transition-all hover:-translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(28,27,27,1)] active:translate-y-0 active:shadow-none"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
            </svg>
          </a>
          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-on-surface text-surface text-[11px] font-medium rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-md z-50">
            LinkedIn
          </div>
        </div>

        {/* X / Twitter */}
        <div className="relative group">
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Share to X"
            aria-label="Share to X"
            className="w-10 h-10 rounded-xl border border-on-surface bg-surface hover:bg-on-surface hover:text-surface flex items-center justify-center text-on-surface transition-all hover:-translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(28,27,27,1)] active:translate-y-0 active:shadow-none"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-on-surface text-surface text-[11px] font-medium rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-md z-50">
            X (Twitter)
          </div>
        </div>

        {/* Native Share */}
        {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
          <div className="relative group">
            <button
              onClick={handleNativeShare}
              title="More Share Options"
              aria-label="More Share Options"
              className="w-10 h-10 rounded-xl border border-on-surface bg-surface hover:bg-surface-container-high flex items-center justify-center text-on-surface transition-all hover:-translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(28,27,27,1)] active:translate-y-0 active:shadow-none"
            >
              <span className="material-symbols-outlined text-[18px]">share</span>
            </button>
            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-on-surface text-surface text-[11px] font-medium rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-md z-50">
              More
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Share Bar */}
      <div className="flex lg:hidden items-center justify-between gap-3 max-w-[700px] mx-auto mb-8 px-4 py-3 bg-surface-container-low rounded-xl border border-on-surface/20">
        <span className="text-xs font-label-bold uppercase text-secondary">Share story</span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className={`px-3 py-1.5 rounded-lg border border-on-surface bg-surface text-xs font-medium flex items-center gap-1.5 transition-all shadow-[1px_1px_0px_0px_rgba(28,27,27,1)] ${copied ? 'text-green-700 bg-green-50' : 'text-on-surface'}`}
          >
            <span className="material-symbols-outlined text-[15px]">{copied ? 'check' : 'link'}</span>
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on WhatsApp"
            className="w-8 h-8 rounded-lg border border-on-surface bg-surface hover:bg-[#25D366]/10 hover:text-[#25D366] text-on-surface flex items-center justify-center transition-all shadow-[1px_1px_0px_0px_rgba(28,27,27,1)]"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.074-2.122-.516-1.748-.72-2.852-2.483-2.94-2.6-.088-.115-.71-1.002-.71-1.914 0-.912.477-1.357.646-1.541.169-.184.368-.23.491-.23.123 0 .245.002.353.007.113.005.263-.043.412.316.154.37.525 1.277.57 1.37.045.093.076.201.015.323-.061.123-.092.2-.184.307-.092.107-.193.24-.275.323-.092.092-.188.192-.081.376.107.184.477.788 1.023 1.274.704.628 1.297.822 1.481.914.184.092.292.077.4-.046.108-.123.461-.538.584-.723.123-.184.246-.153.415-.092.17.061 1.076.507 1.261.6.184.092.307.138.353.215.046.077.046.446-.098.851z"/>
            </svg>
          </a>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on LinkedIn"
            className="w-8 h-8 rounded-lg border border-on-surface bg-surface hover:bg-[#0077B5]/10 hover:text-[#0077B5] text-on-surface flex items-center justify-center transition-all shadow-[1px_1px_0px_0px_rgba(28,27,27,1)]"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
            </svg>
          </a>
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on X"
            className="w-8 h-8 rounded-lg border border-on-surface bg-surface hover:bg-on-surface hover:text-surface text-on-surface flex items-center justify-center transition-all shadow-[1px_1px_0px_0px_rgba(28,27,27,1)]"
          >
            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
            <button
              onClick={handleNativeShare}
              aria-label="More share options"
              className="w-8 h-8 rounded-lg border border-on-surface bg-surface hover:bg-surface-container-high text-on-surface flex items-center justify-center transition-all shadow-[1px_1px_0px_0px_rgba(28,27,27,1)]"
            >
              <span className="material-symbols-outlined text-[16px]">share</span>
            </button>
          )}
        </div>
      </div>

      {/* Article Header */}
      <article className="max-w-[720px] mx-auto relative">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-primary font-label-bold text-xs uppercase tracking-wider">{article.category}</span>
            <span className="text-on-surface-variant font-medium">·</span>
            <span className="text-on-surface-variant text-xs font-medium">{article.date}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-sans text-on-surface mb-4 leading-tight">{article.title}</h1>
          <p className="text-sm sm:text-base font-normal text-on-surface-variant mb-6 leading-relaxed">{article.subtitle}</p>

          {/* Author or Project Team Bio Box */}
          {isProject ? (
            <div className="py-4 border-y border-outline-variant/40 mb-8 flex flex-col items-center justify-center gap-2">
              <div className="flex items-center gap-1.5 text-secondary">
                <span className="material-symbols-outlined text-[18px] text-primary">groups</span>
                <span className="text-xs font-bold uppercase tracking-wider">
                  {teamName ? `Team: ${teamName}` : 'Project Team & Contributors'}
                </span>
              </div>
              {teamMembers && teamMembers.length > 0 ? (
                <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
                  {teamMembers.map((member, mIdx) => {
                    const hasLink = member.url && member.url.trim().length > 0;
                    const isGithub = member.url?.toLowerCase().includes('github.com');
                    const isLinkedin = member.url?.toLowerCase().includes('linkedin.com');

                    if (hasLink) {
                      return (
                        <a
                          key={mIdx}
                          href={member.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={`View ${member.name}'s profile (${member.url})`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-on-surface bg-surface hover:bg-primary/10 hover:border-primary hover:text-primary transition-all text-xs font-bold text-on-surface shadow-[2px_2px_0px_0px_rgba(28,27,27,1)] active:translate-y-0 active:shadow-none group"
                        >
                          <span>{member.name}</span>
                          {isGithub ? (
                            <svg className="w-3.5 h-3.5 fill-current text-secondary group-hover:text-primary" viewBox="0 0 24 24">
                              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                            </svg>
                          ) : isLinkedin ? (
                            <svg className="w-3.5 h-3.5 fill-current text-[#0077B5]" viewBox="0 0 24 24">
                              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                            </svg>
                          ) : (
                            <span className="material-symbols-outlined text-[14px] text-secondary group-hover:text-primary">open_in_new</span>
                          )}
                        </a>
                      );
                    }

                    return (
                      <span
                        key={mIdx}
                        className="inline-flex items-center px-3 py-1.5 rounded-full border border-outline-variant bg-surface-container-low text-xs font-bold text-on-surface shadow-sm"
                      >
                        {member.name}
                      </span>
                    );
                  })}
                </div>
              ) : (
                <div className="text-xs font-bold text-on-surface">{article.author?.name || 'IEDC Project Team'}</div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3 py-4 border-y border-outline-variant/40 mb-8">
              <img className="w-11 h-11 rounded-full object-cover border border-on-surface" alt={article.author?.name} src={article.author?.avatarUrl}/>
              <div className="text-left">
                <div className="text-xs font-bold text-on-surface">{article.author?.name}</div>
                <div className="text-[11px] text-secondary">{article.author?.role}</div>
              </div>
            </div>
          )}
        </div>

        {/* Hero Image */}
        {article.imageUrl && (
          <div className="w-full aspect-[16/9] mb-8 rounded-xl overflow-hidden border-2 border-on-surface shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] relative bg-surface-container-high">
            <img className="w-full h-full object-cover img-editorial" alt={article.title} src={getDirectDriveImageUrl(article.imageUrl)}/>
          </div>
        )}

        {/* Content */}
        {article.content?.html ? (
          <div
            className="prose article-rich-content text-base md:text-lg font-body-lg text-on-surface leading-relaxed"
            dangerouslySetInnerHTML={{ __html: article.content.html }}
          />
        ) : (
          <div className="prose text-base md:text-lg font-body-lg text-on-surface leading-relaxed">
            {article.content?.paragraphs?.map((p, idx) => (
              <div key={idx}>
                {article.content?.subheadings?.[idx] && (
                  <h2 className="text-xl sm:text-2xl font-bold font-sans text-on-surface mt-8 mb-3">{article.content.subheadings[idx]}</h2>
                )}
                <p className="mb-5">{p}</p>
                {idx === 1 && article.content?.blockquote && (
                  <blockquote className="my-6 border-l-4 border-secondary bg-secondary-container/40 p-4 rounded-xl text-base sm:text-lg italic text-on-surface font-serif">{article.content.blockquote}</blockquote>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Project Resources & Embedded Docs */}
        {resources && resources.length > 0 && (
          <section className="mt-12 pt-8 border-t-2 border-on-surface flex flex-col gap-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-2xl">folder_open</span>
                <h2 className="text-xl sm:text-2xl font-bold font-sans text-on-surface">
                  Project Resources & Documents
                </h2>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface border border-outline-variant">
                {resources.length} {resources.length === 1 ? 'Resource' : 'Resources'}
              </span>
            </div>

            <div className="flex flex-col gap-6">
              {resources.map((res, rIdx) => {
                const embed = getEmbedDetails(res.url);
                return (
                  <div
                    key={rIdx}
                    className="rounded-2xl border-2 border-on-surface bg-surface-container-lowest p-4 sm:p-6 shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] flex flex-col gap-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-outline-variant/60">
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-primary text-2xl">
                          {embed.icon}
                        </span>
                        <div>
                          <h3 className="text-sm sm:text-base font-bold text-on-surface font-sans">
                            {res.title || embed.label}
                          </h3>
                          <span className="text-[11px] font-medium text-secondary">
                            {embed.label}
                          </span>
                        </div>
                      </div>
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-on-surface bg-surface text-xs font-bold text-on-surface hover:bg-primary hover:text-on-primary shadow-[2px_2px_0px_0px_rgba(28,27,27,1)] transition-all"
                      >
                        <span>Open in Tab</span>
                        <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                      </a>
                    </div>

                    {/* Interactive iframe preview for Google Drive docs, PDFs, YouTube, etc. */}
                    {embed.isEmbeddable ? (
                      <div className="w-full aspect-[16/10] sm:aspect-[16/9] md:h-[550px] rounded-xl overflow-hidden border-2 border-on-surface bg-black/5 relative shadow-inner">
                        <iframe
                          src={embed.embedUrl}
                          title={res.title || 'Document Preview'}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-surface border border-outline-variant flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="material-symbols-outlined text-secondary text-lg">link</span>
                          <span className="text-xs text-secondary font-mono truncate">{res.url}</span>
                        </div>
                        <a
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-primary hover:underline shrink-0 flex items-center gap-1"
                        >
                          <span>Visit Resource</span>
                          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </article>

      {/* Bottom Article Share Card */}
      <div className="max-w-[720px] mx-auto mt-12 p-5 sm:p-6 rounded-2xl border-2 border-on-surface bg-surface-container-low shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-sm sm:text-base text-on-surface">Share this story</h3>
          <p className="text-xs text-secondary mt-0.5">Circulate innovation insights with peers and student founders</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCopyLink}
            className={`px-3 py-1.5 rounded-lg border border-on-surface bg-surface text-xs font-bold uppercase flex items-center gap-1.5 transition-all hover:-translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(28,27,27,1)] active:translate-y-0 active:shadow-none ${copied ? 'text-green-700 bg-green-50' : 'text-on-surface'}`}
          >
            <span className="material-symbols-outlined text-[16px]">{copied ? 'check' : 'link'}</span>
            <span>{copied ? 'Copied!' : 'Copy Link'}</span>
          </button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg border border-on-surface bg-surface hover:bg-[#25D366]/10 hover:border-[#25D366] hover:text-[#25D366] text-on-surface transition-all hover:-translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(28,27,27,1)]"
            title="Share to WhatsApp"
            aria-label="Share to WhatsApp"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.074-2.122-.516-1.748-.72-2.852-2.483-2.94-2.6-.088-.115-.71-1.002-.71-1.914 0-.912.477-1.357.646-1.541.169-.184.368-.23.491-.23.123 0 .245.002.353.007.113.005.263-.043.412.316.154.37.525 1.277.57 1.37.045.093.076.201.015.323-.061.123-.092.2-.184.307-.092.107-.193.24-.275.323-.092.092-.188.192-.081.376.107.184.477.788 1.023 1.274.704.628 1.297.822 1.481.914.184.092.292.077.4-.046.108-.123.461-.538.584-.723.123-.184.246-.153.415-.092.17.061 1.076.507 1.261.6.184.092.307.138.353.215.046.077.046.446-.098.851z"/>
            </svg>
          </a>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg border border-on-surface bg-surface hover:bg-[#0077B5]/10 hover:border-[#0077B5] hover:text-[#0077B5] text-on-surface transition-all hover:-translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(28,27,27,1)]"
            title="Share to LinkedIn"
            aria-label="Share to LinkedIn"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
            </svg>
          </a>
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg border border-on-surface bg-surface hover:bg-on-surface hover:text-surface text-on-surface transition-all hover:-translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(28,27,27,1)]"
            title="Share to X"
            aria-label="Share to X"
          >
            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Recommended Articles Section */}
      <section className="max-w-4xl mx-auto w-full mt-16 border-t-2 border-on-surface pt-8">
        <h2 className="text-xl font-bold font-headline-md text-on-surface mb-6">Up Next</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommended.map((rec) => (
            <Link key={rec.id} to={`/article/${rec.id}`} className="flex flex-col gap-3 group cursor-pointer bg-surface p-4 rounded-xl border-2 border-on-surface shadow-[3px_3px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_rgba(28,27,27,1)] transition-all">
              {rec.imageUrl ? (
                <div className="w-full aspect-[16/9] rounded-lg overflow-hidden border border-on-surface bg-surface-container-high">
                  <img className="w-full h-full object-cover img-editorial group-hover:scale-105 transition-transform duration-300" alt={rec.title} src={rec.imageUrl}/>
                </div>
              ) : (
                <div className="w-full aspect-[16/9] rounded-lg overflow-hidden border border-on-surface bg-surface-container-high flex items-center justify-center p-4">
                  <span className="text-base font-bold font-sans text-center text-on-surface">{rec.title}</span>
                </div>
              )}
              <h3 className="text-base font-bold font-sans text-on-surface group-hover:text-primary transition-colors leading-snug">{rec.title}</h3>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
