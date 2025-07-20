// tests/ai/test-error-handling.js
require('dotenv').config({ path: '../../.env' });
const { matchCVWithJob } = require('../../dist/lib/ai_logic/matchCV.js');
const fs = require('fs');
const path = require('path');

async function runErrorHandlingTests() {
    console.log("--- Démarrage des Tests de Gestion d'Erreurs pour matchCVWithJob ---");

    const jobValidText = fs.readFileSync(path.join(__dirname, 'fixtures/job-simple.txt'), 'utf8');

    // Test 1: CV vide
    try {
        console.log("\n[Test 1] CV Vide");
        const resultEmptyCV = await matchCVWithJob("", jobValidText);
        console.log("Résultat Test 1 (CV Vide):", resultEmptyCV);
        // On s'attend à ce que l'IA retourne un score bas ou une indication qu'il n'y a pas de contenu.
        // La fonction matchCVWithJob devrait retourner un score de 0 et un résumé indiquant le problème si l'IA ne peut pas traiter.
        if (resultEmptyCV.score === 0 && resultEmptyCV.summary.includes("Désolé, une erreur est survenue")) {
            console.log("Statut Test 1: ✅ PASSÉ (Gestion d'erreur attendue)");
        } else if (typeof resultEmptyCV.score === 'number' && resultEmptyCV.score === 0) {
             console.log("Statut Test 1: ✅ PASSÉ (Score bas pour CV vide, comme attendu)");
        } else {
            console.warn("Statut Test 1: ⚠️ ATTENTION - Comportement inattendu pour CV vide.", resultEmptyCV);
        }
    } catch (error) {
        console.error("Erreur lors du Test 1 (CV Vide):", error);
        console.error("Statut Test 1: ❌ ÉCHOUÉ");
    }

    // Test 2: Description de poste vide
    try {
        console.log("\n[Test 2] Description de Poste Vide");
        const cvValidText = fs.readFileSync(path.join(__dirname, 'fixtures/cv-simple.txt'), 'utf8');
        const resultEmptyJob = await matchCVWithJob(cvValidText, "");
        console.log("Résultat Test 2 (Description Vide):", resultEmptyJob);
        if (resultEmptyJob.score === 0 && resultEmptyJob.summary.includes("Désolé, une erreur est survenue")) {
            console.log("Statut Test 2: ✅ PASSÉ (Gestion d'erreur attendue)");
        } else if (typeof resultEmptyJob.score === 'number' && resultEmptyJob.score === 0) {
             console.log("Statut Test 2: ✅ PASSÉ (Score bas pour description vide, comme attendu)");
        } else {
            console.warn("Statut Test 2: ⚠️ ATTENTION - Comportement inattendu pour description vide.", resultEmptyJob);
        }
    } catch (error) {
        console.error("Erreur lors du Test 2 (Description Vide):", error);
        console.error("Statut Test 2: ❌ ÉCHOUÉ");
    }
    
    // Test 3: Les deux champs vides
    try {
        console.log("\n[Test 3] CV et Description de Poste Vides");
        const resultBothEmpty = await matchCVWithJob("", "");
        console.log("Résultat Test 3 (Les deux vides):", resultBothEmpty);
        if (resultBothEmpty.score === 0 && resultBothEmpty.summary.includes("Désolé, une erreur est survenue")) {
            console.log("Statut Test 3: ✅ PASSÉ (Gestion d'erreur attendue)");
        } else if (typeof resultBothEmpty.score === 'number' && resultBothEmpty.score === 0) {
             console.log("Statut Test 3: ✅ PASSÉ (Score bas pour champs vides, comme attendu)");
        } else {
            console.warn("Statut Test 3: ⚠️ ATTENTION - Comportement inattendu pour champs vides.", resultBothEmpty);
        }
    } catch (error) {
        console.error("Erreur lors du Test 3 (Les deux vides):", error);
        console.error("Statut Test 3: ❌ ÉCHOUÉ");
    }

    // Note: Les tests d'erreurs réseau ou de clé API invalide sont plus complexes à simuler ici
    // et sont généralement couverts par des tests d'intégration ou en observant le comportement
    // de la fonction matchCVWithJob qui retourne un score de 0 et un message d'erreur.

    console.log("\n--- Fin des Tests de Gestion d'Erreurs ---");
}

if (require.main === module) {
    runErrorHandlingTests().catch(err => {
        console.error("Une erreur non gérée est survenue lors de l'exécution des tests d'erreur:", err);
    });
}

module.exports = { runErrorHandlingTests };
