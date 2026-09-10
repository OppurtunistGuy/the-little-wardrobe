import { brandConfig } from '../config/brandConfig';

/**
 * Generates an encoded WhatsApp deep-link URL for product enquiries.
 * Follows exact PRD format:
 * "Hi! I'm interested in the [Product Name] priced at ₹[Price] in size [Size]. Is this available?"
 *
 * @param {Object} product - Product object
 * @param {string} [selectedSize] - Optional selected size (e.g., 'S', 'M', 'L', 'XL')
 * @param {Object} [customSettings] - Optional dynamic brand settings
 * @returns {string} Fully formatted wa.me URL
 */
export function getProductWhatsAppUrl(product, selectedSize = null, customSettings = null) {
  const number = customSettings?.whatsappNumber || brandConfig.whatsappNumber;
  const currency = brandConfig.currencySymbol || '₹';
  const priceFormatted = `${currency}${Number(product.price).toLocaleString('en-IN')}`;
  
  let message = "";
  if (selectedSize) {
    message = `Hi! I'm interested in the ${product.name} priced at ${priceFormatted} in size ${selectedSize}. Is this available?`;
  } else {
    message = `Hi! I'm interested in the ${product.name} priced at ${priceFormatted}. Is this available?`;
  }

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${encoded}`;
}

/**
 * Generates an encoded WhatsApp link for general brand enquiries.
 *
 * @param {string} [customMessage] - Optional custom message text
 * @param {Object} [customSettings] - Optional dynamic brand settings
 * @returns {string} Fully formatted wa.me URL
 */
export function getGeneralWhatsAppUrl(customMessage = null, customSettings = null) {
  const number = customSettings?.whatsappNumber || brandConfig.whatsappNumber;
  const brandName = customSettings?.brandName || brandConfig.brandName;
  const defaultMsg = customSettings?.defaultWhatsappMessage || `Hi! I came across ${brandName} on Instagram and would like to ask a question.`;
  
  const message = customMessage || defaultMsg;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
