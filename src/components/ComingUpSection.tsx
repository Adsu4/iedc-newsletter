import { useState } from 'react';
import { Link } from 'react-router-dom';
import { upcomingEvents, type UpcomingEvent } from '../data/newsletterData';
import EventModal from './EventModal';

interface ComingUpSectionProps {
  showAll?: boolean;
}

export default function ComingUpSection({ showAll = false }: ComingUpSectionProps) {
  const [selectedEvent, setSelectedEvent] = useState<UpcomingEvent | null>(null);

  const displayEvents = showAll ? upcomingEvents : upcomingEvents.slice(0, 3);

  return (
    <>
      <section className="flex flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-4 border-on-surface pb-6 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-primary text-on-primary px-3.5 py-1 rounded-full text-label-bold font-label-bold uppercase text-xs">
                Mark Your Calendar
              </span>
              <span className="text-secondary font-label-bold uppercase text-xs">• Next 30 Days</span>
            </div>
            <h2 className="text-display-lg-mobile md:text-headline-xl font-display-lg-mobile md:font-headline-xl text-on-surface uppercase leading-none">
              Coming Up at IEDC
            </h2>
          </div>
          {!showAll && (
            <Link
              to="/coming-up"
              className="text-label-bold font-label-bold uppercase text-primary hover:text-on-surface transition-colors flex items-center gap-1.5 text-sm"
            >
              <span>View All Events ({upcomingEvents.length})</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          )}
        </div>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {displayEvents.map((event) => (
            <div
              key={event.id}
              className={`bg-surface rounded-2xl border-4 border-on-surface p-8 flex flex-col justify-between shadow-[8px_8px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[14px_14px_0px_0px_rgba(28,27,27,1)] transition-all ${
                event.isFeatured ? 'bg-secondary-container' : ''
              }`}
            >
              <div>
                {/* Badge & Date Header */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className={`${event.badgeColor} px-3 py-1 rounded-full text-label-bold font-label-bold uppercase text-xs border border-on-surface shadow-[2px_2px_0px_0px_rgba(28,27,27,1)]`}>
                    {event.category}
                  </span>
                  <span className="text-xs font-label-bold uppercase text-error">
                    Deadline: {event.deadline}
                  </span>
                </div>

                {/* Event Title */}
                <h3 className="text-headline-md font-headline-md text-on-surface uppercase leading-tight mb-4">
                  {event.title}
                </h3>

                {/* Event Meta */}
                <div className="flex flex-col gap-2 mb-6 text-xs font-label-bold uppercase text-on-surface-variant">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-primary">calendar_today</span>
                    <span>{event.date} • {event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
                    <span className="normal-case">{event.venue}</span>
                  </div>
                </div>

                <p className="text-body-md text-on-surface-variant line-clamp-3 leading-relaxed mb-6">
                  {event.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t-2 border-on-surface/10 flex items-center gap-3">
                <button
                  onClick={() => setSelectedEvent(event)}
                  className="flex-1 bg-on-surface text-surface py-3.5 px-4 rounded-full text-label-bold font-label-bold uppercase text-xs hover:bg-primary hover:text-on-primary transition-colors flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_rgba(28,27,27,1)] border-2 border-on-surface"
                >
                  <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
                  <span>Register & QR</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Event Modal */}
      <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </>
  );
}
