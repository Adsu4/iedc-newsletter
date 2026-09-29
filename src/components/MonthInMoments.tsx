import { useState } from 'react';
import { monthMoments, type MonthMoment, currentEditionInfo } from '../data/newsletterData';

export default function MonthInMoments() {
  const [activePhoto, setActivePhoto] = useState<MonthMoment | null>(null);

  return (
    <>
      <section className="flex flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-4 border-on-surface pb-6 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-tertiary text-on-tertiary px-3.5 py-1 rounded-full text-label-bold font-label-bold uppercase text-xs">
                Visual Digest
              </span>
              <span className="text-secondary font-label-bold uppercase text-xs">• {currentEditionInfo.monthYear}</span>
            </div>
            <h2 className="text-display-lg-mobile md:text-headline-xl font-display-lg-mobile md:font-headline-xl text-on-surface uppercase leading-none">
              Month in Moments
            </h2>
          </div>
          <p className="text-body-md text-on-surface-variant max-w-md text-left md:text-right">
            Snapshots of campus energy, late-night prototyping sessions, and workshop breakthroughs.
          </p>
        </div>

        {/* Photo Mosaic Collage */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {monthMoments.map((moment, index) => (
            <div
              key={moment.id}
              onClick={() => setActivePhoto(moment)}
              className={`group relative rounded-2xl overflow-hidden border-4 border-on-surface bg-surface cursor-pointer shadow-[6px_6px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-1.5 hover:shadow-[12px_12px_0px_0px_rgba(28,27,27,1)] transition-all flex flex-col ${
                index === 0 ? 'sm:col-span-2 sm:row-span-1' : ''
              }`}
            >
              <div className="w-full aspect-[16/10] overflow-hidden bg-primary relative">
                <img
                  src={moment.imageUrl}
                  alt={moment.title}
                  className="w-full h-full object-cover img-editorial group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 right-3 bg-on-surface text-surface px-3 py-1 rounded-full text-label-bold font-label-bold uppercase text-[10px] border border-surface shadow-[2px_2px_0px_0px_rgba(28,27,27,1)]">
                  {moment.tag}
                </span>
              </div>

              {/* Caption Card */}
              <div className="p-5 flex flex-col gap-2 justify-between flex-1 bg-surface">
                <div>
                  <h4 className="text-headline-md font-headline-md text-on-surface uppercase leading-tight group-hover:text-primary transition-colors">
                    {moment.title}
                  </h4>
                  <p className="text-body-sm text-on-surface-variant line-clamp-2 mt-1 leading-relaxed">
                    {moment.caption}
                  </p>
                </div>
                <div className="flex items-center justify-between text-[11px] font-label-bold text-secondary uppercase pt-3 border-t border-on-surface/10 mt-2">
                  <span>{moment.date}</span>
                  <span>{moment.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Photo Lightbox Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 bg-on-surface/85 backdrop-blur-md z-[100] flex items-center justify-center p-4"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="bg-surface rounded-[2rem] border-4 border-on-surface shadow-[16px_16px_0px_0px_rgba(28,27,27,1)] max-w-2xl w-full p-6 md:p-8 flex flex-col gap-6 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full aspect-[16/10] rounded-xl overflow-hidden border-2 border-on-surface bg-primary shadow-[4px_4px_0px_0px_rgba(28,27,27,1)]">
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                className="w-full h-full object-cover img-editorial"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-4">
                <span className="bg-tertiary text-on-tertiary px-3 py-1 rounded-full text-label-bold font-label-bold uppercase text-xs">
                  {activePhoto.tag}
                </span>
                <span className="text-xs font-label-bold text-secondary uppercase">
                  {activePhoto.date} • {activePhoto.location}
                </span>
              </div>
              <h3 className="text-headline-md font-headline-md text-on-surface uppercase leading-tight mt-1">
                {activePhoto.title}
              </h3>
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                {activePhoto.caption}
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setActivePhoto(null)}
                className="bg-on-surface text-surface px-8 py-3 rounded-full text-label-bold font-label-bold uppercase text-xs hover:bg-primary hover:text-on-primary transition-colors border-2 border-on-surface shadow-[3px_3px_0px_0px_rgba(28,27,27,1)]"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
