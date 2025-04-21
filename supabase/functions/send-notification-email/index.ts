import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

function getSupabaseJwt(req: Request): string | null {
  const auth = req.headers.get("Authorization");
  if (!auth || !auth.startsWith("Bearer ")) return null;
  return auth.slice(7);
}

serve(async (req) => {
  // Sécurité : vérifier JWT Supabase
  const jwt = getSupabaseJwt(req);
  if (!jwt) {
    return new Response("Unauthorized: JWT missing", { status: 401 });
  }

  const { to, subject, text, html } = await req.json();

  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  const EMAIL_FROM = Deno.env.get("EMAIL_FROM");

  if (!RESEND_API_KEY || !EMAIL_FROM) {
    return new Response("Email config missing", { status: 500 });
  }

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

  if (!response.ok) {
    const error = await response.text();
    return new Response(`Resend error: ${error}`, { status: 500 });
  }

  return new Response("Email envoyé", { status: 200 });
});
