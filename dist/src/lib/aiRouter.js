// aiRouter.ts : Route dynamiquement les appels IA selon le choix utilisateur et la clé API stockée.
// Gère le chiffrement local (MVP) et supporte multi-fournisseurs.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function matchScoreIA(userSkills, jobKeywords, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const { engine, apiKeys } = opts;
        const apiKey = apiKeys[engine] || '';
        // Fallback local (MVP)
        if (!apiKey || engine === 'openai') {
            // Local fallback ou OpenAI public
            const matchCount = jobKeywords.filter((kw) => userSkills.includes(kw)).length;
            return Math.round((matchCount / jobKeywords.length) * 100);
        }
        // TODO: Ajouter les appels réels aux API selon le moteur choisi
        // Exemples :
        // if (engine === 'claude') { ... }
        // if (engine === 'gemini') { ... }
        // if (engine === 'cohere') { ... }
        // if (engine === 'huggingface') { ... }
        // if (engine === 'mistral') { ... }
        // if (engine === 'custom') { ... }
        // Pour l’instant, fallback local
        const matchCount = jobKeywords.filter((kw) => userSkills.includes(kw)).length;
        return Math.round((matchCount / jobKeywords.length) * 100);
    });
}
// TODO: Ajouter d’autres fonctions IA (génération lettre, analyse CV, etc.) avec la même logique.
