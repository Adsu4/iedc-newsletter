import { useState, useRef, useEffect, useCallback, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { publishArticle, uploadCoverImage } from '../data/articleService';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState('Tech Update');
  const [categoryColor, setCategoryColor] = useState<'primary' | 'secondary' | 'tertiary'>('primary');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  
  const [showToolbar, setShowToolbar] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const [savedText, setSavedText] = useState('Just now');
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>();

  // Update "saved X ago" text
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

  // Contextual toolbar on text selection
  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0) {
        setShowToolbar(true);
      } else {
        setShowToolbar(false);
      }
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

  const handlePublish = async () => {
    if (!title.trim()) {
      alert('Please enter a title for your story before publishing.');
      return;
    }

    setIsPublishing(true);

    // Extract text paragraphs from contentEditable
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

    try {
      const published = await publishArticle({
        title: title.trim(),
        subtitle: subtitle.trim(),
        category,
        categoryColor,
        imageUrl: coverImageUrl,
        paragraphs,
        subheadings: ['Key Takeaways'],
      });

      // Redirect to published article page
      navigate(`/article/${published.id}`);
    } catch (err) {
      console.error('Publishing failed:', err);
      alert('Failed to publish article. Please check your inputs.');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <>
      {/* Header (Minimalist) */}
      <header className="flex justify-between items-center mb-12 flex-wrap gap-4 fixed top-0 right-0 left-0 md:left-20 bg-surface/90 backdrop-blur-md z-40 p-4 md:px-12 border-b border-surface-variant/30">
        <div className="flex items-center gap-4">
          <span className="text-label-bold font-label-bold text-secondary uppercase tracking-widest">Draft</span>
          <span className="text-secondary/30">•</span>
          <span className="text-label-md font-label-md text-secondary">Saved {savedText}</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-secondary hover:bg-surface-container rounded-full transition-colors flex items-center justify-center" title="Settings">
            <span className="material-symbols-outlined text-[20px]">more_horiz</span>
          </button>
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="px-6 py-2 bg-primary text-on-primary rounded-full text-label-bold font-label-bold hover:bg-surface-tint transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
          >
            {isPublishing ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                Publishing...
              </>
            ) : (
              'Publish'
            )}
          </button>
        </div>
      </header>

      {/* Editor Area */}
      <div className="max-w-3xl mx-auto mt-24 px-4 md:pr-80 lg:pr-0">
        {/* Title & Meta */}
        <div className="mb-12">
          <input
            className="w-full bg-transparent text-headline-xl font-headline-xl text-on-surface border-none focus:ring-0 p-0 placeholder:text-surface-variant mb-6"
            placeholder="Title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              handleInput();
            }}
          />
          <div className="flex flex-col gap-2">
            <input
              className="w-full bg-transparent text-headline-md font-headline-md text-secondary border-none focus:ring-0 p-0 placeholder:text-surface-variant/70 mb-4"
              placeholder="Tell your story..."
              type="text"
              value={subtitle}
              onChange={(e) => {
                setSubtitle(e.target.value);
                handleInput();
              }}
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

        {/* Cover Preview (if uploaded) */}
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

        {/* The Content Area */}
        <div className="relative group">
          <div className="absolute -left-12 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
            <button className="w-8 h-8 rounded-full border border-outline flex items-center justify-center text-secondary hover:border-secondary transition-colors bg-surface-container-lowest">
              <span className="material-symbols-outlined text-[18px]">add</span>
            </button>
          </div>
          <div ref={editorRef} className="rich-text-area prose text-body-lg font-body-lg text-on-surface min-h-[400px] focus:outline-none leading-relaxed" contentEditable suppressContentEditableWarning placeholder="Start writing..." onInput={handleInput}>
            <p className="mb-6">Here is a space where your thoughts can flow freely without distractions. Type your story paragraphs here.</p>
            <p className="mb-6">Highlight text to reveal the contextual formatting bar.</p>
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageFileChange}
      />

      {/* Sidebar for Settings */}
      <div className="fixed right-0 top-20 h-[calc(100vh-80px)] w-80 bg-surface border-l border-surface-variant transform translate-x-full md:translate-x-0 transition-transform duration-300 z-30 p-6 overflow-y-auto">
        <h3 className="text-body-md font-body-md font-semibold text-on-surface mb-8 border-b border-surface-variant/50 pb-4">Publish Details</h3>
        <div className="flex flex-col gap-8">
          {/* Cover Image Upload */}
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

          {/* Category Topic */}
          <div>
            <span className="block text-label-bold font-label-bold uppercase text-secondary mb-3">Topic</span>
            <div className="flex flex-wrap gap-2">
              {[
                { name: 'Tech Update', color: 'primary' },
                { name: 'Event', color: 'secondary' },
                { name: 'Project', color: 'tertiary' },
                { name: 'Robotics', color: 'primary' },
              ].map((t) => (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => {
                    setCategory(t.name);
                    setCategoryColor(t.color as any);
                  }}
                  className={`px-3 py-1.5 rounded-full border text-label-md font-label-md transition-colors ${
                    category === t.name
                      ? 'border-primary bg-primary text-on-primary shadow-sm'
                      : 'border-outline-variant text-secondary hover:bg-surface-container'
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* Schedule Streamlined */}
          <div>
            <span className="block text-label-bold font-label-bold uppercase text-secondary mb-3">Schedule</span>
            <div className="flex items-center gap-3 text-body-md text-on-surface cursor-pointer hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-[20px]">calendar_month</span>
              <span>Publish immediately</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
