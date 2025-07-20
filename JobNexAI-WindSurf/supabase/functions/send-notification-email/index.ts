import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

function getSupabaseJwt(req: Request): string | null {
  console.log("[send-notification-email] Attempting to get JWT. Headers:", JSON.stringify(Object.fromEntries(req.headers.entries())));
  const auth = req.headers.get("Authorization");
  if (!auth || !auth.startsWith("Bearer ")) return null;
  return auth.slice(7);
}

serve(async (req: Request) => {
  console.log("[send-notification-email] Function invoked.");
  // Sécurité : vérifier JWT Supabase
  const jwt = getSupabaseJwt(req);
  console.log(`[send-notification-email] JWT received: ${jwt ? 'found' : 'null'}`);
  if (!jwt) {
    console.error("[send-notification-email] Unauthorized: JWT missing or invalid.");
    return new Response("Unauthorized: JWT missing", { status: 401 });
  }

  let payload;
  try {
    payload = await req.json();
    console.log("[send-notification-email] Received payload:", JSON.stringify(payload));
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error("[send-notification-email] Error parsing request JSON:", e.message);
    } else {
      console.error("[send-notification-email] Error parsing request JSON: Unknown error type", e);
    }
    return new Response("Error parsing request JSON: " + (e instanceof Error ? e.message : 'Unknown error'), { status: 400 });
  }
  const { to, subject, text, html } = payload;

  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  const EMAIL_FROM = Deno.env.get("EMAIL_FROM");
  console.log(`[send-notification-email] RESEND_API_KEY loaded: ${RESEND_API_KEY ? 'true' : 'false'}`);
  console.log(`[send-notification-email] EMAIL_FROM loaded: ${EMAIL_FROM}`);

  if (!RESEND_API_KEY || !EMAIL_FROM) {
    console.error("[send-notification-email] Email config missing - RESEND_API_KEY or EMAIL_FROM not set.");
    return new Response("Email config missing", { status: 500 });
  }

  console.log("[send-notification-email] Email config loaded. Preparing to call Resend API.");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to,
      subject,
      text,
      html,
    }),
  });

  console.log(`[send-notification-email] Resend API response status: ${response.status}, statusText: ${response.statusText}`);
  if (!response.ok) {
    const error = await response.text();
    console.error(`[send-notification-email] Resend API error: ${error}`);
    return new Response(`Resend error: ${error}`, { status: 500 });
  }

  console.log("[send-notification-email] Email sent successfully via Resend.");
  return new Response("Email envoyé", { status: 200 });
});
