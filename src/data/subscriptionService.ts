const WEBHOOK_URL = import.meta.env.VITE_GOOGLE_SHEET_WEBHOOK || '';

interface SubscribePayload {
  email: string;
  action: 'subscribe' | 'unsubscribe';
  reason?: string;
  feedback?: string;
}

export async function submitToGoogleSheet(payload: SubscribePayload): Promise<boolean> {
  if (!WEBHOOK_URL) {
    console.warn('Google Sheet webhook URL not configured. Set VITE_GOOGLE_SHEET_WEBHOOK in your environment variables.');
    // Still return true so the UI flow completes in dev
    return true;
  }

  try {
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors', // Google Apps Script requires no-cors
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        timestamp: new Date().toISOString(),
      }),
    });

    // no-cors mode always returns opaque response, so we can't check status
    // If the fetch itself didn't throw, consider it successful
    return true;
  } catch (err) {
    console.error('Failed to submit to Google Sheet:', err);
    return false;
  }
}

export async function subscribe(email: string): Promise<boolean> {
  return submitToGoogleSheet({ email, action: 'subscribe' });
}

export async function unsubscribe(email: string, reason?: string, feedback?: string): Promise<boolean> {
  return submitToGoogleSheet({ email, action: 'unsubscribe', reason, feedback });
}
