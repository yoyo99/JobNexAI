export interface UserProfile {
  skills: string[];
  experience: string;
  preferences: string[];
}

export interface SearchFilters {
  location?: string;
  jobType?: string;
  salaryRange?: { min: number; max: number };
  remote?: boolean;
}

export interface OptimizedSearchResult {
  enhancedQuery: string;
  keywords: string[];
  synonyms: string[];
  excludeTerms: string[];
  prioritySkills: string[];
  searchStrategy: 'broad' | 'focused' | 'hybrid';
  originalQuery: string;
  timestamp: string;
  confidence: number;
}

export class AIJobSearchService {
  private static readonly FUNCTION_URL = '/.netlify/functions/ai-job-search';

  /**
   * Optimise une requête de recherche d'emploi avec l'IA
   */
  static async optimizeJobSearch(
    query: string,
    userProfile?: UserProfile,
    filters?: SearchFilters
  ): Promise<OptimizedSearchResult> {
    try {
      const response = await fetch(this.FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          userProfile,
          filters
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }

      return result;
    } catch (error) {
      console.error('Erreur lors de l\'optimisation de la recherche:', error);
      
      // Fallback en cas d'erreur
      return {
        enhancedQuery: query,
        keywords: query.split(' ').filter(word => word.length > 2),
        synonyms: [],
        excludeTerms: [],
        prioritySkills: userProfile?.skills?.slice(0, 3) || [],
        searchStrategy: 'hybrid',
        originalQuery: query,
        timestamp: new Date().toISOString(),
        confidence: 0.3
      };
    }
  }

  /**
   * Génère des suggestions de recherche basées sur le profil utilisateur
   */
  static async generateSearchSuggestions(userProfile: UserProfile): Promise<string[]> {
    try {
      // Utiliser les compétences et préférences pour générer des suggestions
      const suggestions: string[] = [];
      
      // Suggestions basées sur les compétences
      if (userProfile.skills.length > 0) {
        const topSkills = userProfile.skills.slice(0, 3);
        suggestions.push(...topSkills.map(skill => `Développeur ${skill}`));
        suggestions.push(...topSkills.map(skill => `Expert ${skill}`));
      }

      // Suggestions basées sur l'expérience
      if (userProfile.experience) {
        const experienceLevel = this.extractExperienceLevel(userProfile.experience);
        suggestions.push(`Poste ${experienceLevel}`);
      }

      // Suggestions basées sur les préférences
      if (userProfile.preferences.length > 0) {
        suggestions.push(...userProfile.preferences.slice(0, 2));
      }

      // Retourner les suggestions uniques
      return [...new Set(suggestions)].slice(0, 5);
    } catch (error) {
      console.error('Erreur lors de la génération des suggestions:', error);
      return ['Développeur', 'Consultant', 'Manager', 'Analyste', 'Ingénieur'];
    }
  }

  /**
   * Extrait le niveau d'expérience d'une chaîne de texte
   */
  private static extractExperienceLevel(experience: string): string {
    const exp = experience.toLowerCase();
    
    if (exp.includes('junior') || exp.includes('débutant') || exp.includes('0-2')) {
      return 'junior';
    } else if (exp.includes('senior') || exp.includes('expert') || exp.includes('5+')) {
      return 'senior';
    } else {
      return 'confirmé';
    }
  }

  /**
   * Analyse la qualité d'une requête de recherche
   */
  static analyzeSearchQuality(query: string): {
    score: number;
    suggestions: string[];
    issues: string[];
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 0.5;

    // Vérifier la longueur
    if (query.length < 3) {
      issues.push('Requête trop courte');
      suggestions.push('Ajoutez plus de détails sur le poste recherché');
    } else {
      score += 0.2;
    }

    // Vérifier la présence de mots-clés techniques
    const techKeywords = ['développeur', 'ingénieur', 'consultant', 'manager', 'analyste'];
    const hasTechKeyword = techKeywords.some(keyword => 
      query.toLowerCase().includes(keyword)
    );
    
    if (hasTechKeyword) {
      score += 0.2;
    } else {
      suggestions.push('Précisez le type de poste (développeur, consultant, etc.)');
    }

    // Vérifier la présence de compétences
    const skillKeywords = ['javascript', 'python', 'react', 'node', 'sql', 'aws'];
    const hasSkill = skillKeywords.some(skill => 
      query.toLowerCase().includes(skill)
    );
    
    if (hasSkill) {
      score += 0.1;
    } else {
      suggestions.push('Mentionnez des compétences techniques spécifiques');
    }

    return {
      score: Math.min(score, 1.0),
      suggestions,
      issues
    };
  }
}

export default AIJobSearchService;
