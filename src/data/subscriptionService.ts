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

export interface ProjectSubmissionNotificationParams {
  projectTitle: string;
  teamName?: string;
  teamMembers?: { name: string; url?: string }[];
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  articleId: string;
  articleSummary?: string;
}

/**
 * Sends an email notification to gectiedc@gmail.com with project details and a direct
 * link to the admin panel for review and approval.
 */
export async function sendProjectSubmissionAdminNotification(
  params: ProjectSubmissionNotificationParams
): Promise<boolean> {
  const adminEmail = 'gectiedc@gmail.com';
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://iedc-newsletter.vercel.app';
  const adminReviewUrl = `${siteUrl}/admin/article/${params.articleId}`;

  const membersText = params.teamMembers && params.teamMembers.length > 0
    ? params.teamMembers.map((m) => m.name).filter(Boolean).join(', ')
    : 'Not listed';

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 2px solid #1c1b1b; border-radius: 16px; overflow: hidden; box-shadow: 4px 4px 0px #1c1b1b;">
      <div style="background: #C25E37; color: #ffffff; padding: 20px 24px;">
        <span style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; background: rgba(0,0,0,0.25); padding: 4px 10px; border-radius: 99px;">
          IEDC Projects Showcase Submission
        </span>
        <h1 style="margin: 12px 0 4px 0; font-size: 22px; line-height: 1.3;">
          New Project Submission Pending Approval
        </h1>
        <p style="margin: 0; font-size: 13px; opacity: 0.95;">
          A student innovator has submitted their project for review.
        </p>
      </div>

      <div style="padding: 24px; color: #1c1b1b;">
        <h2 style="font-size: 18px; margin: 0 0 8px 0; color: #1c1b1b;">
          ${params.projectTitle}
        </h2>
        ${params.articleSummary ? `<p style="font-size: 14px; color: #555; line-height: 1.5; margin: 0 0 16px 0;">${params.articleSummary}</p>` : ''}

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
          ${params.teamName ? `<tr><td style="padding: 6px 0; font-weight: bold; width: 140px; color: #777;">Team Name:</td><td style="padding: 6px 0; font-weight: bold;">${params.teamName}</td></tr>` : ''}
          <tr><td style="padding: 6px 0; font-weight: bold; width: 140px; color: #777;">Team Members:</td><td style="padding: 6px 0;">${membersText}</td></tr>
        </table>

        <!-- Confidential Submitter Details -->
        <div style="background: #FDF4ED; border: 1px solid #E8BAA8; border-radius: 12px; padding: 14px; margin-bottom: 24px;">
          <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #C25E37; margin-bottom: 6px;">
            🔒 Submitter Contact (Confidential - For Editorial Use Only)
          </div>
          <div style="font-size: 13px; line-height: 1.6;">
            <strong>Lead Contact:</strong> ${params.contactName}<br/>
            <strong>Email:</strong> <a href="mailto:${params.contactEmail}">${params.contactEmail}</a><br/>
            <strong>Phone:</strong> <a href="tel:${params.contactPhone}">${params.contactPhone}</a>
          </div>
        </div>

        <div style="text-align: center; margin: 28px 0 12px 0;">
          <a href="${adminReviewUrl}" style="display: inline-block; background: #C25E37; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 14px; text-transform: uppercase; padding: 12px 28px; border-radius: 99px; border: 2px solid #1c1b1b; box-shadow: 2px 2px 0px #1c1b1b;">
            Review, Edit &amp; Publish in Admin Panel →
          </a>
        </div>
        <p style="text-align: center; font-size: 11px; color: #888; margin-top: 8px;">
          Direct Review Link: <a href="${adminReviewUrl}" style="color: #C25E37;">${adminReviewUrl}</a>
        </p>
      </div>
    </div>
  `;

  if (WEBHOOK_URL) {
    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'test_email',
          recipient: adminEmail,
          subject: `[ACTION REQUIRED] New Project for Approval: ${params.projectTitle}`,
          htmlBody,
          timestamp: new Date().toISOString(),
        }),
      });
      return true;
    } catch (err) {
      console.error('Failed to notify admin via webhook:', err);
    }
  }

  return true;
}

