import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

exports.handler = async function(event, context) {
  const { default: Stripe } = await import('stripe');
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const req = {
    method: event.httpMethod,
    json: async () => JSON.parse(event.body || '{}'),
    headers: event.headers || {},
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userId } = await req.json()

    // Récupérer l'ID client Stripe de l'utilisateur
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single()

    if (subscriptionError) {
      // Si l'utilisateur n'a pas d'abonnement, retourner une liste vide
      if (subscriptionError.code === 'PGRST116') {
        return new Response(
          JSON.stringify([]),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )
      }
      throw subscriptionError
    }

    if (!subscription?.stripe_customer_id) {
      // Si l'utilisateur n'a pas de client Stripe, retourner une liste vide
      return new Response(
        JSON.stringify([]),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // Récupérer les factures du client
    const invoices = await stripe.invoices.list({
      customer: subscription.stripe_customer_id,
      limit: 100,
    })

    // Formater les factures
    const formattedInvoices = invoices.data.map(invoice => ({
      id: invoice.id,
      number: invoice.number,
      amount_paid: invoice.amount_paid,
      currency: invoice.currency,
      status: invoice.status,
      created: invoice.created,
      hosted_invoice_url: invoice.hosted_invoice_url,
      pdf: invoice.invoice_pdf,
    }))

    return new Response(
      JSON.stringify(formattedInvoices),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return {
      statusCode: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message })
    };
  }
}