# Edge Function: extract-cv-text

## Objectif

Cette fonction Edge a pour but d'extraire le contenu textuel d'un fichier PDF stocké dans un bucket Supabase Storage. Elle est utile pour analyser des CV ou d'autres documents PDF.

## Fonctionnement

1.  La fonction attend une requête `POST` avec un corps JSON contenant `storagePath`.
2.  Elle gère les requêtes `OPTIONS` pour le CORS.
3.  Elle initialise un client Supabase en utilisant les variables d'environnement `SUPABASE_URL` et `SUPABASE_ANON_KEY`, et propage l'en-tête `Authorization` de la requête entrante.
4.  Le `storagePath` (format attendu : `nom_du_bucket/chemin/vers/le/fichier.pdf`) est utilisé pour télécharger le fichier depuis Supabase Storage.
5.  Une fois le fichier (attendu comme un `Blob`) téléchargé, son contenu est converti en `ArrayBuffer`.
6.  La librairie `unpdf` est ensuite utilisée pour extraire le texte, le nombre total de pages et les métadonnées du PDF.
7.  En cas de succès, la fonction retourne un objet JSON contenant `extractedText`, `totalPages`, et `meta`.
8.  Des erreurs sont gérées et retournées avec un statut approprié (400 pour les erreurs d'input, 500 pour les erreurs serveur).

## Paramètres d'Entrée

-   **Méthode HTTP :** `POST`
-   **En-têtes :**
    -   `Authorization: Bearer VOTRE_SUPABASE_ANON_KEY_OU_USER_TOKEN` (Nécessaire pour l'authentification Supabase)
    -   `Content-Type: application/json`
-   **Corps de la requête (JSON) :**
    ```json
    {
      "storagePath": "votre_bucket/chemin_vers_votre_cv.pdf"
    }
    ```
    Où `storagePath` est le chemin complet vers le fichier PDF dans Supabase Storage, incluant le nom du bucket.

## Réponse en Cas de Succès (Statut 200)

-   **En-têtes :**
    -   `Content-Type: application/json`
    -   En-têtes CORS (`Access-Control-Allow-Origin`, etc.)
-   **Corps de la réponse (JSON) :**
    ```json
    {
      "extractedText": "Le contenu textuel extrait du PDF...",
      "totalPages": 2,
      "meta": {
        // Métadonnées fournies par unpdf (ex: info, metadata)
      }
    }
    ```

## Réponse en Cas d'Erreur (Statut 400 ou 500)

-   **Corps de la réponse (JSON) :**
    ```json
    {
      "error": "Description de l'erreur rencontrée."
    }
    ```

## Variables d'Environnement Requises

Ces variables doivent être configurées dans le tableau de bord Supabase pour cette fonction Edge (`Project Settings > Edge Functions > extract-cv-text > Add new secret`):

-   `SUPABASE_URL`: L'URL de votre projet Supabase.
-   `SUPABASE_ANON_KEY`: La clé anonyme (publique) de votre projet Supabase.

## Dépendances Externes

-   `https://deno.land/std@0.177.0/http/server.ts`: Pour le serveur HTTP Deno.
-   `https://esm.sh/@supabase/supabase-js@2`: Client Supabase pour JavaScript.
-   `https://esm.sh/unpdf@latest`: Librairie pour l'extraction de texte PDF.
    *   **Note pour la production :** Il est recommandé de "pinner" la version de `unpdf` à une version spécifique (ex: `https://esm.sh/unpdf@0.13.0`) pour éviter des changements inattendus dus à une mise à jour `latest`.

## Considérations de Sécurité et Permissions

-   **CORS :** Les en-têtes CORS sont actuellement configurés avec `'Access-Control-Allow-Origin': '*'`. Pour un environnement de production, il est fortement recommandé de restreindre cette valeur à votre (vos) domaine(s) frontend spécifique(s).
-   **Permissions d'Accès au Stockage :** La fonction opère avec les permissions de l'utilisateur dont le token est fourni dans l'en-tête `Authorization`. Assurez-vous que les politiques RLS (Row Level Security) sur votre bucket de stockage autorisent l'utilisateur à lire (`select`) les fichiers ciblés.

## Invocation Locale (Exemple)

Après avoir démarré votre environnement Supabase local (`supabase start`) :

```bash
curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/extract-cv-text' \
  --header 'Authorization: Bearer VOTRE_SUPABASE_ANON_KEY_OU_USER_TOKEN' \
  --header 'Content-Type: application/json' \
  --data '{"storagePath":"cv-bucket/public/mon_cv.pdf"}'
```
(Remplacez `VOTRE_SUPABASE_ANON_KEY_OU_USER_TOKEN` et `cv-bucket/public/mon_cv.pdf` par vos valeurs.)

