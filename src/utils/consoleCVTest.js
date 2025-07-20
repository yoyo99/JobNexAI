/**
 * Script de test à exécuter dans la console du navigateur
 * pour diagnostiquer le problème du bucket CVs
 * 
 * Instructions :
 * 1. Ouvre http://localhost:5173 dans ton navigateur
 * 2. Connecte-toi à ton compte
 * 3. Ouvre la console (F12 > Console)
 * 4. Copie-colle ce script et exécute-le
 */

// Test du bucket CVs
async function testCVBucket() {
  console.log('🔍 Test du bucket CVs - Début');
  
  try {
    // Importer Supabase depuis le module global (si disponible)
    const { supabase } = window;
    
    if (!supabase) {
      console.error('❌ Supabase client non disponible dans window');
      return;
    }
    
    console.log('✅ Client Supabase trouvé');
    
    // 1. Lister tous les buckets
    console.log('📦 Liste des buckets...');
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('❌ Erreur lors de la récupération des buckets:', listError);
      return;
    }
    
    console.log('📦 Buckets disponibles:', buckets?.map(b => b.name));
    
    // 2. Vérifier si le bucket 'cvs' existe
    const cvsBucket = buckets?.find(bucket => bucket.name === 'cvs');
    
    if (cvsBucket) {
      console.log('✅ Bucket "cvs" trouvé:', cvsBucket);
      
      // 3. Tester l'accès au bucket
      console.log('🔐 Test d\'accès au bucket...');
      const { data: files, error: accessError } = await supabase.storage
        .from('cvs')
        .list('', { limit: 1 });
        
      if (accessError) {
        console.error('❌ Erreur d\'accès au bucket cvs:', accessError);
        console.log('💡 Suggestion: Vérifier les permissions RLS du bucket');
      } else {
        console.log('✅ Accès au bucket cvs confirmé');
        console.log('📁 Fichiers dans le bucket (max 1):', files);
      }
    } else {
      console.log('❌ Bucket "cvs" non trouvé');
      console.log('💡 Le bucket doit être créé dans Supabase Dashboard > Storage');
      
      // Tentative de création du bucket
      console.log('🔨 Tentative de création du bucket...');
      const { data: newBucket, error: createError } = await supabase.storage.createBucket('cvs', {
        public: false,
        allowedMimeTypes: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.oasis.opendocument.text',
          'application/rtf',
          'text/rtf'
        ],
        fileSizeLimit: 5242880 // 5MB
      });
      
      if (createError) {
        console.error('❌ Impossible de créer le bucket:', createError);
        console.log('💡 Tu dois créer le bucket manuellement dans Supabase Dashboard');
      } else {
        console.log('✅ Bucket "cvs" créé avec succès !', newBucket);
      }
    }
    
    // 4. Test d'authentification
    console.log('👤 Vérification de l\'authentification...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('❌ Erreur d\'authentification:', authError);
    } else if (user) {
      console.log('✅ Utilisateur connecté:', user.id, user.email);
    } else {
      console.log('⚠️ Aucun utilisateur connecté');
    }
    
  } catch (error) {
    console.error('❌ Erreur inattendue:', error);
  }
  
  console.log('🏁 Test du bucket CVs - Fin');
}

// Fonction pour tester l'upload d'un fichier factice
async function testCVUpload() {
  console.log('🧪 Test d\'upload d\'un fichier factice...');
  
  try {
    const { supabase } = window;
    if (!supabase) {
      console.error('❌ Supabase client non disponible');
      return;
    }
    
    // Vérifier l'utilisateur
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('❌ Utilisateur non connecté');
      return;
    }
    
    // Créer un fichier PDF factice
    const testContent = '%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\nxref\n0 2\n0000000000 65535 f \n0000000009 00000 n \ntrailer\n<<\n/Size 2\n/Root 1 0 R\n>>\nstartxref\n74\n%%EOF';
    const testFile = new Blob([testContent], { type: 'application/pdf' });
    const testFileName = `test-${user.id}-${Date.now()}.pdf`;
    
    console.log('📤 Upload du fichier de test:', testFileName);
    
    // Tenter l'upload
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('cvs')
      .upload(testFileName, testFile);
      
    if (uploadError) {
      console.error('❌ Erreur lors de l\'upload:', uploadError);
      return;
    }
    
    console.log('✅ Upload réussi !', uploadData);
    
    // Nettoyer le fichier de test
    console.log('🧹 Nettoyage du fichier de test...');
    const { error: deleteError } = await supabase.storage
      .from('cvs')
      .remove([testFileName]);
      
    if (deleteError) {
      console.warn('⚠️ Impossible de supprimer le fichier de test:', deleteError);
    } else {
      console.log('✅ Fichier de test supprimé');
    }
    
  } catch (error) {
    console.error('❌ Erreur inattendue:', error);
  }
}

// Exposer les fonctions globalement
window.testCVBucket = testCVBucket;
window.testCVUpload = testCVUpload;

console.log('🔧 Scripts de test CVs chargés !');
console.log('📋 Commandes disponibles:');
console.log('  - testCVBucket()  : Vérifier le bucket CVs');
console.log('  - testCVUpload()  : Tester l\'upload d\'un fichier');
