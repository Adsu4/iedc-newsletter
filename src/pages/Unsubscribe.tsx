import { useState } from 'react';
import { Link } from 'react-router-dom';
import { unsubscribe } from '../data/subscriptionService';

export default function Unsubscribe() {
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      alert('Please enter your email address.');
      return;
    }

    setIsSubmitting(true);
    await unsubscribe(email.trim(), reason, feedback);
    setIsSubmitting(false);
    setIsDone(true);
  };

  if (isDone) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="max-w-md text-center bg-surface p-10 rounded-[2rem] border-4 border-on-surface shadow-[12px_12px_0px_0px_rgba(28,27,27,1)]">
          <div className="text-6xl mb-6">😿</div>
          <h1 className="text-headline-xl font-headline-xl text-on-surface uppercase mb-4 leading-none">
            We're sad to see you go
          </h1>
          <p className="text-body-lg text-secondary mb-8 leading-relaxed">
            You've been unsubscribed from the IEDC GECT Newsletter. If you ever change your mind, you can re-subscribe anytime.
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-on-primary rounded-full text-label-bold font-label-bold uppercase border-2 border-on-surface shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(28,27,27,1)] transition-all w-full"
          >
            <span className="material-symbols-outlined text-[18px]">home</span>
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

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
        <form onSubmit={handleSubmit} className="bg-surface p-8 md:p-10 rounded-[2rem] border-4 border-on-surface shadow-[12px_12px_0px_0px_rgba(28,27,27,1)] flex flex-col gap-6">
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

          {/* Normal Unsubscribe Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 bg-error text-on-error px-8 py-4 rounded-xl text-label-bold font-label-bold uppercase border-2 border-on-surface shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(28,27,27,1)] transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                Unsubscribing...
              </>
            ) : (
              'Unsubscribe'
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
