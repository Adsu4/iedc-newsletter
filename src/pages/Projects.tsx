import { useState } from 'react';
import { Link } from 'react-router-dom';

interface ProjectItem {
  id: string;
  title: string;
  department: string;
  status: 'Deployed' | 'Incubated' | 'In Development' | 'Funded';
  statusColor: string;
  summary: string;
  techStack: string[];
  team: string[];
  imageUrl: string;
  articleId?: string;
}

const campusProjects: ProjectItem[] = [];


export default function Projects() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('gectiedc@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mailtoUrl = "mailto:gectiedc@gmail.com?subject=Project%20Submission%20-%20IEDC%20Student%20Labs&body=Hi%20IEDC%20Team%2C%0A%0AI%20would%20like%20to%20submit%20our%20project%20for%20the%20IEDC%20Newsletter%20Showcase.%0A%0AProject%20Title%3A%20%0ADepartment%3A%20%0ATeam%20Members%3A%20%0AProject%20Summary%3A%20%0ATechnologies%20Used%3A%20%0AGitHub%20%2F%20Demo%20Link%3A%20%0AContact%20Phone%3A%20%0A%0AThank%20you!";

  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-14 flex flex-col gap-8 md:gap-10">
      {/* Header */}
      <div className="border-b-2 border-on-surface pb-5 flex flex-col md:flex-row justify-between items-start md:items-end gap-5">
        <div>
          <span className="bg-tertiary text-on-tertiary px-3 py-0.5 rounded-full text-label-bold font-label-bold uppercase text-[11px] mb-2 inline-block">
            Student Labs & R&D
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-headline-xl uppercase text-on-surface leading-tight">
            Projects Showcase
          </h1>
          <p className="text-sm sm:text-base text-on-surface-variant max-w-2xl mt-2 leading-relaxed">
            Explore cutting-edge hardware prototypes, SaaS applications, and IoT systems built by student innovators at Govt. Engineering College Thrissur.
          </p>
        </div>
        <a
          href={mailtoUrl}
          className="bg-primary text-on-primary px-5 py-2.5 rounded-full text-label-bold font-label-bold uppercase text-xs border border-on-surface shadow-[2px_2px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] transition-all shrink-0 flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">mail</span>
          <span>Submit Your Project</span>
        </a>
      </div>

      {/* Submission Guidance Callout Banner */}
      <div className="bg-surface-container-high rounded-xl border-2 border-on-surface p-5 sm:p-6 shadow-[3px_3px_0px_0px_rgba(28,27,27,1)] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
        <div className="flex flex-col gap-1.5 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-medium text-secondary">
            <span className="bg-secondary text-on-secondary px-2.5 py-0.5 rounded-full text-[10px] font-label-bold uppercase">Call for Submissions</span>
            <span>• Open for all departments</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold font-sans text-on-surface leading-tight">
            How to Submit Your Project
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            Built an innovative hardware prototype, software application, or research model? Student projects can be submitted directly by emailing our official IEDC address at{' '}
            <strong className="text-on-surface font-semibold underline">gectiedc@gmail.com</strong> with your project title, team members, tech stack, and GitHub or demo links.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <a
            href={mailtoUrl}
            className="bg-on-surface text-surface px-4 py-2 rounded-full text-label-bold font-label-bold uppercase text-xs hover:bg-primary hover:text-on-primary transition-colors border border-on-surface shadow-[2px_2px_0px_0px_rgba(28,27,27,1)] flex items-center justify-center gap-1.5 whitespace-nowrap flex-1 sm:flex-initial"
          >
            <span className="material-symbols-outlined text-[15px]">send</span>
            <span>Send to gectiedc@gmail.com</span>
          </a>
          <button
            onClick={handleCopyEmail}
            className="bg-surface text-on-surface px-4 py-2 rounded-full text-label-bold font-label-bold uppercase text-xs hover:bg-surface-container transition-colors border border-on-surface shadow-[2px_2px_0px_0px_rgba(28,27,27,1)] flex items-center justify-center gap-1.5 whitespace-nowrap flex-1 sm:flex-initial"
          >
            <span className="material-symbols-outlined text-[15px]">{copied ? 'check' : 'content_copy'}</span>
            <span>{copied ? 'Copied!' : 'Copy Email'}</span>
          </button>
        </div>
      </div>

      {/* Grid of Projects or Empty State */}
      {campusProjects.length === 0 ? (
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
          <a
            href={mailtoUrl}
            className="mt-2 bg-primary text-on-primary px-5 py-2.5 rounded-full text-label-bold font-label-bold uppercase text-xs border border-on-surface shadow-[2px_2px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">send</span>
            <span>Submit Your Project</span>
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {campusProjects.map((project) => (
            <div
              key={project.id}
              className="bg-surface rounded-xl border-2 border-on-surface shadow-[3px_3px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-1 hover:shadow-[5px_5px_0px_0px_rgba(28,27,27,1)] transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Image Banner */}
                <div className="w-full aspect-[16/9] bg-surface-container-high border-b-2 border-on-surface overflow-hidden relative">
                  <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover img-editorial" />
                  <span className={`absolute top-3 right-3 ${project.statusColor} px-3 py-1 rounded-full text-label-bold font-label-bold uppercase text-[10px] border border-on-surface shadow-[1px_1px_0px_0px_rgba(28,27,27,1)]`}>
                    {project.status}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 flex flex-col gap-4">
                  <div>
                    <div className="text-xs font-medium text-secondary mb-1">{project.department}</div>
                    <h3 className="text-lg sm:text-xl font-bold font-sans text-on-surface leading-snug">{project.title}</h3>
                  </div>

                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    {project.summary}
                  </p>

                  {/* Tech Stack Pills */}
                  <div>
                    <span className="text-[11px] font-medium text-secondary block mb-1.5">Technologies Used</span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.techStack.map((tech) => (
                        <span key={tech} className="bg-surface-container-high text-on-surface px-2.5 py-0.5 rounded-full text-[11px] font-medium border border-on-surface/30">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-5 sm:p-6 pt-0 border-t border-on-surface/10 mt-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-label-bold uppercase text-secondary block">Team</span>
                  <span className="text-xs font-semibold text-on-surface">{project.team.join(', ')}</span>
                </div>
                {project.articleId && (
                  <Link
                    to={`/article/${project.articleId}`}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    <span>Read story</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
