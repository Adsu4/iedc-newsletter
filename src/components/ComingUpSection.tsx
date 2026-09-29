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
    <section className="flex flex-col gap-8 animate-fade-in-up">
      {/* Header (shown on Home page when showAll is false) */}
      {!showAll && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-4 border-on-surface pb-6 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-primary text-on-primary px-3.5 py-1 rounded-full text-label-bold font-label-bold uppercase text-xs">
                Mark Your Calendar
              </span>
              <span className="text-secondary font-label-bold uppercase text-xs">• Upcoming Schedule</span>
            </div>
            <h2 className="text-display-lg-mobile md:text-headline-xl font-display-lg-mobile md:font-headline-xl text-on-surface uppercase leading-none">
              Coming Up at IEDC
            </h2>
          </div>
          <Link
            to="/coming-up"
            className="text-label-bold font-label-bold uppercase text-primary hover:text-on-surface transition-colors flex items-center gap-1.5 text-sm"
          >
            <span>Full Schedule Status</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>
      )}

      {/* Meme Card Showcase */}
      <div className="bg-surface rounded-2xl md:rounded-3xl border-4 border-on-surface p-6 sm:p-10 md:p-12 shadow-[8px_8px_0px_0px_rgba(28,27,27,1)] md:shadow-[12px_12px_0px_0px_rgba(28,27,27,1)] flex flex-col lg:flex-row items-center gap-8 md:gap-12">
        {/* Left / Top: Meme Image Display */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="w-full max-w-lg rounded-2xl overflow-hidden border-4 border-on-surface bg-[#FDFBF7] shadow-[6px_6px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(28,27,27,1)] transition-all">
            <img
              src="/will_be_updated_soon.png"
              alt="Will be updated soon meme"
              className="w-full h-auto object-contain block select-none"
            />
            <div className="bg-surface-container-high border-t-2 border-on-surface px-4 py-2.5 flex items-center justify-between text-xs font-label-bold uppercase text-secondary">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                In the Oven 🍳
              </span>
              <span>Next Edition Drops Soon</span>
            </div>
          </div>
        </div>

        {/* Right / Content */}
        <div className="w-full lg:w-1/2 flex flex-col gap-5 text-left">
          <div className="inline-flex items-center gap-2 bg-secondary text-on-secondary px-3.5 py-1 rounded-full text-xs font-label-bold uppercase self-start border border-on-surface shadow-[2px_2px_0px_0px_rgba(28,27,27,1)]">
            <span className="inline-block w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
            <span>Schedule Dropping Soon</span>
          </div>

          <h3 className="text-display-lg-mobile md:text-headline-xl font-display-lg-mobile md:font-headline-xl text-on-surface uppercase leading-tight">
            Events Will Be Updated Soon!
          </h3>

          <p className="text-body-lg text-on-surface-variant leading-relaxed">
            The IEDC core team is currently locking in dates, booking campus labs, and coordinating with industry mentors for upcoming hackathons, innovation bootcamps, and workshop tracks.
          </p>

          <p className="text-body-md text-on-surface-variant">
            Have an idea for a workshop, or want your club's technical event featured? Send us your proposal at{' '}
            <a
              href="mailto:iedc@gectcr.ac.in?subject=Workshop%2FEvent%20Proposal%20-%20IEDC%20GECT"
              className="font-label-bold text-primary underline hover:text-on-surface transition-colors"
            >
              iedc@gectcr.ac.in
            </a>.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-4 border-t-2 border-on-surface/10">
            <a
              href="#newsletter"
              className="bg-primary text-on-primary px-6 py-3.5 rounded-full text-label-bold font-label-bold uppercase text-xs border-2 border-on-surface shadow-[3px_3px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_rgba(28,27,27,1)] transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px]">notifications</span>
              <span>Get Notified on Drop</span>
            </a>

            <button
              onClick={handleCopyEmail}
              className="bg-surface text-on-surface px-5 py-3.5 rounded-full text-label-bold font-label-bold uppercase text-xs border-2 border-on-surface shadow-[3px_3px_0px_0px_rgba(28,27,27,1)] hover:bg-surface-container-high transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px]">{copied ? 'check' : 'content_copy'}</span>
              <span>{copied ? 'Copied iedc@gectcr.ac.in!' : 'Copy IEDC Email'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
