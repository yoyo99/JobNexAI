/**
 * Script de diagnostic pour les policies RLS du bucket CVs
 * À exécuter dans la console du navigateur sur https://jobnexai-windsurf.netlify.app
 */

async function diagnoseBucketRLS() {
  console.log('🔍 Diagnostic des policies RLS pour le bucket CVs...');
  
  try {
    // Vérifier l'utilisateur connecté
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('❌ Utilisateur non connecté:', authError);
      return;
    }
    
    console.log('✅ Utilisateur connecté:', {
      id: user.id,
      email: user.email,
      role: user.role
    });
    
    // Test 1: Lister les buckets avec différentes approches
    console.log('\n📦 Test 1: Listing des buckets...');
    
    try {
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      console.log('Résultat listBuckets():', { buckets, error: listError });
    } catch (e) {
      console.error('Erreur listBuckets():', e);
    }
    
    // Test 2: Accès direct au bucket 'cvs'
    console.log('\n🎯 Test 2: Accès direct au bucket cvs...');
    
    try {
      const { data: files, error: accessError } = await supabase.storage
        .from('cvs')
        .list('', { limit: 1 });
      console.log('Résultat accès direct cvs:', { files, error: accessError });
    } catch (e) {
      console.error('Erreur accès direct cvs:', e);
    }
    
    // Test 3: Informations sur l'utilisateur depuis la DB
    console.log('\n👤 Test 3: Profil utilisateur...');
    
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      console.log('Profil utilisateur:', { profile, error: profileError });
    } catch (e) {
      console.error('Erreur profil:', e);
    }
    
    // Test 4: Vérifier les CVs existants
    console.log('\n📄 Test 4: CVs existants...');
    
    try {
      const { data: cvs, error: cvsError } = await supabase
        .from('user_cvs')
        .select('*')
        .eq('user_id', user.id);
      console.log('CVs existants:', { cvs, error: cvsError });
    } catch (e) {
      console.error('Erreur CVs:', e);
    }
    
    // Test 5: Test de création de bucket avec admin
    console.log('\n🔧 Test 5: Tentative de création bucket...');
    
    try {
      const { data: createResult, error: createError } = await supabase.storage
        .createBucket('test-bucket-' + Date.now(), {
          public: false
        });
      console.log('Résultat création bucket test:', { createResult, error: createError });
      
      // Nettoyer le bucket de test si créé
      if (createResult) {
        await supabase.storage.deleteBucket(createResult.name);
        console.log('🧹 Bucket de test nettoyé');
      }
    } catch (e) {
      console.error('Erreur création bucket test:', e);
    }
    
    console.log('\n🏁 Diagnostic terminé');
    
  } catch (error) {
    console.error('❌ Erreur inattendue:', error);
  }
}

// Fonction pour tester les permissions spécifiques
async function testStoragePermissions() {
  console.log('🔐 Test des permissions Storage...');
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('❌ Utilisateur non connecté');
      return;
    }
    
    // Test avec différents buckets connus
    const bucketsToTest = ['cvs', 'avatars', 'public'];
    
    for (const bucketName of bucketsToTest) {
      console.log(`\n🧪 Test bucket: ${bucketName}`);
      
      try {
        const { data, error } = await supabase.storage
          .from(bucketName)
          .list('', { limit: 1 });
          
        if (error) {
          console.log(`❌ ${bucketName}: ${error.message}`);
        } else {
          console.log(`✅ ${bucketName}: Accès OK (${data?.length || 0} fichiers)`);
        }
      } catch (e) {
        console.log(`❌ ${bucketName}: Exception - ${e.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Erreur test permissions:', error);
  }
}

// Exposer les fonctions
window.diagnoseBucketRLS = diagnoseBucketRLS;
window.testStoragePermissions = testStoragePermissions;

console.log('🔧 Scripts de diagnostic RLS chargés !');
console.log('📋 Commandes disponibles:');
console.log('  - diagnoseBucketRLS()      : Diagnostic complet RLS');
console.log('  - testStoragePermissions() : Test permissions buckets');
