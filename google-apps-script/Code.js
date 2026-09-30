// ==============================================================================
// IEDC GECT Innovation Chronicle — Google Apps Script (Live Sheet & Email Broadcast)
// Official Account: iedc@gectcr.ac.in
// ==============================================================================

/**
 * ⚡ RUN THIS FUNCTION ONCE IN APPS SCRIPT EDITOR TO AUTHORIZE EMAIL SENDING:
 * 1. In the top dropdown (where it says doGet), select "testAuth".
 * 2. Click "▷ Run".
 * 3. Click "Review permissions" -> Choose iedc@gectcr.ac.in -> "Advanced" -> "Go to Untitled project (unsafe)" -> "Allow".
 * 4. Deploy > Manage deployments > Edit > New version > Deploy.
 */
function testAuth() {
  Logger.log("Testing authorization...");
  var email = Session.getActiveUser().getEmail() || "iedc@gectcr.ac.in";
  sendInnovationEmail(
    email,
    "IEDC GECT Innovation Chronicle - Authorization Test",
    "<div style='font-family: sans-serif; padding: 24px; border: 3px solid #1C1B1B; border-radius: 12px; background-color: #FFFFFF; max-width: 500px;'>" +
    "<span style='background-color: #C25E37; color: #FFFFFF; font-size: 10px; font-weight: bold; padding: 3px 8px; border-radius: 9999px; text-transform: uppercase;'>Verified</span>" +
    "<h2 style='color: #1C1B1B; margin-top: 10px;'>Authorization Successful!</h2>" +
    "<p style='color: #555555; line-height: 1.5;'>Your Google Apps Script is now fully authorized to send newsletter emails from <strong>" + email + "</strong>.</p>" +
    "<p style='font-size: 12px; color: #888888;'>Official Sender: IEDC GECT Innovation Chronicle &lt;iedc@gectcr.ac.in&gt;</p>" +
    "</div>"
  );
  Logger.log("Test email successfully sent to: " + email);
}

function sendInnovationEmail(recipient, subject, htmlBody) {
  var options = {
    htmlBody: htmlBody,
    name: "IEDC GECT Innovation Chronicle",
    replyTo: "iedc@gectcr.ac.in"
  };

  try {
    var aliases = GmailApp.getAliases();
    if (aliases && aliases.indexOf("iedc@gectcr.ac.in") > -1) {
      options.from = "iedc@gectcr.ac.in";
    }
  } catch (e) {
    // default to active user account
  }

  GmailApp.sendEmail(recipient, subject, "", options);
}

function doGet(e) {
  try {
    var params = e ? e.parameter : {};
    var email = (params.email || '').toString().trim().toLowerCase();
    var action = (params.action || '').toString().trim().toLowerCase();
    
    var sheet = getSubscribersSheet();

    // Check subscriber count
    if (action === 'count') {
      var count = getActiveSubscribers(sheet).length;
      return jsonOutput({ status: 'ok', count: count });
    }

    if (!email) {
      return jsonOutput({ status: 'ok', message: 'IEDC Newsletter webhook active' });
    }

    var lastRow = sheet.getLastRow();
    if (lastRow <= 1) {
      return jsonOutput({ status: 'none' });
    }

    var cols = getColumnIndexes(sheet);
    var emailValues = sheet.getRange(2, cols.emailCol, lastRow - 1, 1).getValues();
    var actionValues = sheet.getRange(2, cols.actionCol, lastRow - 1, 1).getValues();

    for (var r = 0; r < emailValues.length; r++) {
      if (emailValues[r][0].toString().trim().toLowerCase() === email) {
        var currentAction = actionValues[r][0].toString().trim().toLowerCase();
        return jsonOutput({ status: currentAction === 'subscribe' ? 'already_subscribed' : 'unsubscribed' });
      }
    }

    return jsonOutput({ status: 'none' });

  } catch (err) {
    return jsonOutput({ status: 'none', error: err.toString() });
  }
}

function doPost(e) {
  try {
    var sheet = getSubscribersSheet();
    var data = {};
    
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }
    
    var action = (data.action || 'subscribe').toString().trim().toLowerCase();
    var timestamp = data.timestamp || new Date().toISOString();

    // -------------------------------------------------------------
    // ACTION 1: SEND TEST PREVIEW EMAIL
    // -------------------------------------------------------------
    if (action === 'test_email') {
      var recipient = (data.recipient || '').toString().trim().toLowerCase();
      if (!recipient) {
        return jsonOutput({ result: 'error', message: 'No recipient email provided' });
      }

      var subject = data.subject || '[PREVIEW] IEDC GECT Innovation Chronicle';
      var htmlBody = data.htmlBody || '<p>IEDC Newsletter Test Preview</p>';

      sendInnovationEmail(recipient, subject, htmlBody);
      return jsonOutput({ result: 'success', message: 'Test email sent to ' + recipient });
    }

    // -------------------------------------------------------------
    // ACTION 2: BROADCAST NEWSLETTER TO ALL ACTIVE SUBSCRIBERS
    // -------------------------------------------------------------
    if (action === 'broadcast_newsletter') {
      var subject = data.subject || 'IEDC GECT Innovation Chronicle - Monthly Newsletter';
      var rawHtml = data.htmlBody || '';
      var activeSubscribers = getActiveSubscribers(sheet);

      if (activeSubscribers.length === 0) {
        return jsonOutput({ result: 'error', message: 'No active subscribers found in sheet' });
      }

      var sentCount = 0;
      var failedCount = 0;

      for (var i = 0; i < activeSubscribers.length; i++) {
        var subEmail = activeSubscribers[i];
        try {
          // Replace {{EMAIL}} token with recipient email for personalized 1-click unsubscribe
          var personalizedHtml = rawHtml
            .replace(/\{\{EMAIL\}\}/g, encodeURIComponent(subEmail))
            .replace(/\{\{UNSUBSCRIBE_URL\}\}/g, 'https://iedc-newsletter.vercel.app/unsubscribe?email=' + encodeURIComponent(subEmail));

          sendInnovationEmail(subEmail, subject, personalizedHtml);
          sentCount++;
          Utilities.sleep(120); // Small pause to respect Google sending rate
        } catch (mailErr) {
          failedCount++;
          Logger.log('Error sending to ' + subEmail + ': ' + mailErr.toString());
        }
      }

      // Record in Broadcast_Logs sheet if desired
      logBroadcast(data.articleId || '', data.title || '', sentCount, failedCount, subject);

      return jsonOutput({
        result: 'success',
        sentCount: sentCount,
        failedCount: failedCount,
        total: activeSubscribers.length,
        message: 'Successfully broadcasted newsletter to ' + sentCount + ' subscribers'
      });
    }

    // -------------------------------------------------------------
    // ACTION 3 & 4: SUBSCRIBE / UNSUBSCRIBE (YOUR EXACT LOGIC)
    // -------------------------------------------------------------
    var email = (data.email || '').toString().trim().toLowerCase();
    var reason = data.reason || '';
    var feedback = data.feedback || '';

    if (!email) {
      return jsonOutput({ result: 'error', message: 'No email provided' });
    }

    var lastRow = sheet.getLastRow();
    var cols = getColumnIndexes(sheet);

    var existingRow = -1;
    if (lastRow > 1) {
      var emailValues = sheet.getRange(2, cols.emailCol, lastRow - 1, 1).getValues();
      for (var r = 0; r < emailValues.length; r++) {
        if (emailValues[r][0].toString().trim().toLowerCase() === email) {
          existingRow = r + 2;
          break;
        }
      }
    }

    if (existingRow > -1) {
      // Edit existing row in-place (keeps your exact sheet format)
      sheet.getRange(existingRow, cols.timeCol).setValue(timestamp);
      sheet.getRange(existingRow, cols.actionCol).setValue(action);
      if (reason) sheet.getRange(existingRow, cols.reasonCol).setValue(reason);
      if (feedback) sheet.getRange(existingRow, cols.feedbackCol).setValue(feedback);

      return jsonOutput({ result: 'updated', row: existingRow, action: action });
    } else {
      // Append new row matching your column order: [Timestamp, Email, Action, Reason, Feedback]
      var newRowData = [];
      var maxCol = Math.max(cols.emailCol, cols.timeCol, cols.actionCol, cols.reasonCol, cols.feedbackCol);
      for (var c = 1; c <= maxCol; c++) {
        if (c === cols.emailCol) newRowData.push(email);
        else if (c === cols.timeCol) newRowData.push(timestamp);
        else if (c === cols.actionCol) newRowData.push(action);
        else if (c === cols.reasonCol) newRowData.push(reason);
        else if (c === cols.feedbackCol) newRowData.push(feedback);
        else newRowData.push('');
      }
      sheet.appendRow(newRowData);

      return jsonOutput({ result: 'created', action: action });
    }
  } catch (error) {
    return jsonOutput({ result: 'error', message: error.toString() });
  }
}

// -------------------------------------------------------------
// HELPER FUNCTIONS (MATCHES SHEET1 EXACTLY)
// -------------------------------------------------------------

function getSubscribersSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  // Automatically finds 'Sheet1' or 'Subscribers' or active sheet
  var sheet = ss.getSheetByName('Sheet1') || ss.getSheetByName('Subscribers') || ss.getActiveSheet();
  return sheet;
}

function getColumnIndexes(sheet) {
  var lastRow = sheet.getLastRow();
  var headers = lastRow > 0 ? sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 5)).getValues()[0] : [];
  
  var emailCol = 2; // Column B: Email
  var timeCol = 1;  // Column A: Timestamp
  var actionCol = 3; // Column C: Action
  var reasonCol = 4; // Column D: Reason
  var feedbackCol = 5; // Column E: Feedback

  for (var h = 0; h < headers.length; h++) {
    var headerText = headers[h].toString().trim().toLowerCase();
    if (headerText.indexOf('email') !== -1) emailCol = h + 1;
    if (headerText.indexOf('time') !== -1) timeCol = h + 1;
    if (headerText.indexOf('action') !== -1) actionCol = h + 1;
    if (headerText.indexOf('reason') !== -1) reasonCol = h + 1;
    if (headerText.indexOf('feedback') !== -1) feedbackCol = h + 1;
  }

  return { emailCol: emailCol, timeCol: timeCol, actionCol: actionCol, reasonCol: reasonCol, feedbackCol: feedbackCol };
}

function getActiveSubscribers(sheet) {
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return [];

  var cols = getColumnIndexes(sheet);
  var emailValues = sheet.getRange(2, cols.emailCol, lastRow - 1, 1).getValues();
  var actionValues = sheet.getRange(2, cols.actionCol, lastRow - 1, 1).getValues();

  var subscribers = [];
  for (var i = 0; i < emailValues.length; i++) {
    var email = emailValues[i][0].toString().trim().toLowerCase();
    var action = actionValues[i][0].toString().trim().toLowerCase();
    // Only send to those with action === 'subscribe'
    if (email && email.indexOf('@') !== -1 && action === 'subscribe') {
      if (subscribers.indexOf(email) === -1) {
        subscribers.push(email);
      }
    }
  }
  return subscribers;
}

function logBroadcast(articleId, title, sentCount, failedCount, subject) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var logSheet = ss.getSheetByName('Broadcast_Logs');
    if (!logSheet) {
      logSheet = ss.insertSheet('Broadcast_Logs');
      logSheet.appendRow(['Timestamp', 'Article ID', 'Title', 'Sent Count', 'Failed Count', 'Subject']);
      logSheet.getRange(1, 1, 1, 6).setFontWeight('bold');
    }
    logSheet.appendRow([new Date().toISOString(), articleId, title, sentCount, failedCount, subject]);
  } catch (e) {
    Logger.log('Could not write to Broadcast_Logs: ' + e.toString());
  }
}

function jsonOutput(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
