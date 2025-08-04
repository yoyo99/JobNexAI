import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

interface TestCV {
  id: string;
  content: string;
  expectedScore: number;
  language: string;
  format: string;
}

interface TestResult {
  cvId: string;
  success: boolean;
  score: number;
  parsingTime: number;
  analysisTime: number;
  errors: string[];
}

class CVFuzzerRunner {
  private results: TestResult[] = [];
  private baseUrl = "http://localhost:54321/functions/v1";
  private testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";
  
  // Test CVs de base
  private testCVs: TestCV[] = [
    {
      id: "cv-dev-en",
      content: `JOHN DOE
Senior Software Engineer
Experience: 5+ years at Google, Facebook
Skills: React, Node.js, Python, AWS
Education: MIT Computer Science`,
      expectedScore: 85,
      language: "en",
      format: "text"
    },
    {
      id: "cv-marketing-fr",
      content: `MARIE DUBOIS
Chef de Projet Marketing Digital
Expérience: 3 ans chez L'Oréal, Sephora
Compétences: SEO, Google Ads, Analytics
Formation: Master Marketing`,
      expectedScore: 78,
      language: "fr",
      format: "text"
    }
  ];

  async runTests() {
    console.log("🧪 Lancement des tests CV Fuzzer...");
    
    for (const testCV of this.testCVs) {
      await this.testCVParsing(testCV);
      await this.testCVAnalysis(testCV);
    }
    
    this.generateReport();
  }

  private async testCVParsing(testCV: TestCV): Promise<void> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(`${this.baseUrl}/parse-cv-v2`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer test-token"
        },
        body: JSON.stringify({
          cvId: testCV.id,
          content: testCV.content
        })
      });

      const parsingTime = Date.now() - startTime;
      const result = await response.json();
      
      this.results.push({
        cvId: testCV.id,
        success: response.ok,
        score: 0,
        parsingTime,
        analysisTime: 0,
        errors: response.ok ? [] : [result.error || "Parsing failed"]
      });

      console.log(`✅ Parsing ${testCV.id}: ${response.ok ? "OK" : "FAILED"} (${parsingTime}ms)`);
      
    } catch (error) {
      this.results.push({
        cvId: testCV.id,
        success: false,
        score: 0,
        parsingTime: 0,
        analysisTime: 0,
        errors: [error.message]
      });
    }
  }

  private async testCVAnalysis(testCV: TestCV): Promise<void> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(`${this.baseUrl}/analyze-cv-v2`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer test-token"
        },
        body: JSON.stringify({
          cvId: testCV.id,
          jobDescription: "Software Engineer position"
        })
      });

      const analysisTime = Date.now() - startTime;
      const result = await response.json();
      
      const existingResult = this.results.find(r => r.cvId === testCV.id);
      if (existingResult) {
        existingResult.analysisTime = analysisTime;
        existingResult.score = result.score || 0;
        if (!response.ok) {
          existingResult.errors.push(result.error || "Analysis failed");
        }
      }

      console.log(`✅ Analysis ${testCV.id}: ${response.ok ? "OK" : "FAILED"} (${analysisTime}ms)`);
      
    } catch (error) {
      console.error(`❌ Analysis ${testCV.id}: ${error.message}`);
    }
  }

  private generateReport() {
    console.log("\n📊 RAPPORT DE TESTS CV");
    console.log("=" * 50);
    
    const totalTests = this.results.length;
    const successfulTests = this.results.filter(r => r.success).length;
    const avgParsingTime = this.results.reduce((sum, r) => sum + r.parsingTime, 0) / totalTests;
    const avgAnalysisTime = this.results.reduce((sum, r) => sum + r.analysisTime, 0) / totalTests;
    
    console.log(`Total tests: ${totalTests}`);
    console.log(`Success rate: ${successfulTests}/${totalTests} (${(successfulTests/totalTests*100).toFixed(1)}%)`);
    console.log(`Avg parsing time: ${avgParsingTime.toFixed(0)}ms`);
    console.log(`Avg analysis time: ${avgAnalysisTime.toFixed(0)}ms`);
    
    if (this.results.some(r => !r.success)) {
      console.log("\n❌ ERREURS:");
      this.results.filter(r => !r.success).forEach(r => {
        console.log(`- ${r.cvId}: ${r.errors.join(", ")}`);
      });
    }
    
    // Export JSON
    Deno.writeTextFileSync("./tests/cv-test-results.json", JSON.stringify(this.results, null, 2));
    console.log("\n📄 Results exported to cv-test-results.json");
  }
}

// Lancer les tests
if (import.meta.main) {
  const runner = new CVFuzzerRunner();
  await runner.runTests();
}

export { CVFuzzerRunner };
