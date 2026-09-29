import { useState } from 'react';
import { monthMoments, type MonthMoment } from '../data/newsletterData';

export default function MonthInMoments() {
  const [activePhoto, setActivePhoto] = useState<MonthMoment | null>(null);

  return (
    <>
      <section className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-on-surface pb-3 gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-tertiary text-on-tertiary px-3 py-0.5 rounded-full text-label-bold font-label-bold uppercase text-[11px]">
                Visual Digest
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold font-headline-md text-on-surface leading-tight">
              Month in Moments
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-on-surface-variant max-w-md text-left md:text-right">
            Snapshots of campus energy, late-night prototyping sessions, and workshop breakthroughs.
          </p>
        </div>

        {/* Photo Mosaic Collage */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {monthMoments.map((moment, index) => (
            <div
              key={moment.id}
              onClick={() => setActivePhoto(moment)}
              className={`group relative rounded-xl overflow-hidden border-2 border-on-surface bg-surface cursor-pointer shadow-[3px_3px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-1 hover:shadow-[5px_5px_0px_0px_rgba(28,27,27,1)] transition-all flex flex-col ${
                index === 0 ? 'sm:col-span-2 sm:row-span-1' : ''
              }`}
            >
              <div className="w-full aspect-[16/10] overflow-hidden bg-surface-container-high relative">
                <img
                  src={moment.imageUrl}
                  alt={moment.title}
                  className="w-full h-full object-cover img-editorial group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2.5 right-2.5 bg-on-surface text-surface px-2.5 py-0.5 rounded-full text-label-bold font-label-bold uppercase text-[10px] border border-surface shadow-[1px_1px_0px_0px_rgba(28,27,27,1)]">
                  {moment.tag}
                </span>
              </div>

              {/* Caption Card */}
              <div className="p-4 flex flex-col gap-1.5 justify-between flex-1 bg-surface">
                <div>
                  <h4 className="text-sm sm:text-base font-bold font-sans text-on-surface leading-snug group-hover:text-primary transition-colors">
                    {moment.title}
                  </h4>
                  <p className="text-xs text-on-surface-variant line-clamp-2 mt-0.5 leading-relaxed">
                    {moment.caption}
                  </p>
                </div>
                <div className="flex items-center justify-between text-[11px] text-secondary font-medium pt-2 border-t border-on-surface/10 mt-1">
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
            className="bg-surface rounded-2xl border-2 border-on-surface shadow-[8px_8px_0px_0px_rgba(28,27,27,1)] max-w-2xl w-full p-5 sm:p-6 md:p-8 flex flex-col gap-4 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full aspect-[16/10] rounded-xl overflow-hidden border border-on-surface bg-surface-container-high shadow-[2px_2px_0px_0px_rgba(28,27,27,1)]">
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                className="w-full h-full object-cover img-editorial"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-4">
                <span className="bg-tertiary text-on-tertiary px-2.5 py-0.5 rounded-full text-label-bold font-label-bold uppercase text-[10px]">
                  {activePhoto.tag}
                </span>
                <span className="text-xs text-secondary font-medium">
                  {activePhoto.date} • {activePhoto.location}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-sans text-on-surface leading-tight mt-1">
                {activePhoto.title}
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {activePhoto.caption}
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setActivePhoto(null)}
                className="bg-on-surface text-surface px-6 py-2.5 rounded-full text-label-bold font-label-bold uppercase text-xs hover:bg-primary hover:text-on-primary transition-colors border border-on-surface shadow-[2px_2px_0px_0px_rgba(28,27,27,1)]"
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
