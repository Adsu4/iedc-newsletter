import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllArticles, getLocalArticlesSync } from '../data/articleService';
import type { Article } from '../data/articles';
import { getDirectDriveImageUrl, getEmbedDetails } from '../utils/embedHelper';

function isProjectArticle(a: Article): boolean {
  const cat = (a.category || '').trim().toLowerCase();
  return (
    cat === 'project section' ||
    cat === 'project' ||
    cat.includes('project') ||
    Boolean(a.teamMembers && a.teamMembers.length > 0)
  );
}

export default function Projects() {
  const [copied, setCopied] = useState(false);
  const [projects, setProjects] = useState<Article[]>(() => {
    return getLocalArticlesSync().filter(isProjectArticle);
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllArticles().then((all) => {
      const filtered = all.filter(isProjectArticle).sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : Number(a.id) || 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : Number(b.id) || 0;
        return timeB - timeA;
      });
      setProjects(filtered);
      setLoading(false);
    });
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('gectiedc@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mailtoUrl =
    'mailto:gectiedc@gmail.com?subject=Project%20Submission%20-%20IEDC%20Student%20Labs&body=Hi%20IEDC%20Team%2C%0A%0AI%20would%20like%20to%20submit%20our%20project%20for%20the%20IEDC%20Newsletter%20Showcase.%0A%0AProject%20Title%3A%20%0ATeam%20Name%3A%20%0ATeam%20Members%20(with%20LinkedIn%2FGitHub)%3A%20%0AProject%20Summary%3A%20%0APublic%20Document%20%2F%20Drive%20Link%3A%20%0AGitHub%20%2F%20Demo%20Link%3A%20%0AContact%20Phone%3A%20%0A%0AThank%20you!';

  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-14 flex flex-col gap-8 md:gap-10">
      {/* Header */}
      <div className="border-b-2 border-on-surface pb-5 flex flex-col md:flex-row justify-between items-start md:items-end gap-5">
        <div>
          <span className="bg-tertiary text-on-tertiary px-3 py-0.5 rounded-full text-label-bold font-label-bold uppercase text-[11px] mb-2 inline-block">
            Student Labs &amp; R&amp;D
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-headline-xl uppercase text-on-surface leading-tight">
            Projects Showcase
          </h1>
          <p className="text-sm sm:text-base text-on-surface-variant max-w-2xl mt-2 leading-relaxed">
            Explore cutting-edge hardware prototypes, SaaS applications, and IoT systems built by student innovators at Govt. Engineering College Thrissur.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            to="/submit-project"
            className="bg-primary text-on-primary px-5 py-2.5 rounded-full text-label-bold font-label-bold uppercase text-xs border border-on-surface shadow-[2px_2px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] transition-all shrink-0 flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">edit_document</span>
            <span>Write &amp; Submit Project</span>
          </Link>
        </div>
      </div>

      {/* Submission Guidance Callout Banner */}
      <div className="bg-surface-container-high rounded-xl border-2 border-on-surface p-5 sm:p-6 shadow-[3px_3px_0px_0px_rgba(28,27,27,1)] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
        <div className="flex flex-col gap-1.5 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-medium text-secondary">
            <span className="bg-secondary text-on-secondary px-2.5 py-0.5 rounded-full text-[10px] font-label-bold uppercase">Call for Submissions</span>
            <span>• Open for all engineering departments</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold font-sans text-on-surface leading-tight">
            How to Submit Your Project
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            Built an innovative hardware prototype, software application, or research model? Submit directly through our online project submission form for review by the IEDC team, or email{' '}
            <strong className="text-on-surface font-semibold underline">gectiedc@gmail.com</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <Link
            to="/submit-project"
            className="bg-primary text-on-primary px-5 py-2.5 rounded-full text-label-bold font-label-bold uppercase text-xs hover:bg-primary/90 transition-colors border border-on-surface shadow-[2px_2px_0px_0px_rgba(28,27,27,1)] flex items-center justify-center gap-1.5 whitespace-nowrap flex-1 sm:flex-initial"
          >
            <span className="material-symbols-outlined text-[16px]">edit_document</span>
            <span>Write &amp; Submit Online</span>
          </Link>
          <a
            href={mailtoUrl}
            className="bg-surface text-on-surface px-4 py-2.5 rounded-full text-label-bold font-label-bold uppercase text-xs hover:bg-surface-container transition-colors border border-on-surface shadow-[2px_2px_0px_0px_rgba(28,27,27,1)] flex items-center justify-center gap-1.5 whitespace-nowrap flex-1 sm:flex-initial"
          >
            <span className="material-symbols-outlined text-[15px]">mail</span>
            <span>Or Email Us</span>
          </a>
          <button
            onClick={handleCopyEmail}
            className="bg-surface text-on-surface px-3 py-2.5 rounded-full text-label-bold font-label-bold uppercase text-xs hover:bg-surface-container transition-colors border border-outline-variant flex items-center justify-center gap-1 whitespace-nowrap"
            title="Copy email address"
          >
            <span className="material-symbols-outlined text-[15px]">{copied ? 'check' : 'content_copy'}</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && projects.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <span className="material-symbols-outlined text-4xl animate-spin text-primary">progress_activity</span>
          <span className="text-xs font-bold text-secondary uppercase tracking-wider">Loading project showcase...</span>
        </div>
      ) : projects.length === 0 ? (
        /* Empty State */
        <div className="bg-surface rounded-2xl border-2 border-on-surface p-8 sm:p-14 text-center shadow-[3px_3px_0px_0px_rgba(28,27,27,1)] flex flex-col items-center justify-center gap-4 my-2">
          <div className="w-14 h-14 rounded-full bg-surface-container-high border-2 border-on-surface flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(28,27,27,1)]">
            <span className="material-symbols-outlined text-2xl text-secondary">biotech</span>
          </div>
          <div className="flex flex-col gap-1.5 max-w-md">
            <h3 className="text-xl font-bold font-sans text-on-surface">No Projects Published Yet</h3>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Submissions are currently open for all GECT engineering batches. Submit your verified prototype, hardware build, or software platform to be featured in the official showcase.
            </p>
          </div>
          <Link
            to="/submit-project"
            className="mt-2 bg-primary text-on-primary px-6 py-2.5 rounded-full text-label-bold font-label-bold uppercase text-xs border border-on-surface shadow-[2px_2px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">edit_document</span>
            <span>Submit Your Project Online</span>
          </Link>
        </div>
      ) : (
        /* Dynamic Grid of Published Projects */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {projects.map((project) => {
            const teamMembers = project.teamMembers || project.content?.teamMembers || [];
            const teamName = project.teamName || project.content?.teamName;
            const resources = project.resources || project.content?.resources || [];
            const coverImage = project.imageUrl ? getDirectDriveImageUrl(project.imageUrl) : '';

            return (
              <div
                key={project.id}
                className="bg-surface rounded-2xl border-2 border-on-surface shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(28,27,27,1)] transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Image Banner */}
                  <div className="w-full aspect-[16/9] bg-surface-container-high border-b-2 border-on-surface overflow-hidden relative">
                    {coverImage ? (
                      <img
                        src={coverImage}
                        alt={project.title}
                        className="w-full h-full object-cover img-editorial group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-surface-container-high to-surface-container-highest">
                        <span className="material-symbols-outlined text-5xl text-secondary/40 mb-2">rocket_launch</span>
                        <span className="text-xs font-bold uppercase tracking-wider text-secondary">IEDC Project Labs</span>
                      </div>
                    )}

                    {/* Status & Team Name Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                      <span className="bg-tertiary text-on-tertiary px-3 py-1 rounded-full text-label-bold font-label-bold uppercase text-[10px] border border-on-surface shadow-[2px_2px_0px_0px_rgba(28,27,27,1)] pointer-events-auto">
                        🚀 Project section
                      </span>
                      {teamName && (
                        <span className="bg-surface text-on-surface px-3 py-1 rounded-full text-label-bold font-label-bold uppercase text-[10px] border border-on-surface shadow-[2px_2px_0px_0px_rgba(28,27,27,1)] pointer-events-auto">
                          Team: {teamName}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 sm:p-6 flex flex-col gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-medium text-secondary mb-1">
                        <span>{project.date}</span>
                        {project.author?.role && <span>• {project.author.role}</span>}
                      </div>
                      <Link to={`/article/${project.id}`}>
                        <h3 className="text-xl sm:text-2xl font-bold font-sans text-on-surface group-hover:text-primary transition-colors leading-tight">
                          {project.title}
                        </h3>
                      </Link>
                    </div>

                    <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed line-clamp-3">
                      {project.subtitle || 'Read the full project report, documentation, and technical breakdown.'}
                    </p>

                    {/* Team Members List (with Clickable LinkedIn / GitHub Links) */}
                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] font-label-bold uppercase text-secondary mb-2">
                        <span className="material-symbols-outlined text-[15px] text-primary">groups</span>
                        <span>Project Contributors</span>
                      </div>
                      {teamMembers.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
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
                                  title={`Open ${member.name}'s profile`}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-on-surface bg-surface hover:bg-primary/10 hover:border-primary hover:text-primary transition-all text-xs font-bold text-on-surface shadow-[1px_1px_0px_0px_rgba(28,27,27,1)]"
                                >
                                  <span>{member.name}</span>
                                  {isGithub ? (
                                    <svg className="w-3 h-3 fill-current text-secondary" viewBox="0 0 24 24">
                                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                                    </svg>
                                  ) : isLinkedin ? (
                                    <svg className="w-3 h-3 fill-current text-[#0077B5]" viewBox="0 0 24 24">
                                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                                    </svg>
                                  ) : (
                                    <span className="material-symbols-outlined text-[13px] text-secondary">open_in_new</span>
                                  )}
                                </a>
                              );
                            }

                            return (
                              <span
                                key={mIdx}
                                className="inline-flex items-center px-2.5 py-1 rounded-full border border-outline-variant bg-surface-container-low text-xs font-semibold text-on-surface"
                              >
                                {member.name}
                              </span>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="text-xs text-secondary font-medium">
                          {project.author?.name || 'IEDC Project Labs'}
                        </span>
                      )}
                    </div>

                    {/* Attached Resources Badges */}
                    {resources.length > 0 && (
                      <div className="pt-2 border-t border-outline-variant/50">
                        <span className="text-[11px] font-label-bold uppercase text-secondary block mb-1.5">
                          Documentation &amp; Links
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {resources.map((res, rIdx) => {
                            const embed = getEmbedDetails(res.url, res.type, res.title);
                            return (
                              <a
                                key={rIdx}
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-outline-variant bg-surface hover:border-primary text-[11px] font-medium text-on-surface transition-colors"
                              >
                                <span className="material-symbols-outlined text-[14px] text-primary">{embed.icon}</span>
                                <span className="truncate max-w-[150px]">{res.title || embed.label}</span>
                                <span className="material-symbols-outlined text-[11px] text-secondary">north_east</span>
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-5 sm:p-6 pt-0 border-t border-on-surface/10 mt-3 flex items-center justify-between gap-3">
                  <span className="text-[11px] text-secondary font-medium">
                    {resources.length > 0 ? `${resources.length} Docs / Files Attached` : 'Full Article Available'}
                  </span>
                  <Link
                    to={`/article/${project.id}`}
                    className="inline-flex items-center gap-1.5 bg-primary text-on-primary px-4 py-2 rounded-full text-xs font-label-bold uppercase border border-on-surface shadow-[2px_2px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] transition-all"
                  >
                    <span>Read Story &amp; Docs</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
