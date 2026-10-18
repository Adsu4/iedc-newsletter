import { useState } from 'react';
import ComingUpSection from '../components/ComingUpSection';

export default function ComingUpPage() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('gectiedc@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mailtoProposal =
    'mailto:gectiedc@gmail.com?subject=Event%2FWorkshop%20Proposal%20-%20IEDC%20GECT&body=Hi%20IEDC%20Team%2C%0A%0AWe%20would%20like%20to%20propose%20a%20technical%20workshop%20%2F%20hackathon%20with%20IEDC.%0A%0AEvent%20Title%3A%20%0AFormat%20(Workshop%2FHackathon%2FBootcamp)%3A%20%0AProposed%20Date%20%26%20Venue%3A%20%0ATarget%20Audience%3A%20%0AOrganizing%20Team%20%2F%20Department%3A%20%0AContact%20Phone%3A%20%0A%0AThank%20you!';

  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-14 flex flex-col gap-8 md:gap-10">
      {/* Header Banner */}
      <div className="border-b-2 border-on-surface pb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-primary text-on-primary px-3 py-0.5 rounded-full text-label-bold font-label-bold uppercase text-[11px]">
            Events, Workshops &amp; Hackathons
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-headline-xl uppercase text-on-surface leading-tight">
          Coming Up at IEDC
        </h1>
        <p className="text-sm sm:text-base text-on-surface-variant max-w-2xl mt-2 leading-relaxed">
          Stay ahead with our upcoming innovation bootcamps, technical design sprints, national hackathons, and venture demo days.
        </p>
      </div>

      {/* Dynamic Schedule List (Events / Articles first) */}
      <ComingUpSection showAll={true} />

      {/* Collaboration Callout Banner (Placed after articles) */}
      <div className="bg-surface-container-high rounded-xl border-2 border-on-surface p-5 sm:p-6 shadow-[3px_3px_0px_0px_rgba(28,27,27,1)] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
        <div className="flex flex-col gap-1.5 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-medium text-secondary">
            <span className="bg-secondary text-on-secondary px-2.5 py-0.5 rounded-full text-[10px] font-label-bold uppercase">
              Host an Event
            </span>
            <span>• Open for campus clubs, student initiatives &amp; labs</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold font-sans text-on-surface leading-tight">
            Partner with IEDC to Host Your Next Workshop or Hackathon
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            Have an idea for a cutting-edge technical bootcamp, robotics workshop, or open-source hackathon?
            IEDC provides lab facilities, mentor networks, marketing outreach, and incubation support.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <a
            href={mailtoProposal}
            className="bg-primary text-on-primary px-5 py-2.5 rounded-full text-label-bold font-label-bold uppercase text-xs hover:bg-primary/90 transition-colors border border-on-surface shadow-[2px_2px_0px_0px_rgba(28,27,27,1)] flex items-center justify-center gap-1.5 whitespace-nowrap flex-1 sm:flex-initial"
          >
            <span className="material-symbols-outlined text-[16px]">mail</span>
            <span>Submit Proposal</span>
          </a>
          <button
            onClick={handleCopyEmail}
            className="bg-surface text-on-surface px-4 py-2.5 rounded-full text-label-bold font-label-bold uppercase text-xs hover:bg-surface-container transition-colors border border-on-surface shadow-[2px_2px_0px_0px_rgba(28,27,27,1)] flex items-center justify-center gap-1.5 whitespace-nowrap"
            title="Copy email address"
          >
            <span className="material-symbols-outlined text-[15px]">{copied ? 'check' : 'content_copy'}</span>
            <span>{copied ? 'Copied gectiedc@gmail.com!' : 'Copy Email'}</span>
          </button>
        </div>
      </div>
    </main>
  );
}
