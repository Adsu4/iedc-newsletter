import { generateNewsletterEmailHtml } from './emailTemplateService';

const WEBHOOK_URL = import.meta.env.VITE_GOOGLE_SHEET_WEBHOOK || '';

export type SubscribeResult = 'created' | 'already_subscribed' | 'resubscribed' | 'error';

/** Query the live Google Sheet directly via GET to check email status */
export async function checkEmailStatus(email: string): Promise<'already_subscribed' | 'unsubscribed' | 'none'> {
  if (!WEBHOOK_URL) return 'none';
  try {
    const url = `${WEBHOOK_URL}?action=check&email=${encodeURIComponent(email.trim().toLowerCase())}`;
    const res = await fetch(url);
    if (!res.ok) return 'none';
    const json = await res.json();
    return json.status || 'none';
  } catch (e) {
    return 'none';
  }
}

export async function subscribe(email: string): Promise<SubscribeResult> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) return 'error';

  // 1. Perform a real-time live check against your Google Sheet
  const liveStatus = await checkEmailStatus(normalizedEmail);

  if (liveStatus === 'already_subscribed') {
    // Email is already active in your Google Sheet -> return 'already_subscribed' without sending duplicate POST
    return 'already_subscribed';
  }

  // 2. Submit to Google Apps Script Webhook
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

  return liveStatus === 'unsubscribed' ? 'resubscribed' : 'created';
}

export async function unsubscribe(email: string, reason?: string, feedback?: string): Promise<boolean> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) return false;

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
      return false;
    }
  }

  return true;
}

/**
 * Broadcasts an editorial HTML newsletter email to all active subscribers
 * in the connected Google Sheet via Google Apps Script.
 */
export async function broadcastNewsletter(article: {
  id: string;
  title: string;
  subtitle?: string;
  category?: string;
  date?: string;
  readTime?: string;
  imageUrl?: string;
  content?: { paragraphs?: string[]; html?: string };
}): Promise<boolean> {
  if (!WEBHOOK_URL) {
    console.warn('Cannot broadcast newsletter: VITE_GOOGLE_SHEET_WEBHOOK is not configured.');
    return false;
  }

  try {
    const htmlBody = generateNewsletterEmailHtml({
      id: String(article.id),
      title: article.title,
      subtitle: article.subtitle,
      category: article.category || 'Monthly Newsletter',
      date: article.date,
      readTime: article.readTime,
      imageUrl: article.imageUrl,
      paragraphs: article.content?.paragraphs,
      articleUrl: `https://iedc-newsletter.vercel.app/article/${article.id}`,
      unsubscribeUrl: `https://iedc-newsletter.vercel.app/unsubscribe?email={{EMAIL}}`,
    });

    await fetch(WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        action: 'broadcast_newsletter',
        subject: `IEDC GECT Chronicle: ${article.title}`,
        articleId: String(article.id),
        title: article.title,
        subtitle: article.subtitle || '',
        category: article.category || 'Monthly Newsletter',
        date: article.date || '',
        readTime: article.readTime || '',
        imageUrl: article.imageUrl || '',
        articleUrl: `https://iedc-newsletter.vercel.app/article/${article.id}`,
        unsubscribeUrl: `https://iedc-newsletter.vercel.app/unsubscribe`,
        htmlBody,
        timestamp: new Date().toISOString(),
      }),
    });
    return true;
  } catch (err) {
    console.error('Failed to trigger newsletter broadcast:', err);
    return false;
  }
}

/**
 * Sends a single test email of the newsletter to the admin for visual inspection.
 */
export async function sendTestNewsletterEmail(
  testEmail: string,
  article: {
    id: string;
    title: string;
    subtitle?: string;
    category?: string;
    date?: string;
    readTime?: string;
    imageUrl?: string;
    content?: { paragraphs: string[] };
  }
): Promise<boolean> {
  if (!WEBHOOK_URL) {
    alert('Google Sheet Webhook URL is not configured.');
    return false;
  }

  const normalized = testEmail.trim().toLowerCase();
  if (!normalized) return false;

  try {
    const htmlBody = generateNewsletterEmailHtml({
      id: String(article.id),
      title: article.title,
      subtitle: article.subtitle,
      category: article.category || 'Monthly Newsletter',
      date: article.date,
      readTime: article.readTime,
      imageUrl: article.imageUrl,
      paragraphs: article.content?.paragraphs,
      articleUrl: `https://iedc-newsletter.vercel.app/article/${article.id}`,
      unsubscribeUrl: `https://iedc-newsletter.vercel.app/unsubscribe?email=${encodeURIComponent(normalized)}`,
    });

    await fetch(WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        action: 'test_email',
        recipient: normalized,
        subject: `[PREVIEW] IEDC GECT Chronicle: ${article.title}`,
        htmlBody,
        timestamp: new Date().toISOString(),
      }),
    });
    return true;
  } catch (err) {
    console.error('Failed to send test email:', err);
    return false;
  }
}
