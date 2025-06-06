import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

// --- Configuration & Environment Variables ---
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Supabase URL or Service Role Key is missing from environment variables.');
}

// Initialize Supabase Admin Client
const supabaseAdmin: SupabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey);

// --- AI Matching Logic ---
import { matchCVWithJob } from '../src/lib/ai_logic/matchCV';

// --- Placeholder for CV Parsing Logic ---
// TODO: Implement actual CV parsing (e.g., from PDF/DOCX on Supabase Storage)
async function parseCvFile(cvStoragePath: string): Promise<string> {
  console.log('Placeholder: Parsing CV from storage path:', cvStoragePath);
  // Simulate fetching and parsing
  // In a real scenario, you'd download the file from cvStoragePath using supabaseAdmin.storage
  // and then parse its content.
  await new Promise(resolve => setTimeout(resolve, 300));
  return `Extracted text from CV at ${cvStoragePath}. Content: Lorem ipsum dolor sit amet...`;
}

// --- Interfaces ---
interface RequestBody {
  cvStoragePath: string; // Path to the CV file in Supabase Storage (e.g., 'public/cv-offers/user_id/filename.pdf')
  jobId?: string; // Optional: ID of the job offer if it exists in a 'jobs' table
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  userId?: string; // Optional: If known, otherwise might be inferred from auth context if available
  // Add other relevant job details if needed
}

interface ApplicationData {
  id: string;
  user_id?: string;
  job_id?: string;
  cv_storage_path: string;
  job_title: string;
  company_name: string;
  job_description: string;
  match_score: number;
  match_summary: string;
  status: string;
  created_at: string;
  // Add other fields as per your 'applications' table structure
}

// --- Netlify Function Handler ---
const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed. Please use POST.' }),
    };
  }

  try {
    const body: RequestBody = JSON.parse(event.body || '{}');
    const {
      cvStoragePath,
      jobId,
      jobTitle,
      companyName,
      jobDescription,
      userId // Consider how to get userId, e.g. from JWT if Netlify Identity is used, or passed in body
    } = body;

    if (!cvStoragePath || !jobTitle || !companyName || !jobDescription) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Missing required fields: cvStoragePath, jobTitle, companyName, or jobDescription.' }),
      };
    }

    // 1. Parse CV Text from Storage
    //    This is a placeholder. You'll need to implement robust CV parsing.
    const cvText = await parseCvFile(cvStoragePath);

    // 2. Perform AI Matching
    const matchResult = await matchCVWithJob(cvText, jobDescription);

    // 3. Save Application to Database
    const applicationToInsert = {
      user_id: userId, // Ensure this is correctly sourced
      job_id: jobId,
      cv_storage_path: cvStoragePath,
      job_title: jobTitle,
      company_name: companyName,
      job_description: jobDescription, // Consider if you want to store the full job description
      match_score: matchResult.score,
      match_summary: matchResult.summary,
      status: 'pending_review', // Initial status
      // Add any other relevant fields for your 'applications' table
    };

    const { data: newApplication, error: insertError } = await supabaseAdmin
      .from('applications') // Ensure 'applications' is your table name
      .insert(applicationToInsert)
      .select()
      .single();

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      throw new Error(`Failed to save application: ${insertError.message}`);
    }

    return {
      statusCode: 201,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newApplication as ApplicationData),
    };

  } catch (error) {
    console.error('Error in createApplicationAndMatch function:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message || 'Internal Server Error' }),
    };
  }
};

export { handler };
