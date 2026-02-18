import api from '@/lib/api';
import QRCode from 'qrcode';

/**
 * Generate shareable event URL
 */
export const getEventShareUrl = (eventId, baseUrl = '') => {
  const url = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${url}/events/${eventId}`;
};

/**
 * Generate QR code for event
 */
export const generateEventQRCode = async (eventId, size = 300) => {
  try {
    const shareUrl = getEventShareUrl(eventId);
    const qrDataUrl = await QRCode.toDataURL(shareUrl, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.95,
      margin: 1,
      width: size,
      color: {
        dark: '#1a1a1a',
        light: '#ffffff'
      }
    });
    return qrDataUrl;
  } catch (error) {
    console.warn('Failed to generate QR code:', error);
    return null;
  }
};

/**
 * Copy event link to clipboard
 */
export const copyEventLinkToClipboard = async (eventId) => {
  try {
    const shareUrl = getEventShareUrl(eventId);
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      return { success: true, message: 'Link copied to clipboard' };
    } else {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return { success: true, message: 'Link copied to clipboard' };
    }
  } catch (error) {
    console.warn('Failed to copy to clipboard:', error);
    return { success: false, message: 'Failed to copy link' };
  }
};

/**
 * Generate calendar export for iCalendar format
 */
export const generateICalendarExport = (event) => {
  try {
    const eventDate = new Date(event.date);
    
    // Format date as YYYYMMDDTHHMMSSZ
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
    };

    const startDate = formatDate(eventDate);
    
    // End date - 2 hours after start
    const endDate = new Date(eventDate.getTime() + 2 * 60 * 60 * 1000);
    const endDateFormatted = formatDate(endDate);

    // Create iCalendar content
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Hostels App//Events//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${event._id}@hostelsapp.com
DTSTAMP:${formatDate(new Date())}
DTSTART:${startDate}
DTEND:${endDateFormatted}
SUMMARY:${escapeICalText(event.title)}
DESCRIPTION:${escapeICalText(event.description || '')}
LOCATION:${escapeICalText(event.location || 'TBA')}
URL:${getEventShareUrl(event._id)}
ORGANIZER:CN=${escapeICalText(event.createdBy?.name || 'Event Organizer')}
ATTENDEES:${event.attendees?.length || 0}
CATEGORIES:${event.category || 'Event'}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    return icsContent;
  } catch (error) {
    console.warn('Failed to generate iCalendar:', error);
    return null;
  }
};

/**
 * Download iCalendar file
 */
export const downloadICalendar = (event) => {
  try {
    const icsContent = generateICalendarExport(event);
    if (!icsContent) throw new Error('Failed to generate calendar');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${event.title}-${new Date().toISOString().split('T')[0]}.ics`;
    link.click();
    URL.revokeObjectURL(link.href);

    return { success: true, message: 'Calendar file downloaded' };
  } catch (error) {
    console.warn('Failed to download calendar:', error);
    return { success: false, message: 'Failed to download calendar' };
  }
};

/**
 * Generate Google Calendar URL
 */
export const getGoogleCalendarUrl = (event) => {
  try {
    const eventDate = new Date(event.date);
    const startDate = eventDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endDate = new Date(eventDate.getTime() + 2 * 60 * 60 * 1000)
      .toISOString()
      .replace(/[-:]/g, '')
      .split('.')[0] + 'Z';

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      details: event.description || '',
      location: event.location || '',
      dates: `${startDate}/${endDate}`,
      ctz: Intl.DateTimeFormat().resolvedOptions().timeZone
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  } catch (error) {
    console.warn('Failed to generate Google Calendar URL:', error);
    return null;
  }
};

/**
 * Share to social media platforms
 */
export const shareToSocialMedia = (platform, event) => {
  const shareUrl = getEventShareUrl(event._id);
  const title = encodeURIComponent(event.title);
  const description = encodeURIComponent(event.description || 'Check out this event!');
  const text = encodeURIComponent(`${event.title} - ${event.description || 'Join us!'}`);

  let url = '';

  switch (platform) {
    case 'facebook':
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${title}`;
      break;

    case 'twitter':
      url = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}&hashtags=events,networking`;
      break;

    case 'linkedin':
      url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
      break;

    case 'whatsapp':
      url = `https://wa.me/?text=${text}%20${encodeURIComponent(shareUrl)}`;
      break;

    case 'telegram':
      url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${text}`;
      break;

    case 'reddit':
      url = `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${title}`;
      break;

    case 'email':
      url = `mailto:?subject=${title}&body=${description}%0A%0A${encodeURIComponent(shareUrl)}`;
      break;

    default:
      return null;
  }

  if (platform === 'email') {
    window.location.href = url;
  } else {
    window.open(url, '_blank', 'width=600,height=400');
  }

  return { success: true, message: `Shared to ${platform}` };
};

/**
 * Invite friends via email (backend call)
 */
export const inviteFriendsViaEmail = async (eventId, emails, personalMessage = '') => {
  try {
    const response = await api.post(`/api/v1/events/${eventId}/invite`, {
      emails: Array.isArray(emails) ? emails : [emails],
      message: personalMessage
    });
    return response.data?.data;
  } catch (error) {
    console.warn('Failed to send invites:', error?.response?.data?.message);
    throw error;
  }
};

/**
 * Log event share (analytics)
 */
export const logEventShare = async (eventId, platform) => {
  try {
    // Non-blocking analytics call
    api.post(`/api/v1/events/${eventId}/share`, {
      platform,
      timestamp: new Date().toISOString()
    }).catch(error => {
      console.warn('Failed to log share:', error?.response?.data?.message);
    });
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Get event share statistics
 */
export const getEventShareStats = async (eventId) => {
  try {
    const response = await api.get(`/api/v1/events/${eventId}/share-stats`);
    return response.data?.data || {
      total: 0,
      facebook: 0,
      twitter: 0,
      linkedin: 0,
      whatsapp: 0,
      email: 0
    };
  } catch (error) {
    console.warn('Failed to fetch share stats:', error?.response?.data?.message);
    return {
      total: 0,
      facebook: 0,
      twitter: 0,
      linkedin: 0,
      whatsapp: 0,
      email: 0
    };
  }
};

/**
 * Helper function to escape special characters in iCal format
 */
const escapeICalText = (text) => {
  if (!text) return '';
  return text
    .replace(/\\/g, '\\\\')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
    .replace(/\n/g, '\\n')
    .slice(0, 100); // Limit to 100 chars
};
