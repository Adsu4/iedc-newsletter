import { useState, useEffect, useRef } from 'react';
import { monthlyStats, currentEditionInfo } from '../data/newsletterData';

function useCountUp(target: string, duration = 1200) {
  const [display, setDisplay] = useState('0');
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          // Extract numeric part and suffix
          const numericMatch = target.match(/^[₹]?([\d,.]+)/);
          const prefix = target.match(/^₹/) ? '₹' : '';
          const suffix = target.replace(/^[₹]?[\d,.]+/, '');
          
          if (numericMatch) {
            const endValue = parseFloat(numericMatch[1].replace(/,/g, ''));
            const startTime = performance.now();
            
            const animate = (now: number) => {
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Ease-out cubic
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = Math.round(eased * endValue);
              
              // Format with commas if original had them
              const formatted = numericMatch[1].includes(',')
                ? current.toLocaleString('en-IN')
                : String(current);
              
              setDisplay(`${prefix}${formatted}${suffix}`);
              
              if (progress < 1) {
                requestAnimationFrame(animate);
              } else {
                setDisplay(target);
              }
            };
            requestAnimationFrame(animate);
          } else {
            setDisplay(target);
          }
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration, hasAnimated]);

  return { display, ref };
}

export default function NumbersTicker() {
  const statItems = [
    {
      label: 'Events Conducted',
      value: `${monthlyStats.eventsConducted}`,
      subtext: 'Hackathons & summits',
      icon: 'campaign',
      color: 'bg-primary text-on-primary',
    },
    {
      label: 'Active Participants',
      value: monthlyStats.participants,
      subtext: 'Students & attendees',
      icon: 'groups',
      color: 'bg-tertiary text-on-tertiary',
    },
    {
      label: 'Hands-on Workshops',
      value: `${monthlyStats.workshops}`,
      subtext: 'AI, Cloud & Hardware',
      icon: 'construction',
      color: 'bg-secondary text-on-secondary',
    },
    {
      label: 'Industry Collabs',
      value: `${monthlyStats.industryCollabs}`,
      subtext: 'MoUs & mentorship',
      icon: 'handshake',
      color: 'bg-surface-container-high text-on-surface',
    },
    {
      label: 'New Initiatives',
      value: `${monthlyStats.newInitiatives}`,
      subtext: 'Labs & student tracks',
      icon: 'bolt',
      color: 'bg-primary text-on-primary',
    },
    {
      label: 'Student Projects',
      value: monthlyStats.studentProjects,
      subtext: 'Prototypes & patents',
      icon: 'lightbulb',
      color: 'bg-tertiary text-on-tertiary',
    },
  ];

  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-4 border-on-surface pb-6 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-tertiary text-on-tertiary px-3.5 py-1 rounded-full text-label-bold font-label-bold uppercase text-xs">
              Monthly Impact
            </span>
            <span className="text-secondary font-label-bold uppercase text-xs">
              • {currentEditionInfo.monthYear}
            </span>
          </div>
          <h2 className="text-display-lg-mobile md:text-headline-xl font-display-lg-mobile md:font-headline-xl text-on-surface uppercase leading-none">
            IEDC by the Numbers
          </h2>
        </div>
        <div className="bg-surface px-6 py-3 rounded-2xl border-2 border-on-surface shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-[22px]">account_balance_wallet</span>
          <div>
            <div className="text-[11px] font-label-bold uppercase text-secondary">Grants & Funding Mobilized</div>
            <div className="text-headline-md font-headline-md text-on-surface leading-tight">{monthlyStats.totalGrantsMobilized}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
        {statItems.map((item, index) => {
          const counter = useCountUp(item.value);
          return (
            <div
              key={item.label}
              ref={counter.ref}
              className="bg-surface p-6 rounded-2xl border-4 border-on-surface shadow-[6px_6px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(28,27,27,1)] transition-all flex flex-col justify-between"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl border-2 border-on-surface ${item.color} flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(28,27,27,1)]`}>
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                </div>
              </div>
              <div>
                <div className="text-display-lg-mobile font-display-lg-mobile font-black text-on-surface leading-none mb-1 tabular-nums">
                  {counter.display}
                </div>
                <div className="text-label-bold font-label-bold uppercase text-on-surface text-xs leading-tight mb-1">
                  {item.label}
                </div>
                <div className="text-[11px] text-secondary font-body-md">
                  {item.subtext}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
