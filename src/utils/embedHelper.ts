/**
 * Utility helper to detect and transform public Google Drive, Docs, YouTube,
 * and external resource URLs into embeddable iframe links.
 */

export interface EmbedResult {
  isEmbeddable: boolean;
  embedUrl: string;
  originalUrl: string;
  type: 'gdrive_doc' | 'gdrive_file' | 'youtube' | 'pdf' | 'github' | 'generic';
  icon: string;
  label: string;
}

/**
 * Extracts a Google Drive file ID from standard share links:
 * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/uc?id=FILE_ID
 */
export function extractGoogleDriveId(url: string): string | null {
  if (!url) return null;
  const fileDMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) return fileDMatch[1];

  const idQueryMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idQueryMatch && idQueryMatch[1]) return idQueryMatch[1];

  return null;
}

/**
 * Converts a Google Drive image link into a direct CDN image link:
 * https://lh3.googleusercontent.com/d/FILE_ID
 */
export function getDirectDriveImageUrl(url: string): string {
  if (!url) return '';
  const driveId = extractGoogleDriveId(url);
  if (driveId) {
    return `https://lh3.googleusercontent.com/d/${driveId}`;
  }
  return url;
}

/**
 * Parses any resource link and returns embed details if iframe-compatible
 */
export function getEmbedDetails(rawUrl: string): EmbedResult {
  const url = (rawUrl || '').trim();

  // 1. YouTube video
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return {
      isEmbeddable: true,
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}`,
      originalUrl: url,
      type: 'youtube',
      icon: 'smart_display',
      label: 'YouTube Video',
    };
  }

  // 2. Google Docs (Document, Spreadsheet, Presentation)
  const gdocMatch = url.match(/docs\.google\.com\/(document|spreadsheets|presentation)\/d\/([a-zA-Z0-9_-]+)/i);
  if (gdocMatch && gdocMatch[1] && gdocMatch[2]) {
    const docType = gdocMatch[1];
    const docId = gdocMatch[2];
    return {
      isEmbeddable: true,
      embedUrl: `https://docs.google.com/${docType}/d/${docId}/preview`,
      originalUrl: url,
      type: 'gdrive_doc',
      icon: docType === 'spreadsheets' ? 'table_chart' : docType === 'presentation' ? 'slideshow' : 'description',
      label: docType === 'spreadsheets' ? 'Google Sheets' : docType === 'presentation' ? 'Google Slides' : 'Google Doc',
    };
  }

  // 3. Google Drive File (PDF, Video, etc.)
  const driveId = extractGoogleDriveId(url);
  if (driveId) {
    return {
      isEmbeddable: true,
      embedUrl: `https://drive.google.com/file/d/${driveId}/preview`,
      originalUrl: url,
      type: 'gdrive_file',
      icon: 'picture_as_pdf',
      label: 'Google Drive Document',
    };
  }

  // 4. Direct PDF URL
  if (url.toLowerCase().endsWith('.pdf')) {
    return {
      isEmbeddable: true,
      embedUrl: `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`,
      originalUrl: url,
      type: 'pdf',
      icon: 'picture_as_pdf',
      label: 'PDF Document',
    };
  }

  // 5. GitHub Repository or Project
  if (url.includes('github.com')) {
    return {
      isEmbeddable: false,
      embedUrl: url,
      originalUrl: url,
      type: 'github',
      icon: 'code',
      label: 'GitHub Repository',
    };
  }

  // 6. Generic external link
  return {
    isEmbeddable: false,
    embedUrl: url,
    originalUrl: url,
    type: 'generic',
    icon: 'open_in_new',
    label: 'External Link',
  };
}
