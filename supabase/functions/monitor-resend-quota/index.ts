// Supabase Edge Function pour monitorer le quota Resend
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { type Request } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS Headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Ou votre domaine Netlify spécifique
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => { // Utilisation de req au lieu de _req car on vérifie la méthode
  // Gestion de la requête preflight OPTIONS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      // Ne pas retourner les détails de l'erreur interne au client
      return new Response(JSON.stringify({ error: 'Internal server error: Missing API key' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch("https://api.resend.com/v1/usage", {
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Resend API error (${response.status}): ${errorText}`);
      // Ne pas retourner les détails de l'erreur Resend au client
      return new Response(JSON.stringify({ error: 'Failed to fetch quota from provider' }), {
        status: response.status, // Renvoyer le statut d'erreur de Resend
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const stats = await response.json();
    // { sent, limit, period }
    return new Response(JSON.stringify(stats), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Function error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
