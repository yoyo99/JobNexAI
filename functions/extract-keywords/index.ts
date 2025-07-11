// Import necessary modules
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

// Initialize OpenAI client with API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Common CORS headers (adapted for Netlify handlers)
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Throttling
const MAX_CALLS_PER_MINUTE = 100;
let callCount = 0;
setInterval(() => {
  callCount = 0;
}, 60_000);

// Types **********************************************************************
interface KeywordsResponse {
  keywords: string[];
}

interface ErrorResponse {
  error: string;
  code?: number;
}

// Helpers ********************************************************************
function handleCallCount() {
  callCount += 1;
  if (callCount >= MAX_CALLS_PER_MINUTE) {
    throw new Error('Too many requests');
  }
}

function validateInput(data: any): { success: boolean; error?: string } {
  if (!data?.text || typeof data.text !== 'string') {
    return { success: false, error: 'Invalid or missing text' };
  }
  return { success: true };
}

async function verifyToken(authHeader?: string): Promise<{ userId: string | null; error: string | null }> {
  if (!authHeader) {
    return { userId: null, error: 'Missing Authorization header' };
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return { userId: null, error: 'Missing token' };
  }

  const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

  const { data: user, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user?.user) {
    return { userId: null, error: authError?.message || 'Invalid token' };
  }

  return { userId: user.user.id, error: null };
}

async function extractKeywordsFromOpenAI(text: string): Promise<KeywordsResponse> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content:
          'You are a language expert tasked with extracting the most relevant keywords from a given text. Return a JSON array (max 10) of keywords.',
      },
      { role: 'user', content: text },
    ],
  });

  const content = completion.choices[0]?.message?.content ?? '[]';
  let keywords: string[];
  try {
    keywords = JSON.parse(content);
  } catch {
    keywords = content
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);
  }
  return { keywords };
}

async function extractKeywords(text: string): Promise<KeywordsResponse> {
  handleCallCount();
  return extractKeywordsFromOpenAI(text);
}

// Netlify handler *************************************************************
export async function handler(event: any) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: 'ok',
    };
  }

  // Verify JWT (via Supabase) *************************************************
  const { userId, error: tokenError } = await verifyToken(
    event.headers.authorization || event.headers.Authorization
  );
  if (tokenError || !userId) {
    const response: ErrorResponse = { error: tokenError || 'Unauthorized', code: 401 };
    return {
      statusCode: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify(response),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { success, error: validationError } = validateInput(body);
    if (!success) {
      const response: ErrorResponse = { error: validationError || 'Bad Request', code: 400 };
      return {
        statusCode: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(response),
      };
    }

    const { text } = body;
    const keywordsResponse = await extractKeywords(text);

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify(keywordsResponse),
    };
  } catch (error) {
    console.error('Error:', error);
    const response: ErrorResponse = {
      error: (error as Error).message || 'Internal Server Error',
      code: 500,
    };
    return {
      statusCode: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify(response),
    };
  }
}
