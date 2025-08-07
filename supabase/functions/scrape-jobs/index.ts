import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from "../_shared/cors.ts";

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

interface ScrapingTarget {
  platform: 'linkedin' | 'indeed' | 'welcometothejungle';
  keywords: string[];
  location: string;
  filters?: any;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { target }: { target: ScrapingTarget } = await req.json();
    if (!target || !target.platform || !target.keywords || !target.location) {
      return new Response(JSON.stringify({ error: 'Invalid scraping target provided.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    
    // Add the scraping request to the job queue
    const { data, error } = await supabase
      .from('job_queue')
      .insert({
        type: 'scraping',
        payload: target,
        scheduled_for: new Date()
      })
      .select()
      .single();

    if (error) throw error;

    console.log(`Enqueued scraping job ${data.id} for platform ${target.platform}`);

    return new Response(JSON.stringify({ jobId: data.id }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (e) {
    const error = e instanceof Error ? e : new Error(String(e));
    console.error('Error enqueuing scraping job:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
