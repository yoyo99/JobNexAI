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
    console.log('📋 Request body:', JSON.stringify(body, null, 2));
    
    const { priceId } = body;
    console.log('💰 Price ID received:', priceId);
    
    // Test simple pour l'essai gratuit
    if (priceId === 'price_1RoRHKQIOmiow871W7anKnRZ') {
      console.log('🎉 FREE TRIAL DETECTED!');
      
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