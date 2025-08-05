import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase.ts";
import { assertEquals, assert } from "std/testing/asserts.ts";

const testCVs = [
    { id: "cv-dev-en", path: "./tests/cv_dev_en.pdf", jobDescription: "Senior Software Engineer..." },
    { id: "cv-marketing-fr", path: "./tests/cv_marketing_fr.pdf", jobDescription: "Chef de Projet Marketing..." }
];

function initializeAdminClient(): SupabaseClient<Database> {
    const SUPABASE_URL = "https://klwugophjvzctlautsqz.supabase.co";
    const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_KEY');
    if (!SUPABASE_SERVICE_KEY) {
        throw new Error('SUPABASE_SERVICE_KEY is not set in environment variables.');
    }
    return createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_KEY);
}

Deno.test("CV Fuzzer E2E Tests", { sanitizeResources: false, sanitizeOps: false }, async (t) => {
    const supabaseAdmin = initializeAdminClient();
    const baseUrl = "https://klwugophjvzctlautsqz.supabase.co/functions/v1";

    for (const cv of testCVs) {
        await t.step(`Test for ${cv.id}`, async () => {
            const email = `test-user-${Date.now()}@example.com`;
            const password = 'password123';
            const { data: { user }, error: userError } = await supabaseAdmin.auth.admin.createUser({
                email,
                password,
                email_confirm: true
            });
            assert(user, `User creation failed: ${userError?.message}`);
            if (!user) return;

            // Sign in to get a JWT for the new user
            const { data: signInData, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
                email,
                password,
            });
            assert(signInData?.session, `Sign-in failed: ${signInError?.message}`);
            if (!signInData?.session) throw new Error('Sign-in failed, session is null.');
            const userToken = signInData.session.access_token;

            const { data: cvData, error: cvError } = await supabaseAdmin
                .from('user_cvs')
                .insert({ user_id: user.id, file_name: cv.id, storage_path: `${user.id}/${cv.id}` })
                .select()
                .single();
            assert(cvData, `CV creation in DB failed: ${cvError?.message}`);
            if (!cvData) return;

            try {
                const fileContent = await Deno.readFile(cv.path);

                // 1. Upload CV to Storage
                const { error: uploadError } = await supabaseAdmin.storage
                    .from('cvs')
                    .upload(cvData.storage_path, fileContent, { upsert: true, contentType: 'application/pdf' });
                assert(!uploadError, `File upload failed: ${uploadError?.message}`);

                // 2. Call Parse Function
                const parseResponse = await fetch(`${baseUrl}/parse-cv-v2`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userToken}` },
                    body: JSON.stringify({ cvId: cvData.id, cvPath: cvData.storage_path })
                });
                assertEquals(parseResponse.status, 200, `Parsing failed with status: ${await parseResponse.text()}`);

                const analyzeResponse = await fetch(`${baseUrl}/analyze-cv-v2`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userToken}` },
                    body: JSON.stringify({ cvId: cvData.id, job_description: cv.jobDescription })
                });
                assertEquals(analyzeResponse.status, 200, `Analysis failed with status: ${await analyzeResponse.text()}`);

            } finally {
                await supabaseAdmin.auth.admin.deleteUser(user.id);
            }
        });
    }
});
