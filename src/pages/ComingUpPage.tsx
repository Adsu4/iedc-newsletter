import ComingUpSection from '../components/ComingUpSection';

export default function ComingUpPage() {
  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-20 flex flex-col gap-12">
      {/* Header Banner */}
      <div className="border-b-4 border-on-surface pb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="bg-primary text-on-primary px-4 py-1.5 rounded-full text-label-bold font-label-bold uppercase text-xs">
            Events & Hackathons
          </span>
          <span className="text-secondary font-label-bold uppercase text-xs">• GECT Campus & Inter-College</span>
        </div>
        <h1 className="text-display-lg-mobile md:text-display-lg font-display-lg-mobile md:font-display-lg text-on-surface uppercase leading-none">
          Coming Up at IEDC
        </h1>
        <p className="text-body-lg text-on-surface-variant max-w-2xl mt-4">
          Stay ahead with our upcoming innovation bootcamps, technical design sprints, national hackathons, and venture demo days.
        </p>
      </div>

      <ComingUpSection showAll={true} />
    </main>
  );
}
