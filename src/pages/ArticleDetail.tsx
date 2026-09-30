import { useState, useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { fetchArticleById, getAllArticles, getLocalArticlesSync } from '../data/articleService';
import type { Article } from '../data/articles';

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
    return <Navigate to="/" replace />;
  }

  if (article === undefined) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="material-symbols-outlined text-4xl animate-spin text-primary">progress_activity</span>
      </div>
    );
  }

  return (
    <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 relative">
      {/* Back to Archive Link */}
      <div className="max-w-[700px] mx-auto mb-8">
        <Link to="/" className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group">
          <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
          <span className="font-label-bold text-label-bold uppercase">Back to Archive</span>
        </Link>
      </div>

      {/* Floating Action Bar */}
      <aside className="hidden lg:flex flex-col items-center gap-6 fixed left-[max(24px,calc((100vw-1280px)/2+24px))] top-[30%] z-40 floating-actions">
        <div className="flex flex-col items-center gap-2">
          <button className="w-12 h-12 rounded-full border-2 border-on-surface bg-surface hover:bg-surface-container-high flex items-center justify-center text-on-surface transition-all hover:-translate-y-1 group shadow-[2px_2px_0px_0px_#1c1b1b]">
            <span className="material-symbols-outlined text-[24px] group-hover:text-primary transition-colors">sign_language</span>
          </button>
          <span className="text-sm font-label-bold text-on-surface-variant">1.2K</span>
        </div>
        <div className="w-8 border-t-2 border-outline-variant my-2"></div>
        <button className="w-12 h-12 rounded-full border-2 border-on-surface bg-surface hover:bg-surface-container-high flex items-center justify-center text-on-surface transition-all hover:-translate-y-1 shadow-[2px_2px_0px_0px_#1c1b1b]">
          <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
        </button>
        <button className="w-12 h-12 rounded-full border-2 border-on-surface bg-surface hover:bg-surface-container-high flex items-center justify-center text-on-surface transition-all hover:-translate-y-1 shadow-[2px_2px_0px_0px_#1c1b1b]">
          <span className="material-symbols-outlined text-[20px]">bookmark</span>
        </button>
        <button className="w-12 h-12 rounded-full border-2 border-on-surface bg-surface hover:bg-surface-container-high flex items-center justify-center text-on-surface transition-all hover:-translate-y-1 shadow-[2px_2px_0px_0px_#1c1b1b]">
          <span className="material-symbols-outlined text-[20px]">ios_share</span>
        </button>
      </aside>

      {/* Mobile Action Bar */}
      <div className="flex lg:hidden items-center justify-center gap-4 max-w-[700px] mx-auto mb-8 py-4 border-y border-outline-variant">
        <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-on-surface bg-surface hover:bg-surface-container-high text-on-surface transition-all text-sm font-label-bold">
          <span className="material-symbols-outlined text-[18px]">sign_language</span>
          1.2K
        </button>
        <button className="w-10 h-10 rounded-full border border-on-surface bg-surface hover:bg-surface-container-high flex items-center justify-center text-on-surface transition-all">
          <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
        </button>
        <button className="w-10 h-10 rounded-full border border-on-surface bg-surface hover:bg-surface-container-high flex items-center justify-center text-on-surface transition-all">
          <span className="material-symbols-outlined text-[18px]">bookmark</span>
        </button>
        <button className="w-10 h-10 rounded-full border border-on-surface bg-surface hover:bg-surface-container-high flex items-center justify-center text-on-surface transition-all">
          <span className="material-symbols-outlined text-[18px]">ios_share</span>
        </button>
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

          {/* Author Bio Box */}
          <div className="flex items-center justify-center gap-3 py-4 border-y border-outline-variant/40 mb-8">
            <img className="w-11 h-11 rounded-full object-cover border border-on-surface" alt={article.author?.name} src={article.author?.avatarUrl}/>
            <div className="text-left">
              <div className="text-xs font-bold text-on-surface">{article.author?.name}</div>
              <div className="text-[11px] text-secondary">{article.author?.role}</div>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        {article.imageUrl && (
          <div className="w-full aspect-[16/9] mb-8 rounded-xl overflow-hidden border-2 border-on-surface shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] relative bg-surface-container-high">
            <img className="w-full h-full object-cover img-editorial" alt={article.title} src={article.imageUrl}/>
          </div>
        )}

        {/* Content */}
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
      </article>

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
