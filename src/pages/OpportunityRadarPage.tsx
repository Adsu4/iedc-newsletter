import OpportunityRadar from '../components/OpportunityRadar';

export default function OpportunityRadarPage() {
  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-20 flex flex-col gap-12">
      {/* Header Banner */}
      <div className="border-b-4 border-on-surface pb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="bg-tertiary text-on-tertiary px-4 py-1.5 rounded-full text-label-bold font-label-bold uppercase text-xs">
            Grants, Schemes & Competitions
          </span>
          <span className="text-secondary font-label-bold uppercase text-xs">• Curated by IEDC Team</span>
        </div>
        <h1 className="text-display-lg-mobile md:text-display-lg font-display-lg-mobile md:font-display-lg text-on-surface uppercase leading-none">
          Opportunity Radar
        </h1>
        <p className="text-body-lg text-on-surface-variant max-w-2xl mt-4">
          Discover verified funding calls from Kerala Startup Mission (KSUM), DST NIDHI-PRAYAS grants, national hackathons, and incubation programs for student innovators.
        </p>
      </div>

      <OpportunityRadar showAll={true} />
    </main>
  );
}
