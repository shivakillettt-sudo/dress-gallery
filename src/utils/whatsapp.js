/**
 * Utility to format and resolve WhatsApp ordering numbers dynamically.
 * Default fallback number: 6369099224 (international format: 916369099224).
 */

export function cleanPhoneNumber(input) {
  if (!input) return '';
  return String(input).replace(/[^0-9]/g, '');
}

/**
 * Returns the international WhatsApp format (e.g. 916369099224).
 * Supports:
 * - 10-digit Indian numbers (e.g. 6369099224 -> 916369099224)
 * - 11-digit numbers starting with 0 (e.g. 06369099224 -> 916369099224)
 * - 12-digit numbers starting with 91 (e.g. 916369099224 -> 916369099224)
 * - Custom international numbers
 */
export function getWhatsAppOrderNumber(settings) {
  const rawNumber = settings?.orderWhatsAppNumber || 
                    settings?.whatsappNumber || 
                    settings?.whatsappInternal || 
                    '6369099224';

  const cleaned = cleanPhoneNumber(rawNumber);

  if (!cleaned) return '916369099224';

  // 10-digit standard Indian mobile number
  if (cleaned.length === 10) {
    return `91${cleaned}`;
  }

  // 11-digit with leading 0 (e.g. 06369099224)
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    return `91${cleaned.slice(1)}`;
  }

  // 12-digit starting with 91 (e.g. 916369099224)
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return cleaned;
  }

  // Fallback as-is
  return cleaned;
}

/**
 * Builds the official WhatsApp direct order / chat URL.
 */
export function buildWhatsAppUrl(settings, messageText = '') {
  const phone = getWhatsAppOrderNumber(settings);
  if (!messageText) {
    return `https://api.whatsapp.com/send?phone=${phone}`;
  }
  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(messageText)}`;
}
