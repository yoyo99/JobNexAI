   // supabase/functions/expire-free-trials/index.ts

   import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
   import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'
   import Stripe from 'https://esm.sh/stripe@11.16.0?target=deno' // Ou la dernière version compatible

   // --- Configuration ---
   const TRIAL_PLAN_ID = 'trial_48h'
   const TRIAL_DURATION_HOURS = 48
   const NEW_STATUS_AFTER_TRIAL = 'trial_ended'
   // La mise à jour de user_type est gérée par la logique applicative, pas directement ici.
   // const DEFAULT_USER_TYPE_AFTER_TRIAL = 'standard' 

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
	   const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
	   const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')

	   if (!supabaseUrl || !supabaseServiceRoleKey || !stripeSecretKey) {
		 console.error('Missing environment variables for expire-free-trials function')
		 return new Response(JSON.stringify({ error: 'Missing environment variables' }), {
		   headers: { ...corsHeaders, 'Content-Type': 'application/json' },
		   status: 500,
		 })
	   }

	   const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)
	   const stripe = new Stripe(stripeSecretKey, {
		 apiVersion: '2023-10-16', // Ou la version que vous ciblez
		 httpClient: Stripe.createFetchHttpClient(),
	   })

	   console.log(`[${new Date().toISOString()}] expire-free-trials function invoked.`)

	   const { data: activeTrials, error: fetchError } = await supabaseAdmin
		 .from('subscriptions')
		 .select('id, user_id, stripe_subscription_id, current_period_start')
		 .eq('plan', TRIAL_PLAN_ID)
		 .eq('status', 'trialing') 

	   if (fetchError) {
		 console.error('Error fetching active trials:', fetchError.message)
		 throw new Error(`Error fetching active trials: ${fetchError.message}`)
	   }

	   if (!activeTrials || activeTrials.length === 0) {
		 console.log('No active trials found with status "trialing" to process.')
		 return new Response(JSON.stringify({ message: 'No active "trialing" trials to process.' }), {
		   headers: { ...corsHeaders, 'Content-Type': 'application/json' },
		   status: 200,
		 })
	   }

	   console.log(`Found ${activeTrials.length} active trial(s) with status "trialing" to check.`);
	   const now = new Date()
	   let trialsProcessedCount = 0

	   for (const trial of activeTrials) {
		 if (!trial.current_period_start) {
		   console.warn(`Trial ${trial.id} (Stripe ID: ${trial.stripe_subscription_id}) is missing current_period_start. Skipping.`);
		   continue;
		 }
		 const trialStartDate = new Date(trial.current_period_start)
		 const expirationDate = new Date(trialStartDate.getTime() + TRIAL_DURATION_HOURS * 60 * 60 * 1000)

		 console.log(`Checking trial ${trial.id} (Stripe ID: ${trial.stripe_subscription_id}). Start: ${trialStartDate.toISOString()}, Expires: ${expirationDate.toISOString()}`);

		 if (now >= expirationDate) {
		   console.log(`Trial ${trial.id} has expired. Attempting cancellation...`)
		   trialsProcessedCount++;
		   try {
			 await stripe.subscriptions.del(trial.stripe_subscription_id)
			 console.log(`Stripe subscription ${trial.stripe_subscription_id} cancelled successfully.`)

			 const { error: updateSubError } = await supabaseAdmin
			   .from('subscriptions')
			   .update({ status: NEW_STATUS_AFTER_TRIAL })
			   .eq('id', trial.id)

			 if (updateSubError) {
			   console.error(`Error updating Supabase subscription ${trial.id} status to "${NEW_STATUS_AFTER_TRIAL}":`, updateSubError.message)
			 } else {
			   console.log(`Supabase subscription ${trial.id} status updated to '${NEW_STATUS_AFTER_TRIAL}'.`)
			 }

			 // La section de mise à jour du user_type reste commentée comme convenu.

		   } catch (stripeError) {
			 console.error(`Error cancelling Stripe subscription ${trial.stripe_subscription_id}:`, stripeError.message)
			 if (stripeError.code === 'resource_missing') {
				console.warn(`Stripe subscription ${trial.stripe_subscription_id} was already cancelled or does not exist. Attempting to update Supabase status anyway.`);
				const { error: updateSubErrorIfMissing } = await supabaseAdmin
				   .from('subscriptions')
				   .update({ status: NEW_STATUS_AFTER_TRIAL })
				   .eq('id', trial.id)
				   .eq('status', 'trialing'); 
				if (updateSubErrorIfMissing) {
				   console.error(`Error updating Supabase subscription ${trial.id} status after Stripe resource_missing:`, updateSubErrorIfMissing.message);
				} else {
				   console.log(`Supabase subscription ${trial.id} status updated to '${NEW_STATUS_AFTER_TRIAL}' after Stripe resource_missing.`);
				}
			 }
		   }
		 } else {
		   console.log(`Trial ${trial.id} has not expired yet.`);
		 }
	   }

	   console.log(`Processing complete. ${trialsProcessedCount} trial(s) met expiration criteria.`);
	   return new Response(JSON.stringify({ message: `Processing complete. ${trialsProcessedCount} trial(s) met expiration criteria.` }), {
		 headers: { ...corsHeaders, 'Content-Type': 'application/json' },
		 status: 200,
	   })

	 } catch (error) {
	   console.error('General error in expire-free-trials function:', error.message)
	   return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
		 headers: { ...corsHeaders, 'Content-Type': 'application/json' },
		 status: 500,
	   })
	 }
   })