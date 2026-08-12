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
    return true;
  }

  try {
    // Note: Content-Type text/plain with no-cors avoids CORS preflight blocking in browsers
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        ...payload,
        timestamp: new Date().toISOString(),
      }),
    });

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
