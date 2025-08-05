import { assert, assertEquals } from 'std/testing/asserts.ts';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const baseUrl = `${supabaseUrl}/functions/v1`;

const initializeAdminClient = (): SupabaseClient => {
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

Deno.test('Generate Cover Letter E2E Test', async (t) => {
  const supabaseAdmin = initializeAdminClient();
  const email = `test-user-${Date.now()}@example.com`;
  const password = 'password123';

  await t.step('Should generate a cover letter successfully', async () => {
    // 1. Create a temporary user
    const { data: { user }, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    assert(user, `User creation failed: ${userError?.message}`);

    // 2. Sign in to get a JWT
    const { data: signInData, error: signInError } = await supabaseAdmin.auth.signInWithPassword({ email, password });
    assert(signInData?.session, `Sign-in failed: ${signInError?.message}`);
    const userToken = signInData.session.access_token;

    // 3. Prepare test data
    const requestBody = {
      cvText: 'Experienced software developer with 5 years in JavaScript and React.',
      jobTitle: 'Frontend Developer',
      companyName: 'TechCorp',
      jobDescription: 'Seeking a skilled frontend developer to build modern web applications.',
      customInstructions: 'Highlight the experience with React Hooks.',
      targetLanguage: 'en',
    };

    // 4. Call the edge function
    const response = await fetch(`${baseUrl}/generate-cover-letter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
      },
      body: JSON.stringify(requestBody),
    });

    const responseBody = await response.json();
    assertEquals(response.status, 200, `Request failed: ${responseBody.error || 'Unknown error'}`);
    assert(responseBody.coverLetterContent, 'Cover letter content is missing from the response.');
    console.log(`\n--- Generated Cover Letter ---\n${responseBody.coverLetterContent}\n----------------------------\n`);

    // 5. Clean up the user
    await supabaseAdmin.auth.admin.deleteUser(user.id);
  });
});
