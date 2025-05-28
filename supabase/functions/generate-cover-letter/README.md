# Edge Function: generate-cover-letter

## Objectif

Cette fonction Edge génère une lettre de motivation personnalisée en utilisant l'API OpenAI. Elle se base sur le contenu d'un CV, les détails d'une offre d'emploi, des instructions spécifiques fournies par l'utilisateur et une langue cible.

## Fonctionnement

1.  La fonction attend une requête `POST` avec un corps JSON contenant `cvText`, `jobTitle`, `companyName`, `jobDescription`, `targetLanguage`, et optionnellement `customInstructions`.
2.  Elle gère les requêtes `OPTIONS` pour le CORS.
3.  Elle récupère la clé API OpenAI depuis la variable d'environnement `OPENAI_API_KEY`.
4.  Un prompt système et un prompt utilisateur sont construits :
    *   Le prompt système instruit l'IA d'agir comme un rédacteur expert de lettres de motivation dans la langue cible.
    *   Le prompt utilisateur inclut le texte du CV, les détails de l'offre, et les instructions personnalisées (si fournies). Il demande à l'IA de générer uniquement le texte de la lettre.
5.  La fonction fait un appel à l'API OpenAI (modèle `gpt-3.5-turbo`) avec ces prompts.
6.  Si la génération réussit, la fonction retourne le contenu de la lettre de motivation générée.
7.  Les erreurs (champs manquants, clé API non configurée, échec de la génération par l'IA) sont gérées et retournées avec un statut approprié.

## Paramètres d'Entrée

-   **Méthode HTTP :** `POST`
-   **En-têtes :**
    -   `Authorization: Bearer VOTRE_SUPABASE_ANON_KEY_OU_USER_TOKEN` (Recommandé, bien que non utilisé directement par la fonction pour l'appel OpenAI, c'est une bonne pratique pour sécuriser l'accès à la fonction Edge elle-même).
    -   `Content-Type: application/json`
-   **Corps de la requête (JSON) :**
    ```json
    {
      "cvText": "Contenu textuel complet du CV...",
      "jobTitle": "Titre du poste visé",
      "companyName": "Nom de l'entreprise",
      "jobDescription": "Description complète de l'offre d'emploi...",
      "targetLanguage": "fr", // ou "en", "es", etc.
      "customInstructions": "Mettre l'accent sur mon expérience en gestion de projet." // Optionnel
    }
    ```

## Réponse en Cas de Succès (Statut 200)

-   **En-têtes :**
    -   `Content-Type: application/json`
    -   En-têtes CORS.
-   **Corps de la réponse (JSON) :**
    ```json
    {
      "coverLetterContent": "Le texte de la lettre de motivation générée par l'IA..."
    }
    ```

## Réponse en Cas d'Erreur (Statut 400 ou 500)

-   **Corps de la réponse (JSON) :**
    ```json
    {
      "error": "Description de l'erreur rencontrée."
    }
    ```
    Exemples d'erreurs : "Missing required fields...", "OPENAI_API_KEY is not set...", "AI failed to generate a cover letter content."

## Variables d'Environnement Requises

Ces variables doivent être configurées dans le tableau de bord Supabase pour cette fonction Edge (`Project Settings > Edge Functions > generate-cover-letter > Add new secret`):

-   `OPENAI_API_KEY`: Votre clé API secrète OpenAI.

## Dépendances Externes

-   `https://deno.land/std@0.177.0/http/server.ts`: Pour le serveur HTTP Deno.
-   `https://deno.land/x/openai@v4.24.1/mod.ts`: Client OpenAI pour Deno.
    *   **Note :** Vérifiez et utilisez la dernière version compatible de ce module.

## Considérations de Sécurité et Bonnes Pratiques

-   **CORS :** Actuellement `'Access-Control-Allow-Origin': '*'`. À restreindre à vos domaines frontend en production.
-   **Gestion de la Clé API OpenAI :** La clé `OPENAI_API_KEY` est sensible. Assurez-vous qu'elle est correctement configurée comme secret dans Supabase et jamais exposée côté client.
-   **Coûts OpenAI :** Soyez conscient des coûts associés aux appels à l'API OpenAI. Mettez en place un monitoring et potentiellement des limites si nécessaire.
-   **Qualité de la Génération :** La qualité de la lettre dépend du prompt et du modèle utilisé. Des ajustements du prompt ou le passage à un modèle plus performant (ex: GPT-4) pourraient être envisagés si la qualité n'est pas satisfaisante, mais cela impacterait les coûts.
-   **Validation des Entrées :** Bien que la fonction vérifie la présence des champs requis, une validation plus poussée (longueur du texte, format de la langue) pourrait être ajoutée pour éviter des appels inutiles ou erronés à l'API OpenAI.

## Invocation Locale (Exemple)

Après `supabase start` :

```bash
curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/generate-cover-letter' \
  --header 'Authorization: Bearer VOTRE_SUPABASE_ANON_KEY_OU_USER_TOKEN' \
  --header 'Content-Type: application/json' \
  --data-raw '{
      "cvText": "Expérience en développement web avec React et Node.js...",
      "jobTitle": "Ingénieur Logiciel Senior",
      "companyName": "Innovatech",
      "jobDescription": "Nous recherchons un ingénieur expérimenté pour développer des solutions cloud...",
      "customInstructions": "Souligner ma capacité à diriger des équipes techniques.",
      "targetLanguage": "fr"
  }'
```

