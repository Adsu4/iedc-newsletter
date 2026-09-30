/**
 * ==============================================================================
 * IEDC GECT Innovation Chronicle - Google Apps Script Backend
 * ==============================================================================
 * 
 * IMPORTANT: ONE-TIME PERMISSION AUTHORIZATION (Takes 30 seconds)
 * 1. In the Apps Script toolbar at the top, find the function dropdown.
 * 2. Select "testAuth" from the dropdown.
 * 3. Click "▷ Run".
 * 4. Google will show a popup: "Authorization required".
 * 5. Click "Review permissions" -> Select your Google account (iedc@gectcr.ac.in or your account).
 * 6. Click "Advanced" (small link at bottom left of popup) -> Click "Go to Untitled project (unsafe)".
 * 7. Click "Allow".
 * 
 * SENDER EMAIL:
 * - If this script is run from the iedc@gectcr.ac.in Google account, emails will
 *   automatically be sent FROM iedc@gectcr.ac.in.
 * - If run from another account, it sets the sender display name to
 *   "IEDC GECT Innovation Chronicle" and replyTo to "iedc@gectcr.ac.in".
 *   (You can also add iedc@gectcr.ac.in as a 'Send mail as' alias in Gmail settings).
 * ==============================================================================
 */

// Name of sheets inside your spreadsheet
const SUBSCRIBERS_SHEET_NAME = 'Subscribers';
const LOGS_SHEET_NAME = 'Broadcast_Logs';
const OFFICIAL_EMAIL = 'iedc@gectcr.ac.in';

/**
 * ⚡ RUN THIS FUNCTION ONCE INSIDE APPS SCRIPT TO GRANT EMAIL PERMISSION
 * In the top dropdown, select "testAuth", then click "▷ Run".
 */
function testAuth() {
  Logger.log('Starting authorization check...');
  const activeUser = Session.getActiveUser().getEmail();
  Logger.log('Active executing user: ' + activeUser);

  const testSubject = '[VERIFICATION] IEDC GECT Chronicle - Email Authorization';
  const testHtml = '<div style="font-family: sans-serif; padding: 20px; border: 2px solid #1C1B1B; border-radius: 8px;">' +
    '<h2 style="color: #C25E37; margin-top: 0;">Authorization Successful!</h2>' +
    '<p>Your Google Apps Script is now fully authorized to send newsletter emails.</p>' +
    '<p><strong>Sender:</strong> ' + activeUser + '</p>' +
    '<p><strong>Official Contact:</strong> ' + OFFICIAL_EMAIL + '</p>' +
    '</div>';

  sendInnovationEmail(activeUser, testSubject, testHtml);
  Logger.log('Success! Test verification email sent to: ' + activeUser);
}

/**
 * Robust Email Sender: Sets official name, replyTo, and from alias when available
 */
function sendInnovationEmail(recipient, subject, htmlBody) {
  const options = {
    htmlBody: htmlBody,
    name: 'IEDC GECT Innovation Chronicle',
    replyTo: OFFICIAL_EMAIL,
  };

  // If executing account has iedc@gectcr.ac.in configured as an alias, use it as 'from'
  try {
    const aliases = GmailApp.getAliases();
    if (aliases && aliases.indexOf(OFFICIAL_EMAIL) > -1) {
      options.from = OFFICIAL_EMAIL;
    }
  } catch (aliasErr) {
    Logger.log('Alias check note: ' + aliasErr.toString());
  }

  try {
    GmailApp.sendEmail(recipient, subject, '', options);
  } catch (gmailErr) {
    Logger.log('GmailApp send error, falling back to MailApp: ' + gmailErr.toString());
    MailApp.sendEmail({
      to: recipient,
      subject: subject,
      htmlBody: htmlBody,
      name: 'IEDC GECT Innovation Chronicle',
      replyTo: OFFICIAL_EMAIL,
    });
  }
}

/**
 * Handle GET requests (health check, subscriber verification, count)
 */
function doGet(e) {
  try {
    const action = e ? e.parameter.action : '';
    const email = e && e.parameter.email ? e.parameter.email.trim().toLowerCase() : '';

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = getOrCreateSheet(ss, SUBSCRIBERS_SHEET_NAME, ['Email', 'Status', 'Subscribed At', 'Unsubscribed At', 'Reason', 'Feedback']);

    if (action === 'check') {
      const status = checkSubscriberStatus(sheet, email);
      return jsonResponse({ status: status });
    }

    if (action === 'count') {
      const count = countActiveSubscribers(sheet);
      return jsonResponse({ count: count });
    }

    return jsonResponse({ status: 'ok', message: 'IEDC Newsletter Webhook is active' });
  } catch (err) {
    return jsonResponse({ error: err.toString() });
  }
}

/**
 * Handle POST requests (Subscribe, Unsubscribe, Test Email, Broadcast Newsletter)
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ error: 'No post data received' });
    }

    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const subSheet = getOrCreateSheet(ss, SUBSCRIBERS_SHEET_NAME, ['Email', 'Status', 'Subscribed At', 'Unsubscribed At', 'Reason', 'Feedback']);

    // 1. SUBSCRIBE
    if (action === 'subscribe') {
      const email = (data.email || '').trim().toLowerCase();
      if (!email) return jsonResponse({ error: 'Missing email' });

      handleSubscribe(subSheet, email);
      return jsonResponse({ success: true, message: 'Subscribed successfully' });
    }

    // 2. UNSUBSCRIBE
    if (action === 'unsubscribe') {
      const email = (data.email || '').trim().toLowerCase();
      if (!email) return jsonResponse({ error: 'Missing email' });

      handleUnsubscribe(subSheet, email, data.reason || '', data.feedback || '');
      return jsonResponse({ success: true, message: 'Unsubscribed successfully' });
    }

    // 3. SEND TEST EMAIL
    if (action === 'test_email') {
      const recipient = (data.recipient || '').trim().toLowerCase();
      if (!recipient) return jsonResponse({ error: 'Missing recipient' });

      const subject = data.subject || '[PREVIEW] IEDC GECT Innovation Chronicle';
      const htmlBody = data.htmlBody || '<p>Test email preview</p>';

      sendInnovationEmail(recipient, subject, htmlBody);
      return jsonResponse({ success: true, message: 'Test email successfully dispatched to ' + recipient });
    }

    // 4. BROADCAST NEWSLETTER TO ALL SUBSCRIBERS
    if (action === 'broadcast_newsletter') {
      const subject = data.subject || 'IEDC GECT Innovation Chronicle - Monthly Newsletter';
      const rawHtml = data.htmlBody || '';
      const articleTitle = data.title || 'Untitled Monthly Edition';
      const articleId = data.articleId || '';

      const activeSubscribers = getActiveSubscribers(subSheet);

      if (activeSubscribers.length === 0) {
        return jsonResponse({ success: false, message: 'No active subscribers found in sheet' });
      }

      let sentCount = 0;
      let failedCount = 0;

      for (let i = 0; i < activeSubscribers.length; i++) {
        const subscriberEmail = activeSubscribers[i];
        try {
          // Personalize the unsubscribe link for this recipient
          const personalizedHtml = rawHtml
            .replace(/\{\{EMAIL\}\}/g, encodeURIComponent(subscriberEmail))
            .replace(/\{\{UNSUBSCRIBE_URL\}\}/g, 'https://iedc-newsletter.vercel.app/unsubscribe?email=' + encodeURIComponent(subscriberEmail));

          sendInnovationEmail(subscriberEmail, subject, personalizedHtml);

          sentCount++;
          // Pause slightly between sends to respect Google rate limits
          Utilities.sleep(150);
        } catch (mailErr) {
          failedCount++;
          Logger.log('Failed to send to ' + subscriberEmail + ': ' + mailErr.toString());
        }
      }

      // Log the broadcast in the Broadcast_Logs sheet
      const logSheet = getOrCreateSheet(ss, LOGS_SHEET_NAME, ['Timestamp', 'Article ID', 'Title', 'Sent Count', 'Failed Count', 'Subject']);
      logSheet.appendRow([
        new Date().toISOString(),
        articleId,
        articleTitle,
        sentCount,
        failedCount,
        subject,
      ]);

      return jsonResponse({
        success: true,
        sentCount: sentCount,
        failedCount: failedCount,
        total: activeSubscribers.length,
        message: 'Successfully broadcasted newsletter to ' + sentCount + ' subscribers',
      });
    }

    return jsonResponse({ error: 'Unknown action: ' + action });
  } catch (err) {
    Logger.log('Webhook error: ' + err.toString());
    return jsonResponse({ error: err.toString() });
  }
}

// ------------------------------------------------------------------------------
// Helper Functions
// ------------------------------------------------------------------------------

function getOrCreateSheet(ss, sheetName, headers) {
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    if (headers && headers.length > 0) {
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    }
  }
  return sheet;
}

function checkSubscriberStatus(sheet, email) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    const rowEmail = (data[i][0] || '').toString().trim().toLowerCase();
    const rowStatus = (data[i][1] || '').toString().trim().toLowerCase();
    if (rowEmail === email) {
      return rowStatus === 'unsubscribed' ? 'unsubscribed' : 'already_subscribed';
    }
  }
  return 'none';
}

function handleSubscribe(sheet, email) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    const rowEmail = (data[i][0] || '').toString().trim().toLowerCase();
    if (rowEmail === email) {
      // Re-activate if was unsubscribed
      sheet.getRange(i + 1, 2).setValue('subscribed');
      sheet.getRange(i + 1, 3).setValue(new Date().toISOString());
      return;
    }
  }
  // New subscriber
  sheet.appendRow([email, 'subscribed', new Date().toISOString(), '', '', '']);
}

function handleUnsubscribe(sheet, email, reason, feedback) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    const rowEmail = (data[i][0] || '').toString().trim().toLowerCase();
    if (rowEmail === email) {
      sheet.getRange(i + 1, 2).setValue('unsubscribed');
      sheet.getRange(i + 1, 4).setValue(new Date().toISOString());
      sheet.getRange(i + 1, 5).setValue(reason);
      sheet.getRange(i + 1, 6).setValue(feedback);
      return;
    }
  }
  // If not found, add record as unsubscribed
  sheet.appendRow([email, 'unsubscribed', '', new Date().toISOString(), reason, feedback]);
}

function getActiveSubscribers(sheet) {
  const data = sheet.getDataRange().getValues();
  const subscribers = [];
  for (let i = 1; i < data.length; i++) {
    const email = (data[i][0] || '').toString().trim().toLowerCase();
    const status = (data[i][1] || '').toString().trim().toLowerCase();
    if (email && email.includes('@') && status !== 'unsubscribed') {
      if (!subscribers.includes(email)) {
        subscribers.push(email);
      }
    }
  }
  return subscribers;
}

function countActiveSubscribers(sheet) {
  return getActiveSubscribers(sheet).length;
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
