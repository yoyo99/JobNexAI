import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

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

    // Récupérer les méthodes de paiement du client
    const paymentMethods = await stripe.paymentMethods.list({
      customer: subscription.stripe_customer_id,
      type: 'card',
    })

    // Récupérer la méthode de paiement par défaut du client
    const customer = await stripe.customers.retrieve(subscription.stripe_customer_id)
    const defaultPaymentMethodId = customer.invoice_settings?.default_payment_method

    // Formater les méthodes de paiement
    const formattedPaymentMethods = paymentMethods.data.map(method => ({
      id: method.id,
      brand: method.card?.brand,
      last4: method.card?.last4,
      exp_month: method.card?.exp_month,
      exp_year: method.card?.exp_year,
      is_default: method.id === defaultPaymentMethodId,
    }))

    return new Response(
      JSON.stringify(formattedPaymentMethods),
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