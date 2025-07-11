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

import pdf from 'pdf-parse';
import mammoth from 'mammoth'; // Ajout de l'import pour mammoth

// --- CV Parsing Logic ---
async function parseCvFile(cvStoragePath: string): Promise<string> {
  console.log('Attempting to parse CV from storage path:', cvStoragePath);
  const BUCKET_NAME = 'cv-uploads';

  const fileExtension = cvStoragePath.split('.').pop()?.toLowerCase();

  if (!fileExtension) {
    console.error(`Could not determine file extension for path: ${cvStoragePath}`);
    throw new Error(`Could not determine file extension for path: ${cvStoragePath}`);
  }

  try {
    // 1. Download the file from Supabase Storage
    const { data: fileData, error: downloadError } = await supabaseAdmin
      .storage
      .from(BUCKET_NAME)
      .download(cvStoragePath);

    if (downloadError) {
      console.error(`Error downloading file from Supabase Storage (${BUCKET_NAME}/${cvStoragePath}):`, downloadError);
      throw new Error(`Failed to download file: ${downloadError.message}`);
    }

    if (!fileData) {
      throw new Error(`Downloaded file data is null or undefined for path: ${cvStoragePath}.`);
    }

    const arrayBuffer = await fileData.arrayBuffer();

    // 2. Parse based on file extension
    if (fileExtension === 'pdf') {
      const pdfBuffer = Buffer.from(arrayBuffer); // pdf-parse expects a Buffer
      const parsedPdf = await pdf(pdfBuffer);
      if (parsedPdf && parsedPdf.text) {
        console.log(`Successfully parsed PDF. Extracted ${parsedPdf.text.length} characters from ${cvStoragePath}.`);
        return parsedPdf.text;
      } else {
        console.warn(`Failed to parse text from PDF at ${cvStoragePath}. It might be corrupted or empty.`);
        throw new Error(`Failed to parse text from PDF at ${cvStoragePath}.`);
      }
    } else if (fileExtension === 'docx') {
      const result = await mammoth.extractRawText({ arrayBuffer });
      if (result && typeof result.value === 'string') {
        console.log(`Successfully parsed DOCX. Extracted ${result.value.length} characters from ${cvStoragePath}.`);
        return result.value;
      } else {
        if (result && result.messages && result.messages.length > 0) {
            console.warn(`Mammoth parsing messages for ${cvStoragePath}:`, result.messages);
        }
        console.warn(`Failed to parse text from DOCX at ${cvStoragePath}. It might be corrupted or empty.`);
        throw new Error(`Failed to parse text from DOCX at ${cvStoragePath}.`);
      }
    } else {
      console.warn(`Unsupported file extension: .${fileExtension} for path: ${cvStoragePath}.`);
      throw new Error(`Unsupported file extension: .${fileExtension}. Only .pdf and .docx are currently supported.`);
    }

  } catch (error) {
    console.error(`Error during CV parsing process for ${cvStoragePath}:`, error);
    if (error instanceof Error) {
        throw new Error(`CV Parsing Error for ${cvStoragePath}: ${error.message}`);
    }
    throw new Error(`CV Parsing Error for ${cvStoragePath}: An unknown error occurred.`);
  }
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
