/**
 * ==============================================================================
 * IEDC GECT Innovation Chronicle - Google Apps Script Backend
 * ==============================================================================
 * 
 * Instructions:
 * 1. Open your Google Sheet where subscribers are collected.
 * 2. In the menu, go to: Extensions > Apps Script
 * 3. Replace all existing code in the editor with this entire file.
 * 4. Click "Save" (disk icon).
 * 5. Click "Deploy" > "Manage deployments" > Edit current deployment (or "New deployment").
 *    - Type: Web app
 *    - Description: IEDC Newsletter & Broadcast v2
 *    - Execute as: Me (your Google account)
 *    - Who has access: Anyone
 * 6. Click "Deploy" and authorize the script permissions (Gmail and Sheets).
 * 7. Copy the Web App URL (ends with /exec).
 * ==============================================================================
 */

// Name of sheets inside your spreadsheet
const SUBSCRIBERS_SHEET_NAME = 'Subscribers';
const LOGS_SHEET_NAME = 'Broadcast_Logs';

/**
 * Handle GET requests (health check, subscriber verification, count)
 */
function doGet(e) {
  try {
    const action = e.parameter.action;
    const email = (e.parameter.email || '').trim().toLowerCase();

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

      MailApp.sendEmail({
        to: recipient,
        subject: subject,
        htmlBody: htmlBody,
        name: 'IEDC GECT Innovation Chronicle',
      });

      return jsonResponse({ success: true, message: 'Test email sent to ' + recipient });
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

          MailApp.sendEmail({
            to: subscriberEmail,
            subject: subject,
            htmlBody: personalizedHtml,
            name: 'IEDC GECT Innovation Chronicle',
          });

          sentCount++;
          // Pause slightly between sends to respect Google quota
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
