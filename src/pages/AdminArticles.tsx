import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  getAllArticlesAdmin,
  getLocalArticlesAdminSync,
  deleteArticle,
  onArticlesChange,
  checkServerConnection,
  setArticleTopStoryRank,
  reorderTopStories,
} from '../data/articleService';
import type { Article } from '../data/articles';

const statusConfig = {
  published: { label: 'Published', color: 'bg-tertiary text-on-tertiary' },
  draft: { label: 'Draft', color: 'bg-surface-container-high text-on-surface' },
  scheduled: { label: 'Scheduled', color: 'bg-secondary text-on-secondary' },
};

export default function AdminArticles() {
  const navigate = useNavigate();
  const [articlesList, setArticlesList] = useState<Article[]>(() => getLocalArticlesAdminSync());
  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);
  const [filter, setFilter] = useState<'all' | Article['status'] | 'pending'>('all');
  const [serverStatus, setServerStatus] = useState<{ configured: boolean; online: boolean; statusText: string; url: string } | null>(null);
  const [showCurateModal, setShowCurateModal] = useState(false);
  const [curateOrder, setCurateOrder] = useState<string[]>([]);
  const [selectedToAdd, setSelectedToAdd] = useState<string>('');
  const [isSavingRanks, setIsSavingRanks] = useState(false);

  const loadArticles = async () => {
    const all = await getAllArticlesAdmin();
    setArticlesList(all);
    setLoading(false);
  };

  useEffect(() => {
    loadArticles();
    checkServerConnection().then(setServerStatus);
    const unsubscribe = onArticlesChange(() => {
      setArticlesList(getLocalArticlesAdminSync());
    });
    return unsubscribe;
  }, []);

  // Sync curateOrder whenever showCurateModal opens or articles change
  useEffect(() => {
    const ranked = articlesList
      .filter((a) => a.topStoryRank && a.topStoryRank > 0 && a.status === 'published')
      .sort((a, b) => (a.topStoryRank || 999) - (b.topStoryRank || 999))
      .map((a) => String(a.id));
    setCurateOrder(ranked);
  }, [articlesList, showCurateModal]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteArticle(deleteTarget.id);
    setDeleteTarget(null);
    loadArticles();
  };

  const handleQuickRank = async (articleId: string, val: string) => {
    const rank = val ? parseInt(val, 10) : null;
    await setArticleTopStoryRank(articleId, rank);
    loadArticles();
  };

  const moveRank = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= curateOrder.length) return;
    const next = [...curateOrder];
    const temp = next[index];
    next[index] = next[targetIdx];
    next[targetIdx] = temp;
    setCurateOrder(next);
  };

  const removeFromCurate = (idToRemove: string) => {
    setCurateOrder(curateOrder.filter((id) => id !== idToRemove));
  };

  const addToCurate = (idToAdd: string) => {
    if (!idToAdd || curateOrder.includes(idToAdd)) return;
    setCurateOrder([...curateOrder, idToAdd]);
  };

  const handleSaveCurate = async () => {
    setIsSavingRanks(true);
    try {
      await reorderTopStories(curateOrder);
      await loadArticles();
      setShowCurateModal(false);
    } catch (e) {
      console.error('Failed to save top stories:', e);
    } finally {
      setIsSavingRanks(false);
    }
  };

  const pendingCount = articlesList.filter((a) => a.needsApproval).length;

  const filtered = filter === 'all'
    ? articlesList
    : filter === 'pending'
    ? articlesList.filter((a) => a.needsApproval)
    : articlesList.filter((a) => a.status === filter);

  const counts = {
    all: articlesList.length,
    published: articlesList.filter((a) => a.status === 'published').length,
    draft: articlesList.filter((a) => a.status === 'draft').length,
    scheduled: articlesList.filter((a) => a.status === 'scheduled').length,
    pending: pendingCount,
  };

  const rankedStoriesCount = articlesList.filter((a) => a.topStoryRank && a.topStoryRank > 0).length;

  return (
    <div className="p-4 md:p-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
        <div>
          <h1 className="text-headline-xl font-headline-xl text-on-surface uppercase leading-none">Articles</h1>
          <p className="text-body-md text-secondary mt-2">
            {articlesList.length} total stories • {rankedStoriesCount} curated in Top Stories
            {pendingCount > 0 && ` • ${pendingCount} pending approval`}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => setShowCurateModal(true)}
            className="px-5 py-3 bg-surface text-on-surface rounded-full text-label-bold font-label-bold uppercase hover:bg-surface-container-high transition-all flex items-center gap-2 border-2 border-on-surface shadow-[3px_3px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_rgba(28,27,27,1)]"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">hotel_class</span>
            <span>Curate Top Stories ({rankedStoriesCount})</span>
          </button>
          <Link
            to="/admin/dashboard"
            className="px-6 py-3 bg-primary text-on-primary rounded-full text-label-bold font-label-bold uppercase hover:bg-surface-tint transition-colors shadow-sm flex items-center gap-2 border-2 border-on-surface shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(28,27,27,1)]"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Article
          </Link>
        </div>
      </div>

      {/* Project Submission Pending Approval Alert */}
      {pendingCount > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl border-2 border-amber-500 bg-amber-50 shadow-[4px_4px_0px_0px_#d97706] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
              <span className="material-symbols-outlined text-[22px]">inbox</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-950 font-sans">
                  {pendingCount} {pendingCount === 1 ? 'Project Submission' : 'Project Submissions'} Awaiting Approval
                </span>
                <span className="bg-amber-200 text-amber-900 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">
                  Action Required
                </span>
              </div>
              <p className="text-xs text-amber-900 mt-0.5">
                Student projects submitted through the portal need review before appearing on the public showcase.
              </p>
            </div>
          </div>
          <button
            onClick={() => setFilter('pending')}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-colors shadow-sm flex items-center gap-1.5 shrink-0"
          >
            <span>Review Submissions ({pendingCount})</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      )}

      {/* Server Connection Banner */}
      {serverStatus && (
        <div className={`p-4 rounded-xl border-2 flex items-start gap-3 text-sm mb-8 ${
          serverStatus.online
            ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
            : 'bg-amber-50 border-amber-500 text-amber-950'
        }`}>
          <span className="material-symbols-outlined text-[20px] mt-0.5 shrink-0">
            {serverStatus.online ? 'cloud_done' : 'cloud_off'}
          </span>
          <div className="flex-1">
            <div className="font-bold flex items-center justify-between flex-wrap gap-2">
              <span>{serverStatus.online ? 'Cloud Server Online (Multi-Device Active)' : 'Cloud Server Disconnected'}</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface/50 border border-outline-variant">
                {serverStatus.url ? new URL(serverStatus.url).hostname : 'No URL'}
              </span>
            </div>
            <p className="text-xs mt-1">
              {serverStatus.online
                ? 'All devices loading the website receive stories from the cloud database instantly.'
                : `${serverStatus.statusText}. New articles will only exist in this browser until the Supabase project is active.`}
            </p>
          </div>
        </div>
      )}

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

        {pendingCount > 0 && (
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-full text-label-bold font-label-bold uppercase text-sm transition-all border-2 flex items-center gap-1.5 ${
              filter === 'pending'
                ? 'bg-amber-600 text-white border-amber-600 shadow-none'
                : 'bg-amber-50 text-amber-900 border-amber-500 hover:bg-amber-100'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">pending_actions</span>
            <span>Pending Approval ({pendingCount})</span>
          </button>
        )}
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
                    {article.needsApproval && (
                      <span className="bg-amber-500 text-white px-2.5 py-0.5 rounded-full text-xs font-label-bold uppercase flex items-center gap-1 shadow-xs">
                        <span className="material-symbols-outlined text-[13px]">pending</span>
                        Needs Approval
                      </span>
                    )}
                    {article.category !== 'Project section' && article.topStoryRank && article.topStoryRank > 0 ? (
                      <span className="bg-primary text-on-primary px-2.5 py-0.5 rounded-full text-xs font-label-bold uppercase flex items-center gap-1 shadow-sm">
                        <span className="material-symbols-outlined text-[13px]">hotel_class</span>
                        #{article.topStoryRank} {article.topStoryRank === 1 ? 'Cover' : article.topStoryRank <= 3 ? 'Brief' : 'Spotlight'}
                      </span>
                    ) : null}
                    <span className="text-label-md text-secondary">{article.category}</span>
                    <span className="text-secondary/30">•</span>
                    <span className="text-label-md text-secondary">{article.date}</span>
                    {article.author?.name && (
                      <>
                        <span className="text-secondary/30">•</span>
                        <span className="text-label-md text-on-surface font-medium flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px] text-secondary">
                            {article.category === 'Project section' ? 'groups' : 'person'}
                          </span>
                          {article.author.name}
                        </span>
                      </>
                    )}
                    {article.status === 'scheduled' && article.scheduledFor && (
                      <>
                        <span className="text-secondary/30">•</span>
                        <span className="text-label-md text-secondary flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">schedule</span>
                          {new Date(article.scheduledFor).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </>
                    )}
                    {article.submitterContact && (
                      <span className="text-[11px] text-amber-900 bg-amber-100/90 border border-amber-300 px-2 py-0.5 rounded-md font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px] text-amber-700">lock</span>
                        Lead: {article.submitterContact.name || 'Student'} ({article.submitterContact.phone || article.submitterContact.email})
                      </span>
                    )}
                  </div>
                  <h3 className="text-body-lg font-headline-md text-on-surface truncate">{article.title}</h3>
                  <p className="text-body-md text-secondary truncate">{article.subtitle}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
                  {/* Quick Rank Selector (Only for non-Project articles) */}
                  {article.category !== 'Project section' && (
                    <div className="flex items-center gap-1.5 bg-surface-container-high px-2.5 py-1.5 rounded-xl border border-on-surface text-xs shadow-[2px_2px_0px_0px_rgba(28,27,27,1)]">
                      <span className="text-[11px] font-bold text-secondary uppercase hidden md:inline">Top Story:</span>
                      <select
                        value={article.topStoryRank || ''}
                        onChange={(e) => handleQuickRank(String(article.id), e.target.value)}
                        className="bg-transparent text-on-surface text-xs font-bold focus:outline-none cursor-pointer"
                        title="Set Top Story Slot"
                      >
                        <option value="">No Rank</option>
                        <option value="1">#1 Cover Story</option>
                        <option value="2">#2 Exec Brief 1</option>
                        <option value="3">#3 Exec Brief 2</option>
                        <option value="4">#4 Spotlight</option>
                        <option value="5">#5 Spotlight</option>
                        <option value="6">#6 Spotlight</option>
                        <option value="7">#7 Spotlight</option>
                        <option value="8">#8 Spotlight</option>
                      </select>
                    </div>
                  )}

                  {article.needsApproval ? (
                    <button
                      onClick={() => navigate(`/admin/article/${article.id}`)}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase transition-all shadow-[2px_2px_0px_0px_rgba(28,27,27,1)] flex items-center gap-1.5 shrink-0"
                      title="Review and approve student submission"
                    >
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                      <span>Review &amp; Approve</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate(`/admin/dashboard/${article.id}`)}
                      className="w-10 h-10 rounded-full border border-outline-variant hover:border-primary hover:bg-primary/5 flex items-center justify-center text-secondary hover:text-primary transition-all"
                      title="Edit"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                  )}
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

      {/* Curate Top Stories Modal */}
      {showCurateModal && (
        <div
          className="fixed inset-0 bg-on-surface/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={() => setShowCurateModal(false)}
        >
          <div
            className="bg-surface rounded-2xl border-4 border-on-surface shadow-[12px_12px_0px_0px_rgba(28,27,27,1)] p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b-2 border-on-surface">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-primary text-on-primary px-2.5 py-0.5 rounded-full text-xs font-label-bold uppercase flex items-center gap-1 shadow-sm">
                    <span className="material-symbols-outlined text-[14px]">hotel_class</span>
                    Editorial Ranking
                  </span>
                </div>
                <h2 className="text-headline-md font-headline-md text-on-surface uppercase">
                  Curate Top Stories
                </h2>
                <p className="text-body-md text-secondary mt-1">
                  <strong>#1</strong> is Cover Story (Home) & Top Pick (Top Stories). <strong>#2 & #3</strong> are Executive Briefs (Home). <strong>#4+</strong> are Spotlight Stories.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCurateModal(false)}
                className="w-9 h-9 rounded-full border border-outline-variant hover:border-on-surface flex items-center justify-center text-secondary hover:text-on-surface shrink-0"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Stories List */}
            <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-3 pr-1">
              {curateOrder.length === 0 ? (
                <div className="text-center py-10 text-secondary bg-surface-container/50 rounded-xl border border-dashed border-outline-variant">
                  <span className="material-symbols-outlined text-4xl mb-2 block opacity-40">hotel_class</span>
                  <p className="text-sm font-medium">No stories currently ranked.</p>
                  <p className="text-xs text-secondary mt-1">Use the dropdown below to add stories into Top Story slots.</p>
                </div>
              ) : (
                curateOrder.map((artId, idx) => {
                  const article = articlesList.find((a) => String(a.id) === artId);
                  const rank = idx + 1;
                  const slotLabel =
                    rank === 1
                      ? 'Cover Story'
                      : rank === 2
                      ? 'Exec Brief #1'
                      : rank === 3
                      ? 'Exec Brief #2'
                      : `Spotlight #${rank}`;

                  const slotBg =
                    rank === 1
                      ? 'bg-primary text-on-primary'
                      : rank <= 3
                      ? 'bg-secondary text-on-secondary'
                      : 'bg-surface-container-high text-on-surface border border-outline-variant';

                  return (
                    <div
                      key={artId}
                      className="flex items-center gap-3 p-3.5 bg-surface rounded-xl border-2 border-on-surface shadow-[3px_3px_0px_0px_rgba(28,27,27,1)]"
                    >
                      {/* Rank Tag */}
                      <div className="shrink-0 flex flex-col items-center">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-label-bold uppercase ${slotBg}`}>
                          #{rank}
                        </span>
                        <span className="text-[10px] font-bold text-secondary mt-1 text-center max-w-[70px] leading-tight">
                          {slotLabel}
                        </span>
                      </div>

                      {/* Thumbnail */}
                      {article?.imageUrl ? (
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-on-surface shrink-0 bg-surface-container">
                          <img src={article.imageUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg border border-outline-variant shrink-0 bg-surface-container flex items-center justify-center">
                          <span className="material-symbols-outlined text-[18px] text-secondary">article</span>
                        </div>
                      )}

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[11px] font-label-bold uppercase text-primary">
                            {article?.category || 'Story'}
                          </span>
                          {article?.date && (
                            <>
                              <span className="text-secondary/40 text-xs">•</span>
                              <span className="text-[11px] text-secondary">{article.date}</span>
                            </>
                          )}
                        </div>
                        <div className="text-sm font-bold font-sans text-on-surface truncate">
                          {article?.title || `Article #${artId}`}
                        </div>
                        {article?.author?.name && (
                          <div className="text-[11px] text-secondary truncate">
                            By {article.author.name}
                          </div>
                        )}
                      </div>

                      {/* Reorder Buttons */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveRank(idx, 'up')}
                          className="w-8 h-8 rounded-lg border border-outline-variant hover:border-on-surface hover:bg-surface-container disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-on-surface transition-all"
                          title="Move Up"
                        >
                          <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
                        </button>
                        <button
                          type="button"
                          disabled={idx === curateOrder.length - 1}
                          onClick={() => moveRank(idx, 'down')}
                          className="w-8 h-8 rounded-lg border border-outline-variant hover:border-on-surface hover:bg-surface-container disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-on-surface transition-all"
                          title="Move Down"
                        >
                          <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFromCurate(artId)}
                          className="w-8 h-8 rounded-lg border border-outline-variant hover:border-error hover:text-error hover:bg-error/5 flex items-center justify-center text-secondary transition-all"
                          title="Remove from Top Stories"
                        >
                          <span className="material-symbols-outlined text-[16px]">close</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Add Story Dropdown */}
              <div className="mt-2 p-3 bg-surface-container rounded-xl border border-outline-variant flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-on-surface shrink-0">Add to Slots:</span>
                <select
                  value={selectedToAdd}
                  onChange={(e) => setSelectedToAdd(e.target.value)}
                  className="flex-1 min-w-[200px] text-xs py-2 px-3 bg-surface border border-outline-variant rounded-lg text-on-surface focus:outline-none focus:border-on-surface"
                >
                  <option value="">Select a published article...</option>
                  {articlesList
                    .filter((a) => !curateOrder.includes(String(a.id)) && a.status === 'published')
                    .map((a) => (
                      <option key={a.id} value={String(a.id)}>
                        {a.title} ({a.category})
                      </option>
                    ))}
                </select>
                <button
                  type="button"
                  disabled={!selectedToAdd}
                  onClick={() => {
                    addToCurate(selectedToAdd);
                    setSelectedToAdd('');
                  }}
                  className="px-4 py-2 bg-on-surface text-surface rounded-lg text-xs font-label-bold uppercase disabled:opacity-30 disabled:pointer-events-none hover:bg-on-surface/90 transition-all flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">add</span>
                  Add Slot
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t-2 border-on-surface flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCurateModal(false)}
                className="px-5 py-2.5 rounded-xl border-2 border-on-surface text-on-surface font-label-bold uppercase text-xs hover:bg-surface-container transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSavingRanks}
                onClick={handleSaveCurate}
                className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-label-bold uppercase text-xs hover:bg-surface-tint transition-all border-2 border-on-surface shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(28,27,27,1)] flex items-center gap-2"
              >
                {isSavingRanks ? (
                  <>
                    <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                    Saving Slots...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    Save Top Stories Order
                  </>
                )}
              </button>
            </div>
          </div>
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
