import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { Resend } from "https://esm.sh/resend@3.2.0";
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'; // Supabase client

// Environment variables
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL') || 'admin@jobnexai.com'; // Fallback if not set
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || 'contact@jobnexai.com'; // Fallback if not set
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

// Helper function to log email attempts
async function logEmailAttempt(supabase: SupabaseClient, details: {
  recipient_email: string;
  subject: string;
  status: 'sent' | 'failed';
  sender_email: string;
  resend_email_id?: string | null;
  error_message?: string | null;
  metadata?: Record<string, unknown>;
}) {
  if (!supabase) return; // Do not attempt to log if Supabase client is not initialized
  try {
    const { error: logError } = await supabase.from('emails_sent').insert([details]);
    if (logError) {
      console.error('Failed to log email attempt to Supabase:', logError.message);
    }
  } catch (e) {
    console.error('Exception during email logging:', (e as Error).message);
  }
}

serve(async (req: Request) => {
  // Ensure API keys and Supabase creds are available
  if (!RESEND_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing required environment variables (RESEND_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY).');
    return new Response(JSON.stringify({ error: 'Internal server configuration error.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  const resend = new Resend(RESEND_API_KEY);
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // Handle CORS preflight request
  // IMPORTANT: Adjust '*' to your specific frontend URL in production for better security
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // e.g., 'https://your-app.netlify.app'
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ error: 'Missing required form fields.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 1. Send email to admin
    const adminEmailResult = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `Nouveau message de contact - JobNexAI : ${subject}`,
      html: `
        <p>Bonjour Administrateur,</p>
        <p>Vous avez reçu un nouveau message via le formulaire de contact de JobNexAI :</p>
        <ul>
          <li><strong>Nom :</strong> ${name}</li>
          <li><strong>Email :</strong> ${email}</li>
          <li><strong>Sujet :</strong> ${subject}</li>
        </ul>
        <p><strong>Message :</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p>Cordialement,<br>Le système de notification JobNexAI</p>
      `,
    });

    if (adminEmailResult.error) {
      console.error('Resend admin email error:', adminEmailResult.error);
      await logEmailAttempt(supabase, {
        recipient_email: ADMIN_EMAIL,
        subject: `Nouveau message de contact - JobNexAI : ${subject}`,
        status: 'failed',
        sender_email: FROM_EMAIL,
        error_message: adminEmailResult.error.message,
        metadata: { type: 'contact_form_admin_notification', original_sender: email }
      });
      throw new Error(`Failed to send admin email: ${adminEmailResult.error.message}`);
    } else {
      await logEmailAttempt(supabase, {
        recipient_email: ADMIN_EMAIL,
        subject: `Nouveau message de contact - JobNexAI : ${subject}`,
        status: 'sent',
        sender_email: FROM_EMAIL,
        resend_email_id: adminEmailResult.data?.id,
        metadata: { type: 'contact_form_admin_notification', original_sender: email }
      });
    }

    // 2. Send confirmation email to user
    const userEmailResult = await resend.emails.send({
      from: FROM_EMAIL,
      to: email, // User's email from the form
      subject: 'Confirmation de votre message - JobNexAI',
      html: `
        <p>Bonjour ${name},</p>
        <p>Merci de nous avoir contactés via JobNexAI !</p>
        <p>Nous avons bien reçu votre message concernant : "<strong>${subject}</strong>".<br>
        Nous nous efforcerons de vous répondre dans les plus brefs délais.</p>
        <p>Pour rappel, voici une copie de votre message :</p>
        <blockquote style="border-left: 2px solid #ccc; padding-left: 10px; margin-left: 5px; color: #555;">
          <p>${message.replace(/\n/g, '<br>')}</p>
        </blockquote>
        <hr>
        <p>Cordialement,<br>L'équipe JobNexAI</p>
      `,
    });

    if (userEmailResult.error) {
      console.error('Resend user email error:', userEmailResult.error);
      await logEmailAttempt(supabase, {
        recipient_email: email,
        subject: 'Confirmation de votre message - JobNexAI',
        status: 'failed',
        sender_email: FROM_EMAIL,
        error_message: userEmailResult.error.message,
        metadata: { type: 'contact_form_user_confirmation' }
      });
      // Even if user email fails, admin email might have succeeded. 
      // For now, let's consider it a partial failure if user email doesn't send.
      throw new Error(`Failed to send user confirmation email: ${userEmailResult.error.message}`);
    } else {
      await logEmailAttempt(supabase, {
        recipient_email: email,
        subject: 'Confirmation de votre message - JobNexAI',
        status: 'sent',
        sender_email: FROM_EMAIL,
        resend_email_id: userEmailResult.data?.id,
        metadata: { type: 'contact_form_user_confirmation' }
      });
    }

    return new Response(JSON.stringify({ message: 'Emails sent successfully!' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (e: unknown) {
    const error = e as Error; // Type assertion
    console.error('Overall email sending/logging error:', error.message, error.stack);
    // Note: Logging at this top level might be redundant if individual sends are already logged
    // or could be used for errors not caught by specific send attempts (e.g., req.json() failure before Supabase client init)
    return new Response(JSON.stringify({ error: 'Failed to process email request. ' + error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
