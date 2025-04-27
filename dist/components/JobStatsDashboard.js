import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { jsPDF } from 'jspdf';
Chart.register(BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend);
const JobStatsDashboard = ({ stats }) => {
    // Préparation des données pour les graphiques
    const barData = useMemo(() => ({
        labels: stats.map(s => s.status),
        datasets: [
            {
                label: 'Nombre de candidatures',
                data: stats.map(s => s.count),
                backgroundColor: [
                    '#60a5fa', '#facc15', '#34d399', '#f87171', '#a78bfa', '#fbbf24', '#38bdf8',
                ],
            },
        ],
    }), [stats]);
    const pieData = useMemo(() => ({
        labels: stats.map(s => s.status),
        datasets: [
            {
                label: 'Répartition',
                data: stats.map(s => s.count),
                backgroundColor: [
                    '#60a5fa', '#facc15', '#34d399', '#f87171', '#a78bfa', '#fbbf24', '#38bdf8',
                ],
            },
        ],
    }), [stats]);
    // Export PDF du dashboard
    const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.text('Statistiques de candidatures JobNexus', 10, 10);
        doc.text('Répartition des statuts :', 10, 20);
        stats.forEach((s, i) => {
            doc.text(`${s.status}: ${s.count}`, 10, 30 + i * 10);
        });
        doc.save('jobnexus_stats.pdf');
    };
    return (_jsxs("div", { className: "prose mx-auto p-8 bg-background text-white rounded-lg max-w-3xl", children: [_jsx("h1", { children: "Statistiques de vos candidatures" }), _jsx("div", { className: "my-8", children: _jsx(Bar, { data: barData }) }), _jsx("div", { className: "my-8", children: _jsx(Pie, { data: pieData }) }), _jsx("button", { className: "btn-primary mt-4", onClick: handleExportPDF, children: "Exporter en PDF" })] }));
};
export default JobStatsDashboard;
