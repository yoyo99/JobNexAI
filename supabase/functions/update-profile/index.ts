// Supabase Edge Function: update-profile
// Permet la mise à jour du profil utilisateur avec validation fiscale/RGPD
// À déployer dans supabase/functions/update-profile/index.ts

import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

export function validateProfile(form: any): string | null {
  if (!form.userType || !form.fiscalCountry || !form.address) {
    return 'Type utilisateur, pays de résidence fiscale et adresse sont obligatoires.';
  }
  if (form.userType === 'physique' && !form.legalStatus) {
    return 'Le statut légal est obligatoire pour une personne physique.';
  }
  if (
    form.userType === 'morale' ||
    form.legalStatus === 'auto-entrepreneur' ||
    form.userType === 'freelance'
  ) {
    if (!form.companyName || !form.siren) {
      return 'Raison sociale et SIREN/SIRET sont obligatoires pour une société ou un freelance.';
    }
    if (!/^[0-9]{9,14}$/.test(form.siren)) {
      return 'Le numéro SIREN/SIRET doit comporter 9 à 14 chiffres.';
    }
  }
  // Validation stricte TVA par pays
if (form.tva) {
  const tva = form.tva.toUpperCase();
  const country = tva.slice(0,2);
  let valid = false;
  switch (country) {
    case 'FR':
      // FR : FR + 2 chiffres + 9 chiffres
      valid = /^FR[0-9]{2}[0-9]{9}$/.test(tva);
      break;
    case 'DE':
      // DE : DE + 9 chiffres
      valid = /^DE[0-9]{9}$/.test(tva);
      break;
    case 'BE':
      // BE : BE + 10 chiffres
      valid = /^BE[0-9]{10}$/.test(tva);
      break;
    default:
      // Fallback : 2 lettres pays + 2 à 12 caractères alphanumériques
      valid = /^([A-Z]{2})([0-9A-Z]{2,12})$/.test(tva);
  }
  if (!valid) {
    return 'Le numéro de TVA intracommunautaire semble invalide.';
  }
}
    return 'Le numéro de TVA intracommunautaire semble invalide.';
  }
  return null;
}

if (import.meta.main) {
  serve(async (req) => {
    // 1. Vérifier le JWT du header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Non authentifié' }), { status: 401 });
    }
    const jwt = authHeader.replace('Bearer ', '');

    // 2. Utiliser le client Supabase avec le JWT utilisateur
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: `Bearer ${jwt}` } } }
    );

    // 3. Récupérer l'utilisateur authentifié
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Token invalide' }), { status: 401 });
    }

    // 4. Vérifier que l’utilisateur correspond bien à l’ID demandé
    const { user_id, fullName, userType, legalStatus, companyName, siren, tva, fiscalCountry, address, aiApiKey } = await req.json();
    if (user.id !== user_id) {
      return new Response(JSON.stringify({ error: 'Accès interdit' }), { status: 403 });
    }

    // 5. Validation métier
    const validationError = validateProfile({ userType, legalStatus, companyName, siren, tva, fiscalCountry, address, fullName, aiApiKey });
    if (validationError) {
      return new Response(JSON.stringify({ error: validationError }), { status: 400 });
    }

    // 6. Mise à jour du profil avec RLS activé
    const { error } = await supabase
      .from('profiles')
      .update({ fullName, userType, legalStatus, companyName, siren, tva, fiscalCountry, address, aiApiKey })
      .eq('id', user_id);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  });
}
