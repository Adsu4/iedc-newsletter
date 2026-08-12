const WEBHOOK_URL = import.meta.env.VITE_GOOGLE_SHEET_WEBHOOK || '';
const LOCAL_SUBS_KEY = 'iedc_subscribed_emails';

export type SubscribeResult = 'created' | 'already_subscribed' | 'resubscribed' | 'unsubscribed' | 'error';

interface SubRecord {
  email: string;
  action: 'subscribe' | 'unsubscribe';
  updatedAt: string;
}

function getLocalSubscribers(): SubRecord[] {
  try {
    const stored = localStorage.getItem(LOCAL_SUBS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
}

function saveLocalSubscribers(list: SubRecord[]): void {
  try {
    localStorage.setItem(LOCAL_SUBS_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save subscribers to localStorage:', e);
  }
}

export async function subscribe(email: string): Promise<SubscribeResult> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) return 'error';

  const current = getLocalSubscribers();
  const existingIdx = current.findIndex((s) => s.email === normalizedEmail);

  let result: SubscribeResult = 'created';

  if (existingIdx !== -1) {
    if (current[existingIdx].action === 'subscribe') {
      result = 'already_subscribed';
    } else {
      result = 'resubscribed';
      current[existingIdx] = { email: normalizedEmail, action: 'subscribe', updatedAt: new Date().toISOString() };
    }
  } else {
    current.push({ email: normalizedEmail, action: 'subscribe', updatedAt: new Date().toISOString() });
  }

  saveLocalSubscribers(current);

  // Send payload to Google Sheets Webhook for cloud deduplication
  if (WEBHOOK_URL) {
    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          email: normalizedEmail,
          action: 'subscribe',
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.error('Failed to submit to Google Sheet webhook:', err);
    }
  }

  return result;
}

export async function unsubscribe(email: string, reason?: string, feedback?: string): Promise<boolean> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) return false;

  const current = getLocalSubscribers();
  const existingIdx = current.findIndex((s) => s.email === normalizedEmail);

  if (existingIdx !== -1) {
    current[existingIdx] = { email: normalizedEmail, action: 'unsubscribe', updatedAt: new Date().toISOString() };
  } else {
    current.push({ email: normalizedEmail, action: 'unsubscribe', updatedAt: new Date().toISOString() });
  }

  saveLocalSubscribers(current);

  if (WEBHOOK_URL) {
    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          email: normalizedEmail,
          action: 'unsubscribe',
          reason: reason || '',
          feedback: feedback || '',
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.error('Failed to submit unsubscribe to Google Sheet webhook:', err);
    }
  }

  return true;
}
