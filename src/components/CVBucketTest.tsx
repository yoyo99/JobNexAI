import React, { useState } from 'react';
import { testAndCreateCVBucket, testCVUpload, quickBucketTest, testBucketAccess } from '../utils/testCVBucket';
import { useAuth } from '../stores/auth';
import { supabase } from '../lib/supabase';

const CVBucketTest: React.FC = () => {
  const { user } = useAuth();
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const runTests = async () => {
    if (!user) {
      addResult('❌ Utilisateur non connecté');
      return;
    }

    setTesting(true);
    setResults([]);
    
    try {
      addResult('🚀 Début des tests du bucket CVs...');
      addResult(`👤 Utilisateur: ${user.email} (${user.id})`);
      
      // Test 1: Vérification rapide
      addResult('🔍 Test 1: Vérification des buckets existants...');
      const quickTest = await quickBucketTest();
      if (quickTest.success) {
        addResult(`✅ ${quickTest.message}`);
      } else {
        addResult(`⚠️ ${quickTest.message}`);
      }
      
      // Test 2: Test d'accès au bucket (si existe)
      if (quickTest.bucketExists) {
        addResult('🔐 Test 2: Vérification des permissions d\'accès...');
        const accessTest = await testBucketAccess();
        if (accessTest.success) {
          addResult(`✅ ${accessTest.message}`);
        } else {
          addResult(`❌ ${accessTest.message}`);
        }
      }
      
      // Test 3: Tentative de création (si nécessaire)
      if (!quickTest.bucketExists) {
        addResult('🔨 Test 3: Tentative de création du bucket...');
        const createTest = await testAndCreateCVBucket();
        if (createTest) {
          addResult('✅ Bucket créé avec succès!');
        } else {
          addResult('❌ Échec de la création automatique');
          addResult('💡 Solution: Créer le bucket manuellement dans Supabase Dashboard');
          addResult('📋 Nom du bucket: "cvs"');
          addResult('🔒 Type: Privé (non public)');
          addResult('📏 Limite: 5MB');
        }
      }
      
      // Test 4: Test d'upload (si bucket disponible)
      const finalBucketCheck = await quickBucketTest();
      if (finalBucketCheck.bucketExists) {
        addResult('🧪 Test 4: Test d\'upload d\'un fichier factice...');
        const uploadOk = await testCVUpload(user.id);
        if (uploadOk) {
          addResult('✅ Test d\'upload réussi - Le système est opérationnel!');
        } else {
          addResult('❌ Problème lors du test d\'upload');
          addResult('💡 Vérifier les politiques RLS pour les objets storage');
        }
      }
      
      addResult('🏁 Tests terminés');
    } catch (error) {
      addResult(`❌ Erreur inattendue: ${error}`);
      console.error('Erreur lors des tests:', error);
    } finally {
      setTesting(false);
    }
  };

  const runQuickTest = async () => {
    if (!user) {
      addResult('❌ Utilisateur non connecté');
      return;
    }

    setTesting(true);
    setResults([]);
    
    try {
      addResult('⚡ Test rapide du bucket CVs...');
      const result = await quickBucketTest();
      addResult(result.success ? `✅ ${result.message}` : `❌ ${result.message}`);
      
      if (result.bucketExists) {
        addResult('🎉 Le bucket CVs est disponible!');
      } else {
        addResult('⚠️ Le bucket CVs doit être créé manuellement');
      }
    } catch (error) {
      addResult(`❌ Erreur: ${error}`);
    } finally {
      setTesting(false);
    }
  };

  const exposeGlobalFunctions = () => {
    // Exposer les fonctions de test dans la console
    (window as any).quickBucketTest = quickBucketTest;
    (window as any).testBucketAccess = testBucketAccess;
    (window as any).supabase = supabase;
    addResult('🔧 Fonctions de debug exposées dans la console:');
    addResult('- quickBucketTest()');
    addResult('- testBucketAccess()');
    addResult('- supabase (client Supabase)');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white/5 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4">🔧 Test du Bucket CVs</h2>
        
        <div className="mb-6">
          <p className="text-gray-300 mb-4">
            Cette page permet de diagnostiquer et résoudre les problèmes d'upload de CV.
          </p>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={runTests}
              disabled={testing || !user}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium"
            >
              {testing ? '🔄 Tests en cours...' : '🚀 Tests Complets'}
            </button>
            
            <button
              onClick={runQuickTest}
              disabled={testing || !user}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium"
            >
              {testing ? '🔄 Test en cours...' : '⚡ Test Rapide'}
            </button>
            
            <button
              onClick={exposeGlobalFunctions}
              disabled={!user}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium"
            >
              🔧 Debug Console
            </button>
          </div>
          
          <div className="mt-4 text-sm text-gray-400">
            <p><strong>Test Rapide:</strong> Vérifie uniquement si le bucket existe</p>
            <p><strong>Tests Complets:</strong> Vérifie tout + tentative de création + test d'upload</p>
            <p><strong>Debug Console:</strong> Expose les fonctions de test dans la console du navigateur</p>
          </div>
        </div>

        {results.length > 0 && (
          <div className="bg-black/20 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">📋 Résultats des tests</h3>
            <div className="space-y-1 font-mono text-sm">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`${
                    result.includes('✅') ? 'text-green-400' :
                    result.includes('❌') ? 'text-red-400' :
                    result.includes('⚠️') ? 'text-yellow-400' :
                    'text-gray-300'
                  }`}
                >
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}

        {!user && (
          <div className="bg-yellow-900/50 border border-yellow-600 rounded-lg p-4 mt-4">
            <p className="text-yellow-200">
              ⚠️ Vous devez être connecté pour effectuer les tests.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CVBucketTest;
