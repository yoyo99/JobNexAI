// File: supabase/functions/get_translations_by_lang/index.ts
import { serve } from 'https://deno.land/std/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js';
serve(async (req)=>{
  const url = new URL(req.url);
  const lang = url.searchParams.get('lang') ?? 'en';
  const supabase = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_ANON_KEY'));
  const { data, error } = await supabase.from('translations').select('key, value').eq('lang', lang);
  if (error) {
    return new Response(JSON.stringify({
      error
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  const translations = data.reduce((acc, { key, value })=>{
    acc[key] = value;
    return acc;
  }, {});
  return new Response(JSON.stringify({
    lang,
    translations
  }), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
});
