import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAllArticles, getLocalArticlesSync, onArticlesChange, isComingUpArticle } from '../data/articleService';
import type { Article } from '../data/articles';
import { getDirectDriveImageUrl } from '../utils/embedHelper';
import { useAuth } from '../context/AuthContext';

interface ComingUpSectionProps {
  showAll?: boolean;
}

const formatBadgeColors: Record<string, string> = {
  Workshop: 'bg-amber-100 text-amber-900 border-amber-400',
  Hackathon: 'bg-purple-100 text-purple-900 border-purple-400',
  Competition: 'bg-emerald-100 text-emerald-900 border-emerald-400',
  Bootcamp: 'bg-blue-100 text-blue-900 border-blue-400',
  Talk: 'bg-rose-100 text-rose-900 border-rose-400',
  Webinar: 'bg-teal-100 text-teal-900 border-teal-400',
  Other: 'bg-neutral-100 text-neutral-900 border-neutral-400',
};

const formatIcons: Record<string, string> = {
  Workshop: 'build',
  Hackathon: 'bolt',
  Competition: 'trophy',
  Bootcamp: 'rocket_launch',
  Talk: 'record_voice_over',
  Webinar: 'cast_for_education',
  Other: 'event',
};

export default function ComingUpSection({ showAll = false }: ComingUpSectionProps) {
  const { isAuthenticated } = useAuth();
  const [copied, setCopied] = useState(false);
  const [events, setEvents] = useState<Article[]>(() => {
    return getLocalArticlesSync().filter(isComingUpArticle);
  });
  const [loading, setLoading] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [qrModalItem, setQrModalItem] = useState<{ title: string; qrUrl: string; regLink?: string } | null>(null);

  useEffect(() => {
    getAllArticles().then((all) => {
      const filtered = all.filter(isComingUpArticle).sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : Number(a.id) || 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : Number(b.id) || 0;
        return timeB - timeA;
      });
      setEvents(filtered);
      setLoading(false);
    });

    const unsubscribe = onArticlesChange(() => {
      const current = getLocalArticlesSync().filter(isComingUpArticle).sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : Number(a.id) || 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : Number(b.id) || 0;
        return timeB - timeA;
      });
      setEvents(current);
    });
    return unsubscribe;
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('gectiedc@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCalendarUrl = (art: Article) => {
    const title = art.title || 'IEDC Event';
    const details = `${art.subtitle || ''}\n\nRegistration: ${art.eventDetails?.registrationLink || ''}`;
    const location = art.eventDetails?.eventVenue || 'Govt. Engineering College Thrissur (GECT)';
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
  };

  // Filter events by format and search query
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const format = ev.eventDetails?.eventType || 'Workshop';
      const matchesFormat = selectedFormat === 'All' || format.toLowerCase() === selectedFormat.toLowerCase();
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        ev.title.toLowerCase().includes(query) ||
        (ev.subtitle && ev.subtitle.toLowerCase().includes(query)) ||
        (ev.eventDetails?.eventVenue && ev.eventDetails.eventVenue.toLowerCase().includes(query)) ||
        (ev.eventDetails?.eventDate && ev.eventDetails.eventDate.toLowerCase().includes(query));
      return matchesFormat && matchesSearch;
    });
  }, [events, selectedFormat, searchQuery]);

  // Number of items to display: on homepage, display up to 4; on page, display all
  const displayedEvents = showAll ? filteredEvents : events.slice(0, 3);

  return (
    <section className="flex flex-col gap-6 animate-fade-in-up">
      {/* Header (shown on Home page when showAll is false) */}
      {!showAll && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-on-surface pb-3 gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-primary text-on-primary px-3 py-0.5 rounded-full text-label-bold font-label-bold uppercase text-[11px]">
                Calendar &amp; Hackathons
              </span>
              {events.length > 0 && (
                <span className="bg-surface-container-high text-on-surface px-2.5 py-0.5 rounded-full text-xs font-bold border border-outline-variant">
                  {events.length} Upcoming
                </span>
              )}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold font-headline-md text-on-surface leading-tight">
              Coming Up at IEDC
            </h2>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {isAuthenticated && (
              <Link
                to="/admin/dashboard?category=Coming%20Up"
                className="text-xs font-bold text-on-primary bg-primary px-3 py-1.5 rounded-full border border-on-surface shadow-[2px_2px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-0.5 transition-all flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[15px]">add</span>
                <span>Upload Event</span>
              </Link>
            )}
            <Link
              to="/coming-up"
              className="text-xs font-medium text-primary hover:text-on-surface transition-colors flex items-center gap-1"
            >
              <span>Full schedule status {events.length > 0 ? `(${events.length})` : ''}</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      )}

      {/* Filter and Search Bar for full schedule page */}
      {showAll && events.length > 0 && (
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-surface-container-low p-4 rounded-2xl border-2 border-on-surface shadow-[2px_2px_0px_0px_rgba(28,27,27,1)]">
          {/* Format Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {['All', 'Workshop', 'Hackathon', 'Competition', 'Bootcamp', 'Talk'].map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => setSelectedFormat(fmt)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                  selectedFormat === fmt
                    ? 'bg-on-surface text-surface border-on-surface shadow-xs font-bold'
                    : 'bg-surface text-secondary border-outline-variant hover:border-on-surface'
                }`}
              >
                {fmt === 'All' ? 'All Formats' : fmt}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="flex items-center gap-2 border border-outline-variant rounded-xl px-3 py-1.5 bg-surface focus-within:border-primary max-w-xs w-full">
            <span className="material-symbols-outlined text-secondary text-[18px]">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search event or venue..."
              className="bg-transparent border-none text-xs text-on-surface focus:ring-0 p-0 w-full placeholder:text-secondary/60"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-secondary hover:text-error text-xs"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Dynamic Display of Uploaded Events OR Meme Placeholder */}
      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3">
          <span className="material-symbols-outlined text-4xl animate-spin text-primary">progress_activity</span>
          <span className="text-xs font-bold text-secondary uppercase tracking-wider">Loading events calendar...</span>
        </div>
      ) : events.length > 0 ? (
        /* Dynamic Upcoming Events Grid */
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedEvents.map((ev) => {
              const format = ev.eventDetails?.eventType || 'Workshop';
              const badgeStyle = formatBadgeColors[format] || formatBadgeColors.Other;
              const icon = formatIcons[format] || 'event';
              const coverUrl = ev.imageUrl ? getDirectDriveImageUrl(ev.imageUrl) : '';

              return (
                <div
                  key={ev.id}
                  className="bg-surface rounded-2xl border-2 border-on-surface shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(28,27,27,1)] transition-all overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    {/* Event Banner */}
                    <div className="w-full aspect-[16/9] bg-surface-container-high border-b-2 border-on-surface overflow-hidden relative">
                      {coverUrl ? (
                        <img
                          src={coverUrl}
                          alt={ev.title}
                          className="w-full h-full object-cover img-editorial group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-amber-50 to-orange-100">
                          <span className="material-symbols-outlined text-5xl text-amber-600/50 mb-1">{icon}</span>
                          <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                            IEDC GECT Event
                          </span>
                        </div>
                      )}

                      {/* Format Badge */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-label-bold uppercase border shadow-sm flex items-center gap-1 ${badgeStyle}`}>
                          <span className="material-symbols-outlined text-[13px]">{icon}</span>
                          {format}
                        </span>
                      </div>

                      {/* Admin Quick Edit Button */}
                      {isAuthenticated && (
                        <Link
                          to={`/admin/dashboard/${ev.id}`}
                          className="absolute top-3 right-3 bg-surface/90 hover:bg-surface text-on-surface p-1.5 rounded-lg border border-on-surface shadow-xs transition-transform hover:scale-105"
                          title="Edit event in Admin Dashboard"
                        >
                          <span className="material-symbols-outlined text-[15px]">edit</span>
                        </Link>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="p-5 flex flex-col gap-3">
                      {/* Date & Venue Chips */}
                      <div className="flex flex-col gap-1.5 text-xs">
                        {ev.eventDetails?.eventDate ? (
                          <div className="flex items-center gap-1.5 text-primary font-bold">
                            <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                            <span>{ev.eventDetails.eventDate}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-secondary">
                            <span className="material-symbols-outlined text-[16px]">schedule</span>
                            <span>{ev.date}</span>
                          </div>
                        )}

                        {ev.eventDetails?.eventVenue && (
                          <div className="flex items-center gap-1.5 text-secondary">
                            <span className="material-symbols-outlined text-[16px]">location_on</span>
                            <span className="truncate">{ev.eventDetails.eventVenue}</span>
                          </div>
                        )}
                      </div>

                      {/* Title & Subtitle */}
                      <Link to={`/article/${ev.id}`} className="group-hover:text-primary transition-colors">
                        <h3 className="text-lg font-bold font-sans text-on-surface leading-tight line-clamp-2">
                          {ev.title}
                        </h3>
                      </Link>

                      {ev.subtitle && (
                        <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                          {ev.subtitle}
                        </p>
                      )}

                      {/* Metadata Chips (Deadline & Eligibility) */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {ev.eventDetails?.registrationDeadline && (
                          <span className="bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">alarm</span>
                            Deadline: {ev.eventDetails.registrationDeadline}
                          </span>
                        )}

                        {ev.eventDetails?.eligibility && (
                          <span className="bg-surface-container-high text-secondary border border-outline-variant/60 px-2 py-0.5 rounded-md text-[10px] font-medium flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">school</span>
                            {ev.eventDetails.eligibility}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-5 pt-0 border-t border-outline-variant/40 mt-2 flex flex-col gap-2">
                    <div className="flex items-center gap-2 pt-3">
                      {ev.eventDetails?.registrationLink ? (
                        <a
                          href={ev.eventDetails.registrationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-primary text-on-primary py-2 px-3 rounded-xl text-xs font-label-bold uppercase border border-on-surface shadow-[2px_2px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(28,27,27,1)] transition-all flex items-center justify-center gap-1 text-center"
                        >
                          <span>Register Now</span>
                          <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                        </a>
                      ) : (
                        <Link
                          to={`/article/${ev.id}`}
                          className="flex-1 bg-surface-container-high text-on-surface py-2 px-3 rounded-xl text-xs font-label-bold uppercase border border-on-surface hover:bg-surface-container-highest transition-colors flex items-center justify-center gap-1 text-center"
                        >
                          <span>View Details</span>
                          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </Link>
                      )}

                      {/* QR Code Action Button */}
                      {ev.eventDetails?.registrationQrUrl && (
                        <button
                          type="button"
                          onClick={() => setQrModalItem({
                            title: ev.title,
                            qrUrl: getDirectDriveImageUrl(ev.eventDetails?.registrationQrUrl || ''),
                            regLink: ev.eventDetails?.registrationLink,
                          })}
                          className="w-9 h-9 rounded-xl border border-on-surface bg-surface hover:bg-surface-container-high flex items-center justify-center text-on-surface transition-all shadow-[2px_2px_0px_0px_rgba(28,27,27,1)] shrink-0"
                          title="Scan Registration QR"
                        >
                          <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
                        </button>
                      )}

                      {/* Add to Google Calendar Button */}
                      <a
                        href={getCalendarUrl(ev)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-xl border border-outline-variant hover:border-on-surface bg-surface hover:bg-surface-container-high flex items-center justify-center text-secondary hover:text-primary transition-all shrink-0"
                        title="Add to Google Calendar"
                      >
                        <span className="material-symbols-outlined text-[18px]">calendar_add_on</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Homepage footer callout */}
          {!showAll && events.length > 3 && (
            <div className="flex justify-center mt-2">
              <Link
                to="/coming-up"
                className="bg-surface text-on-surface px-6 py-2.5 rounded-full text-xs font-label-bold uppercase border-2 border-on-surface shadow-[3px_3px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_rgba(28,27,27,1)] transition-all flex items-center gap-2"
              >
                <span>View Full Schedule ({events.length} Events)</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          )}
        </div>
      ) : (
        /* Fallback: Beloved "In the Oven / Will be updated soon" Meme Card */
        <div className="bg-surface rounded-2xl border-2 border-on-surface p-5 sm:p-7 md:p-8 shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] flex flex-col lg:flex-row items-center gap-6 md:gap-8">
          {/* Left / Top: Meme Image Display */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="w-full max-w-md rounded-xl overflow-hidden border-2 border-on-surface bg-[#FDFBF7] shadow-[3px_3px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_rgba(28,27,27,1)] transition-all">
              <img
                src="/will_be_updated_soon.png"
                alt="Will be updated soon meme"
                className="w-full h-auto object-contain block select-none"
              />
              <div className="bg-surface-container-high border-t border-on-surface px-3 py-2 flex items-center justify-between text-[11px] font-label-bold uppercase text-secondary">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  In the Oven 🍳
                </span>
                <span>Next Edition Drops Soon</span>
              </div>
            </div>
          </div>

          {/* Right / Content */}
          <div className="w-full lg:w-1/2 flex flex-col gap-3.5 text-left">
            <div className="inline-flex items-center gap-1.5 bg-secondary text-on-secondary px-3 py-0.5 rounded-full text-[10px] font-label-bold uppercase self-start border border-on-surface shadow-[1px_1px_0px_0px_rgba(28,27,27,1)]">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"></span>
              <span>Schedule Dropping Soon</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold font-headline-md text-on-surface leading-tight">
              Events Will Be Updated Soon!
            </h3>

            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              The IEDC core team is currently locking in dates, booking campus labs, and coordinating with industry mentors for upcoming hackathons, innovation bootcamps, and workshop tracks.
            </p>

            <p className="text-xs sm:text-sm text-on-surface-variant">
              Have an idea for a workshop, or want your club's technical event featured? Send us your proposal at{' '}
              <a
                href="mailto:gectiedc@gmail.com?subject=Workshop%2FEvent%20Proposal%20-%20IEDC%20GECT"
                className="font-bold text-primary underline hover:text-on-surface transition-colors"
              >
                gectiedc@gmail.com
              </a>.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t border-on-surface/10">
              {isAuthenticated ? (
                <Link
                  to="/admin/dashboard?category=Coming%20Up"
                  className="bg-primary text-on-primary px-5 py-2.5 rounded-full text-label-bold font-label-bold uppercase text-xs border border-on-surface shadow-[2px_2px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(28,27,27,1)] transition-all flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">calendar_add_on</span>
                  <span>Upload First Event Now</span>
                </Link>
              ) : (
                <a
                  href="#newsletter"
                  className="bg-primary text-on-primary px-4 py-2 rounded-full text-label-bold font-label-bold uppercase text-xs border border-on-surface shadow-[2px_2px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(28,27,27,1)] transition-all flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[15px]">notifications</span>
                  <span>Get Notified on Drop</span>
                </a>
              )}

              <button
                onClick={handleCopyEmail}
                className="bg-surface text-on-surface px-4 py-2 rounded-full text-label-bold font-label-bold uppercase text-xs border border-on-surface shadow-[2px_2px_0px_0px_rgba(28,27,27,1)] hover:bg-surface-container-high transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[15px]">{copied ? 'check' : 'content_copy'}</span>
                <span>{copied ? 'Copied gectiedc@gmail.com!' : 'Copy IEDC Email'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Scanning Modal */}
      {qrModalItem && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setQrModalItem(null)}
        >
          <div
            className="bg-surface rounded-2xl border-2 border-on-surface p-6 max-w-sm w-full shadow-[6px_6px_0px_0px_rgba(28,27,27,1)] flex flex-col items-center gap-4 text-center animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between w-full border-b border-outline-variant/60 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-primary">qr_code_scanner</span>
                Scan to Register
              </span>
              <button
                type="button"
                onClick={() => setQrModalItem(null)}
                className="w-7 h-7 rounded-lg border border-outline-variant hover:border-error hover:text-error flex items-center justify-center text-secondary transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            <h3 className="font-bold text-sm text-on-surface">{qrModalItem.title}</h3>

            <div className="w-56 h-56 rounded-xl border-2 border-on-surface bg-white p-3 flex items-center justify-center shadow-inner overflow-hidden">
              <img
                src={qrModalItem.qrUrl}
                alt="Registration QR Code"
                className="w-full h-full object-contain"
              />
            </div>

            <p className="text-xs text-secondary leading-snug">
              Point your smartphone camera at this QR code to open the registration form directly.
            </p>

            {qrModalItem.regLink && (
              <a
                href={qrModalItem.regLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-primary text-on-primary py-2 px-4 rounded-xl text-xs font-bold uppercase border border-on-surface shadow-[2px_2px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Or Open Registration Link</span>
                <span className="material-symbols-outlined text-[15px]">open_in_new</span>
              </a>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
