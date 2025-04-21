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

    // Récupérer l'ID client Stripe de l'utilisateur
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single()

    if (subscriptionError) {
      throw new Error('Impossible de récupérer les informations d\'abonnement')
    }

    if (!subscription?.stripe_customer_id) {
      // Créer un client Stripe si nécessaire
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', userId)
        .single()

      if (profileError) {
        throw new Error('Impossible de récupérer les informations de profil')
      }

      const customer = await stripe.customers.create({
        email: profile.email,
        metadata: {
          supabase_user_id: userId,
        },
      })

      // Mettre à jour l'abonnement avec l'ID client
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({ stripe_customer_id: customer.id })
        .eq('user_id', userId)

      if (updateError) {
        throw new Error('Impossible de mettre à jour les informations d\'abonnement')
      }

      // Attacher la méthode de paiement au client
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customer.id,
      })

      // Définir comme méthode de paiement par défaut
      await stripe.customers.update(customer.id, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      })
    } else {
      // Attacher la méthode de paiement au client existant
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: subscription.stripe_customer_id,
      })

      // Définir comme méthode de paiement par défaut
      await stripe.customers.update(subscription.stripe_customer_id, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      })
    }

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