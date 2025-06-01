import Stripe from 'npm:stripe@^14.0.0';
import { createClient } from 'npm:@supabase/supabase-js@^2.39.3';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  // Permet une chaîne de version API personnalisée du dashboard Stripe
  // deno-lint-ignore-next-line no-explicit-any
  apiVersion: '2025-04-30.basil' as any,
  // typescript: true, // Optionnel: pour une meilleure inférence de type si supporté
});
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
    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      throw new Error('No signature provided')
    }

    const body = await req.text()
    
    // Si le webhook secret n'est pas configuré, on traite quand même l'événement
    // mais sans vérifier la signature
    let event;
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    
    if (webhookSecret) {
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature,
        webhookSecret
      )
    } else {
      // Traiter l'événement sans vérifier la signature
      // Ceci est moins sécurisé mais permet de fonctionner sans webhook secret
      event = JSON.parse(body);
      console.warn('Processing webhook without signature verification - not recommended for production');
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        console.log('Received checkout.session.completed:', JSON.stringify(session, null, 2));
        const customerId = session.customer
        const subscriptionId = session.subscription
        const userId = session.metadata?.supabase_user_id

        if (!userId) {
          throw new Error('No user ID provided in session metadata');
        }

        const userType = session.metadata?.user_type

        // Récupérer les détails de l'abonnement
        const subscriptionDetails = await stripe.subscriptions.retrieve(subscriptionId as string)
        console.log('Subscription Details Price Object:', JSON.stringify(subscriptionDetails.items.data[0].price, null, 2)); // Gardons ce log utile
        const plan = subscriptionDetails.items.data[0].price.lookup_key

        // Mettre à jour l'abonnement dans Supabase
        const { error: subscriptionError } = await supabase
          .from('subscriptions')
          .upsert({
            user_id: userId,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            status: subscriptionDetails.status,
            plan,
            current_period_end: typeof subscriptionDetails.current_period_end === 'number' 
              ? new Date(subscriptionDetails.current_period_end * 1000).toISOString() 
              : null, // Set to null if invalid
            cancel_at: subscriptionDetails.cancel_at
              ? new Date(subscriptionDetails.cancel_at * 1000).toISOString()
              : null,
          })

        if (subscriptionError) {
          console.error("Error updating subscription in Supabase:", subscriptionError)
          return new Response(`Supabase error: ${subscriptionError.message}`, { status: 400 })
        }

        console.log(`Subscription updated/inserted for user ${userId} to plan ${plan}`);

        console.log(`Attempting to re-read subscription for user ${userId} with service role key...`);
        const { data: reReadData, error: reReadError } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', userId) // Lire en utilisant le user_id
          .eq('stripe_subscription_id', subscriptionId); // Et aussi le stripe_subscription_id pour être précis

        if (reReadError) {
          console.error('Error re-reading subscription immediately after upsert:', reReadError);
        } else {
          console.log('Re-read subscription data immediately after upsert:', JSON.stringify(reReadData, null, 2));
          if (!reReadData || reReadData.length === 0) {
            console.warn('WARN: Re-read attempt returned no data for the subscription just upserted.');
          }
        }

        // Envoyer un email de confirmation après la mise à jour réussie de la BDD
        const userEmail = session.customer_details?.email;
        if (userEmail && plan && plan !== 'free') { 
          try {
            console.log(`Attempting to send confirmation email to ${userEmail} for plan ${plan}`);
            const emailHtml = `<h1>Merci pour votre abonnement !</h1><p>Votre plan '${plan}' est maintenant actif.</p><p>Connectez-vous à votre compte pour profiter de toutes les fonctionnalités.</p>`;
            const emailText = `Merci pour votre abonnement ! Votre plan '${plan}' est maintenant actif. Connectez-vous à votre compte pour profiter de toutes les fonctionnalités.`;
            const { data: emailSendData, error: emailError } = await supabase.functions.invoke("send-notification-email", {
              body: {
                to: userEmail,
                subject: "Confirmation de votre abonnement JobNexAI",
                html: emailHtml,
                text: emailText,
              },
              headers: { 
                'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
              }
            });

            if (emailError) {
              console.error(`Error invoking send-notification-email function: ${emailError.message}`);
              if(emailSendData) {
                console.error('Response data from failed email invocation:', emailSendData);
              }
            } else {
              console.log(`Successfully invoked send-notification-email for ${userEmail}. Response:`, emailSendData);
            }
          } catch (e: unknown) {
            if (e instanceof Error) {
              console.error(`Exception when trying to invoke send-notification-email: ${e.message}`);
            } else {
              console.error('An unknown error occurred during send-notification-email invocation:', e);
            }
          }
        } else if (!userEmail) {
          console.warn("Could not send confirmation email: User email not found in checkout session details.");
        } else if (plan === 'free'){
          console.log("Skipping email confirmation for free plan.");
        }

        // Mettre à jour le type d'utilisateur si nécessaire
        if (userType) {
          const { error: userTypeError } = await supabase
            .from('profiles')
            .update({ user_type: userType })
            .eq('id', userId)
            
          if (userTypeError) throw userTypeError
        }
        
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object
        const { error } = await supabase
          .from('subscriptions')
          .update({
            status: subscription.status,
            current_period_end: typeof subscription.current_period_end === 'number' 
              ? new Date(subscription.current_period_end * 1000).toISOString() 
              : null, // Set to null if invalid
            cancel_at: subscription.cancel_at
              ? new Date(subscription.cancel_at * 1000).toISOString()
              : null,
          })
          .eq('stripe_subscription_id', subscription.id)

        if (error) throw error
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        const { error } = await supabase
          .from('subscriptions')
          .update({
            status: 'canceled',
            cancel_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id)

        if (error) throw error
        break
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error('Webhook Error:', e.message);
      return new Response(`Webhook error: ${e.message}`, { status: 400 });
    }
    console.error('Webhook Error: An unknown error occurred', e);
    return new Response('Webhook error: An unknown error occurred', { status: 400 });
  }
})