import { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { unsubscribe } from '../data/subscriptionService';

const DODGE_MESSAGES = [
  "Are you sure? 😢",
  "We'll miss you!",
  "One more chance? 🥺",
  "Think about it...",
  "Okay okay, fine... 😮‍💨",
];

export default function Unsubscribe() {
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [feedback, setFeedback] = useState('');
  const [dodgeCount, setDodgeCount] = useState(0);
  const [dodgeMessage, setDodgeMessage] = useState('');
  const [buttonOffset, setButtonOffset] = useState({ x: 0, y: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const maxDodges = 5;

  const dodgeButton = useCallback(() => {
    if (dodgeCount >= maxDodges) return; // Button has given up

    const containerEl = containerRef.current;
    if (!containerEl) return;

    const rect = containerEl.getBoundingClientRect();
    const maxX = Math.min(rect.width / 2 - 80, 200);
    const maxY = Math.min(150, 120);

    const newX = (Math.random() - 0.5) * 2 * maxX;
    const newY = (Math.random() - 0.5) * 2 * maxY;

    setButtonOffset({ x: newX, y: newY });
    setDodgeMessage(DODGE_MESSAGES[Math.min(dodgeCount, DODGE_MESSAGES.length - 1)]);
    setDodgeCount((c) => c + 1);
  }, [dodgeCount]);

  const handleSubmit = async () => {
    if (!email.trim()) {
      alert('Please enter your email address.');
      return;
    }

    setIsSubmitting(true);
    await unsubscribe(email, reason, feedback);
    setIsSubmitting(false);
    setIsDone(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
  };

  if (isDone) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Confetti */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="absolute animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-${Math.random() * 20}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 3}s`,
                  fontSize: `${12 + Math.random() * 18}px`,
                }}
              >
                {['😢', '💔', '👋', '🫡', '🥲'][Math.floor(Math.random() * 5)]}
              </div>
            ))}
          </div>
        )}

        <div className="max-w-md text-center">
          <div className="text-6xl mb-6">😿</div>
          <h1 className="text-headline-xl font-headline-xl text-on-surface uppercase mb-4">We're sad to see you go</h1>
          <p className="text-body-lg text-secondary mb-8">
            You've been unsubscribed from the IEDC GECT Newsletter. If you ever change your mind, we'll be right here.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-on-primary rounded-full text-label-bold font-label-bold uppercase border-2 border-on-surface shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(28,27,27,1)] transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">home</span>
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  const buttonHasGivenUp = dodgeCount >= maxDodges;

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group mb-8">
            <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
            <span className="font-label-bold text-label-bold uppercase">Back to Home</span>
          </Link>
          <h1 className="text-headline-xl font-headline-xl text-on-surface uppercase leading-none mb-3">Unsubscribe</h1>
          <p className="text-body-md text-secondary">We're sorry to hear you want to leave. Please let us know why.</p>
        </div>

        {/* Form */}
        <div className="bg-surface p-8 rounded-2xl border-4 border-on-surface shadow-[8px_8px_0px_0px_rgba(28,27,27,1)] flex flex-col gap-6">
          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-label-bold font-label-bold uppercase text-on-surface tracking-wider" htmlFor="unsub-email">Your Email</label>
            <input
              id="unsub-email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 rounded-xl border-2 border-on-surface bg-surface-container-lowest text-body-md font-body-md focus:border-primary focus:outline-none transition-colors placeholder-on-surface/50 shadow-[4px_4px_0px_0px_rgba(28,27,27,1)]"
              required
            />
          </div>

          {/* Reason Dropdown */}
          <div className="flex flex-col gap-2">
            <label className="text-label-bold font-label-bold uppercase text-on-surface tracking-wider" htmlFor="unsub-reason">Why are you unsubscribing?</label>
            <select
              id="unsub-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-6 py-4 rounded-xl border-2 border-on-surface bg-surface-container-lowest text-body-md font-body-md focus:border-primary focus:outline-none transition-colors shadow-[4px_4px_0px_0px_rgba(28,27,27,1)]"
            >
              <option value="">Select a reason...</option>
              <option value="too_many">Too many emails</option>
              <option value="not_relevant">Content not relevant</option>
              <option value="lost_interest">Lost interest</option>
              <option value="never_subscribed">I never subscribed</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Feedback Textarea */}
          <div className="flex flex-col gap-2">
            <label className="text-label-bold font-label-bold uppercase text-on-surface tracking-wider" htmlFor="unsub-feedback">
              Any feedback for us? <span className="text-secondary font-normal normal-case">(optional)</span>
            </label>
            <textarea
              id="unsub-feedback"
              placeholder="Tell us how we could improve..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
              className="w-full px-6 py-4 rounded-xl border-2 border-on-surface bg-surface-container-lowest text-body-md font-body-md focus:border-primary focus:outline-none transition-colors placeholder-on-surface/50 shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] resize-none"
            />
          </div>

          {/* The Dodging Button Area */}
          <div ref={containerRef} className="relative min-h-[160px] flex flex-col items-center justify-center mt-4">
            {/* Dodge message */}
            {dodgeMessage && !buttonHasGivenUp && (
              <p className="text-body-lg font-headline-md text-secondary mb-4 animate-pulse text-center">
                {dodgeMessage}
              </p>
            )}

            {buttonHasGivenUp && (
              <p className="text-body-md text-secondary mb-4 text-center italic">
                Fine... you can click it now 😮‍💨
              </p>
            )}

            <button
              ref={buttonRef}
              onClick={buttonHasGivenUp ? handleSubmit : undefined}
              onMouseEnter={!buttonHasGivenUp ? dodgeButton : undefined}
              disabled={isSubmitting}
              className={`px-8 py-4 rounded-xl text-label-bold font-label-bold uppercase border-2 border-on-surface transition-all duration-200 ${
                buttonHasGivenUp
                  ? 'bg-error text-on-error shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(28,27,27,1)] cursor-pointer'
                  : 'bg-error/80 text-on-error shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] cursor-pointer'
              } disabled:opacity-50`}
              style={{
                transform: buttonHasGivenUp
                  ? undefined
                  : `translate(${buttonOffset.x}px, ${buttonOffset.y}px)`,
                transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                  Unsubscribing...
                </span>
              ) : (
                'Unsubscribe'
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
