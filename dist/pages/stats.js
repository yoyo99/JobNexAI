import { jsx as _jsx } from "react/jsx-runtime";
import JobStatsDashboard from '../components/JobStatsDashboard';
// Exemple de stats fictives à remplacer par un fetch Supabase réel
const fakeStats = [
    { status: 'Brouillons', count: 2 },
    { status: 'Postulées', count: 8 },
    { status: 'Entretiens', count: 3 },
    { status: 'Offres', count: 1 },
    { status: 'Refusées', count: 4 },
];
export default function StatsPage() {
    return _jsx(JobStatsDashboard, { stats: fakeStats });
}
