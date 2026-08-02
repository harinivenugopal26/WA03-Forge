import emailjs from '@emailjs/browser';

const SERVICE_ID = 'service_39yhtrb';
const TEMPLATE_ID = 'template_wac0919';
const PUBLIC_KEY = '5smmNPKt5-HAVVyM8';

export function sendAlertEmail(toEmail, alertData) {
  const templateParams = {
    to_email: toEmail,
    district: alertData.district,
    severity: alertData.severity,
    risk_score: alertData.risk_score,
    time_window: alertData.time_window,
    action_message: alertData.action_message,
    camp_name: alertData.camp_name,
    camp_distance: alertData.camp_distance,
    avoid_route: alertData.avoid_route,
  };

  return emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
}