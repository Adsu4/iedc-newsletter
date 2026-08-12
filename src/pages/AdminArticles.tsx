import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllArticlesAdmin, deleteArticle } from '../data/articleService';
import type { Article } from '../data/articles';

const statusConfig = {
  published: { label: 'Published', color: 'bg-tertiary text-on-tertiary' },
  draft: { label: 'Draft', color: 'bg-surface-container-high text-on-surface' },
  scheduled: { label: 'Scheduled', color: 'bg-secondary text-on-secondary' },
};

export default function AdminArticles() {
  const navigate = useNavigate();
  const [articlesList, setArticlesList] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);
  const [filter, setFilter] = useState<'all' | Article['status']>('all');

  const loadArticles = async () => {
    setLoading(true);
    const all = await getAllArticlesAdmin();
    setArticlesList(all);
    setLoading(false);
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteArticle(deleteTarget.id);
    setDeleteTarget(null);
    loadArticles();
  };

  const filtered = filter === 'all' ? articlesList : articlesList.filter((a) => a.status === filter);

  const counts = {
    all: articlesList.length,
    published: articlesList.filter((a) => a.status === 'published').length,
    draft: articlesList.filter((a) => a.status === 'draft').length,
    scheduled: articlesList.filter((a) => a.status === 'scheduled').length,
  };

  return (
    <div className="p-4 md:p-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
        <div>
          <h1 className="text-headline-xl font-headline-xl text-on-surface uppercase leading-none">Articles</h1>
          <p className="text-body-md text-secondary mt-2">{articlesList.length} total stories</p>
        </div>
        <Link
          to="/admin/dashboard"
          className="px-6 py-3 bg-primary text-on-primary rounded-full text-label-bold font-label-bold uppercase hover:bg-surface-tint transition-colors shadow-sm flex items-center gap-2 border-2 border-on-surface shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(28,27,27,1)]"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Article
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {(['all', 'published', 'draft', 'scheduled'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-label-bold font-label-bold uppercase text-sm transition-all border-2 ${
              filter === f
                ? 'bg-on-surface text-surface border-on-surface shadow-none'
                : 'bg-transparent text-on-surface border-outline-variant hover:border-on-surface'
            }`}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
          </button>
        ))}
      </div>

      {/* Articles List */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <span className="material-symbols-outlined text-4xl animate-spin text-primary">progress_activity</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 text-secondary">
          <span className="material-symbols-outlined text-6xl mb-4 block opacity-30">article</span>
          <p className="text-body-lg font-body-lg">No articles found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((article) => {
            const sc = statusConfig[article.status] || statusConfig.published;
            return (
              <div
                key={article.id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6 bg-surface rounded-2xl border-2 border-outline-variant hover:border-on-surface transition-all group"
              >
                {/* Thumbnail */}
                {article.imageUrl ? (
                  <div className="w-full sm:w-20 h-20 rounded-xl overflow-hidden border-2 border-on-surface shrink-0 bg-primary-fixed">
                    <img src={article.imageUrl} alt="" className="w-full h-full object-cover mix-blend-luminosity" />
                  </div>
                ) : (
                  <div className="w-full sm:w-20 h-20 rounded-xl border-2 border-outline-variant shrink-0 bg-surface-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-outline-variant">article</span>
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <span className={`${sc.color} px-2 py-0.5 rounded-full text-xs font-label-bold uppercase`}>{sc.label}</span>
                    <span className="text-label-md text-secondary">{article.category}</span>
                    <span className="text-secondary/30">•</span>
                    <span className="text-label-md text-secondary">{article.date}</span>
                    {article.status === 'scheduled' && article.scheduledFor && (
                      <>
                        <span className="text-secondary/30">•</span>
                        <span className="text-label-md text-secondary flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">schedule</span>
                          {new Date(article.scheduledFor).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </>
                    )}
                  </div>
                  <h3 className="text-body-lg font-headline-md text-on-surface truncate">{article.title}</h3>
                  <p className="text-body-md text-secondary truncate">{article.subtitle}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => navigate(`/admin/dashboard/${article.id}`)}
                    className="w-10 h-10 rounded-full border border-outline-variant hover:border-primary hover:bg-primary/5 flex items-center justify-center text-secondary hover:text-primary transition-all"
                    title="Edit"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                  <button
                    onClick={() => window.open(`/article/${article.id}`, '_blank')}
                    className="w-10 h-10 rounded-full border border-outline-variant hover:border-tertiary hover:bg-tertiary/5 flex items-center justify-center text-secondary hover:text-tertiary transition-all"
                    title="View"
                  >
                    <span className="material-symbols-outlined text-[18px]">visibility</span>
                  </button>
                  <button
                    onClick={() => setDeleteTarget(article)}
                    className="w-10 h-10 rounded-full border border-outline-variant hover:border-error hover:bg-error/5 flex items-center justify-center text-secondary hover:text-error transition-all"
                    title="Delete"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-on-surface/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setDeleteTarget(null)}>
          <div className="bg-surface rounded-2xl border-4 border-on-surface shadow-[12px_12px_0px_0px_rgba(28,27,27,1)] p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-error-container text-on-error-container rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-error">
                <span className="material-symbols-outlined text-[32px]">warning</span>
              </div>
              <h2 className="text-headline-md font-headline-md text-on-surface uppercase mb-2">Delete Article?</h2>
              <p className="text-body-md text-secondary">
                "{deleteTarget.title}" will be permanently removed. This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-6 py-3 rounded-xl border-2 border-on-surface text-on-surface font-label-bold uppercase hover:bg-surface-container transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-6 py-3 rounded-xl bg-error text-on-error font-label-bold uppercase hover:bg-error/80 transition-colors border-2 border-on-surface shadow-[4px_4px_0px_0px_rgba(28,27,27,1)]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
