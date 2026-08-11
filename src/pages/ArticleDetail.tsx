import { useState, useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { fetchArticleById, getAllArticles } from '../data/articleService';
import type { Article } from '../data/articles';

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null | undefined>(undefined);
  const [recommended, setRecommended] = useState<Article[]>([]);

  useEffect(() => {
    if (id) {
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
      <article className="max-w-[700px] mx-auto relative">
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-primary font-label-bold text-label-bold uppercase tracking-widest">{article.category}</span>
            <span className="text-on-surface-variant font-label-bold text-label-bold">·</span>
            <span className="text-on-surface-variant font-label-bold text-label-bold">{article.date?.toUpperCase()}</span>
          </div>
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-6 uppercase">{article.title}</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-10">{article.subtitle}</p>

          {/* Author Bio Box */}
          <div className="flex items-center justify-center gap-4 py-6 border-y border-outline-variant mb-12">
            <img className="w-14 h-14 rounded-full object-cover border-2 border-on-surface" alt={article.author?.name} src={article.author?.avatarUrl}/>
            <div className="text-left">
              <div className="font-label-bold text-label-bold text-on-surface uppercase">{article.author?.name}</div>
              <div className="text-sm font-body-md text-on-surface-variant">{article.author?.role}</div>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        {article.imageUrl && (
          <div className="w-full aspect-[16/9] mb-12 rounded-2xl overflow-hidden border-4 border-on-surface shadow-[8px_8px_0px_0px_rgba(28,27,27,1)] relative bg-primary-fixed">
            <img className="w-full h-full object-cover mix-blend-luminosity opacity-90" alt={article.title} src={article.imageUrl}/>
          </div>
        )}

        {/* Content */}
        <div className="prose text-body-lg font-body-lg text-on-surface leading-relaxed">
          {article.content?.paragraphs?.map((p, idx) => (
            <div key={idx}>
              {article.content?.subheadings?.[idx] && (
                <h2>{article.content.subheadings[idx]}</h2>
              )}
              <p className="mb-6">{p}</p>
              {idx === 1 && article.content?.blockquote && (
                <blockquote>{article.content.blockquote}</blockquote>
              )}
            </div>
          ))}
        </div>
      </article>

      {/* Recommended Articles Section */}
      <section className="max-w-4xl mx-auto w-full mt-24 border-t-2 border-on-surface pt-12">
        <h2 className="text-headline-md font-headline-md text-on-surface uppercase mb-8">Up Next</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {recommended.map((rec) => (
            <Link key={rec.id} to={`/article/${rec.id}`} className="flex flex-col gap-4 group cursor-pointer">
              {rec.imageUrl ? (
                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden border-4 border-on-surface shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] group-hover:-translate-y-1 group-hover:-translate-x-1 group-hover:shadow-[8px_8px_0px_0px_rgba(28,27,27,1)] transition-all bg-secondary">
                  <img className="w-full h-full object-cover mix-blend-luminosity opacity-80" alt={rec.title} src={rec.imageUrl}/>
                </div>
              ) : (
                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden border-4 border-on-surface shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] group-hover:-translate-y-1 group-hover:-translate-x-1 group-hover:shadow-[8px_8px_0px_0px_rgba(28,27,27,1)] transition-all bg-surface-container-high flex items-center justify-center p-8">
                  <span className="text-headline-md font-headline-md uppercase text-center text-on-surface">{rec.title}</span>
                </div>
              )}
              <h3 className="text-body-lg font-headline-md text-on-surface group-hover:text-primary transition-colors leading-tight uppercase">{rec.title}</h3>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
