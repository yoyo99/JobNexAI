import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as jose from "https://deno.land/x/jose@v4.14.4/index.ts";

// Interfaces
interface TestCV {
  id: string;
  path: string; // Path to the test CV file
  jobDescription: string;
}

interface TestResult {
  cvId: string;
  success: boolean;
  parsingTime: number;
  analysisTime: number;
  errors: string[];
}

interface SubTestResult {
  success: boolean;
  time: number;
  errors: string[];
}

class CVFuzzerRunner {
  private results: TestResult[] = [];
  private baseUrl = "http://localhost:54321/functions/v1";
  private supabaseAdmin!: SupabaseClient;
  private JWT_SECRET = 'super-secret-jwt-token-with-at-least-32-characters-long';

  private testCVs: TestCV[] = [
    { id: "cv-dev-en", path: "./tests/cv_dev_en.pdf", jobDescription: "Senior Software Engineer..." },
    { id: "cv-marketing-fr", path: "./tests/cv_marketing_fr.pdf", jobDescription: "Chef de Projet Marketing..." }
  ];

  constructor() {}

  private async initializeAdminClient(): Promise<void> {
    const SUPABASE_URL = "http://localhost:54321";
    const serviceRolePayload = { role: 'service_role', iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 60 * 60 };
    const secret = new TextEncoder().encode(this.JWT_SECRET);
    const serviceRoleKey = await new jose.SignJWT(serviceRolePayload).setProtectedHeader({ alg: 'HS256' }).sign(secret);
    this.supabaseAdmin = createClient(SUPABASE_URL, serviceRoleKey);
  }

  async runTests() {
    console.log("🧪 Lancement des tests CV Fuzzer...");
    await this.initializeAdminClient();
    for (const testCV of this.testCVs) {
      await this.runSingleTest(testCV);
    }
    this.generateReport();
  }

  private async runSingleTest(testCV: TestCV) {
    console.log(`--- Running test for ${testCV.id} ---`);
    let userId = '', token = '', realCvId = '', storagePath = '';
    let parsingResult: SubTestResult = { success: false, time: 0, errors: [] };
    let analysisResult: SubTestResult = { success: false, time: 0, errors: [] };

    try {
      // 1. Setup User
      const userEmail = `test-user-${Date.now()}@example.com`;
      const { data: userData, error: userError } = await this.supabaseAdmin.auth.admin.createUser({ email: userEmail, password: 'password123', email_confirm: true });
      if (userError) throw new Error(`User creation failed: ${userError.message}`);
      userId = userData.user.id;

      const { data: sessionData, error: sessionError } = await this.supabaseAdmin.auth.signInWithPassword({ email: userEmail, password: 'password123' });
      if (sessionError) throw new Error(`Sign-in failed: ${sessionError.message}`);
      token = sessionData.session!.access_token;

      // 2. Upload file to storage
      storagePath = `${userId}/${testCV.id}.pdf`;
      const fileBody = await Deno.readFile(testCV.path);
      const { error: uploadError } = await this.supabaseAdmin.storage.from('cvs').upload(storagePath, fileBody, { contentType: 'application/pdf', upsert: true });
      if (uploadError) throw new Error(`Storage upload failed: ${uploadError.message}`);

      // 3. Create DB entry
      const { data: cvData, error: cvError } = await this.supabaseAdmin.from('user_cvs').insert({ user_id: userId, content: { path: storagePath } }).select('id').single();
      if (cvError) throw new Error(`DB insert failed: ${cvError.message}`);
      realCvId = cvData.id;
      console.log(`✅ Setup complete for ${testCV.id} (User: ${userId}, CV: ${realCvId})`);

      // 4. Run tests
      parsingResult = await this.runSubTest('Parsing', 'parse-cv-v2', { cvPath: storagePath, cvId: realCvId }, token);
      if (parsingResult.success) {
        analysisResult = await this.runSubTest('Analysis', 'analyze-cv-v2', { cvId: realCvId, jobDescription: testCV.jobDescription }, token);
      } else {
        analysisResult.errors.push('Parsing failed, analysis skipped');
      }

    } catch (e) {
      console.error(`❌ Test lifecycle error for ${testCV.id}: ${e.message}`);
      parsingResult.errors.push(e.message);
    } finally {
      // 5. Teardown
      if (userId) await this.supabaseAdmin.auth.admin.deleteUser(userId);
      if (storagePath) await this.supabaseAdmin.storage.from('cvs').remove([storagePath]);
      console.log(`🧹 Teardown complete for ${testCV.id}`);

      this.results.push({
        cvId: testCV.id,
        success: parsingResult.success && analysisResult.success,
        parsingTime: parsingResult.time,
        analysisTime: analysisResult.time,
        errors: [...parsingResult.errors, ...analysisResult.errors].filter(e => e)
      });
    }
  }

  private async runSubTest(name: string, endpoint: string, body: Record<string, any>, token: string): Promise<SubTestResult> {
    const startTime = Date.now();
    try {
      const response = await fetch(`${this.baseUrl}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      const time = Date.now() - startTime;
      if (!response.ok) {
        const errorBody = await response.text();
        return { success: false, time, errors: [`${name} failed: ${errorBody}`] };
      }
      return { success: true, time, errors: [] };
    } catch (error) {
      const time = Date.now() - startTime;
      return { success: false, time, errors: [error.message] };
    }
  }

  private generateReport() {
    console.log("\n📊 RAPPORT DE TESTS CV");
    console.log("=".repeat(50));

    const totalTests = this.results.length;
    const successfulTests = this.results.filter(r => r.success).length;
    const avgParsingTime = totalTests > 0 ? this.results.reduce((sum, r) => sum + r.parsingTime, 0) / totalTests : 0;
    const avgAnalysisTime = totalTests > 0 ? this.results.reduce((sum, r) => sum + r.analysisTime, 0) / totalTests : 0;

    console.log(`Total tests: ${totalTests}`);
    const successRate = totalTests > 0 ? (successfulTests / totalTests * 100).toFixed(1) : "0.0";
    console.log(`Success rate: ${successfulTests}/${totalTests} (${successRate}%)`);
    console.log(`Avg parsing time: ${avgParsingTime.toFixed(0)}ms`);
    console.log(`Avg analysis time: ${avgAnalysisTime.toFixed(0)}ms`);

    const failedTests = this.results.filter(r => !r.success);
    if (failedTests.length > 0) {
      console.log("\n❌ ERREURS:");
      failedTests.forEach(r => {
        console.log(`- ${r.cvId}: ${r.errors.join(", ")}`);
      });
    }

    Deno.writeTextFileSync("cv-test-results.json", JSON.stringify(this.results, null, 2));
    console.log("\n📄 Results exported to cv-test-results.json");
  }
}

if (import.meta.main) {
  const runner = new CVFuzzerRunner();
  runner.runTests().catch(err => console.error("FATAL ERROR:", err));
}

export { CVFuzzerRunner };
