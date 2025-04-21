// Supabase Edge Function pour monitorer le quota Resend
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  if (!RESEND_API_KEY) {
    return new Response("Resend API key missing", { status: 500 });
  }
  const response = await fetch("https://api.resend.com/v1/stats", {
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    const error = await response.text();
    return new Response(`Resend stats error: ${error}`, { status: 500 });
  }
  const stats = await response.json();
  // { sent, limit, period }
  return new Response(JSON.stringify(stats), { status: 200 });
});
