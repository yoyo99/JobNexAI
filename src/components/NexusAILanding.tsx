import React, { useState } from 'react';
import nexusAILogo from '../../public/nexusai-logo.svg';

const translations = {
  fr: {
    heroTitle: "Boostez votre carrière avec l'IA",
    heroSubtitle: "Matching intelligent, lettres de motivation personnalisées, conseils IA. NexusAI simplifie votre recherche d'emploi.",
    cta: "Commencer maintenant",
    howItWorks: "Comment ça marche ?",
    howItWorksSteps: [
      "Créez votre profil en quelques clics.",
      "Recevez des suggestions d'offres adaptées à votre parcours.",
      "Générez des lettres de motivation sur-mesure grâce à l'IA.",
      "Postulez et suivez vos candidatures en toute simplicité."
    ],
    advantages: "Pourquoi choisir NexusAI ?",
    advantagesList: [
      "Matching IA ultra-précis",
      "Lettres de motivation générées en 1 clic",
      "Confidentialité et sécurité de vos données",
      "Plateforme intuitive et moderne"
    ],
    testimonials: "Ils ont trouvé leur job grâce à NexusAI",
    footer: "© 2025 NexusAI. Tous droits réservés."
  },
  en: {
    heroTitle: "Boost your career with AI",
    heroSubtitle: "Smart matching, personalized cover letters, AI-powered advice. NexusAI makes your job search easy.",
    cta: "Get Started",
    howItWorks: "How does it work?",
    howItWorksSteps: [
      "Create your profile in a few clicks.",
      "Get job suggestions tailored to your background.",
      "Generate custom cover letters with AI.",
      "Apply and track your applications easily."
    ],
    advantages: "Why choose NexusAI?",
    advantagesList: [
      "Ultra-precise AI matching",
      "1-click cover letter generation",
      "Confidentiality & data security",
      "Modern and intuitive platform"
    ],
    testimonials: "They found their job with NexusAI",
    footer: "© 2025 NexusAI. All rights reserved."
  }
};

export default function NexusAILanding() {
  const [lang, setLang] = useState<'fr' | 'en'>('fr');
  const t = translations[lang];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 text-gray-900">
      <header className="flex justify-between items-center px-6 py-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-4">
          <img src={nexusAILogo} alt="NexusAI Logo" className="h-12 w-12" />
          <span className="font-bold text-2xl text-indigo-700">NexusAI</span>
        </div>
        <div className="flex gap-3">
          <button
            className={`px-3 py-1 rounded ${lang === 'fr' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 border border-indigo-200'}`}
            onClick={() => setLang('fr')}
          >FR</button>
          <button
            className={`px-3 py-1 rounded ${lang === 'en' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 border border-indigo-200'}`}
            onClick={() => setLang('en')}
          >EN</button>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-12">
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-700 mb-4">{t.heroTitle}</h1>
          <p className="text-lg md:text-2xl text-gray-700 mb-8">{t.heroSubtitle}</p>
          <button className="bg-gradient-to-r from-indigo-600 to-cyan-500 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:scale-105 transition-transform">
            {t.cta}
          </button>
        </section>
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-indigo-700 mb-4">{t.howItWorks}</h2>
          <ol className="list-decimal list-inside space-y-2 text-lg text-gray-700">
            {t.howItWorksSteps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </section>
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-indigo-700 mb-4">{t.advantages}</h2>
          <ul className="list-disc list-inside space-y-2 text-lg text-gray-700">
            {t.advantagesList.map((adv, idx) => (
              <li key={idx}>{adv}</li>
            ))}
          </ul>
        </section>
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-indigo-700 mb-4">{t.testimonials}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="italic text-gray-600">“Grâce à NexusAI, j’ai trouvé un job en 2 semaines !”</p>
              <span className="block mt-2 font-semibold text-indigo-600">Sarah, Paris</span>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="italic text-gray-600">“NexusAI made my job search so much easier and faster.”</p>
              <span className="block mt-2 font-semibold text-indigo-600">James, London</span>
            </div>
          </div>
        </section>
      </main>
      <footer className="text-center py-6 text-gray-500 border-t border-indigo-100">
        {t.footer}
      </footer>
    </div>
  );
}
