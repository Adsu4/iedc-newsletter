import ComingUpSection from '../components/ComingUpSection';

export default function ComingUpPage() {
  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-14 flex flex-col gap-8 md:gap-10">
      {/* Header Banner */}
      <div className="border-b-2 border-on-surface pb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-primary text-on-primary px-3 py-0.5 rounded-full text-label-bold font-label-bold uppercase text-[11px]">
            Events & Hackathons
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-headline-xl uppercase text-on-surface leading-tight">
          Coming Up at IEDC
        </h1>
        <p className="text-sm sm:text-base text-on-surface-variant max-w-2xl mt-2 leading-relaxed">
          Stay ahead with our upcoming innovation bootcamps, technical design sprints, national hackathons, and venture demo days.
        </p>
      </div>

      <ComingUpSection showAll={true} />
    </main>
  );
}
