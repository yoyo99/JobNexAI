console.log('[create-checkout-session] SCRIPT START: Initializing simplified function...');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  console.log(`[create-checkout-session] REQUEST HANDLER: Received request: ${req.method} ${req.url}`);

  if (req.method === 'OPTIONS') {
    console.log('[create-checkout-session] REQUEST HANDLER: Handling OPTIONS request.');
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('[create-checkout-session] REQUEST HANDLER: Processing main request logic.');
    // Essayons de lire le corps de la requête au cas où, mais sans que cela soit bloquant
    let requestBody = null;
    try {
      if (req.body) {
        requestBody = await req.json();
        console.log('[create-checkout-session] REQUEST HANDLER: Parsed request body:', requestBody);
      }
    } catch (e) {
      console.warn('[create-checkout-session] REQUEST HANDLER: Could not parse request body as JSON:', e.message);
    }

    const responsePayload = {
      message: 'Simplified create-checkout-session reached successfully!',
      timestamp: new Date().toISOString(),
      invokedMethod: req.method,
      invokedUrl: req.url,
      bodyReceived: requestBody
    };

    console.log('[create-checkout-session] REQUEST HANDLER: Sending success response.');
    return new Response(
      JSON.stringify(responsePayload),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // Répondre avec un succès pour ce test
      }
    );
  } catch (error) {
    console.error('[create-checkout-session] REQUEST HANDLER CRITICAL ERROR:', error.message, error.stack);
    return new Response(
      JSON.stringify({ error: 'Critical error in simplified function: ' + error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500, // Erreur serveur interne
      }
    );
  }
});

console.log('[create-checkout-session] SCRIPT END: Deno.serve configured.');