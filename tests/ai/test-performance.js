// tests/ai/test-performance.js
require('dotenv').config({ path: '../../.env' });
const fs = require('fs');
const path = require('path');
const { matchCVWithJob } = require('../../dist/lib/ai_logic/matchCV.js');

async function runPerformanceTests() {
    console.log("--- Démarrage des Tests de Performance pour matchCVWithJob ---");

    const cvText = fs.readFileSync(path.join(__dirname, 'fixtures/cv-simple.txt'), 'utf8');
    const jobText = fs.readFileSync(path.join(__dirname, 'fixtures/job-simple.txt'), 'utf8');
    const numberOfRuns = 5;
    const timeThresholdMs = 5000; // Seuil de temps de réponse acceptable en millisecondes (ex: 5 secondes)
    let totalTime = 0;
    let maxTime = 0;
    let minTime = Infinity;
    let successfulRuns = 0;

    console.log(`Exécution de ${numberOfRuns} appels consécutifs...`);

    for (let i = 0; i < numberOfRuns; i++) {
        try {
            const startTime = process.hrtime();
            const result = await matchCVWithJob(cvText, jobText);
            const endTime = process.hrtime(startTime);
            const durationMs = (endTime[0] * 1000) + (endTime[1] / 1000000);
            
            console.log(`Appel ${i + 1}: Score = ${result.score}, Durée = ${durationMs.toFixed(2)} ms`);
            
            totalTime += durationMs;
            if (durationMs > maxTime) maxTime = durationMs;
            if (durationMs < minTime) minTime = durationMs;
            
            if (durationMs > timeThresholdMs) {
                console.warn(`⚠️ ATTENTION: L'appel ${i + 1} a dépassé le seuil de ${timeThresholdMs} ms.`);
            }
            successfulRuns++;
        } catch (error) {
            console.error(`Erreur lors de l'appel ${i + 1}:`, error);
        }
        // Petite pause pour éviter de surcharger l'API trop rapidement si on fait beaucoup d'appels
        if (i < numberOfRuns - 1) {
            await new Promise(resolve => setTimeout(resolve, 200)); 
        }
    }

    if (successfulRuns > 0) {
        const averageTime = totalTime / successfulRuns;
        console.log("\n--- Statistiques de Performance ---");
        console.log(`Nombre d'appels réussis: ${successfulRuns}/${numberOfRuns}`);
        console.log(`Temps moyen par appel: ${averageTime.toFixed(2)} ms`);
        console.log(`Temps maximum: ${maxTime.toFixed(2)} ms`);
        console.log(`Temps minimum: ${minTime.toFixed(2)} ms`);
        if (averageTime > timeThresholdMs) {
            console.error(`❌ ÉCHOUÉ: Le temps moyen par appel (${averageTime.toFixed(2)} ms) dépasse le seuil de ${timeThresholdMs} ms.`);
        } else {
            console.log(`✅ PASSÉ: Le temps moyen par appel est dans les limites acceptables.`);
        }
    } else {
        console.error("❌ ÉCHOUÉ: Aucun appel n'a réussi.");
    }

    console.log("\n--- Fin des Tests de Performance ---");
}

if (require.main === module) {
    runPerformanceTests().catch(err => {
        console.error("Une erreur non gérée est survenue lors de l'exécution des tests de performance:", err);
    });
}

module.exports = { runPerformanceTests };
