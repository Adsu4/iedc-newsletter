import { Link } from 'react-router-dom';
import { startupSpotlights } from '../data/newsletterData';

export default function StartupSpotlightSection() {
  return (
    <section className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-on-surface pb-3 gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-secondary text-on-secondary px-3 py-0.5 rounded-full text-label-bold font-label-bold uppercase text-[11px]">
              Ventures
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-headline-md text-on-surface leading-tight">
            Startup & Innovation Spotlight
          </h2>
        </div>
        <Link
          to="/projects"
          className="text-xs font-medium text-primary hover:text-on-surface transition-colors flex items-center gap-1"
        >
          <span>Explore all projects</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </Link>
      </div>

      {/* Spotlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {startupSpotlights.map((startup) => (
          <div
            key={startup.id}
            className="bg-surface rounded-xl border-2 border-on-surface shadow-[3px_3px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-1 hover:shadow-[5px_5px_0px_0px_rgba(28,27,27,1)] transition-all overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Cover Image Banner */}
              <div className="w-full aspect-[16/9] bg-surface-container-high border-b-2 border-on-surface overflow-hidden relative">
                <img
                  src={startup.imageUrl}
                  alt={startup.name}
                  className="w-full h-full object-cover img-editorial"
                />
                <span className={`absolute top-2.5 right-2.5 ${startup.stageColor} px-2.5 py-0.5 rounded-full text-label-bold font-label-bold uppercase text-[10px] border border-on-surface shadow-[1px_1px_0px_0px_rgba(28,27,27,1)]`}>
                  {startup.stage}
                </span>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-5 flex flex-col gap-2.5">
                <div>
                  <div className="flex items-center justify-between text-xs font-medium text-secondary mb-1">
                    <span>{startup.sector}</span>
                    <span className="text-primary font-bold">{startup.highlightMetric}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold font-sans text-on-surface leading-snug">
                    {startup.name}
                  </h3>
                  <p className="text-xs font-medium text-secondary mt-0.5">
                    {startup.tagline}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed line-clamp-3">
                  {startup.description}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-5 pt-0 border-t border-on-surface/10 mt-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-label-bold uppercase text-secondary block">Founders</span>
                <span className="text-xs font-medium text-on-surface">{startup.founder} ({startup.founderBatch})</span>
              </div>

              {startup.articleId && (
                <Link
                  to={`/article/${startup.articleId}`}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1 shrink-0"
                >
                  <span>Read story</span>
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
