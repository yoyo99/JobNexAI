import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from "../_shared/cors.ts";

// Placeholder functions for modular logic. These will be implemented later.
async function processScraping(payload: any) {
  console.log('Processing scraping job:', payload);
  // In a real scenario, this would call the scraping logic
  return { success: true, message: 'Scraping not implemented yet.' };
}

async function processMatching(payload: any) {
  console.log('Processing matching job:', payload);
  // In a real scenario, this would call the matching logic
  return { success: true, message: 'Matching not implemented yet.' };
}

async function processApplication(payload: any) {
  console.log('Processing application job:', payload);
  // In a real scenario, this would call the application logic
  return { success: true, message: 'Application not implemented yet.' };
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Retrieve pending jobs
    const { data: pendingJobs, error: fetchError } = await supabase
      .from('job_queue')
      .select('*')
      .eq('status', 'pending')
      .lte('scheduled_for', new Date().toISOString())
      .limit(10);

    if (fetchError) throw fetchError;

    for (const job of pendingJobs || []) {
      await processJob(job);
    }

    return new Response(JSON.stringify({ processed: pendingJobs?.length || 0 }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (e) {
    const error = e instanceof Error ? e : new Error(String(e));
    console.error('Error processing job queue:', error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
});

async function processJob(job: any) {
  console.log(`Processing job ${job.id} of type ${job.type}`);
  // Mark as processing
  await supabase
    .from('job_queue')
    .update({ status: 'processing', updated_at: new Date() })
    .eq('id', job.id);

  try {
    let result;
    
    switch (job.type) {
      case 'scraping':
        result = await processScraping(job.payload);
        break;
      case 'matching':
        result = await processMatching(job.payload);
        break;
      case 'application':
        result = await processApplication(job.payload);
        break;
      default:
        throw new Error(`Unknown job type: ${job.type}`);
    }

    // Save the result
    await supabase.from('job_results').insert({
      job_id: job.id,
      result
    });

    await supabase
      .from('job_queue')
      .update({ status: 'completed', updated_at: new Date() })
      .eq('id', job.id);
    
    console.log(`Job ${job.id} completed successfully.`);

  } catch (e) {
    const error = e instanceof Error ? e : new Error(String(e));
    console.error(`Error processing job ${job.id}:`, error);
    await supabase
      .from('job_queue')
      .update({ 
        status: 'failed', 
        attempts: job.attempts + 1,
        last_error: error.message,
        updated_at: new Date()
      })
      .eq('id', job.id);
  }
}
