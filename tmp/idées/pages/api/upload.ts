// API route upload.ts - upload files to Supabase bucket (exemple simplifié)
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    try {
        const file = req.body.file; // suppose base64 or multipart
        const { data, error } = await supabase.storage
            .from('cv-offers')
            .upload('filename.pdf', file, { contentType: 'application/pdf' });

        if (error) throw error;

        res.status(200).json({ message: 'Fichier uploadé', data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
