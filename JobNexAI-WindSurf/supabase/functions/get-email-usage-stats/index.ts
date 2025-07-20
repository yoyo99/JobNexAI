import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'npm:@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') 
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')

    if (!supabaseUrl || !serviceRoleKey || !anonKey) {
      console.error('Variables d\'environnement Supabase manquantes. SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY doivent être définies.')
      return new Response(JSON.stringify({ error: 'Erreur de configuration du serveur: Variables d\'environnement manquantes.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
        return new Response(JSON.stringify({ error: 'En-tête Authorization manquant' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 401,
        })
    }
    
    const supabaseClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    })

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      console.error('Erreur d\'authentification utilisateur:', userError?.message || 'Aucun objet utilisateur')
      return new Response(JSON.stringify({ error: 'Échec de l\'authentification: ' + (userError?.message || 'Utilisateur non trouvé') }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    const userId = user.id
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

    const { count: totalEmailsSent, error: totalError } = await supabaseAdmin
      .from('sent_emails')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
    if (totalError) {
        console.error("Erreur total emails:", totalError.message);
        throw new Error(`Erreur de requête base de données (total): ${totalError.message}`);
    }

    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);
    const { count: emailsSentToday, error: todayError } = await supabaseAdmin
      .from('sent_emails')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', todayStart.toISOString())
    if (todayError) {
        console.error("Erreur emails aujourd'hui:", todayError.message);
        throw new Error(`Erreur de requête base de données (aujourd'hui): ${todayError.message}`);
    }

    const now = new Date();
    const dayOfWeek = now.getUTCDay(); 
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; 
    const weekStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + diffToMonday));
    weekStart.setUTCHours(0,0,0,0);

    const { count: emailsSentThisWeek, error: weekError } = await supabaseAdmin
      .from('sent_emails')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', weekStart.toISOString())
    if (weekError) {
        console.error("Erreur emails cette semaine:", weekError.message);
        throw new Error(`Erreur de requête base de données (semaine): ${weekError.message}`);
    }

    const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    monthStart.setUTCHours(0,0,0,0);
    const { count: emailsSentThisMonth, error: monthError } = await supabaseAdmin
      .from('sent_emails')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', monthStart.toISOString())
    if (monthError) {
        console.error("Erreur emails ce mois:", monthError.message);
        throw new Error(`Erreur de requête base de données (mois): ${monthError.message}`);
    }
    
    return new Response(
      JSON.stringify({
        totalEmailsSent: totalEmailsSent ?? 0,
        emailsSentToday: emailsSentToday ?? 0,
        emailsSentThisWeek: emailsSentThisWeek ?? 0,
        emailsSentThisMonth: emailsSentThisMonth ?? 0,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (e) {
    let errorMessage = 'Une erreur inconnue est survenue.';
    if (e instanceof Error) {
      errorMessage = e.message;
    }
    console.error('Erreur critique dans get-email-usage-stats:', errorMessage, e);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
