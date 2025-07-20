import { supabase } from '../lib/supabase';

/**
 * Fonction de test pour vérifier les policies RLS de la table user_cvs
 */
export async function testRLSPolicies() {
  console.log('🧪 [RLS Test] Starting RLS policy test...');
  
  // 1. Vérifier l'authentification
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  console.log('🔐 [RLS Test] Current user:', user?.id);
  console.log('🔐 [RLS Test] Auth error:', authError);
  
  if (!user) {
    console.error('❌ [RLS Test] No authenticated user found');
    return;
  }
  
  // 2. Tester SELECT (lecture)
  console.log('📖 [RLS Test] Testing SELECT policy...');
  const { data: selectData, error: selectError } = await supabase
    .from('user_cvs')
    .select('*')
    .eq('user_id', user.id);
    
  console.log('📖 [RLS Test] SELECT result:', { selectData, selectError });
  
  // 3. Tester INSERT (écriture)
  console.log('✍️ [RLS Test] Testing INSERT policy...');
  const testCV = {
    user_id: user.id,
    file_name: 'test-cv.pdf',
    storage_path: `${user.id}/test-${Date.now()}.pdf`,
    file_size: 1024,
    file_type: 'application/pdf',
    is_primary: false
  };
  
  const { data: insertData, error: insertError } = await supabase
    .from('user_cvs')
    .insert(testCV)
    .select()
    .single();
    
  console.log('✍️ [RLS Test] INSERT result:', { insertData, insertError });
  
  // 4. Si l'insertion a réussi, tester DELETE
  if (insertData && !insertError) {
    console.log('🗑️ [RLS Test] Testing DELETE policy...');
    const { error: deleteError } = await supabase
      .from('user_cvs')
      .delete()
      .eq('id', insertData.id);
      
    console.log('🗑️ [RLS Test] DELETE result:', { deleteError });
  }
  
  console.log('✅ [RLS Test] RLS policy test completed');
}

// Fonction utilitaire pour vérifier la configuration RLS
export async function checkRLSConfiguration() {
  console.log('🔍 [RLS Check] Checking RLS configuration...');
  
  // Vérifier si RLS est activé sur la table
  const { data: rlsStatus, error: rlsError } = await supabase
    .rpc('check_rls_enabled', { table_name: 'user_cvs' });
    
  console.log('🔍 [RLS Check] RLS status:', { rlsStatus, rlsError });
  
  // Lister les policies existantes
  const { data: policies, error: policiesError } = await supabase
    .rpc('get_table_policies', { table_name: 'user_cvs' });
    
  console.log('🔍 [RLS Check] Existing policies:', { policies, policiesError });
}
