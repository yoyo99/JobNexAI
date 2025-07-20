# 🔧 Diagnostic des Problèmes d'Upload CV

## Problème Identifié
D'après les mémoires, nous avons une erreur **"Bucket not found"** lors de l'upload de CVs.

## Étapes de Diagnostic

### 1. Vérifier le Serveur de Développement
```bash
npm run dev
```
Le serveur devrait être accessible sur http://localhost:5173

### 2. Tester l'Upload avec Logs Détaillés

1. **Ouvre ton navigateur** sur http://localhost:5173
2. **Connecte-toi** à ton compte
3. **Va sur la page Profile** ou toute page avec upload CV
4. **Ouvre la Console** (F12 > Console)
5. **Tente un upload** d'un fichier PDF

Tu devrais voir des logs détaillés comme :
```
🚀 [UserCVs] Début upload CV: {fileName: "test.pdf", fileSize: 12345, ...}
[uploadUserCV] Auth check - user: xxx expected userId: xxx
[uploadUserCV] Inserting CV metadata: {...}
```

### 3. Vérifier le Bucket dans Supabase

**Option A: Via Console Navigateur**
1. Dans la console, tape :
```javascript
// Lister tous les buckets
const { data: buckets, error } = await supabase.storage.listBuckets();
console.log('Buckets:', buckets?.map(b => b.name));

// Vérifier le bucket 'cvs'
const { data: files, error: accessError } = await supabase.storage.from('cvs').list('', { limit: 1 });
console.log('Accès bucket cvs:', { files, error: accessError });
```

**Option B: Via Supabase Dashboard**
1. Va sur https://supabase.com/dashboard
2. Sélectionne ton projet
3. Va dans **Storage** dans le menu de gauche
4. Vérifie si le bucket **"cvs"** existe

### 4. Créer le Bucket si Nécessaire

Si le bucket n'existe pas, créé-le :

**Via Dashboard Supabase :**
1. Storage > Create bucket
2. Nom : `cvs`
3. Public : **Non** (privé)
4. File size limit : `5242880` (5MB)
5. Allowed MIME types :
   - `application/pdf`
   - `application/msword`
   - `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
   - `application/vnd.oasis.opendocument.text`
   - `application/rtf`
   - `text/rtf`

**Via Console Navigateur :**
```javascript
const { data, error } = await supabase.storage.createBucket('cvs', {
  public: false,
  allowedMimeTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.oasis.opendocument.text',
    'application/rtf',
    'text/rtf'
  ],
  fileSizeLimit: 5242880
});
console.log('Bucket créé:', { data, error });
```

### 5. Vérifier les Policies RLS

Si le bucket existe mais l'accès est refusé, vérifie les policies RLS :

1. **Supabase Dashboard** > Storage > cvs > Policies
2. Assure-toi qu'il y a des policies pour :
   - **INSERT** : `auth.uid() = user_id`
   - **SELECT** : `auth.uid() = user_id`
   - **DELETE** : `auth.uid() = user_id`

### 6. Test d'Upload Simple

Une fois le bucket créé, teste avec un fichier simple :

```javascript
// Créer un fichier de test
const testContent = '%PDF-1.4\n%%EOF';
const testFile = new Blob([testContent], { type: 'application/pdf' });
const testFileName = `test-${Date.now()}.pdf`;

// Tenter l'upload
const { data, error } = await supabase.storage
  .from('cvs')
  .upload(testFileName, testFile);
  
console.log('Test upload:', { data, error });

// Nettoyer
if (data) {
  await supabase.storage.from('cvs').remove([testFileName]);
}
```

## Messages d'Erreur Courants

| Erreur | Cause | Solution |
|--------|-------|----------|
| "Bucket not found" | Le bucket 'cvs' n'existe pas | Créer le bucket dans Supabase |
| "Access denied" | Policies RLS manquantes | Configurer les policies RLS |
| "File too large" | Fichier > 5MB | Réduire la taille ou augmenter la limite |
| "Invalid file type" | Type MIME non autorisé | Vérifier les types autorisés |

## Résolution Attendue

Une fois le bucket créé et configuré correctement :
- ✅ Upload CV devrait fonctionner
- ✅ Plus d'erreur "Bucket not found"
- ✅ Fichiers stockés dans le bucket 'cvs'
- ✅ Métadonnées enregistrées dans la table 'user_cvs'

## Page de Test

Tu peux aussi utiliser la page de test : http://localhost:5173/cv-bucket-test
