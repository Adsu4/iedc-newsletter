/**
 * Utility helper to detect and transform public Google Drive, Docs, YouTube,
 * images, videos, and external resource URLs into embeddable previews.
 */

export interface EmbedResult {
  isEmbeddable: boolean;
  embedUrl: string;
  originalUrl: string;
  type: 'image' | 'video' | 'gdrive_doc' | 'gdrive_file' | 'youtube' | 'pdf' | 'github' | 'generic';
  icon: string;
  label: string;
  directImageUrl?: string;
  isImage?: boolean;
  isVideo?: boolean;
  isDoc?: boolean;
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
 * Parses any resource link and returns embed details if preview-compatible.
 * Supports explicit type override ('image' | 'video' | 'doc' | 'link' | 'auto')
 * and title hints.
 */
export function getEmbedDetails(
  rawUrl: string,
  explicitType?: string,
  titleHint?: string
): EmbedResult {
  const url = (rawUrl || '').trim();
  const lowerUrl = url.toLowerCase();
  const lowerTitle = (titleHint || '').toLowerCase();
  const driveId = extractGoogleDriveId(url);

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
      isVideo: true,
    };
  }

  // 2. Explicit or detected Image (Google Drive Image, web image)
  const isImageExt = /\.(png|jpe?g|webp|gif|svg|bmp|avif)(\?.*)?$/i.test(lowerUrl);
  const isImageHint = lowerTitle.includes('image') || lowerTitle.includes('photo') || lowerTitle.includes('screenshot') || lowerTitle.includes('diagram') || lowerTitle.includes('schematic') || lowerTitle.includes('poster');

  if (explicitType === 'image' || (explicitType !== 'video' && explicitType !== 'doc' && (isImageExt || (driveId && isImageHint)))) {
    const directImageUrl = driveId ? `https://lh3.googleusercontent.com/d/${driveId}` : url;
    return {
      isEmbeddable: true,
      embedUrl: directImageUrl,
      directImageUrl,
      originalUrl: url,
      type: 'image',
      icon: 'image',
      label: driveId ? 'Google Drive Image' : 'Web Image',
      isImage: true,
    };
  }

  // 3. Explicit or detected Video (Google Drive Video, direct video file)
  const isVideoExt = /\.(mp4|webm|mov|mkv|avi)(\?.*)?$/i.test(lowerUrl);
  const isVideoHint = lowerTitle.includes('video') || lowerTitle.includes('demo') || lowerTitle.includes('recording') || lowerTitle.includes('clip') || lowerTitle.includes('walkthrough');

  if (explicitType === 'video' || (explicitType !== 'image' && explicitType !== 'doc' && (isVideoExt || (driveId && isVideoHint)))) {
    if (driveId) {
      return {
        isEmbeddable: true,
        embedUrl: `https://drive.google.com/file/d/${driveId}/preview`,
        originalUrl: url,
        type: 'video',
        icon: 'smart_display',
        label: 'Google Drive Video',
        isVideo: true,
      };
    }
    return {
      isEmbeddable: true,
      embedUrl: url,
      originalUrl: url,
      type: 'video',
      icon: 'smart_display',
      label: 'Video Link',
      isVideo: true,
    };
  }

  // 4. Google Docs (Document, Spreadsheet, Presentation)
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
      isDoc: true,
    };
  }

  // 5. Google Drive File (Standard preview: PDF, Documents, Media)
  if (driveId) {
    return {
      isEmbeddable: true,
      embedUrl: `https://drive.google.com/file/d/${driveId}/preview`,
      directImageUrl: `https://lh3.googleusercontent.com/d/${driveId}`,
      originalUrl: url,
      type: 'gdrive_file',
      icon: 'picture_as_pdf',
      label: 'Google Drive File',
      isDoc: true,
    };
  }

  // 6. Direct PDF URL
  if (lowerUrl.endsWith('.pdf')) {
    return {
      isEmbeddable: true,
      embedUrl: `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`,
      originalUrl: url,
      type: 'pdf',
      icon: 'picture_as_pdf',
      label: 'PDF Document',
      isDoc: true,
    };
  }

  // 7. GitHub Repository or Project
  if (lowerUrl.includes('github.com')) {
    return {
      isEmbeddable: false,
      embedUrl: url,
      originalUrl: url,
      type: 'github',
      icon: 'code',
      label: 'GitHub Repository',
    };
  }

  // 8. Generic external link
  return {
    isEmbeddable: false,
    embedUrl: url,
    originalUrl: url,
    type: 'generic',
    icon: 'open_in_new',
    label: 'External Link',
  };
}
