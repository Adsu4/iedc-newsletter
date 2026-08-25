import { useEffect } from 'react';
import type { UpcomingEvent } from '../data/newsletterData';

interface EventModalProps {
  event: UpcomingEvent | null;
  onClose: () => void;
}

export default function EventModal({ event, onClose }: EventModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (event) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [event, onClose]);

  if (!event) return null;

  return (
    <div
      className="fixed inset-0 bg-on-surface/75 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-[2rem] border-4 border-on-surface shadow-[16px_16px_0px_0px_rgba(28,27,27,1)] max-w-lg w-full p-8 md:p-10 flex flex-col gap-6 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b-2 border-on-surface pb-4">
          <div>
            <span className={`${event.badgeColor} px-3 py-1 rounded-full text-label-bold font-label-bold uppercase text-xs border border-on-surface inline-block mb-2`}>
              {event.category}
            </span>
            <h3 className="text-headline-md font-headline-md text-on-surface uppercase leading-tight">
              {event.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full border-2 border-on-surface flex items-center justify-center hover:bg-surface-container transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Event Quick Specs */}
        <div className="grid grid-cols-2 gap-4 bg-surface-container-high p-4 rounded-xl border-2 border-on-surface text-xs font-label-bold uppercase">
          <div className="flex flex-col gap-1">
            <span className="text-secondary">📅 Date & Time</span>
            <span className="text-on-surface">{event.date}</span>
            <span className="text-secondary normal-case">{event.time}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-secondary">📍 Venue</span>
            <span className="text-on-surface normal-case">{event.venue}</span>
          </div>
          <div className="flex flex-col gap-1 col-span-2 pt-2 border-t border-on-surface/20">
            <span className="text-secondary">⏳ Registration Deadline</span>
            <span className="text-error font-bold">{event.deadline}</span>
          </div>
        </div>

        <p className="text-body-md text-on-surface-variant leading-relaxed">
          {event.description}
        </p>

        {/* QR Code & Direct Registration */}
        <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl border-2 border-dashed border-on-surface bg-surface-container-lowest">
          <div className="w-28 h-28 bg-white p-2 rounded-xl border-2 border-on-surface shrink-0 shadow-[2px_2px_0px_0px_rgba(28,27,27,1)]">
            <img src={event.qrCodeUrl} alt="Registration QR Code" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col gap-2 text-center sm:text-left">
            <span className="text-xs font-label-bold uppercase text-secondary">Scan to Register on Mobile</span>
            <p className="text-xs text-on-surface-variant">Open your camera or QR scanner to quickly fill out the registration form.</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex gap-4 mt-2">
          <a
            href={event.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-primary text-on-primary py-4 px-6 rounded-full text-label-bold font-label-bold uppercase text-center border-2 border-on-surface shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(28,27,27,1)] transition-all flex items-center justify-center gap-2"
          >
            <span>Open Registration Form</span>
            <span className="material-symbols-outlined text-[18px]">open_in_new</span>
          </a>
        </div>
      </div>
    </div>
  );
}
