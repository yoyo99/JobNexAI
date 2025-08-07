import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from "../_shared/cors.ts";

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

async function generateEmbedding(text: string): Promise<number[]> {
  if (!text) {
    throw new Error("Input text for embedding cannot be empty.");
  }
  const response = await fetch('https://api.mistral.ai/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('MISTRAL_API_KEY')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'mistral-embed',
      input: text
    })
  });
  
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Mistral API error: ${response.status} ${errorBody}`);
  }

  const result = await response.json();
  return result.data[0].embedding;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { userId } = await req.json();
    if (!userId) {
      throw new Error('userId is required.');
    }

    // 1. Try to get the user's CV embedding
    const { data: userCvEmbedding, error: embeddingError } = await supabase
      .from('user_cv_embeddings')
      .select('embedding, cv_text')
      .eq('user_id', userId)
      .single();

    if (embeddingError && embeddingError.code !== 'PGRST116') { // PGRST116 = 'single row not found'
      throw embeddingError;
    }

    let embeddingToUse;
    if (userCvEmbedding?.embedding) {
      embeddingToUse = userCvEmbedding.embedding;
    } else {
      // 2. If no embedding, generate it
      // First, get the CV text. If it's not in user_cv_embeddings, fetch from the primary source.
      const cvText = userCvEmbedding?.cv_text;
      if (!cvText) {
        // TODO: Replace this with the actual logic to fetch the user's main CV text,
        // for example, from a 'user_cvs' table.
        // const { data: cvData } = await supabase.from('user_cvs').select('extracted_text').eq('user_id', userId).single();
        // cvText = cvData?.extracted_text;
        throw new Error(`CV text for user ${userId} not found to generate embedding.`);
      }

      console.log(`Generating new embedding for user ${userId}...`);
      const newEmbedding = await generateEmbedding(cvText);
      
      // 3. Save the new embedding for future use
      const { error: upsertError } = await supabase.from('user_cv_embeddings').upsert({
        user_id: userId,
        cv_text: cvText, // Store the text along with the embedding
        embedding: newEmbedding
      }, { onConflict: 'user_id' });

      if (upsertError) throw upsertError;
      embeddingToUse = newEmbedding;
    }

    // 4. Find matching jobs using the embedding
    // Note: This requires a PostgreSQL function named 'match_jobs' to be created.
    const { data: matches, error: rpcError } = await supabase.rpc('match_jobs', {
      query_embedding: embeddingToUse,
      match_threshold: 0.7, // Example threshold
      match_count: 20       // Example count
    });

    if (rpcError) throw rpcError;

    return new Response(JSON.stringify(matches), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (e) {
    const error = e instanceof Error ? e : new Error(String(e));
    console.error('Error in calculate-matching function:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
