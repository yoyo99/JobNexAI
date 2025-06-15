// tests/ai/test-basic.js
require('dotenv').config({ path: '../../.env' }); // Charger les variables d'environnement depuis la racine du projet
const fs = require('fs');
const path = require('path');
const { matchCVWithJob } = require('../../dist/lib/ai_logic/matchCV.js'); // Ajustez le chemin si nécessaire après la compilation TypeScript

async function runBasicTests() {
    console.log("--- Démarrage des Tests de Base pour matchCVWithJob ---");

    // Test 1: CV simple et offre d'emploi simple (bonne correspondance attendue)
    try {
        console.log("\n[Test 1] CV Simple vs Offre Simple");
        const cvSimpleText = fs.readFileSync(path.join(__dirname, 'fixtures/cv-simple.txt'), 'utf8');
        const jobSimpleText = fs.readFileSync(path.join(__dirname, 'fixtures/job-simple.txt'), 'utf8');
        
        console.time("Test 1 - Durée");
        const resultSimple = await matchCVWithJob(cvSimpleText, jobSimpleText);
        console.timeEnd("Test 1 - Durée");
        
        console.log("Résultat Test 1:", resultSimple);
        if (typeof resultSimple.score === 'number' && resultSimple.score >= 0 && resultSimple.score <= 100 && 
            typeof resultSimple.summary === 'string' && resultSimple.summary.length > 0) {
            console.log("Statut Test 1: ✅ PASSÉ");
        } else {
            console.error("Statut Test 1: ❌ ÉCHOUÉ - Format de réponse invalide ou score hors limites.");
        }
    } catch (error) {
        console.error("Erreur lors du Test 1:", error);
        console.error("Statut Test 1: ❌ ÉCHOUÉ");
    }

    // Test 2: CV avec caractères spéciaux et offre avec caractères spéciaux
    try {
        console.log("\n[Test 2] CV Caractères Spéciaux vs Offre Caractères Spéciaux");
        const cvSpecialCharsText = fs.readFileSync(path.join(__dirname, 'fixtures/cv-special-chars.txt'), 'utf8');
        const jobSpecialCharsText = fs.readFileSync(path.join(__dirname, 'fixtures/job-special-chars.txt'), 'utf8');
        
        console.time("Test 2 - Durée");
        const resultSpecialChars = await matchCVWithJob(cvSpecialCharsText, jobSpecialCharsText);
        console.timeEnd("Test 2 - Durée");
        
        console.log("Résultat Test 2:", resultSpecialChars);
        if (typeof resultSpecialChars.score === 'number' && resultSpecialChars.score >= 0 && resultSpecialChars.score <= 100 && 
            typeof resultSpecialChars.summary === 'string' && resultSpecialChars.summary.length > 0) {
            console.log("Statut Test 2: ✅ PASSÉ");
        } else {
            console.error("Statut Test 2: ❌ ÉCHOUÉ - Format de réponse invalide ou score hors limites.");
        }
    } catch (error) {
        console.error("Erreur lors du Test 2:", error);
        console.error("Statut Test 2: ❌ ÉCHOUÉ");
    }

    console.log("\n--- Fin des Tests de Base ---");
}

// Exécution des tests
if (require.main === module) {
    runBasicTests().catch(err => {
        console.error("Une erreur non gérée est survenue lors de l'exécution des tests:", err);
    });
}

module.exports = { runBasicTests };
