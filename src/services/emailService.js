import emailjs from '@emailjs/browser';

const SERVICE_ID = 'service_39yhtrb';
const TEMPLATE_ID = 'template_wac0919';
const PUBLIC_KEY = '5smmNPKt5-HAVVyM8';

/**
 * Sends a real flood alert email using EmailJS.
 * @param {string} toEmail - Recipient email address
 * @param {Object} alertData - Object containing template parameter fields
 * @returns {Promise<Object>} EmailJS response promise
 */
export const sendAlertEmail = (toEmail, alertData) => {
  const templateParams = {
    to_email: toEmail,
    district: alertData.district || 'Cuddalore',
    severity: alertData.severity || 'EVACUATE',
    risk_score: alertData.risk_score || 86,
    time_window: alertData.time_window || '8–14 hours',
    action_message: alertData.action_message || 'Leave NOW via SH45 North Corridor',
    camp_name: alertData.camp_name || 'GHS Panruti School',
    camp_distance: alertData.camp_distance || '1.8km',
    avoid_route: alertData.avoid_route || 'NH32 Railway Underpass'
  };

  return emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
};
