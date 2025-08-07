// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// supabase/functions/extract-cv-text/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { extractText, getDocumentProxy } from 'https://esm.sh/unpdf@latest';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { storagePath } = await req.json();
    if (!storagePath) {
      throw new Error('storagePath is required in the request body.');
    }

    console.log(`Attempting to download from storage path: ${storagePath}`);

    const bucketName = 'cvs'; // The actual name of your CVs bucket
    const filePath = storagePath; // The full path inside the bucket, e.g., 'user_id/cv.pdf'

    console.log(`Downloading from bucket: '${bucketName}', file path: '${filePath}'`);

    const { data: fileData, error: downloadError } = await supabaseClient
      .storage
      .from(bucketName)
      .download(filePath);

    if (downloadError) {
      console.error('Download error details:', {
        message: downloadError.message,
        name: downloadError.name,
        cause: downloadError.cause,
        stack: downloadError.stack,
        bucketName,
        filePath
      });
      throw new Error(`Storage download failed: ${downloadError.message} (bucket: ${bucketName}, path: ${filePath})`);
    }
    if (!fileData) {
      throw new Error('File not found or empty from Supabase Storage.');
    }
    
    console.log('File downloaded successfully. Size:', fileData.size);

    try {
      const fileArrayBuffer = await fileData.arrayBuffer();
      console.log('File converted to ArrayBuffer. Size:', fileArrayBuffer.byteLength);
      
      console.log('Creating PDF document proxy...');
      const pdfProxy = await getDocumentProxy(new Uint8Array(fileArrayBuffer));
      console.log('PDF document proxy created successfully');

      console.log('Attempting to extract text using unpdf...');
      const { text: extractedText, totalPages } = await extractText(pdfProxy);
      console.log('Text extraction completed. Text length:', extractedText?.length, 'Total pages:', totalPages);

      if (extractedText === undefined || extractedText === null || typeof extractedText !== 'string') {
        throw new Error('Failed to extract text content using unpdf. Result was not a string.');
      }
      
      if (extractedText.trim().length === 0) {
        throw new Error('Extracted text is empty. The PDF might be image-based or corrupted.');
      }
      
      console.log(`Text extracted successfully using unpdf. Extracted text length: ${extractedText?.length ?? 0}, Total pages: ${totalPages}`);

      return new Response(
        JSON.stringify({ 
          extractedText: extractedText || "", 
          totalPages,
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    } catch (pdfError) {
      console.error('Error during PDF processing:', pdfError);
      throw new Error(`PDF processing failed: ${pdfError instanceof Error ? pdfError.message : 'Unknown error'}`);
    }

  } catch (e) {
    console.error('Error in extract-cv-text function:', e);
    let errorMessage = 'An unexpected error occurred.';
    let errorStack: string | undefined = undefined;

    if (e instanceof Error) {
      errorMessage = e.message;
      errorStack = e.stack;
    } else if (typeof e === 'string') {
      errorMessage = e;
    } else {
      try {
        errorMessage = JSON.stringify(e);
      } catch {
        // If stringify fails, stick to the generic message
      }
    }

    if (errorStack) {
        console.error(errorStack);
    }

    const isInputError = errorMessage.includes('storagePath is required') || errorMessage.includes('Invalid storagePath format');

    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: isInputError ? 400 : 500
      }
    );
  }
});

/*
Variables d'environnement à configurer dans Supabase Dashboard > Edge Functions > extract-cv-text > Settings:
- SUPABASE_URL: L'URL de votre projet Supabase.
- SUPABASE_ANON_KEY: La clé anonyme publique de votre projet Supabase.

Permissions de stockage (Row Level Security sur le bucket) :
Assurez-vous que les utilisateurs authentifiés ont le droit de lire (`select`) les fichiers
qu'ils sont censés pouvoir accéder via cette fonction.

Pour invoquer localement (après supabase start) :
  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/extract-cv-text' \
    --header 'Authorization: Bearer VOTRE_SUPABASE_ANON_KEY_OU_USER_TOKEN' \
    --header 'Content-Type: application/json' \
    --data '{"storagePath":"VOTRE_BUCKET/CHEMIN_VERS_FICHIER.pdf"}'
*/
