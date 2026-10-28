// Google Apps Script Web App Endpoint for Leads
export const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyqHu0-YWohp5pu9JKoz--lJxLWOEvs9LKsy9hcp142oYkoOk9E1geQpmF0h7QrSysztg/exec';

/**
 * Submits lead data to Google Sheets & triggers automated email alert.
 * 
 * @param {Object} leadData
 * @param {string} leadData.name - Customer full name
 * @param {string} leadData.phone - 10-digit mobile number
 * @param {string} [leadData.email] - Customer email address
 * @param {string} [leadData.city] - Customer city
 * @param {string} [leadData.property] - Selected property / project name
 * @param {string} [leadData.project] - Selected project name
 * @param {string} [leadData.propertyName] - Selected project name
 * @param {string} [leadData.source] - Lead source or enquiry context (e.g. Hero Banner, Brochure Download)
 */
export async function submitLead(leadData) {
  const propertyName = leadData.property || leadData.project || leadData.propertyName || '';

  const payload = {
    name: leadData.name?.trim() || '',
    phone: leadData.phone?.trim() || '',
    email: leadData.email?.trim() || '',
    city: leadData.city?.trim() || '',
    property: propertyName,
    propertyName: propertyName,
    project: propertyName,
    source: leadData.source
      ? (propertyName && !leadData.source.includes(propertyName) ? `${leadData.source} - ${propertyName}` : leadData.source)
      : (propertyName || 'General Enquiry'),
    pageUrl: typeof window !== 'undefined' ? window.location.href : '',
    timestamp: new Date().toISOString()
  };

  try {
    // Note: mode: 'no-cors' is required for Google Apps Script Web Apps to prevent browser CORS blocks
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to submit lead to Google Sheets:', error);
    return { success: false, error };
  }
}
