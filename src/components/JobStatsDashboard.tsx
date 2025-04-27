import React, { useMemo } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { jsPDF } from 'jspdf';

Chart.register(BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend);

/**
 * Dashboard interactif des statistiques de candidatures JobNexAI.
 * Affiche des graphiques et permet l'export PDF du dashboard.
 * TODO: Brancher sur les vraies données utilisateur.
 */

interface JobStat {
  status: string;
  count: number;
}

interface JobStatsDashboardProps {
  stats: JobStat[];
}

const JobStatsDashboard: React.FC<JobStatsDashboardProps> = ({ stats }) => {
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
    doc.text('Statistiques de candidatures JobNexAI', 10, 10);
    doc.text('Répartition des statuts :', 10, 20);
    stats.forEach((s, i) => {
      doc.text(`${s.status}: ${s.count}`, 10, 30 + i * 10);
    });
    doc.save('jobnexai_stats.pdf');
  };

  return (
    <div className="prose mx-auto p-8 bg-background text-white rounded-lg max-w-3xl">
      <h1>Statistiques de vos candidatures</h1>
      <div className="my-8">
        <Bar data={barData} />
      </div>
      <div className="my-8">
        <Pie data={pieData} />
      </div>
      <button className="btn-primary mt-4" onClick={handleExportPDF}>
        Exporter en PDF
      </button>
      {/* TODO: Brancher sur les vraies données utilisateur (fetch depuis Supabase) */}
    </div>
  );
};

export default JobStatsDashboard;
