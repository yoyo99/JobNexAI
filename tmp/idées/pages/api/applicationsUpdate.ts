// API route applicationsUpdate.ts - update application status
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { id, status } = req.body;
    if (!id || !status) {
        return res.status(400).json({ error: 'Missing id or status' });
    }

    const { data, error } = await supabase
        .from('applications')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });

    res.status(200).json(data);
}
