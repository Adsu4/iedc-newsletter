import { useState, useRef, useEffect, useCallback, type ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  publishArticle,
  updateArticle,
  uploadCoverImage,
  fetchArticleByIdAdmin,
  checkServerConnection,
} from '../data/articleService';
import { broadcastNewsletter, sendTestNewsletterEmail } from '../data/subscriptionService';
import { generateNewsletterEmailHtml } from '../data/emailTemplateService';
import type { Article } from '../data/articles';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { articleId } = useParams<{ articleId: string }>();
  const isEditMode = Boolean(articleId);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState('Monthly Newsletter');
  const [categoryColor, setCategoryColor] = useState<Article['categoryColor']>('primary');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState<Article['status']>('published');
  const [scheduledFor, setScheduledFor] = useState('');
  const [initialParagraphs, setInitialParagraphs] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(!isEditMode);
  const [serverStatus, setServerStatus] = useState<{ configured: boolean; online: boolean; statusText: string; url: string } | null>(null);

  // Email Newsletter broadcast states
  const [sendEmailToSubscribers, setSendEmailToSubscribers] = useState(true);
  const [showEmailPreviewModal, setShowEmailPreviewModal] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testSendResult, setTestSendResult] = useState<string | null>(null);

  const [showToolbar, setShowToolbar] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const [savedText, setSavedText] = useState('Just now');
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check live cloud server connection
  useEffect(() => {
    checkServerConnection().then(setServerStatus);
  }, []);

  // Load existing article in edit mode
  useEffect(() => {
    if (!articleId) return;
    fetchArticleByIdAdmin(articleId).then((art) => {
      if (art) {
        setTitle(art.title);
        setSubtitle(art.subtitle);
        setCategory(art.category);
        setCategoryColor(art.categoryColor);
        setCoverImageUrl(art.imageUrl);
        setPublishStatus(art.status);
        setScheduledFor(art.scheduledFor || '');
        setInitialParagraphs(art.content?.paragraphs || []);
      }
      setLoaded(true);
    });
  }, [articleId]);

  // Populate contentEditable after component mounts
  useEffect(() => {
    if (loaded && initialParagraphs.length > 0 && editorRef.current) {
      editorRef.current.innerHTML = initialParagraphs.map((p) => `<p class="mb-6">${p}</p>`).join('');
    }
  }, [loaded, initialParagraphs]);

  // Auto-save timer display
  useEffect(() => {
    const interval = setInterval(() => {
      const diff = Math.floor((Date.now() - lastSaved.getTime()) / 1000);
      if (diff < 5) setSavedText('Just now');
      else if (diff < 60) setSavedText(`${diff}s ago`);
      else if (diff < 3600) setSavedText(`${Math.floor(diff / 60)} min ago`);
      else setSavedText(`${Math.floor(diff / 3600)}h ago`);
    }, 10000);
    return () => clearInterval(interval);
  }, [lastSaved]);

  const handleInput = useCallback(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      setLastSaved(new Date());
      setSavedText('Just now');
    }, 1500);
  }, []);

  // Contextual toolbar
  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      setShowToolbar(!!selection && selection.toString().length > 0);
    };
    const handleMouseDown = (e: MouseEvent) => {
      if (editorRef.current && !editorRef.current.contains(e.target as Node)) {
        const toolbar = document.querySelector('.context-menu');
        if (toolbar && !toolbar.contains(e.target as Node)) {
          setShowToolbar(false);
        }
      }
    };
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousedown', handleMouseDown);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  const handleImageFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadCoverImage(file);
      setCoverImageUrl(url);
    } catch (err) {
      console.error('Failed to upload image:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const extractParagraphs = (): string[] => {
    const paragraphs: string[] = [];
    if (editorRef.current) {
      const pElements = editorRef.current.querySelectorAll('p');
      pElements.forEach((p) => {
        const text = p.innerText.trim();
        if (text) paragraphs.push(text);
      });
      if (paragraphs.length === 0 && editorRef.current.innerText.trim()) {
        paragraphs.push(editorRef.current.innerText.trim());
      }
    }
    return paragraphs;
  };

  const handlePublish = async () => {
    if (!title.trim()) {
      alert('Please enter a title for your story before publishing.');
      return;
    }

    setIsPublishing(true);
    const paragraphs = extractParagraphs();
    const payload = {
      title: title.trim(),
      subtitle: subtitle.trim(),
      category,
      categoryColor,
      imageUrl: coverImageUrl,
      paragraphs,
      subheadings: ['Key Takeaways'],
      status: publishStatus,
      scheduledFor: publishStatus === 'scheduled' ? scheduledFor : undefined,
    };

    try {
      if (isEditMode && articleId) {
        await updateArticle(articleId, payload);
        let emailMsg = '';
        if (category === 'Monthly Newsletter' && publishStatus === 'published' && sendEmailToSubscribers) {
          try {
            await broadcastNewsletter({
              id: articleId,
              title: payload.title,
              subtitle: payload.subtitle,
              category: payload.category,
              imageUrl: payload.imageUrl,
              content: { paragraphs: payload.paragraphs },
            });
            emailMsg = '\n\n📧 Newsletter broadcast sent to all active subscribers in your Google Sheet!';
          } catch (e) {
            console.error('Email broadcast failed:', e);
            emailMsg = '\n\n⚠️ Story updated, but email broadcast to Google Sheet failed.';
          }
        }
        alert(`Story updated on cloud server! Changes are live across all devices.${emailMsg}`);
        navigate('/admin/articles');
      } else {
        const published = await publishArticle(payload);
        let emailMsg = '';
        if (category === 'Monthly Newsletter' && publishStatus === 'published' && sendEmailToSubscribers) {
          try {
            await broadcastNewsletter(published);
            emailMsg = '\n\n📧 Newsletter broadcast sent to all active subscribers in your Google Sheet!';
          } catch (e) {
            console.error('Email broadcast failed:', e);
            emailMsg = '\n\n⚠️ Story published, but email broadcast to Google Sheet failed.';
          }
        }
        alert(`Story published to cloud server! It is now live across all devices.${emailMsg}`);
        if (publishStatus === 'published') {
          navigate(`/article/${published.id}`);
        } else {
          navigate('/admin/articles');
        }
      }
    } catch (err: any) {
      console.error('Publishing failed on cloud server:', err);
      alert(`⚠️ Cloud Server Warning: ${err.message || err}\n\nThe story was saved locally in this browser, but could not be sent to the cloud database. It will NOT be visible on other devices until your Supabase project is active.`);
      navigate('/admin/articles');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!title.trim()) {
      alert('Please enter a title before saving.');
      return;
    }
    setIsPublishing(true);
    const paragraphs = extractParagraphs();
    const payload = {
      title: title.trim(),
      subtitle: subtitle.trim(),
      category,
      categoryColor,
      imageUrl: coverImageUrl,
      paragraphs,
      subheadings: ['Key Takeaways'],
      status: 'draft' as const,
    };

    try {
      if (isEditMode && articleId) {
        await updateArticle(articleId, payload);
      } else {
        await publishArticle(payload);
      }
      navigate('/admin/articles');
    } catch (err) {
      console.error('Save draft failed:', err);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSendTestEmail = async () => {
    if (!testEmailAddress.trim() || !testEmailAddress.includes('@')) {
      alert('Please enter a valid email address to send the test email to.');
      return;
    }
    setIsSendingTest(true);
    setTestSendResult(null);
    const paragraphs = extractParagraphs();
    const testArticle = {
      id: articleId || 'test-edition',
      title: title.trim() || 'Untitled Monthly Edition',
      subtitle: subtitle.trim() || 'Official Innovation & Startup Report from GECT',
      category,
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      readTime: '3 min read',
      imageUrl: coverImageUrl,
      content: { paragraphs },
    };

    const success = await sendTestNewsletterEmail(testEmailAddress, testArticle);
    setIsSendingTest(false);
    if (success) {
      setTestSendResult(`✅ Preview email dispatched to ${testEmailAddress}! Check your inbox in 10-30 seconds.`);
    } else {
      setTestSendResult('❌ Failed to send preview email. Verify your Google Sheet Webhook URL.');
    }
  };

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="material-symbols-outlined text-4xl animate-spin text-primary">progress_activity</span>
      </div>
    );
  }

  const publishLabel = isEditMode ? 'Update' : publishStatus === 'scheduled' ? 'Schedule' : 'Publish';

  return (
    <>
      {/* Header */}
      <header className="flex justify-between items-center mb-12 flex-wrap gap-4 fixed top-0 right-0 left-0 md:left-20 bg-surface/90 backdrop-blur-md z-40 p-4 md:px-12 border-b border-surface-variant/30">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/articles')} className="text-secondary hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <span className="text-label-bold font-label-bold text-secondary uppercase tracking-widest">
            {isEditMode ? 'Editing' : 'Draft'}
          </span>
          <span className="text-secondary/30">•</span>
          <span className="text-label-md font-label-md text-secondary">Saved {savedText}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveDraft}
            disabled={isPublishing}
            className="px-4 py-2 border-2 border-outline-variant text-secondary rounded-full text-label-bold font-label-bold hover:border-on-surface hover:text-on-surface transition-colors disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="px-6 py-2 bg-primary text-on-primary rounded-full text-label-bold font-label-bold hover:bg-surface-tint transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
          >
            {isPublishing ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                Saving...
              </>
            ) : (
              publishLabel
            )}
          </button>
        </div>
      </header>

      {/* Editor Area */}
      <div className="max-w-3xl mx-auto mt-24 px-4 md:pr-80 lg:pr-0">
        {/* Server Connection Banner */}
        {serverStatus && (
          <div className={`p-4 rounded-xl border-2 flex items-start gap-3 text-sm mb-6 ${
            serverStatus.online
              ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
              : 'bg-amber-50 border-amber-500 text-amber-950'
          }`}>
            <span className="material-symbols-outlined text-[20px] mt-0.5 shrink-0">
              {serverStatus.online ? 'cloud_done' : 'cloud_off'}
            </span>
            <div className="flex-1">
              <div className="font-bold flex items-center justify-between flex-wrap gap-2">
                <span>{serverStatus.online ? 'Cloud Database Connected (Multi-device live)' : 'Cloud Server Disconnected'}</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface/50 border border-outline-variant">
                  {serverStatus.url ? new URL(serverStatus.url).hostname : 'No URL'}
                </span>
              </div>
              <p className="text-xs mt-1">
                {serverStatus.online
                  ? 'All published stories will immediately be stored in the cloud database and visible across all visitor devices.'
                  : `${serverStatus.statusText}. Stories published now will only save to your current browser and will NOT show on other devices. Restore your Supabase project to enable multi-device sync.`}
              </p>
            </div>
          </div>
        )}

        <div className="mb-12">
          <input
            className="w-full bg-transparent text-headline-xl font-headline-xl text-on-surface border-none focus:ring-0 p-0 placeholder:text-surface-variant mb-6"
            placeholder="Title"
            type="text"
            value={title}
            onChange={(e) => { setTitle(e.target.value); handleInput(); }}
          />
          <div className="flex flex-col gap-2">
            <input
              className="w-full bg-transparent text-headline-md font-headline-md text-secondary border-none focus:ring-0 p-0 placeholder:text-surface-variant/70 mb-4"
              placeholder="Tell your story..."
              type="text"
              value={subtitle}
              onChange={(e) => { setSubtitle(e.target.value); handleInput(); }}
            />
            <div className="flex items-center gap-4 text-secondary pt-4 border-t border-surface-variant/30">
              <span className="text-label-bold font-label-bold uppercase">By Admin User</span>
              <span className="text-secondary/30">•</span>
              <span className="text-label-bold font-label-bold uppercase">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        {/* Cover Preview */}
        {coverImageUrl && (
          <div className="mb-8 relative group rounded-2xl overflow-hidden border-4 border-on-surface shadow-[8px_8px_0px_0px_rgba(28,27,27,1)] max-h-[350px]">
            <img src={coverImageUrl} alt="Cover Preview" className="w-full h-full object-cover mix-blend-luminosity opacity-90" />
            <button
              onClick={() => setCoverImageUrl('')}
              className="absolute top-4 right-4 bg-error text-on-error p-2 rounded-full shadow-md hover:scale-105 transition-transform"
              title="Remove Cover Image"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        )}

        {/* Contextual Toolbar */}
        <div className={`context-menu ${showToolbar ? 'active' : ''} fixed top-32 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface rounded-lg shadow-xl flex items-center p-1 gap-1 z-50`}>
          <button className="w-8 h-8 flex items-center justify-center hover:bg-surface-variant/20 rounded text-inverse-on-surface transition-colors"><span className="material-symbols-outlined text-[18px]">format_bold</span></button>
          <button className="w-8 h-8 flex items-center justify-center hover:bg-surface-variant/20 rounded text-inverse-on-surface transition-colors"><span className="material-symbols-outlined text-[18px]">format_italic</span></button>
          <div className="w-px h-5 bg-inverse-on-surface/30 mx-1"></div>
          <button className="w-8 h-8 flex items-center justify-center hover:bg-surface-variant/20 rounded text-inverse-on-surface transition-colors"><span className="material-symbols-outlined text-[18px]">format_h2</span></button>
          <button className="w-8 h-8 flex items-center justify-center hover:bg-surface-variant/20 rounded text-inverse-on-surface transition-colors"><span className="material-symbols-outlined text-[18px]">format_quote</span></button>
          <div className="w-px h-5 bg-inverse-on-surface/30 mx-1"></div>
          <button className="w-8 h-8 flex items-center justify-center hover:bg-surface-variant/20 rounded text-inverse-on-surface transition-colors"><span className="material-symbols-outlined text-[18px]">link</span></button>
        </div>

        {/* Content Area */}
        <div className="relative group">
          <div className="absolute -left-12 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
            <button className="w-8 h-8 rounded-full border border-outline flex items-center justify-center text-secondary hover:border-secondary transition-colors bg-surface-container-lowest">
              <span className="material-symbols-outlined text-[18px]">add</span>
            </button>
          </div>
          <div ref={editorRef} className="rich-text-area prose text-body-lg font-body-lg text-on-surface min-h-[400px] focus:outline-none leading-relaxed" contentEditable suppressContentEditableWarning data-placeholder="Start writing..." onInput={handleInput}>
            {!isEditMode && (
              <>
                <p className="mb-6">Start writing your story here...</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageFileChange} />

      {/* Sidebar */}
      <div className="fixed right-0 top-20 h-[calc(100vh-80px)] w-80 bg-surface border-l border-surface-variant transform translate-x-full md:translate-x-0 transition-transform duration-300 z-30 p-6 overflow-y-auto">
        <h3 className="text-body-md font-body-md font-semibold text-on-surface mb-8 border-b border-surface-variant/50 pb-4">Publish Details</h3>
        <div className="flex flex-col gap-8">
          {/* Cover Image */}
          <div>
            <span className="block text-label-bold font-label-bold uppercase text-secondary mb-3">Cover Image</span>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border border-dashed border-outline-variant rounded-lg h-32 flex flex-col items-center justify-center gap-2 hover:bg-surface-container/50 transition-colors cursor-pointer group bg-surface-container-lowest"
            >
              <span className="material-symbols-outlined text-outline-variant group-hover:text-secondary transition-colors text-2xl">
                {isUploading ? 'progress_activity' : 'add_photo_alternate'}
              </span>
              <span className="text-label-bold font-label-bold uppercase text-secondary group-hover:text-on-surface transition-colors">
                {isUploading ? 'Uploading...' : coverImageUrl ? 'Change cover' : 'Add cover'}
              </span>
            </div>
          </div>

          {/* Topic */}
          <div>
            <span className="block text-label-bold font-label-bold uppercase text-secondary mb-3">Topic / Tag</span>
            <div className="flex flex-wrap gap-2">
              {[
                { name: 'Monthly Newsletter', label: '⭐ Monthly Newsletter', color: 'primary' as const },
                { name: 'Tech Update', label: 'Tech Update', color: 'secondary' as const },
                { name: 'Event', label: 'Event', color: 'secondary' as const },
                { name: 'Project', label: 'Project', color: 'tertiary' as const },
                { name: 'Robotics', label: 'Robotics', color: 'primary' as const },
                { name: 'Alumni', label: 'Alumni', color: 'tertiary' as const },
              ].map((t) => (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => { setCategory(t.name); setCategoryColor(t.color); }}
                  className={`px-3 py-1.5 rounded-full border text-label-md font-label-md transition-all ${
                    category === t.name
                      ? 'border-primary bg-primary text-on-primary shadow-sm font-bold scale-105'
                      : 'border-outline-variant text-secondary hover:bg-surface-container'
                  }`}
                >
                  {t.label || t.name}
                </button>
              ))}
            </div>
            {category === 'Monthly Newsletter' && (
              <p className="text-[11px] text-primary font-medium mt-2.5 bg-primary/10 p-2.5 rounded-xl border border-primary/20 leading-relaxed">
                ⭐ <strong>Official Newsletter Tag:</strong> Publishing with this tag will feature this article as the active monthly edition and lead cover story across the home page.
              </p>
            )}
          </div>

          {/* Email Broadcast Section (Active for Monthly Newsletter) */}
          {category === 'Monthly Newsletter' && (
            <div className="p-4 rounded-xl border-2 border-primary/30 bg-primary/5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-label-bold font-label-bold uppercase text-primary text-xs flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">forward_to_inbox</span>
                  Subscriber Broadcast
                </span>
                <span className="text-[10px] bg-primary text-on-primary px-2 py-0.5 rounded-full font-bold uppercase">
                  Google Sheet
                </span>
              </div>

              <label className="flex items-start gap-2.5 text-xs text-on-surface cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={sendEmailToSubscribers}
                  onChange={(e) => setSendEmailToSubscribers(e.target.checked)}
                  className="mt-0.5 rounded border-outline-variant text-primary focus:ring-primary accent-primary"
                />
                <span className="leading-snug">
                  <strong>Send HTML email</strong> to all active subscribers in Google Sheet upon publishing.
                </span>
              </label>

              <div className="flex flex-col gap-2 pt-2 border-t border-primary/20">
                <button
                  type="button"
                  onClick={() => {
                    setTestSendResult(null);
                    setShowEmailPreviewModal(true);
                  }}
                  className="w-full py-2 px-3 bg-surface border-2 border-primary text-primary hover:bg-primary hover:text-on-primary rounded-lg text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(194,94,55,1)] hover:shadow-none"
                >
                  <span className="material-symbols-outlined text-[16px]">visibility</span>
                  Preview Email & Send Test
                </button>
                <p className="text-[10px] text-secondary leading-tight">
                  Styled with GECT banner, Read More button, and Unsubscribe link.
                </p>
              </div>
            </div>
          )}

          {/* Schedule */}
          <div>
            <span className="block text-label-bold font-label-bold uppercase text-secondary mb-3">Schedule</span>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 text-body-md text-on-surface cursor-pointer hover:text-primary transition-colors">
                <input
                  type="radio"
                  name="publishTime"
                  checked={publishStatus === 'published'}
                  onChange={() => { setPublishStatus('published'); setScheduledFor(''); }}
                  className="accent-primary"
                />
                <span className="material-symbols-outlined text-[20px]">send</span>
                Publish immediately
              </label>
              <label className="flex items-center gap-3 text-body-md text-on-surface cursor-pointer hover:text-primary transition-colors">
                <input
                  type="radio"
                  name="publishTime"
                  checked={publishStatus === 'scheduled'}
                  onChange={() => setPublishStatus('scheduled')}
                  className="accent-primary"
                />
                <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                Schedule for later
              </label>
              {publishStatus === 'scheduled' && (
                <input
                  type="datetime-local"
                  value={scheduledFor}
                  onChange={(e) => setScheduledFor(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  className="mt-2 px-4 py-3 rounded-xl border-2 border-outline-variant bg-surface-container-lowest text-body-md focus:border-primary focus:outline-none transition-colors"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Email Preview & Test Send Modal */}
      {showEmailPreviewModal && (
        <div
          className="fixed inset-0 bg-on-surface/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 md:p-6"
          onClick={() => setShowEmailPreviewModal(false)}
        >
          <div
            className="bg-surface rounded-2xl border-4 border-on-surface shadow-[10px_10px_0px_0px_rgba(28,27,27,1)] max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 md:p-6 border-b-2 border-on-surface bg-surface-container flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-primary text-on-primary rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">mail</span>
                </span>
                <div>
                  <h3 className="font-bold text-base uppercase text-on-surface leading-tight">
                    HTML Newsletter Email Preview
                  </h3>
                  <p className="text-xs text-secondary">
                    Exact formatting delivered to subscribers with Read More and Unsubscribe buttons
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowEmailPreviewModal(false)}
                className="w-8 h-8 rounded-full border border-on-surface flex items-center justify-center text-on-surface hover:bg-on-surface hover:text-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Test Send Bar */}
            <div className="px-4 md:px-6 py-3 bg-surface-container-high border-b border-outline-variant flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
              <div className="flex-1 flex items-center gap-2">
                <span className="font-bold text-on-surface whitespace-nowrap">Send Test Preview:</span>
                <input
                  type="email"
                  placeholder="admin@iedc.ac.in"
                  value={testEmailAddress}
                  onChange={(e) => setTestEmailAddress(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-on-surface bg-surface text-xs focus:outline-none focus:border-primary"
                />
              </div>
              <button
                type="button"
                onClick={handleSendTestEmail}
                disabled={isSendingTest}
                className="px-4 py-1.5 bg-primary text-on-primary font-bold uppercase rounded-lg border border-on-surface hover:bg-surface-tint transition-all disabled:opacity-50 flex items-center justify-center gap-1 shrink-0"
              >
                {isSendingTest ? (
                  <>
                    <span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span>
                    Sending...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[14px]">send</span>
                    Send Test Email
                  </>
                )}
              </button>
            </div>

            {testSendResult && (
              <div className="px-6 py-2 text-xs font-medium border-b border-outline-variant bg-surface">
                {testSendResult}
              </div>
            )}

            {/* Preview Iframe */}
            <div className="flex-1 overflow-y-auto p-4 bg-[#F6F4ED] min-h-[420px]">
              <iframe
                title="Email Preview"
                srcDoc={generateNewsletterEmailHtml({
                  id: articleId || 'preview',
                  title: title.trim() || 'Untitled Monthly Edition',
                  subtitle: subtitle.trim() || 'Innovation & Entrepreneurship Development Centre monthly report',
                  category: category || 'Monthly Newsletter',
                  date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
                  readTime: '3 min read',
                  imageUrl: coverImageUrl,
                  paragraphs: extractParagraphs(),
                  articleUrl: `https://iedc-newsletter.vercel.app/article/${articleId || 'preview'}`,
                  unsubscribeUrl: 'https://iedc-newsletter.vercel.app/unsubscribe?email=test@example.com',
                })}
                className="w-full h-full min-h-[480px] border-none rounded-xl bg-transparent"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t-2 border-on-surface bg-surface flex justify-between items-center text-xs">
              <span className="text-secondary">
                Subscribers list fetched from your connected Google Sheet.
              </span>
              <button
                onClick={() => setShowEmailPreviewModal(false)}
                className="px-5 py-2 bg-on-surface text-surface rounded-full font-bold uppercase hover:bg-primary hover:text-on-primary transition-colors border border-on-surface"
              >
                Done Previewing
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
