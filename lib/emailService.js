// lib/emailService.js
/**
 * Service pour envoyer un email via la Supabase Edge Function (Resend)
 * @param {Object} params
 * @param {string} params.to - Email du destinataire
 * @param {string} params.subject - Sujet de l'email
 * @param {string} params.text - Texte brut
 * @param {string} params.html - Contenu HTML
 * @returns {Promise<Response>}
 */
export async function sendNotificationEmail({ to, subject, text, html }) {
  // Remplace <ton-project-ref> par ton project ref Supabase si besoin
  const endpoint = 'https://klwugophjvzctlautsqz.functions.supabase.co/send-notification-email';
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, subject, text, html })
  });
  return response;
}
