/**
 * Script pour créer automatiquement le bucket CVs dans Supabase
 * 
 * Usage:
 * 1. Assure-toi que le serveur dev tourne (npm run dev)
 * 2. Ouvre http://localhost:5173 et connecte-toi
 * 3. Ouvre la console (F12)
 * 4. Copie-colle ce script et exécute-le
 */

async function createCVBucket() {
  console.log('🚀 Création du bucket CVs...');
  
  try {
    // Vérifier que Supabase est disponible
    if (typeof supabase === 'undefined') {
      console.error('❌ Supabase client non disponible. Assure-toi d\'être sur l\'application.');
      return false;
    }
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('❌ Utilisateur non connecté:', authError);
      return false;
    }
    
    console.log('✅ Utilisateur connecté:', user.email);
    
    // Vérifier si le bucket existe déjà
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    if (listError) {
      console.error('❌ Erreur lors de la récupération des buckets:', listError);
      return false;
    }
    
    const existingBucket = buckets?.find(bucket => bucket.name === 'cvs');
    if (existingBucket) {
      console.log('✅ Le bucket "cvs" existe déjà !');
      
      // Tester l'accès
      const { data: files, error: accessError } = await supabase.storage
        .from('cvs')
        .list('', { limit: 1 });
        
      if (accessError) {
        console.error('❌ Bucket existe mais accès refusé:', accessError);
        console.log('💡 Vérifier les policies RLS dans Supabase Dashboard > Storage > cvs > Policies');
        return false;
      }
      
      console.log('✅ Accès au bucket confirmé');
      return true;
    }
    
    // Créer le bucket
    console.log('🔨 Création du bucket "cvs"...');
    const { data: newBucket, error: createError } = await supabase.storage.createBucket('cvs', {
      public: false, // Bucket privé
      allowedMimeTypes: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.oasis.opendocument.text',
        'application/rtf',
        'text/rtf'
      ],
      fileSizeLimit: 5242880 // 5MB en bytes
    });
    
    if (createError) {
      console.error('❌ Erreur lors de la création du bucket:', createError);
      console.log('💡 Tu dois peut-être créer le bucket manuellement dans Supabase Dashboard');
      return false;
    }
    
    console.log('✅ Bucket "cvs" créé avec succès !', newBucket);
    
    // Test d'upload pour vérifier les permissions
    console.log('🧪 Test d\'upload...');
    const testContent = '%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n>>\nendobj\nxref\n0 1\n0000000000 65535 f \ntrailer\n<<\n/Size 1\n/Root 1 0 R\n>>\nstartxref\n32\n%%EOF';
    const testFile = new Blob([testContent], { type: 'application/pdf' });
    const testFileName = `test-${user.id}-${Date.now()}.pdf`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('cvs')
      .upload(testFileName, testFile);
      
    if (uploadError) {
      console.error('❌ Test d\'upload échoué:', uploadError);
      console.log('💡 Le bucket est créé mais les permissions peuvent être incorrectes');
      return false;
    }
    
    console.log('✅ Test d\'upload réussi !');
    
    // Nettoyer le fichier de test
    await supabase.storage.from('cvs').remove([testFileName]);
    console.log('🧹 Fichier de test nettoyé');
    
    console.log('🎉 Configuration du bucket CVs terminée avec succès !');
    return true;
    
  } catch (error) {
    console.error('❌ Erreur inattendue:', error);
    return false;
  }
}

// Fonction pour vérifier les policies RLS
async function checkCVBucketPolicies() {
  console.log('🔐 Vérification des policies RLS...');
  
  try {
    // Test des différentes opérations
    const testFileName = `policy-test-${Date.now()}.pdf`;
    const testContent = '%PDF-1.4\n%%EOF';
    const testFile = new Blob([testContent], { type: 'application/pdf' });
    
    // Test INSERT
    console.log('📤 Test INSERT...');
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('cvs')
      .upload(testFileName, testFile);
      
    if (uploadError) {
      console.error('❌ INSERT échoué:', uploadError);
      return;
    }
    console.log('✅ INSERT OK');
    
    // Test SELECT
    console.log('📋 Test SELECT...');
    const { data: listData, error: listError } = await supabase.storage
      .from('cvs')
      .list('', { limit: 10 });
      
    if (listError) {
      console.error('❌ SELECT échoué:', listError);
    } else {
      console.log('✅ SELECT OK - Fichiers trouvés:', listData?.length);
    }
    
    // Test DELETE
    console.log('🗑️ Test DELETE...');
    const { error: deleteError } = await supabase.storage
      .from('cvs')
      .remove([testFileName]);
      
    if (deleteError) {
      console.error('❌ DELETE échoué:', deleteError);
    } else {
      console.log('✅ DELETE OK');
    }
    
    console.log('🎉 Tous les tests de policies sont passés !');
    
  } catch (error) {
    console.error('❌ Erreur lors du test des policies:', error);
  }
}

// Exposer les fonctions
window.createCVBucket = createCVBucket;
window.checkCVBucketPolicies = checkCVBucketPolicies;

console.log('🔧 Scripts de création de bucket chargés !');
console.log('📋 Commandes disponibles:');
console.log('  - createCVBucket()        : Créer et configurer le bucket CVs');
console.log('  - checkCVBucketPolicies() : Tester les permissions du bucket');
