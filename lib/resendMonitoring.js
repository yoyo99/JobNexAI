/**
 * Monitoring Resend quota via leur API /v1/stats
 * Nécessite la clé API Resend côté serveur (NE PAS exposer côté client)
 *
 * Utilisation :
 *   - Appeler getResendQuota() côté serveur (Edge Function, CRON, etc.)
 *   - Peut être utilisé pour afficher un bandeau d'alerte dans l'admin ou notifier par email/Slack
 */

export async function getResendQuota({ apiKey }) {
  const response = await fetch('https://api.resend.com/v1/stats', {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération du quota Resend');
  }
  const data = await response.json();
  // Exemple de structure : { sent: 320, limit: 3000, period: 'month' }
  return data;
}
