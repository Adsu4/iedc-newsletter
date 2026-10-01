import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { submitStudentProject } from '../data/articleService';
import type { TeamMember, ProjectResource } from '../data/articles';
import { getEmbedDetails, getDirectDriveImageUrl } from '../utils/embedHelper';

export default function SubmitProject() {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [teamName, setTeamName] = useState('');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { name: '', url: '' },
  ]);

  // Confidential Contact Info (For editorial board only)
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // Media & Cover
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [resources, setResources] = useState<ProjectResource[]>([]);
  const [showDriveInfoModal, setShowDriveInfoModal] = useState(false);

  // Submission Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedArticleId, setSubmittedArticleId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Editor State & Toolbar
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    h2: false,
    h3: false,
    ul: false,
    ol: false,
    blockquote: false,
  });

  const updateActiveFormats = () => {
    setActiveFormats({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      h2: document.queryCommandValue('formatBlock') === 'h2',
      h3: document.queryCommandValue('formatBlock') === 'h3',
      ul: document.queryCommandState('insertUnorderedList'),
      ol: document.queryCommandState('insertOrderedList'),
      blockquote: document.queryCommandValue('formatBlock') === 'blockquote',
    });
  };

  const applyFormat = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    updateActiveFormats();
  };

  const toggleBlock = (tag: string) => {
    const current = document.queryCommandValue('formatBlock').toLowerCase();
    if (current === tag.toLowerCase()) {
      document.execCommand('formatBlock', false, '<p>');
    } else {
      document.execCommand('formatBlock', false, `<${tag}>`);
    }
    updateActiveFormats();
  };

  // Keyboard navigation: Enter directly jumps to next line without skipping lines
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        let node: Node | null = selection.anchorNode;
        let isList = false;
        while (node && node !== editorRef.current) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const tag = (node as HTMLElement).tagName.toLowerCase();
            if (['li', 'ul', 'ol'].includes(tag)) {
              isList = true;
              break;
            }
          }
          node = node.parentNode;
        }

        // Inside list: let browser insert next <li>
        if (isList) return;

        // Normal text: jump to next line directly
        e.preventDefault();
        document.execCommand('insertLineBreak');
        updateActiveFormats();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim()) {
      setErrorMessage('Please provide a Project Title.');
      return;
    }
    if (!subtitle.trim()) {
      setErrorMessage('Please provide a brief Project Summary or Abstract.');
      return;
    }
    if (!contactEmail.trim() || !contactPhone.trim()) {
      setErrorMessage('Please provide your contact email and phone number for editorial communication.');
      return;
    }

    const filteredMembers = teamMembers.filter((m) => m.name.trim().length > 0);
    if (filteredMembers.length === 0) {
      setErrorMessage('Please add at least one Team Member name.');
      return;
    }

    setIsSubmitting(true);
    try {
      const htmlContent = editorRef.current ? editorRef.current.innerHTML.trim() : '';

      const article = await submitStudentProject({
        title: title.trim(),
        subtitle: subtitle.trim(),
        teamName: teamName.trim() || undefined,
        teamMembers: filteredMembers,
        contactName: contactName.trim() || filteredMembers[0].name,
        contactEmail: contactEmail.trim(),
        contactPhone: contactPhone.trim(),
        imageUrl: coverImageUrl.trim(),
        html: htmlContent || undefined,
        paragraphs: htmlContent ? undefined : [subtitle.trim()],
        resources: resources.filter((r) => r.url.trim().length > 0),
      });

      setSubmittedArticleId(article.id);
    } catch (err: any) {
      console.error('Submission failed:', err);
      setErrorMessage(err.message || 'Failed to submit project. Please try again or email gectiedc@gmail.com.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success Confirmation Screen
  if (submittedArticleId) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-16 text-center flex flex-col items-center justify-center gap-6">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-800 border-4 border-on-surface shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] flex items-center justify-center">
          <span className="material-symbols-outlined text-4xl">check_circle</span>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full inline-block mx-auto border border-emerald-300">
            Submission Received
          </span>
          <h1 className="text-3xl sm:text-4xl font-headline-xl uppercase text-on-surface">
            Project Submitted for Approval!
          </h1>
          <p className="text-sm sm:text-base text-on-surface-variant max-w-lg mx-auto leading-relaxed">
            Thank you for submitting <strong>"{title}"</strong>! An email notification has been dispatched to{' '}
            <strong className="text-on-surface">gectiedc@gmail.com</strong>.
          </p>
        </div>

        <div className="bg-surface-container-high border-2 border-on-surface rounded-2xl p-5 text-left text-xs sm:text-sm text-secondary flex flex-col gap-2 max-w-md w-full shadow-[3px_3px_0px_0px_rgba(28,27,27,1)]">
          <div className="font-bold text-on-surface flex items-center gap-1.5 text-xs uppercase tracking-wide">
            <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
            <span>Next Editorial Steps</span>
          </div>
          <p>
            1. The IEDC faculty and editorial board will review your technical overview, documentation, and prototype media.
          </p>
          <p>
            2. If there are any questions, we will reach out directly to your contact number (<strong>{contactPhone}</strong>) or email (<strong>{contactEmail}</strong>).
          </p>
          <p>
            3. Once approved, your project story and live doc embeds will go live on the official <strong>Projects Showcase</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3 mt-4 flex-wrap justify-center">
          <Link
            to="/projects"
            className="bg-primary text-on-primary px-6 py-3 rounded-full text-label-bold font-label-bold uppercase text-xs border border-on-surface shadow-[3px_3px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-0.5 transition-all"
          >
            Go to Projects Showcase
          </Link>
          <button
            type="button"
            onClick={() => {
              setSubmittedArticleId(null);
              setTitle('');
              setSubtitle('');
              setTeamName('');
              setTeamMembers([{ name: '', url: '' }]);
              setResources([]);
              setCoverImageUrl('');
              if (editorRef.current) editorRef.current.innerHTML = '';
            }}
            className="bg-surface text-on-surface px-6 py-3 rounded-full text-label-bold font-label-bold uppercase text-xs border border-on-surface shadow-[3px_3px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-0.5 transition-all"
          >
            Submit Another Project
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-16">
      {/* Top Breadcrumb */}
      <div className="mb-6">
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-secondary hover:text-primary transition-colors group"
        >
          <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
          <span>Back to Projects Showcase</span>
        </Link>
      </div>

      {/* Header */}
      <div className="border-b-2 border-on-surface pb-6 mb-8 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="bg-tertiary text-on-tertiary px-3 py-0.5 rounded-full text-label-bold font-label-bold uppercase text-[11px] inline-block">
            Student Submission Portal
          </span>
          <span className="text-secondary text-xs">• Pending Editorial Approval</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-headline-xl uppercase text-on-surface leading-tight">
          Submit Your Project
        </h1>
        <p className="text-sm sm:text-base text-on-surface-variant max-w-2xl leading-relaxed">
          Feature your hardware prototype, software application, IoT system, or research paper in the official GECT IEDC Showcase. Fill in the details below for editorial review.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl border-2 border-error bg-error-container text-on-error-container text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(28,27,27,1)]">
          <span className="material-symbols-outlined text-[20px] text-error">error</span>
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {/* Section 1: Basic Information */}
        <div className="bg-surface rounded-2xl border-2 border-on-surface p-6 sm:p-8 shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] flex flex-col gap-5">
          <h2 className="text-lg font-bold font-sans uppercase text-on-surface flex items-center gap-2 border-b border-outline-variant pb-3">
            <span className="material-symbols-outlined text-primary text-xl">biotech</span>
            <span>1. Project Overview</span>
          </h2>

          {/* Project Title */}
          <div>
            <label className="block text-xs font-bold uppercase text-secondary mb-1.5">
              Project Title <span className="text-error">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Autonomous Solar Navigation Rover"
              className="w-full text-base sm:text-lg font-bold px-3.5 py-2.5 rounded-xl border-2 border-on-surface bg-surface text-on-surface focus:outline-none focus:border-primary shadow-[2px_2px_0px_0px_rgba(28,27,27,1)]"
            />
          </div>

          {/* Brief Summary */}
          <div>
            <label className="block text-xs font-bold uppercase text-secondary mb-1.5">
              Project Subtitle / Abstract <span className="text-error">*</span>
            </label>
            <textarea
              required
              rows={2}
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="A brief 1-2 sentence summary explaining what your project solves and its key technology..."
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border-2 border-on-surface bg-surface text-on-surface focus:outline-none focus:border-primary shadow-[2px_2px_0px_0px_rgba(28,27,27,1)] leading-relaxed"
            />
          </div>

          {/* Cover Photo */}
          <div>
            <label className="block text-xs font-bold uppercase text-secondary mb-1.5">
              Project Cover Image URL (Google Drive or Web Image)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(getDirectDriveImageUrl(e.target.value))}
                placeholder="Paste public Google Drive image link or direct web URL"
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border-2 border-on-surface bg-surface text-on-surface focus:outline-none focus:border-primary font-mono text-[11px] shadow-[2px_2px_0px_0px_rgba(28,27,27,1)]"
              />
              <button
                type="button"
                onClick={() => setShowDriveInfoModal(true)}
                className="w-9 h-9 rounded-xl border-2 border-on-surface bg-surface-container-high hover:bg-primary hover:text-on-primary flex items-center justify-center font-bold text-xs shadow-[2px_2px_0px_0px_rgba(28,27,27,1)] shrink-0"
                title="How to make Google Drive images public"
              >
                i
              </button>
            </div>
            {coverImageUrl && (
              <div className="mt-3 w-full aspect-[16/9] max-h-56 rounded-xl overflow-hidden border-2 border-on-surface bg-surface-container-high relative shadow-sm">
                <img src={coverImageUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setCoverImageUrl('')}
                  className="absolute top-2 right-2 bg-error text-on-error p-1.5 rounded-full shadow-md hover:scale-105 transition-transform"
                  title="Remove image"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Team Members */}
        <div className="bg-surface rounded-2xl border-2 border-on-surface p-6 sm:p-8 shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-outline-variant pb-3">
            <h2 className="text-lg font-bold font-sans uppercase text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">groups</span>
              <span>2. Team &amp; Contributors</span>
            </h2>
            <button
              type="button"
              onClick={() => setTeamMembers([...teamMembers, { name: '', url: '' }])}
              className="text-xs font-bold uppercase text-primary hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Add Member</span>
            </button>
          </div>

          {/* Team Name */}
          <div>
            <label className="block text-xs font-bold uppercase text-secondary mb-1.5">
              Team Name (Optional)
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. Team Hyperion / EEE Robotics Lab"
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface text-on-surface focus:outline-none focus:border-primary"
            />
          </div>

          {/* Dynamic Members List */}
          <div className="flex flex-col gap-3">
            <label className="block text-xs font-bold uppercase text-secondary">
              Members (Names &amp; Optional LinkedIn / GitHub Profiles) <span className="text-error">*</span>
            </label>
            {teamMembers.map((member, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-outline-variant bg-surface-container-lowest flex flex-col sm:flex-row items-start sm:items-center gap-2 shadow-xs"
              >
                <div className="flex items-center gap-2 flex-1 w-full">
                  <span className="material-symbols-outlined text-secondary text-[18px]">person</span>
                  <input
                    type="text"
                    required={idx === 0}
                    value={member.name}
                    onChange={(e) => {
                      const next = [...teamMembers];
                      next[idx].name = e.target.value;
                      setTeamMembers(next);
                    }}
                    placeholder={`Member #${idx + 1} Full Name`}
                    className="flex-1 text-xs font-bold px-2.5 py-2 rounded-lg border border-outline-variant bg-surface text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex items-center gap-2 flex-1 w-full">
                  <span className="material-symbols-outlined text-secondary text-[18px]">link</span>
                  <input
                    type="url"
                    value={member.url || ''}
                    onChange={(e) => {
                      const next = [...teamMembers];
                      next[idx].url = e.target.value;
                      setTeamMembers(next);
                    }}
                    placeholder="LinkedIn or GitHub Profile URL (Optional)"
                    className="flex-1 text-xs px-2.5 py-2 rounded-lg border border-outline-variant bg-surface text-on-surface focus:outline-none focus:border-primary font-mono text-[10px]"
                  />
                  {teamMembers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setTeamMembers(teamMembers.filter((_, i) => i !== idx))}
                      className="w-8 h-8 rounded-lg border border-outline-variant hover:border-error hover:text-error flex items-center justify-center text-secondary transition-colors shrink-0"
                      title="Remove member"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Confidential Contact Information */}
        <div className="bg-amber-50/70 rounded-2xl border-2 border-amber-600 p-6 sm:p-8 shadow-[4px_4px_0px_0px_#d97706] flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-xl">security</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold font-sans uppercase text-amber-950">
                  3. Confidential Contact Information
                </h2>
                <span className="bg-amber-200 text-amber-900 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">
                  Private &bull; Not Shared Publicly
                </span>
              </div>
              <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                Your phone number and email will <strong>never</strong> be shown on the public newsletter or project cards. This information is strictly for the IEDC faculty and editorial board to contact your team in case of questions, verification, or editorial guidance.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-2">
            <div>
              <label className="block text-xs font-bold uppercase text-amber-950 mb-1">
                Lead / Submitter Name
              </label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Your Full Name"
                className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-amber-400 bg-white text-on-surface focus:outline-none focus:border-amber-600 shadow-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-amber-950 mb-1">
                Contact Email <span className="text-error">*</span>
              </label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="your.email@gect.ac.in"
                className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-amber-400 bg-white text-on-surface focus:outline-none focus:border-amber-600 shadow-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-amber-950 mb-1">
                Contact Phone Number <span className="text-error">*</span>
              </label>
              <input
                type="tel"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-amber-400 bg-white text-on-surface focus:outline-none focus:border-amber-600 shadow-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Project Story / Technical Details */}
        <div className="bg-surface rounded-2xl border-2 border-on-surface p-6 sm:p-8 shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-outline-variant pb-3">
            <h2 className="text-lg font-bold font-sans uppercase text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">menu_book</span>
              <span>4. Project Overview &amp; Technical Breakdown</span>
            </h2>
            <span className="text-[11px] text-secondary font-medium hidden sm:inline">
              Press Enter to jump to next line
            </span>
          </div>

          {/* Formatting Toolbar */}
          <div className="p-2 rounded-xl border-2 border-on-surface bg-surface-container flex items-center flex-wrap gap-1 shadow-sm">
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); toggleBlock('p'); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                !activeFormats.h2 && !activeFormats.h3 && !activeFormats.blockquote
                  ? 'bg-on-surface text-surface'
                  : 'bg-surface text-on-surface hover:bg-surface-variant'
              }`}
            >
              Normal
            </button>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); toggleBlock('h2'); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                activeFormats.h2 ? 'bg-on-surface text-surface' : 'bg-surface text-on-surface hover:bg-surface-variant'
              }`}
            >
              H2
            </button>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); toggleBlock('h3'); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                activeFormats.h3 ? 'bg-on-surface text-surface' : 'bg-surface text-on-surface hover:bg-surface-variant'
              }`}
            >
              H3
            </button>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); toggleBlock('blockquote'); }}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                activeFormats.blockquote ? 'bg-on-surface text-surface' : 'bg-surface text-on-surface hover:bg-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">format_quote</span>
            </button>

            <div className="w-px h-5 bg-outline-variant mx-1"></div>

            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); applyFormat('bold'); }}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                activeFormats.bold ? 'bg-on-surface text-surface' : 'bg-surface text-on-surface hover:bg-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">format_bold</span>
            </button>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); applyFormat('italic'); }}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                activeFormats.italic ? 'bg-on-surface text-surface' : 'bg-surface text-on-surface hover:bg-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">format_italic</span>
            </button>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); applyFormat('insertUnorderedList'); }}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                activeFormats.ul ? 'bg-on-surface text-surface' : 'bg-surface text-on-surface hover:bg-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">format_list_bulleted</span>
            </button>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); applyFormat('insertOrderedList'); }}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                activeFormats.ol ? 'bg-on-surface text-surface' : 'bg-surface text-on-surface hover:bg-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">format_list_numbered</span>
            </button>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); applyFormat('createLink'); }}
              className="w-7 h-7 rounded-lg flex items-center justify-center bg-surface hover:bg-surface-variant text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">link</span>
            </button>
          </div>

          {/* Contenteditable writing surface */}
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onKeyDown={handleKeyDown}
            onKeyUp={updateActiveFormats}
            onMouseUp={updateActiveFormats}
            data-placeholder="Describe your project, architecture, components used, results achieved, and future scope..."
            className="rich-text-area prose text-sm sm:text-base font-body text-on-surface min-h-[300px] p-4 sm:p-6 bg-surface rounded-xl border-2 border-on-surface shadow-[3px_3px_0px_0px_rgba(28,27,27,1)] focus:outline-none focus:shadow-[5px_5px_0px_0px_rgba(28,27,27,1)] transition-all leading-relaxed"
          />
        </div>

        {/* Section 5: Project Resources & Media */}
        <div className="bg-surface rounded-2xl border-2 border-on-surface p-6 sm:p-8 shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-outline-variant pb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary text-xl">folder_open</span>
              <h2 className="text-lg font-bold font-sans uppercase text-on-surface">
                5. Resources &amp; Media (Drive Images, Videos, Docs, GitHub)
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setShowDriveInfoModal(true)}
              className="w-6 h-6 rounded-full border border-on-surface bg-surface-container-high hover:bg-primary hover:text-on-primary flex items-center justify-center font-bold text-xs"
              title="How to make Google Drive links public"
            >
              i
            </button>
          </div>

          <p className="text-xs text-secondary leading-relaxed">
            Attach Google Drive links for your project report (PDF), schematic diagrams (Images), demo walkthroughs (Videos), or GitHub code. They will be embedded into interactive viewers for readers.
          </p>

          <div className="flex flex-col gap-3">
            {resources.map((res, rIdx) => {
              const embedInfo = getEmbedDetails(res.url, res.type, res.title);
              const currentType = res.type || 'auto';

              return (
                <div key={rIdx} className="p-3.5 rounded-xl border border-outline-variant bg-surface-container-lowest flex flex-col gap-2.5 shadow-sm">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={res.title}
                      onChange={(e) => {
                        const next = [...resources];
                        next[rIdx].title = e.target.value;
                        setResources(next);
                      }}
                      placeholder="Title (e.g. Hardware Prototype Photo, Video Walkthrough, Project Report)"
                      className="flex-1 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-outline-variant bg-surface text-on-surface focus:outline-none focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setResources(resources.filter((_, i) => i !== rIdx))}
                      className="w-7 h-7 rounded-lg border border-outline-variant hover:border-error hover:text-error flex items-center justify-center text-secondary transition-colors shrink-0"
                    >
                      <span className="material-symbols-outlined text-[15px]">close</span>
                    </button>
                  </div>

                  <input
                    type="url"
                    value={res.url}
                    onChange={(e) => {
                      const next = [...resources];
                      next[rIdx].url = e.target.value;
                      setResources(next);
                    }}
                    placeholder="Paste Public Link (Google Drive, YouTube, GitHub, etc.)"
                    className="text-xs px-2.5 py-1.5 rounded-lg border border-outline-variant bg-surface text-on-surface focus:outline-none focus:border-primary font-mono text-[10px]"
                  />

                  {/* Type Selector Pills */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold uppercase text-secondary mr-1">Type:</span>
                    {[
                      { id: 'auto', label: 'Auto' },
                      { id: 'image', label: '🖼️ Image' },
                      { id: 'video', label: '🎬 Video' },
                      { id: 'doc', label: '📄 Doc / PDF' },
                      { id: 'link', label: '🔗 Link' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          const next = [...resources];
                          next[rIdx].type = t.id as any;
                          setResources(next);
                        }}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border transition-all ${
                          currentType === t.id
                            ? 'bg-primary text-on-primary border-primary shadow-xs'
                            : 'bg-surface text-secondary border-outline-variant hover:border-on-surface'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  {/* Live Previews */}
                  {res.url && (
                    <div className="flex flex-col gap-2 mt-1 pt-2 border-t border-outline-variant/50">
                      {embedInfo.isImage && (
                        <div className="rounded-lg border-2 border-on-surface bg-surface-container-high overflow-hidden flex flex-col items-center justify-center p-2 relative shadow-sm">
                          <img
                            src={embedInfo.directImageUrl || embedInfo.embedUrl}
                            alt={res.title || 'Live Preview'}
                            className="max-h-40 w-auto rounded object-contain"
                          />
                          <span className="text-[10px] font-bold text-emerald-700 mt-1 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">check_circle</span> Live Drive Image Preview
                          </span>
                        </div>
                      )}

                      {embedInfo.isVideo && (
                        <div className="rounded-lg border-2 border-on-surface bg-black overflow-hidden relative shadow-sm">
                          <div className="w-full aspect-video max-h-48">
                            <iframe
                              src={embedInfo.embedUrl}
                              title={res.title || 'Video Player'}
                              className="w-full h-full border-0"
                              allowFullScreen
                            />
                          </div>
                          <span className="text-[10px] font-bold text-purple-700 p-1 bg-surface-container-lowest block">
                            Live Video Stream Ready
                          </span>
                        </div>
                      )}

                      {embedInfo.isDoc && (
                        <div className="p-2 rounded-lg border border-outline-variant bg-surface-container-low flex items-center justify-between text-[10px]">
                          <span className="flex items-center gap-1.5 text-secondary">
                            <span className="material-symbols-outlined text-primary text-[15px]">description</span>
                            <span>Interactive &lt;iframe&gt; Document Ready</span>
                          </span>
                          <a href={res.url} target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:underline">
                            Verify link
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setResources([...resources, { title: '', url: '', type: 'auto' }])}
            className="px-4 py-2.5 bg-surface-container text-on-surface rounded-xl border border-outline-variant hover:border-on-surface text-xs font-label-bold uppercase flex items-center justify-center gap-1.5 transition-all self-start"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Add Resource / Media Link</span>
          </button>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t-2 border-on-surface">
          <div className="text-xs text-secondary leading-snug">
            By submitting, you confirm that your project is built by students and is ready for editorial review by the IEDC team.
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-primary text-on-primary px-8 py-3.5 rounded-full font-label-bold uppercase text-xs sm:text-sm border-2 border-on-surface shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(28,27,27,1)] transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                <span>Submitting for Review...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg">send</span>
                <span>Submit Project for Approval</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Google Drive Public Sharing Help Modal */}
      {showDriveInfoModal && (
        <div
          className="fixed inset-0 bg-on-surface/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4"
          onClick={() => setShowDriveInfoModal(false)}
        >
          <div
            className="bg-surface rounded-2xl border-4 border-on-surface shadow-[10px_10px_0px_0px_rgba(28,27,27,1)] p-6 sm:p-8 max-w-lg w-full flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b-2 border-on-surface pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm border border-on-surface">
                  i
                </div>
                <div>
                  <h3 className="text-base font-bold font-sans text-on-surface uppercase">
                    Make Any Drive File Public
                  </h3>
                  <span className="text-[11px] text-secondary">Images, Videos, PDFs &amp; Documents</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDriveInfoModal(false)}
                className="w-8 h-8 rounded-full border border-outline-variant hover:border-on-surface flex items-center justify-center text-secondary hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-3 text-xs sm:text-sm text-on-surface leading-relaxed">
              <p className="font-semibold text-secondary">
                Follow these exact steps so your file can be viewed publicly by the editorial board and newsletter readers:
              </p>
              <ol className="list-decimal pl-5 flex flex-col gap-2 font-medium">
                <li>
                  Open{' '}
                  <a href="https://drive.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary font-bold underline">
                    Google Drive
                  </a>{' '}
                  and locate your image, video, PDF, or document.
                </li>
                <li>Right-click the file and select <strong>Share &gt; Share</strong>.</li>
                <li>
                  Under <strong>General access</strong>, change from <em>Restricted</em> to{' '}
                  <strong className="text-primary">Anyone with the link</strong> and set role to <strong>Viewer</strong>.
                </li>
                <li>Click <strong>Copy link</strong> and then <strong>Done</strong>.</li>
                <li>Paste the link here. Our system converts it into high-speed images, video streams, or document viewers automatically!</li>
              </ol>
            </div>

            <button
              type="button"
              onClick={() => setShowDriveInfoModal(false)}
              className="w-full py-2.5 bg-primary text-on-primary rounded-xl font-label-bold uppercase text-xs border-2 border-on-surface shadow-[3px_3px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-0.5 transition-all mt-2"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
