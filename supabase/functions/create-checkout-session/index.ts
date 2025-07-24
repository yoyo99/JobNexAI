
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Initialisation Supabase Admin
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

console.log('🚀 FUNCTION START - create-checkout-session loading...');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

console.log('✅ CORS headers defined');

Deno.serve(async (req: Request) => {
  console.log('📥 REQUEST RECEIVED:', req.method, req.url);
  
  if (req.method === 'OPTIONS') {
    console.log('✅ OPTIONS request handled');
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('🔍 Parsing request body...');
    const body = await req.json();
// Extraire priceId et userId
const { priceId, userId } = body as { priceId: string; userId: string }; 
    console.log('📋 Request body:', JSON.stringify(body, null, 2));
    
    
    console.log('💰 Price ID received:', priceId);
    
    // Test simple pour l'essai gratuit
    if (priceId === 'price_1RoRHKQIOmiow871W7anKnRZ') {
      console.log('🎉 FREE TRIAL DETECTED!');
// Mettre à jour le profil pour activer l'essai gratuit 48h
const trialEndsAt = new Date(Date.now() + 48 * 3600 * 1000).toISOString();
const { data: updateData, error: updateError } = await supabase
  .from('profiles')
  .update({ subscription_status: 'trialing', trial_ends_at: trialEndsAt })
  .eq('id', userId);
console.log('📊 Supabase profile update result - Data:', updateData);
console.log('📊 Supabase profile update result - Error:', updateError);
if (updateError) {
  console.error('Error updating trial in profiles:', updateError);
  return new Response(JSON.stringify({ error: 'DB update failed: ' + updateError.message }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 });
}

      
      const redirectUrl = new URL('/app/dashboard?trial=success', req.headers.get('origin')!).toString();
      console.log('🔗 Redirect URL:', redirectUrl);
      
      return new Response(JSON.stringify({ checkoutUrl: redirectUrl }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }
    
    console.log('💳 Not free trial, would create Stripe session');
    return new Response(JSON.stringify({ error: 'Paid plans temporarily disabled for testing' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
    
  } catch (error: any) {
    console.error('❌ CRITICAL ERROR:', error.message);
    console.error('📚 Error stack:', error.stack);
    return new Response(JSON.stringify({ 
      error: 'Function error: ' + error.message,
      stack: error.stack 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

console.log('🏁 FUNCTION SETUP COMPLETE - Waiting for requests...');