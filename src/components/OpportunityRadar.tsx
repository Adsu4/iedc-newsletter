import { useState } from 'react';
import { Link } from 'react-router-dom';
import { opportunitiesList } from '../data/newsletterData';

interface OpportunityRadarProps {
  showAll?: boolean;
}

export default function OpportunityRadar({ showAll = false }: OpportunityRadarProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'KSUM Grant', 'Government Scheme', 'Hackathon', 'Incubation', 'Open Call'];

  const filtered = selectedCategory === 'All'
    ? opportunitiesList
    : opportunitiesList.filter((op) => op.category === selectedCategory);

  const displayList = showAll ? filtered : filtered.slice(0, 4);

  return (
    <section className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-on-surface pb-3 gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-tertiary text-on-tertiary px-3 py-0.5 rounded-full text-label-bold font-label-bold uppercase text-[11px]">
              Grants Radar
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-headline-md text-on-surface leading-tight">
            Opportunity Radar
          </h2>
        </div>
        {!showAll && (
          <Link
            to="/opportunities"
            className="text-xs font-medium text-primary hover:text-on-surface transition-colors flex items-center gap-1"
          >
            <span>Explore all grants ({opportunitiesList.length})</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border border-on-surface ${
              selectedCategory === cat
                ? 'bg-primary text-on-primary font-bold shadow-[2px_2px_0px_0px_rgba(28,27,27,1)] -translate-y-0.5'
                : 'bg-surface hover:bg-surface-container-high text-on-surface'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
        {displayList.map((item) => (
          <div
            key={item.id}
            className="bg-surface rounded-xl border-2 border-on-surface p-5 sm:p-6 flex flex-col justify-between shadow-[3px_3px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-1 hover:shadow-[5px_5px_0px_0px_rgba(28,27,27,1)] transition-all"
          >
            <div>
              {/* Provider & Category Header */}
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="text-xs font-medium text-secondary">
                  {item.provider}
                </span>
                <span className={`${item.categoryColor} px-2.5 py-0.5 rounded-full text-[10px] font-label-bold uppercase border border-on-surface shadow-[1px_1px_0px_0px_rgba(28,27,27,1)]`}>
                  {item.category}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-lg sm:text-xl font-bold font-sans text-on-surface leading-snug mb-2">
                {item.title}
              </h3>

              {/* Grant / Funding Highlight Card */}
              {item.grantAmount && (
                <div className="inline-flex items-center gap-1.5 bg-surface-container-high px-3 py-1 rounded-lg border border-on-surface text-xs font-bold text-on-surface mb-3">
                  <span className="material-symbols-outlined text-primary text-[16px]">payments</span>
                  <span>{item.grantAmount}</span>
                </div>
              )}

              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-4">
                {item.description}
              </p>

              {/* Eligibility */}
              <div className="bg-surface-container-lowest p-3 rounded-lg border border-on-surface/20 mb-4">
                <span className="text-[10px] font-label-bold uppercase text-secondary block mb-0.5">Target Eligibility</span>
                <p className="text-xs text-on-surface font-medium">{item.eligibility}</p>
              </div>
            </div>

            {/* Footer / Apply Button */}
            <div className="pt-3 border-t border-on-surface/10 flex items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-label-bold uppercase text-secondary">Timeline / Deadline</span>
                <span className="text-xs font-bold text-primary">{item.deadline}</span>
              </div>

              <a
                href={item.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-on-primary px-4 py-2 rounded-full text-label-bold font-label-bold uppercase text-xs border border-on-surface shadow-[2px_2px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(28,27,27,1)] transition-all flex items-center gap-1.5"
              >
                <span>Apply / Details</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
