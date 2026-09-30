export interface NewsletterEmailData {
  id: string;
  title: string;
  subtitle?: string;
  category?: string;
  date?: string;
  readTime?: string;
  imageUrl?: string;
  paragraphs?: string[];
  articleUrl?: string;
  unsubscribeUrl?: string;
}

/**
 * Generates an editorial, neobrutalist-styled HTML email template
 * that matches the visual identity of the IEDC Innovation Chronicle.
 */
export function generateNewsletterEmailHtml(data: NewsletterEmailData): string {
  const baseUrl = 'https://iedc-newsletter.vercel.app';
  const articleUrl = data.articleUrl || `${baseUrl}/article/${data.id}`;
  const unsubscribeUrl = data.unsubscribeUrl || `${baseUrl}/unsubscribe?email={{EMAIL}}`;
  const editionDate = data.date || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const readTime = data.readTime || '3 min read';
  const category = data.category || 'Monthly Newsletter';

  // Preview paragraphs (first 2-3 paragraphs)
  const paragraphsToRender = (data.paragraphs && data.paragraphs.length > 0)
    ? data.paragraphs.slice(0, 3)
    : [data.subtitle || 'Read the full monthly innovation report, campus project updates, and startup breakthroughs on the official IEDC chronicle portal.'];

  const renderedParagraphs = paragraphsToRender
    .map(
      (p) =>
        `<p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.65; color: #292524; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">${p}</p>`
    )
    .join('');

  const imageSection = data.imageUrl
    ? `
      <!-- Cover Image -->
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 24px;">
        <tr>
          <td align="center">
            <a href="${articleUrl}" target="_blank" style="text-decoration: none; display: block;">
              <img src="${data.imageUrl}" alt="${data.title}" width="540" style="max-width: 100%; height: auto; display: block; border: 2px solid #1C1B1B; border-radius: 8px; box-shadow: 4px 4px 0px #1C1B1B;" />
            </a>
          </td>
        </tr>
      </table>
    `
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${data.title} - IEDC GECT Chronicle</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F6F4ED; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; word-break: break-word;">
  <!-- Wrapper Table -->
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #F6F4ED; min-height: 100vh; padding: 24px 12px;">
    <tr>
      <td align="center" valign="top">
        
        <!-- Main Email Container -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 580px; background-color: #FFFFFF; border: 3px solid #1C1B1B; border-radius: 16px; box-shadow: 6px 6px 0px #1C1B1B; overflow: hidden; margin: 0 auto;">
          
          <!-- Editorial Masthead Header -->
          <tr>
            <td style="background-color: #1C1B1B; padding: 18px 24px; text-align: left; border-bottom: 3px solid #1C1B1B;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td>
                    <span style="display: inline-block; background-color: #C25E37; color: #FFFFFF; font-size: 10px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; padding: 3px 8px; border-radius: 9999px; margin-bottom: 6px;">
                      ⭐ ${category.toUpperCase()}
                    </span>
                    <h1 style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 20px; font-weight: 800; color: #FFFFFF; text-transform: uppercase; letter-spacing: 0.5px; line-height: 1.2;">
                      IEDC GECT Innovation Chronicle
                    </h1>
                    <p style="margin: 4px 0 0 0; font-size: 11px; color: #A8A29E; text-transform: uppercase; letter-spacing: 0.8px;">
                      Govt. Engineering College Thrissur • ${editionDate}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Article Body -->
          <tr>
            <td style="padding: 28px 24px 20px 24px;">
              
              <!-- Meta Badge & Read Time -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 12px;">
                <tr>
                  <td>
                    <span style="font-size: 12px; font-weight: 700; color: #C25E37; text-transform: uppercase; letter-spacing: 0.5px;">
                      ${editionDate}
                    </span>
                    <span style="color: #D6D3D1; margin: 0 6px;">•</span>
                    <span style="font-size: 12px; color: #78716C; font-weight: 500;">
                      ⏱ ${readTime}
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Article Title -->
              <h2 style="margin: 0 0 12px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 24px; line-height: 1.25; font-weight: 800; color: #1C1B1B;">
                <a href="${articleUrl}" target="_blank" style="color: #1C1B1B; text-decoration: none;">
                  ${data.title}
                </a>
              </h2>

              <!-- Subtitle -->
              ${data.subtitle ? `
              <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.5; color: #57534E; font-style: italic; font-family: Georgia, serif;">
                ${data.subtitle}
              </p>
              ` : ''}

              <!-- Image (if available) -->
              ${imageSection}

              <!-- Lead Paragraphs -->
              <div style="margin-bottom: 24px;">
                ${renderedParagraphs}
              </div>

              <!-- Read More Button (Call to Action) -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 28px 0 10px 0;">
                <tr>
                  <td align="center">
                    <a href="${articleUrl}" target="_blank" style="display: inline-block; background-color: #C25E37; color: #FFFFFF; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; text-decoration: none; padding: 14px 28px; border-radius: 9999px; border: 2px solid #1C1B1B; box-shadow: 4px 4px 0px #1C1B1B;">
                      Read Full Story on Website →
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 24px;">
              <hr style="border: 0; border-top: 2px dashed #E7E5E4; margin: 0;" />
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #FAFAF9; padding: 24px; text-align: center;">
              
              <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 700; color: #1C1B1B; text-transform: uppercase; letter-spacing: 0.5px;">
                Innovation & Entrepreneurship Development Centre (IEDC)
              </p>
              <p style="margin: 0 0 16px 0; font-size: 11px; color: #78716C; line-height: 1.4;">
                Government Engineering College Thrissur, Kerala - 680009<br>
                Official Student Innovation & Startup Dispatch
              </p>

              <!-- Quick Links -->
              <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin-bottom: 16px;">
                <tr>
                  <td style="padding: 0 8px;">
                    <a href="${baseUrl}" target="_blank" style="font-size: 11px; font-weight: 700; color: #1C1B1B; text-decoration: underline;">Visit Portal</a>
                  </td>
                  <td style="color: #D6D3D1;">•</td>
                  <td style="padding: 0 8px;">
                    <a href="${baseUrl}/archive" target="_blank" style="font-size: 11px; font-weight: 700; color: #1C1B1B; text-decoration: underline;">Past Editions</a>
                  </td>
                  <td style="color: #D6D3D1;">•</td>
                  <td style="padding: 0 8px;">
                    <a href="${baseUrl}/about" target="_blank" style="font-size: 11px; font-weight: 700; color: #1C1B1B; text-decoration: underline;">About IEDC</a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 12px 0; font-size: 11px; color: #A8A29E; line-height: 1.4;">
                You received this monthly report because you subscribed at <a href="${baseUrl}" target="_blank" style="color: #78716C; text-decoration: underline;">iedc-newsletter.vercel.app</a>.
              </p>

              <!-- Unsubscribe Button / Link -->
              <table cellpadding="0" cellspacing="0" border="0" align="center">
                <tr>
                  <td>
                    <a href="${unsubscribeUrl}" target="_blank" style="display: inline-block; font-size: 11px; font-weight: 700; color: #DC2626; text-decoration: none; padding: 6px 14px; border: 1.5px solid #DC2626; border-radius: 6px; background-color: #FEF2F2;">
                      Unsubscribe from this newsletter
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
}
