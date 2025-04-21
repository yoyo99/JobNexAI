import { sendNotificationEmail } from "../lib/emailService";

/**
 * Envoie une notification email et affiche un toast de succès ou d'erreur
 * @param {Object} params
 * @param {string} params.to
 * @param {string} params.subject
 * @param {string} params.text
 * @param {string} params.html
 * @param {function} [params.onSuccess] - callback appelé en cas de succès
 * @param {function} [params.onError] - callback appelé en cas d'erreur
 */
export async function notifyUser({ to, subject, text, html, onSuccess, onError }) {
  try {
    const response = await sendNotificationEmail({ to, subject, text, html });
    if (!response.ok) {
      const error = await response.text();
      if (onError) onError(error);
      // Optionnel : déclencher un événement global (toast)
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'error', message: error } }));
      }
      throw new Error(error);
    }
    if (onSuccess) onSuccess();
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', message: 'Email envoyé avec succès.' } }));
    }
    return true;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    return false;
  }
}
