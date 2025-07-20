# Edge Function: send-notification-email

## Objectif

Cette fonction Edge est conçue pour envoyer des emails transactionnels (notifications, confirmations, etc.) via l'API du service Resend. Elle inclut une vérification d'autorisation basique en s'assurant de la présence d'un JWT Supabase.

## Fonctionnement

1.  La fonction attend une requête `POST`.
2.  Elle extrait le JWT (JSON Web Token) de l'en-tête `Authorization` de la requête. Si le JWT est manquant ou invalide (ne commence pas par "Bearer "), elle retourne une erreur 401 (Non autorisé).
    *   **Note :** La fonction vérifie la présence du JWT mais ne valide pas sa signature ni son contenu (par exemple, le rôle de l'utilisateur). Une validation plus poussée pourrait être ajoutée si nécessaire.
3.  Elle parse le corps de la requête JSON, qui doit contenir `to`, `subject`, et soit `text` soit `html` (ou les deux) pour le contenu de l'email.
4.  Elle récupère la clé API Resend (`RESEND_API_KEY`) et l'adresse email de l'expéditeur (`EMAIL_FROM`) depuis les variables d'environnement. Si l'une de ces variables est manquante, une erreur 500 est retournée.
5.  Elle effectue un appel `POST` à l'API Resend (`https://api.resend.com/emails`) avec les informations de l'email.
6.  Si l'appel à Resend réussit, une réponse 200 est retournée. Sinon, l'erreur de Resend est propagée.

## Paramètres d'Entrée

-   **Méthode HTTP :** `POST`
-   **En-têtes :**
    -   `Authorization: Bearer VOTRE_JWT_SUPABASE_UTILISATEUR` (Obligatoire pour l'autorisation)
    -   `Content-Type: application/json`
-   **Corps de la requête (JSON) :**
    ```json
    {
      "to": "destinataire@example.com", // Peut être une chaîne unique ou un tableau de chaînes pour plusieurs destinataires
      "subject": "Sujet de votre email",
      "text": "Contenu de l'email au format texte brut.", // Optionnel si html est fourni
      "html": "<h1>Contenu de l'email</h1><p>Au format HTML.</p>" // Optionnel si text est fourni
    }
    ```

## Réponse en Cas de Succès (Statut 200)

-   **Corps de la réponse (Texte brut) :**
    ```
    Email envoyé
    ```

## Réponse en Cas d'Erreur

-   **Statut 400 (Bad Request) :** Si le JSON de la requête est malformé.
    -   Corps : "Error parsing request JSON: [message d'erreur]"
-   **Statut 401 (Unauthorized) :** Si le JWT est manquant ou invalide.
    -   Corps : "Unauthorized: JWT missing"
-   **Statut 500 (Internal Server Error) :**
    -   Si `RESEND_API_KEY` ou `EMAIL_FROM` ne sont pas configurés.
        -   Corps : "Email config missing"
    -   Si l'API Resend retourne une erreur.
        -   Corps : "Resend error: [message d'erreur de Resend]"

## Variables d'Environnement Requises

Ces variables doivent être configurées dans le tableau de bord Supabase pour cette fonction Edge (`Project Settings > Edge Functions > send-notification-email > Add new secret`):

-   `RESEND_API_KEY`: Votre clé API secrète du service Resend.
-   `EMAIL_FROM`: L'adresse email qui apparaîtra comme expéditeur (doit être un domaine vérifié dans Resend).

## Dépendances Externes

-   `https://deno.land/std@0.168.0/http/server.ts`: Pour le serveur HTTP Deno.

## Considérations de Sécurité et Bonnes Pratiques

-   **Validation du JWT :** Actuellement, la fonction vérifie uniquement la présence d'un JWT commençant par "Bearer ". Pour une sécurité renforcée, vous pourriez envisager de :
    *   Valider la signature du JWT en utilisant la clé secrète de votre projet Supabase (`SUPABASE_JWT_SECRET`).
    *   Vérifier les `claims` du JWT (par exemple, le `user_id` ou le rôle) pour s'assurer que l'appelant a les permissions nécessaires pour envoyer un email (surtout si l'adresse `to` n'est pas fixe ou liée à l'utilisateur authentifié).
-   **Rate Limiting :** Pour prévenir les abus (envoi massif d'emails), envisagez d'implémenter un mécanisme de limitation de débit, soit au niveau de la fonction Edge elle-même (plus complexe), soit en utilisant des services externes, soit en contrôlant la fréquence d'appel depuis votre frontend/backend.
-   **Validation des Entrées :** Validez plus strictement les entrées (`to`, `subject`, etc.) pour éviter des erreurs ou des injections potentielles si le contenu est dynamique. Par exemple, s'assurer que `to` est une adresse email valide.
-   **Gestion des Secrets :** Les clés API (`RESEND_API_KEY`) sont sensibles et doivent être gérées avec soin comme secrets dans Supabase.
-   **Domaine d'Envoi (`EMAIL_FROM`) :** Assurez-vous que le domaine utilisé dans `EMAIL_FROM` est correctement configuré et vérifié dans votre compte Resend pour améliorer la délivrabilité et éviter d'être marqué comme spam.

## Invocation Locale (Exemple)

Après `supabase start` :

```bash
curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/send-notification-email' \
  --header 'Authorization: Bearer VOTRE_JWT_SUPABASE_UTILISATEUR' \
  --header 'Content-Type: application/json' \
  --data-raw '{
      "to": "test@example.com",
      "subject": "Test Email depuis Supabase Edge Function",
      "text": "Ceci est un email de test.",
      "html": "<h1>Test Email</h1><p>Ceci est un email de test envoyé via Resend.</p>"
  }'
```
(Remplacez `VOTRE_JWT_SUPABASE_UTILISATEUR` par un token valide.)

