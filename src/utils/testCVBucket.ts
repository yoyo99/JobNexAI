import { supabase } from '../lib/supabase';

/**
 * Interface pour les résultats de test
 */
interface TestResult {
  success: boolean;
  message: string;
  bucketExists?: boolean;
}

/**
 * Script de test pour vérifier et créer le bucket CVs si nécessaire
 * Retourne true si le bucket est opérationnel, false sinon
 */
export async function testAndCreateCVBucket(): Promise<boolean> {
  console.log('🔍 Vérification du bucket CVs...');
  
  try {
    // 1. Vérifier si le bucket existe
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('❌ Erreur lors de la récupération des buckets:', listError);
      return false;
    }
    
    console.log('📦 Buckets existants:', buckets?.map(b => b.name));
    
    const cvsBucket = buckets?.find(bucket => bucket.name === 'cvs');
    
    if (cvsBucket) {
      console.log('✅ Le bucket "cvs" existe déjà !');
      
      // Test d'accès au bucket
      const { data: files, error: accessError } = await supabase.storage
        .from('cvs')
        .list('', { limit: 1 });
        
      if (accessError) {
        console.error('❌ Erreur d\'accès au bucket cvs:', accessError);
        return false;
      }
      
      console.log('✅ Accès au bucket cvs confirmé');
      return true;
    } else {
      console.log('⚠️ Le bucket "cvs" n\'existe pas. Tentative de création...');
      
      // 2. Créer le bucket
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
        return false;
      }
      
      console.log('✅ Bucket "cvs" créé avec succès !', newBucket);
      return true;
    }
  } catch (error) {
    console.error('❌ Erreur inattendue:', error);
    return false;
  }
}

/**
 * Test rapide pour vérifier si le bucket CVs existe
 */
export async function quickBucketTest(): Promise<TestResult> {
  try {
    console.log('🔍 Test rapide du bucket CVs...');
    
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      return {
        success: false,
        message: `Erreur lors de la récupération des buckets: ${listError.message}`,
        bucketExists: false
      };
    }
    
    const cvsBucket = buckets?.find(bucket => bucket.name === 'cvs');
    
    if (cvsBucket) {
      return {
        success: true,
        message: 'Bucket "cvs" trouvé et accessible',
        bucketExists: true
      };
    } else {
      return {
        success: false,
        message: 'Bucket "cvs" non trouvé - création manuelle requise',
        bucketExists: false
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Erreur inattendue: ${error}`,
      bucketExists: false
    };
  }
}

/**
 * Test d'accès au bucket CVs (permissions de lecture)
 */
export async function testBucketAccess(): Promise<TestResult> {
  try {
    console.log('🔐 Test d\'accès au bucket CVs...');
    
    const { data: files, error: accessError } = await supabase.storage
      .from('cvs')
      .list('', { limit: 1 });
      
    if (accessError) {
      return {
        success: false,
        message: `Erreur d'accès au bucket: ${accessError.message}`
      };
    }
    
    return {
      success: true,
      message: `Accès au bucket confirmé (${files?.length || 0} fichiers visibles)`
    };
  } catch (error) {
    return {
      success: false,
      message: `Erreur lors du test d'accès: ${error}`
    };
  }
}

/**
 * Test d'upload d'un fichier factice pour vérifier les permissions
 */
export async function testCVUpload(userId: string) {
  console.log('🧪 Test d\'upload d\'un fichier factice...');
  
  try {
    // Créer un fichier blob factice (PDF minimal)
    const testContent = '%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n>>\nendobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \ntrailer\n<<\n/Size 4\n/Root 1 0 R\n>>\nstartxref\n174\n%%EOF';
    const testFile = new Blob([testContent], { type: 'application/pdf' });
    const testFileName = `test-${userId}-${Date.now()}.pdf`;
    
    // Tenter l'upload
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('cvs')
      .upload(testFileName, testFile);
      
    if (uploadError) {
      console.error('❌ Erreur lors du test d\'upload:', uploadError);
      return false;
    }
    
    console.log('✅ Test d\'upload réussi !', uploadData);
    
    // Nettoyer le fichier de test
    const { error: deleteError } = await supabase.storage
      .from('cvs')
      .remove([testFileName]);
      
    if (deleteError) {
      console.warn('⚠️ Impossible de supprimer le fichier de test:', deleteError);
    } else {
      console.log('🧹 Fichier de test nettoyé');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Erreur inattendue lors du test:', error);
    return false;
  }
}

/**
 * Fonction globale pour la console - test complet
 */
export async function fullCVTest() {
  console.log('🚀 Test complet du système CV...');
  
  try {
    // 1. Test rapide
    const quickTest = await quickBucketTest();
    console.log(quickTest.success ? `✅ ${quickTest.message}` : `❌ ${quickTest.message}`);
    
    if (!quickTest.bucketExists) {
      console.log('💡 Le bucket doit être créé manuellement dans Supabase Dashboard');
      return;
    }
    
    // 2. Test d'accès
    const accessTest = await testBucketAccess();
    console.log(accessTest.success ? `✅ ${accessTest.message}` : `❌ ${accessTest.message}`);
    
    // 3. Test d'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.log('❌ Utilisateur non connecté');
      return;
    }
    
    console.log(`✅ Utilisateur connecté: ${user.email}`);
    
    // 4. Test d'upload
    const uploadTest = await testCVUpload(user.id);
    console.log(uploadTest ? '✅ Test d\'upload réussi' : '❌ Échec du test d\'upload');
    
    console.log('🏁 Test complet terminé');
  } catch (error) {
    console.error('❌ Erreur lors du test complet:', error);
  }
}
