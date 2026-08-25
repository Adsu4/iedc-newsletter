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
    <section className="flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-4 border-on-surface pb-6 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-tertiary text-on-tertiary px-3.5 py-1 rounded-full text-label-bold font-label-bold uppercase text-xs">
              Grants & Funding Radar
            </span>
            <span className="text-secondary font-label-bold uppercase text-xs">• Verified Open Calls</span>
          </div>
          <h2 className="text-display-lg-mobile md:text-headline-xl font-display-lg-mobile md:font-headline-xl text-on-surface uppercase leading-none">
            Opportunity Radar
          </h2>
        </div>
        {!showAll && (
          <Link
            to="/opportunities"
            className="text-label-bold font-label-bold uppercase text-primary hover:text-on-surface transition-colors flex items-center gap-1.5 text-sm"
          >
            <span>Explore All Grants ({opportunitiesList.length})</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2.5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-label-bold font-label-bold uppercase text-xs transition-all border-2 border-on-surface shadow-[2px_2px_0px_0px_rgba(28,27,27,1)] ${
              selectedCategory === cat
                ? 'bg-primary text-on-primary shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] -translate-y-0.5'
                : 'bg-surface hover:bg-surface-container-high text-on-surface'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {displayList.map((item) => (
          <div
            key={item.id}
            className="bg-surface rounded-2xl border-4 border-on-surface p-8 flex flex-col justify-between shadow-[8px_8px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-1.5 hover:shadow-[14px_14px_0px_0px_rgba(28,27,27,1)] transition-all"
          >
            <div>
              {/* Provider & Category Header */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-label-bold uppercase text-secondary">
                  {item.provider}
                </span>
                <span className={`${item.categoryColor} px-3 py-1 rounded-full text-label-bold font-label-bold uppercase text-xs border border-on-surface shadow-[2px_2px_0px_0px_rgba(28,27,27,1)]`}>
                  {item.category}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-headline-md font-headline-md text-on-surface uppercase leading-tight mb-3">
                {item.title}
              </h3>

              {/* Grant / Funding Highlight Card */}
              {item.grantAmount && (
                <div className="inline-flex items-center gap-2 bg-surface-container-high px-4 py-2 rounded-xl border border-on-surface font-label-bold text-xs uppercase text-on-surface mb-4">
                  <span className="material-symbols-outlined text-primary text-[18px]">payments</span>
                  <span>{item.grantAmount}</span>
                </div>
              )}

              <p className="text-body-md text-on-surface-variant leading-relaxed mb-6">
                {item.description}
              </p>

              {/* Eligibility */}
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-on-surface/30 mb-6">
                <span className="text-[11px] font-label-bold uppercase text-secondary block mb-1">Target Eligibility</span>
                <p className="text-xs text-on-surface font-medium">{item.eligibility}</p>
              </div>
            </div>

            {/* Footer / Apply Button */}
            <div className="pt-4 border-t-2 border-on-surface/10 flex items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-[11px] font-label-bold uppercase text-secondary">Deadline</span>
                <span className="text-xs font-label-bold uppercase text-error">{item.deadline}</span>
              </div>

              <a
                href={item.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-on-primary px-6 py-3 rounded-full text-label-bold font-label-bold uppercase text-xs border-2 border-on-surface shadow-[3px_3px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_rgba(28,27,27,1)] transition-all flex items-center gap-1.5"
              >
                <span>Apply / Details</span>
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
