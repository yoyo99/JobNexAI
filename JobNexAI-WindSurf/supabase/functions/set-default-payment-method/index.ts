import Stripe from 'npm:stripe@14.0.0'
import { createClient } from 'npm:@supabase/supabase-js@2.39.3'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!)
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userId, paymentMethodId } = await req.json()

    // Vérifier que l'utilisateur est autorisé à modifier cette méthode de paiement
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single()

    if (subscriptionError) {
      throw new Error('Impossible de récupérer les informations d\'abonnement')
    }

    if (!subscription?.stripe_customer_id) {
      throw new Error('Aucun client Stripe associé à cet utilisateur')
    }

    // Vérifier que la méthode de paiement appartient bien à ce client
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId)
    
    if (paymentMethod.customer !== subscription.stripe_customer_id) {
      throw new Error('Cette méthode de paiement n\'appartient pas à cet utilisateur')
    }

    // Définir comme méthode de paiement par défaut
    await stripe.customers.update(subscription.stripe_customer_id, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    })

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})