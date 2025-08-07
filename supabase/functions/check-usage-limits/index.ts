import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from "../_shared/cors.ts";

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

const TIER_LIMITS = {
  trial: { applications: 5, scraping_jobs: 2, cover_letters: 5 },
  starter: { applications: 50, scraping_jobs: 10, cover_letters: 50 },
  professional: { applications: 200, scraping_jobs: 50, cover_letters: -1 }, // -1 means unlimited
  enterprise: { applications: -1, scraping_jobs: -1, cover_letters: -1 }
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { userId, action } = await req.json();
    if (!userId || !action) {
      throw new Error('userId and action are required.');
    }

    // Get user's subscription tier and current usage
    const { data: user, error: userError } = await supabase
      .from('user_subscriptions')
      .select('tier, usage')
      .eq('user_id', userId)
      .single();

    if (userError) throw userError;
    if (!user) throw new Error('User subscription not found.');

    const limits = TIER_LIMITS[user.tier];
    if (!limits) throw new Error(`Invalid tier: ${user.tier}`);

    const actionKey = action as keyof typeof limits;

    const currentUsage = user.usage?.[actionKey] || 0;
    const limit = limits[actionKey];

    if (limit === undefined) throw new Error(`Invalid action: ${action}`);

    const canProceed = limit === -1 || currentUsage < limit;

    // If the request is a POST, it implies an intent to consume the action
    if (canProceed && req.method === 'POST') {
      // Increment usage count
      const newUsage = { ...user.usage, [actionKey]: currentUsage + 1 };
      const { error: updateError } = await supabase
        .from('user_subscriptions')
        .update({ usage: newUsage, updated_at: new Date() })
        .eq('user_id', userId);

      if (updateError) throw updateError;
    }

    return new Response(JSON.stringify({ 
      canProceed, 
      currentUsage, 
      limit, 
      remaining: limit === -1 ? 'unlimited' : limit - currentUsage 
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (e) {
    const error = e instanceof Error ? e : new Error(String(e));
    console.error('Error in check-usage-limits function:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
