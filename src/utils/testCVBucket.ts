import { supabase } from '../lib/supabase';

/**
 * Script de test pour vérifier et créer le bucket CVs si nécessaire
 */
export async function testAndCreateCVBucket() {
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
