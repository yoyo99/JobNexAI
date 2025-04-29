import { createClient } from '@supabase/supabase-js';


const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export async function handler(event, context) {
  const { default: Stripe } = await import('stripe');
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  
  const req = {
    method: event.httpMethod,
    json: async () => JSON.parse(event.body || '{}'),
  };

  if (req.method === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: 'ok',
    };
  }

  try {
    const { userId } = await req.json();

    // Récupérer l'ID client Stripe de l'utilisateur
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single();

    if (subscriptionError) {
      // Si l'utilisateur n'a pas d'abonnement, retourner une liste vide
      if (subscriptionError.code === 'PGRST116') {
        return {
          statusCode: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify([]),
        };
      }
      throw subscriptionError;
    }

    if (!subscription?.stripe_customer_id) {
      // Si l'utilisateur n'a pas de client Stripe, retourner une liste vide
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify([]),
      };
    }

    // Récupérer les méthodes de paiement du client
    const paymentMethods = await stripe.paymentMethods.list({
      customer: subscription.stripe_customer_id,
      type: 'card',
    });

    // Récupérer la méthode de paiement par défaut du client
    const customerObj = await stripe.customers.retrieve(subscription.stripe_customer_id);
    let defaultPaymentMethodId: string | undefined = undefined;
    // Type guard: only access invoice_settings if not deleted
    if ('invoice_settings' in customerObj && customerObj.invoice_settings) {
      const pm = customerObj.invoice_settings.default_payment_method;
      if (typeof pm === 'string') {
        defaultPaymentMethodId = pm;
      }
    }

    // Formater les méthodes de paiement
    const formattedPaymentMethods = paymentMethods.data.map((method) => ({
      id: method.id,
      brand: method.card?.brand,
      last4: method.card?.last4,
      exp_month: method.card?.exp_month,
      exp_year: method.card?.exp_year,
      is_default: method.id === defaultPaymentMethodId,
    }));

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify(formattedPaymentMethods),
    };
  } catch (error: any) {
    console.error('Error:', error);
    return {
      statusCode: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message }),
    };
  }
}