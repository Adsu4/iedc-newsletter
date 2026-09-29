import { Link } from 'react-router-dom';
import { startupSpotlights } from '../data/newsletterData';

export default function StartupSpotlightSection() {
  return (
    <section className="flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-4 border-on-surface pb-6 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-secondary text-on-secondary px-3.5 py-1 rounded-full text-label-bold font-label-bold uppercase text-xs">
              Venture & Deeptech Beat
            </span>
            <span className="text-secondary font-label-bold uppercase text-xs">• Campus & Kerala Ecosystem</span>
          </div>
          <h2 className="text-display-lg-mobile md:text-headline-xl font-display-lg-mobile md:font-headline-xl text-on-surface uppercase leading-none">
            Startup & Innovation Spotlight
          </h2>
        </div>
        <Link
          to="/projects"
          className="text-label-bold font-label-bold uppercase text-primary hover:text-on-surface transition-colors flex items-center gap-1.5 text-sm"
        >
          <span>Explore All Projects</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Link>
      </div>

      {/* Spotlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {startupSpotlights.map((startup) => (
          <div
            key={startup.id}
            className="bg-surface rounded-2xl border-4 border-on-surface shadow-[8px_8px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-2 hover:shadow-[14px_14px_0px_0px_rgba(28,27,27,1)] transition-all overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Cover Image Banner */}
              <div className="w-full aspect-[16/9] bg-primary border-b-4 border-on-surface overflow-hidden relative">
                <img
                  src={startup.imageUrl}
                  alt={startup.name}
                  className="w-full h-full object-cover img-editorial"
                />
                <span className={`absolute top-3.5 right-3.5 ${startup.stageColor} px-3.5 py-1 rounded-full text-label-bold font-label-bold uppercase text-xs border-2 border-on-surface shadow-[2px_2px_0px_0px_rgba(28,27,27,1)]`}>
                  {startup.stage}
                </span>
              </div>

              {/* Body */}
              <div className="p-6 md:p-8 flex flex-col gap-4">
                <div>
                  <div className="flex items-center justify-between text-xs font-label-bold uppercase text-secondary mb-1">
                    <span>{startup.sector}</span>
                    <span className="text-primary font-bold">{startup.highlightMetric}</span>
                  </div>
                  <h3 className="text-headline-md font-headline-md text-on-surface uppercase leading-tight">
                    {startup.name}
                  </h3>
                  <p className="text-xs font-label-bold text-secondary uppercase mt-0.5">
                    {startup.tagline}
                  </p>
                </div>

                <p className="text-body-md text-on-surface-variant leading-relaxed line-clamp-4">
                  {startup.description}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 md:p-8 pt-0 border-t border-on-surface/10 mt-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-label-bold uppercase text-secondary block">Founders</span>
                <span className="text-xs font-label-bold text-on-surface">{startup.founder} ({startup.founderBatch})</span>
              </div>

              {startup.articleId && (
                <Link
                  to={`/article/${startup.articleId}`}
                  className="text-xs font-label-bold uppercase text-primary hover:underline flex items-center gap-1 shrink-0"
                >
                  <span>Read Story</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
