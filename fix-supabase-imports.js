/**
 * Script dédié à la correction des importations Supabase
 * 
 * Ce script s'assure que les importations de @supabase/supabase-js sont correctes
 * et installe les dépendances manquantes.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Correction des importations Supabase...');

// 1. D'abord, vérifier que toutes les dépendances Supabase sont installées
const requiredDeps = [
  '@supabase/supabase-js',
  '@supabase/gotrue-js',
  '@supabase/postgrest-js',
  '@supabase/realtime-js',
  '@supabase/storage-js',
  '@supabase/functions-js'
];

console.log('🔍 Vérification des dépendances Supabase...');
const missingDeps = [];

for (const dep of requiredDeps) {
  const depPath = path.resolve(__dirname, 'node_modules', dep);
  
  if (!fs.existsSync(depPath)) {
    console.log(`❌ ${dep} est manquant`);
    missingDeps.push(dep);
  } else {
    console.log(`✅ ${dep} est présent`);
  }
}

// Installer les dépendances manquantes
if (missingDeps.length > 0) {
  console.log('\n🔄 Installation des dépendances manquantes...');
  try {
    execSync(`npm install ${missingDeps.join(' ')} --save`, { stdio: 'inherit' });
    console.log('✅ Dépendances installées avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de l\'installation des dépendances:', error);
  }
}

// 2. Corriger les fichiers qui utilisent Supabase
const supabaseFiles = [
  path.resolve(__dirname, 'src', 'lib', 'supabase.ts'),
  path.resolve(__dirname, 'src', 'lib', 'supabaseClient.ts')
];

console.log('\n🔍 Vérification des fichiers Supabase...');

for (const filePath of supabaseFiles) {
  if (fs.existsSync(filePath)) {
    console.log(`🔍 Vérification de ${path.relative(__dirname, filePath)}...`);
    
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;
    
    // Remplacer les importations avec des chemins absolus par des importations standard
    content = content.replace(
      /import\s+\{([^}]*)\}\s+from\s+['"]\.\.\/\.\.\/node_modules\/@supabase\/supabase-js\/[^'"]*['"]/g,
      (match, imports) => `import {${imports}} from '@supabase/supabase-js'`
    );
    
    // Remplacer les importations directes vers dist/index.js
    content = content.replace(
      /import\s+\{([^}]*)\}\s+from\s+['"](\.\.\/)*node_modules\/@supabase\/supabase-js\/dist\/index\.js['"]/g,
      (match, imports) => `import {${imports}} from '@supabase/supabase-js'`
    );
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Importations corrigées dans ${path.relative(__dirname, filePath)}`);
    } else {
      console.log(`✅ Les importations dans ${path.relative(__dirname, filePath)} semblent correctes`);
    }
  }
}

// 3. Créer un fichier module d'émulation pour Supabase
console.log('\n📝 Création d\'un module d\'émulation pour Supabase...');

const supabaseCompatDir = path.resolve(__dirname, 'src', 'compat');
if (!fs.existsSync(supabaseCompatDir)) {
  fs.mkdirSync(supabaseCompatDir, { recursive: true });
}

const supabaseCompatPath = path.resolve(supabaseCompatDir, 'supabase.ts');
const supabaseCompatContent = `/**
 * Module d'émulation pour @supabase/supabase-js
 * 
 * Ce fichier facilite l'importation de Supabase dans tous les environnements,
 * y compris lors du build Netlify.
 */

import * as Supabase from '@supabase/supabase-js';

// Exposer l'API Supabase
export const { createClient } = Supabase;

// Re-exporter les types principaux
export type {
  SupabaseClient,
  User,
  Session,
  AuthResponse,
  UserResponse,
  PostgrestResponse,
  PostgrestError
} from '@supabase/supabase-js';

// Créer et exporter une instance du client Supabase (si utilisée dans le projet)
// export const supabase = createClient(
//   process.env.VITE_SUPABASE_URL || '',
//   process.env.VITE_SUPABASE_ANON_KEY || ''
// );

// Exporter le module entier
export default Supabase;
`;

fs.writeFileSync(supabaseCompatPath, supabaseCompatContent);
console.log(`✅ Module d'émulation créé: ${path.relative(__dirname, supabaseCompatPath)}`);

// 4. Modifier le fichier vite.config.patch.js pour améliorer la résolution de Supabase
console.log('\n🔍 Vérification du patch de configuration Vite...');

const viteConfigPatchPath = path.resolve(__dirname, 'vite.config.patch.js');
if (fs.existsSync(viteConfigPatchPath)) {
  const viteConfigPatch = fs.readFileSync(viteConfigPatchPath, 'utf-8');
  
  // Assurons-nous que les optimisations pour Supabase soient correctes
  if (!viteConfigPatch.includes('optimizeDeps: { include: [')) {
    console.log('⚠️ Le patch de configuration Vite doit être mis à jour pour inclure les dépendances Supabase...');
    // Cette partie serait complexe à implémenter ici, car elle nécessiterait de modifier le fichier correctement
    // sans risquer de le corrompre.
  } else {
    console.log('✅ Le patch de configuration Vite semble correct');
  }
}

console.log('\n✨ Correction des importations Supabase terminée!');
