import React, { useState } from 'react';
import { testAndCreateCVBucket, testCVUpload } from '../utils/testCVBucket';
import { useAuth } from '../stores/auth';

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
      
      // Test 1: Vérifier/créer le bucket
      const bucketOk = await testAndCreateCVBucket();
      if (bucketOk) {
        addResult('✅ Bucket CVs opérationnel');
      } else {
        addResult('❌ Problème avec le bucket CVs');
        setTesting(false);
        return;
      }
      
      // Test 2: Test d'upload
      const uploadOk = await testCVUpload(user.id);
      if (uploadOk) {
        addResult('✅ Test d\'upload réussi');
      } else {
        addResult('❌ Problème lors du test d\'upload');
      }
      
      addResult('🏁 Tests terminés');
    } catch (error) {
      addResult(`❌ Erreur inattendue: ${error}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white/5 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4">🔧 Test du Bucket CVs</h2>
        
        <div className="mb-6">
          <p className="text-gray-300 mb-4">
            Cette page permet de diagnostiquer et résoudre les problèmes d'upload de CV.
          </p>
          
          <button
            onClick={runTests}
            disabled={testing || !user}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium"
          >
            {testing ? '🔄 Tests en cours...' : '🚀 Lancer les tests'}
          </button>
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
