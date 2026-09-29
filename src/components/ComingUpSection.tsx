import { useState } from 'react';
import { Link } from 'react-router-dom';

interface ComingUpSectionProps {
  showAll?: boolean;
}

export default function ComingUpSection({ showAll = false }: ComingUpSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('iedc@gectcr.ac.in');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="flex flex-col gap-6 animate-fade-in-up">
      {/* Header (shown on Home page when showAll is false) */}
      {!showAll && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-on-surface pb-3 gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-primary text-on-primary px-3 py-0.5 rounded-full text-label-bold font-label-bold uppercase text-[11px]">
                Calendar
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold font-headline-md text-on-surface leading-tight">
              Coming Up at IEDC
            </h2>
          </div>
          <Link
            to="/coming-up"
            className="text-xs font-medium text-primary hover:text-on-surface transition-colors flex items-center gap-1"
          >
            <span>Full schedule status</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>
      )}

      {/* Meme Card Showcase */}
      <div className="bg-surface rounded-2xl border-2 border-on-surface p-5 sm:p-7 md:p-8 shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] flex flex-col lg:flex-row items-center gap-6 md:gap-8">
        {/* Left / Top: Meme Image Display */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="w-full max-w-md rounded-xl overflow-hidden border-2 border-on-surface bg-[#FDFBF7] shadow-[3px_3px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_rgba(28,27,27,1)] transition-all">
            <img
              src="/will_be_updated_soon.png"
              alt="Will be updated soon meme"
              className="w-full h-auto object-contain block select-none"
            />
            <div className="bg-surface-container-high border-t border-on-surface px-3 py-2 flex items-center justify-between text-[11px] font-label-bold uppercase text-secondary">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                In the Oven 🍳
              </span>
              <span>Next Edition Drops Soon</span>
            </div>
          </div>
        </div>

        {/* Right / Content */}
        <div className="w-full lg:w-1/2 flex flex-col gap-3.5 text-left">
          <div className="inline-flex items-center gap-1.5 bg-secondary text-on-secondary px-3 py-0.5 rounded-full text-[10px] font-label-bold uppercase self-start border border-on-surface shadow-[1px_1px_0px_0px_rgba(28,27,27,1)]">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"></span>
            <span>Schedule Dropping Soon</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold font-headline-md text-on-surface leading-tight">
            Events Will Be Updated Soon!
          </h3>

          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            The IEDC core team is currently locking in dates, booking campus labs, and coordinating with industry mentors for upcoming hackathons, innovation bootcamps, and workshop tracks.
          </p>

          <p className="text-xs sm:text-sm text-on-surface-variant">
            Have an idea for a workshop, or want your club's technical event featured? Send us your proposal at{' '}
            <a
              href="mailto:iedc@gectcr.ac.in?subject=Workshop%2FEvent%20Proposal%20-%20IEDC%20GECT"
              className="font-bold text-primary underline hover:text-on-surface transition-colors"
            >
              iedc@gectcr.ac.in
            </a>.
          </p>

          <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t border-on-surface/10">
            <a
              href="#newsletter"
              className="bg-primary text-on-primary px-4 py-2 rounded-full text-label-bold font-label-bold uppercase text-xs border border-on-surface shadow-[2px_2px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(28,27,27,1)] transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[15px]">notifications</span>
              <span>Get Notified on Drop</span>
            </a>

            <button
              onClick={handleCopyEmail}
              className="bg-surface text-on-surface px-4 py-2 rounded-full text-label-bold font-label-bold uppercase text-xs border border-on-surface shadow-[2px_2px_0px_0px_rgba(28,27,27,1)] hover:bg-surface-container-high transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[15px]">{copied ? 'check' : 'content_copy'}</span>
              <span>{copied ? 'Copied iedc@gectcr.ac.in!' : 'Copy IEDC Email'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
