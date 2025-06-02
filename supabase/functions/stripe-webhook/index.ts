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
  // **** NEW DEBUG LOG ****
  const headersObject: { [key: string]: string } = {};
  req.headers.forEach((value, key) => {
    headersObject[key] = value;
  });
  console.log(`[STRIPE WEBHOOK DEBUG] Function invoked. Method: ${req.method}. Headers: ${JSON.stringify(headersObject)}`);
  if (req.method === 'OPTIONS') {
    // **** NEW DEBUG LOG ****
    console.log('[STRIPE WEBHOOK DEBUG] OPTIONS request received, sending ok.');
    return new Response('ok', { headers: corsHeaders })
  }

  // **** NEW: Read body once ****
  let rawBodyForLoggingAndProcessing: string;
  try {
    rawBodyForLoggingAndProcessing = await req.text();
    console.log(`[STRIPE WEBHOOK DEBUG] Raw request body (first 500 chars): ${rawBodyForLoggingAndProcessing ? rawBodyForLoggingAndProcessing.substring(0, 500) : 'null or empty'}`);
  } catch (bodyError: any) {
    console.error(`[STRIPE WEBHOOK DEBUG] CRITICAL: Failed to read request body: ${bodyError.message}`);
    return new Response('Failed to read request body', { status: 500, headers: corsHeaders });
  }
  // **** END NEW: Read body once ****

  try {
    // **** NEW DEBUG LOG ****
    console.log('[STRIPE WEBHOOK DEBUG] Entering main try block.');
    const signature = req.headers.get('stripe-signature')
    // **** NEW DEBUG LOG ****
    console.log(`[STRIPE WEBHOOK DEBUG] Stripe Signature Header: ${signature}`);
    if (!signature) {
      // **** NEW DEBUG LOG ****
      console.error('[STRIPE WEBHOOK DEBUG] No signature provided. Throwing error.');
      throw new Error('No signature provided')
    }

    // const body = await req.text(); // Already read into rawBodyForLoggingAndProcessing
    const body = rawBodyForLoggingAndProcessing!; // Use the already read body, assert not null as we'd return 500 if it was
    
    // Si le webhook secret n'est pas configuré, on traite quand même l'événement
    // mais sans vérifier la signature
    let event;
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    // **** NEW DEBUG LOG ****
    console.log(`[STRIPE WEBHOOK DEBUG] Retrieved STRIPE_WEBHOOK_SECRET: ${webhookSecret ? 'Exists and has a value' : 'MISSING or Empty'}`);
    
    if (webhookSecret) {
      // **** NEW DEBUG LOG ****
      console.log('[STRIPE WEBHOOK DEBUG] Attempting stripe.webhooks.constructEventAsync...');
      try {
        event = await stripe.webhooks.constructEventAsync(
        body,
        signature,
        webhookSecret
        );
        console.log('[STRIPE WEBHOOK DEBUG] constructEventAsync SUCCESSFUL.');
      } catch (sigError: any) {
        console.error(`[STRIPE WEBHOOK DEBUG] constructEventAsync FAILED: ${sigError.message}`);
        throw sigError; // Re-throw to be caught by outer catch
      }
    } else {
      // Traiter l'événement sans vérifier la signature
      // Ceci est moins sécurisé mais permet de fonctionner sans webhook secret
      event = JSON.parse(body);
      // **** NEW DEBUG LOG ****
      console.warn('[STRIPE WEBHOOK DEBUG] Webhook secret is MISSING. Processing without signature verification.');
      event = JSON.parse(body);
    }

    // **** NEW DEBUG LOG ****
    console.log(`[STRIPE WEBHOOK DEBUG] Event type: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed': {
        // **** NEW DEBUG LOG ****
        console.log('[STRIPE WEBHOOK DEBUG] Processing checkout.session.completed.');
        const session = event.data.object
        console.log('Received checkout.session.completed:', JSON.stringify(session, null, 2));
        const customerId = session.customer
        const subscriptionId = session.subscription
        const userId = session.metadata?.supabase_user_id

        if (!userId) {
          throw new Error('No user ID provided in session metadata');
        }

        const userType = session.metadata?.user_type

        // Récupérer les détails de l'abonnement pour obtenir le plan (lookup_key)
        // **** NEW DEBUG LOG ****
        console.log(`[STRIPE WEBHOOK DEBUG] Retrieving subscription: ${subscriptionId} for user ${userId}`);
        const subscriptionDetails = await stripe.subscriptions.retrieve(subscriptionId as string, {
          expand: ['items.data.price.product'],
        });

        // @ts-ignore: Stripe SDK type expansion for product.metadata can be incomplete when expanding price.product
        const planLookupKey = subscriptionDetails.items.data[0]?.price?.product?.metadata?.supabase_product_id || 
                             // @ts-ignore: Stripe SDK type expansion for price.lookup_key can be incomplete
                             subscriptionDetails.items.data[0]?.price?.lookup_key || 
                             'default_plan_if_not_found'; // Fallback

        console.log(`Subscription Details Price Object: ${JSON.stringify(subscriptionDetails.items.data[0].price, null, 2)}`);
        console.log(`Determined planLookupKey: ${planLookupKey} for user ${userId}`);

        const subscriptionData = {
          user_id: userId,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          status: subscriptionDetails.status, // ex: 'active', 'trialing'
          plan: planLookupKey,
          current_period_end: subscriptionDetails.current_period_end
            ? new Date(subscriptionDetails.current_period_end * 1000).toISOString()
            : null,
          cancel_at: subscriptionDetails.cancel_at
            ? new Date(subscriptionDetails.cancel_at * 1000).toISOString()
            : null,
          cancel_at_period_end: subscriptionDetails.cancel_at_period_end, // Added to satisfy NOT NULL constraint
        };

        let attempts = 0;
        let upsertSuccess = false;
        let lastError;

        while (attempts < 3 && !upsertSuccess) {
          attempts++;
          console.log(`[STRIPE WEBHOOK DEBUG] Attempt ${attempts} to upsert subscription for user ${userId}. Data: ${JSON.stringify(subscriptionData, null, 2)}`);
          // Assurez-vous que 'supabase' est bien votre client Supabase initialisé avec la SERVICE_ROLE_KEY
          const { error } = await supabase 
            .from('subscriptions')
            .upsert(subscriptionData, {
              onConflict: 'user_id', // Cible la colonne user_id pour le conflit
            });

          if (error) {
            lastError = error;
            console.error(`Upsert attempt ${attempts} failed for user ${userId}:`, error);
            if (attempts < 3) {
              console.log(`Waiting 2 seconds before retry for user ${userId}...`);
              await new Promise(resolve => setTimeout(resolve, 2000)); // Attendre 2s
            }
          } else {
            upsertSuccess = true;
            console.log(`[STRIPE WEBHOOK DEBUG] Subscription upserted successfully for user ${userId} on attempt ${attempts} to plan ${planLookupKey}.`);
          }
        }

        if (!upsertSuccess) {
          console.error(`Failed to upsert subscription for user ${userId} after ${attempts} attempts. Last error:`, lastError);
          return new Response(`Webhook Error: Failed to update Supabase. Last error: ${lastError?.message}`, { status: 500 });
        }
          // **** NEW DEBUG LOG ****
        console.log(`[STRIPE WEBHOOK DEBUG] Successfully processed checkout.session.completed for user ${userId}.`);
      // La re-lecture immédiate est maintenant moins critique avec la logique de réessai et la contrainte unique.
        // Vous pouvez la décommenter si vous souhaitez conserver une vérification explicite.
        /*
        console.log(`Attempting to re-read subscription for user ${userId} with service role key...`);
        const { data: reReadData, error: reReadError } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', userId); // Lire en utilisant le user_id suffit maintenant
        if (reReadError) {
          console.error('Error re-reading subscription immediately after upsert:', reReadError);
        } else {
          console.log('Re-read subscription data immediately after upsert:', JSON.stringify(reReadData, null, 2));
          if (!reReadData || reReadData.length === 0) {
            console.warn('WARN: Re-read attempt returned no data for the subscription just upserted.');
          }
        }
        */

        // Envoyer un email de confirmation après la mise à jour réussie de la BDD
        const userEmail = session.customer_details?.email;
        if (userEmail && planLookupKey && planLookupKey !== 'free') { 
          try {
            console.log(`Attempting to send confirmation email to ${userEmail} for plan ${planLookupKey}`);
            const emailHtml = `<h1>Merci pour votre abonnement !</h1><p>Votre plan '${planLookupKey}' est maintenant actif.</p><p>Connectez-vous à votre compte pour profiter de toutes les fonctionnalités.</p>`;
            const emailText = `Merci pour votre abonnement ! Votre plan '${planLookupKey}' est maintenant actif. Connectez-vous à votre compte pour profiter de toutes les fonctionnalités.`;
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
        } else if (planLookupKey === 'free'){
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

    // **** NEW DEBUG LOG ****
    console.log('[STRIPE WEBHOOK DEBUG] Successfully processed event (or no relevant event type found), sending 200 OK.');
    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
} catch (e: unknown) {
  // **** NEW DEBUG LOG ****
  if (e instanceof Error) {
    console.error('[STRIPE WEBHOOK DEBUG] CAUGHT ERROR in main try block:', e.message, e.stack);
    return new Response(`Webhook error: ${e.message}`, { status: 400 });
  }
  console.error('[STRIPE WEBHOOK DEBUG] CAUGHT ERROR in main try block (unknown type):', e);
  return new Response('Webhook error: An unknown error occurred', { status: 400 });
}
}) // Closing Deno.serve