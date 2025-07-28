const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-edge-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    let receivedData = {};
    try {
      receivedData = await req.json();
    } catch (parseError) {
      // If JSON parsing fails, continue with empty object
      console.log('Failed to parse JSON:', parseError.message);
    }

    console.log('Received data:', receivedData);

    return new Response(JSON.stringify({ 
      message: 'Test function works!',
      receivedData
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in test function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
