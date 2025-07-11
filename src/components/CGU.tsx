import React from 'react';

/**
 * Conditions Générales d'Utilisation (CGU) pour une plateforme SaaS française.
 * À adapter selon les spécificités de votre service et à faire relire par un juriste pour conformité totale.
 */

export default function CGU() {
  return (
    <div className="prose mx-auto p-8 bg-background text-white rounded-lg max-w-3xl">
      <h1>Conditions Générales d’Utilisation (CGU)</h1>
      <p><strong>Version :</strong> Avril 2025</p>
      <p><strong>Editeur :</strong> LMCA (micro-entreprise en constitution)</p>
      <p><strong>Siège social :</strong> Allée des Tulipiers, 77120 Coulommiers (France)</p>
      <p><strong>Responsable de traitement :</strong> LMCA</p>

      <h2>Article 1 – Objet</h2>
      <p>Les présentes CGU ont pour objet de définir les conditions d’accès et d’utilisation du service <strong>JobNexAI</strong>, accessible à l’adresse suivante : <a href="https://jobnexus-saas-windsurf.netlify.app/" className="text-primary-400 underline" target="_blank" rel="noopener noreferrer">https://jobnexus-saas-windsurf.netlify.app/</a> (ci-après la "Plateforme").<br/>JobNexAI est une application SaaS permettant d’accompagner les utilisateurs dans leur recherche d'emploi, notamment via des outils basés sur l'IA, de suivi de candidatures, de préparation d’entretiens et de mise en réseau professionnel.</p>

      <h2>Article 2 – Accès au service</h2>
      <p>L’accès à la Plateforme est gratuit, sous réserve d’inscription préalable. L'utilisateur s'engage à fournir des informations exactes lors de son inscription.</p>

      <h2>Article 3 – Propriété intellectuelle</h2>
      <p>Tous les éléments de la Plateforme (textes, images, logos, algorithmes, code source, etc.) sont la propriété exclusive de LMCA. Toute reproduction, distribution ou usage non autorisé est interdite.</p>

      <h2>Article 4 – Données personnelles et conformité RGPD</h2>
      <p>LMCA collecte les données suivantes : adresse email, CV, adresse IP, adresse postale, et informations relatives au profil professionnel.<br/>Ces données sont traitées pour :</p>
      <ul>
        <li>la gestion du compte utilisateur ;</li>
        <li>la personnalisation des offres d’emploi ;</li>
        <li>l’analyse des candidatures ;</li>
        <li>l’amélioration continue de la Plateforme.</li>
      </ul>
      <p>Le traitement est fondé sur le consentement de l’utilisateur (art. 6.1.a RGPD).<br/>Les utilisateurs peuvent exercer leurs droits d’accès, de rectification, d’effacement, de portabilité et d’opposition en contactant LMCA à l’adresse indiquée ci-dessus.<br/>Aucune donnée n’est cédée à des tiers sans consentement, sauf obligations légales. Les données sont hébergées au sein de l’UE ou dans des pays reconnus comme offrant un niveau de protection adéquat.</p>

      <h2>Article 5 – Sous-traitants</h2>
      <p>LMCA utilise des sous-traitants conformes au RGPD pour certains traitements :</p>
      <ul>
        <li>Stripe : paiements (le cas échéant)</li>
        <li>Supabase : base de données</li>
        <li>EmailJS : envoi de mails</li>
        <li>Netlify : hébergement et déploiement de la Plateforme</li>
      </ul>
      <p>Ces sous-traitants s'engagent à respecter la confidentialité, la sécurité des données et les obligations du RGPD.</p>

      <h2>Article 6 – Sécurité des données (ISO 27001)</h2>
      <p>LMCA met en place des mesures techniques et organisationnelles pour garantir la confidentialité, l’intégrité et la disponibilité des données (chiffrement, contrôle d'accès, sauvegardes régulières, journaux de sécurité).<br/>L’utilisateur s’engage à ne pas compromettre la sécurité de la Plateforme par un usage frauduleux ou malveillant.</p>

      <h2>Article 7 – Responsabilité</h2>
      <p>La Plateforme est proposée "en l’état". LMCA ne garantit pas l’absence de bugs ni une disponibilité continue. LMCA ne saurait être tenu responsable des conséquences d’un dysfonctionnement ou d’une interruption.</p>

      <h2>Article 8 – Modifications des CGU</h2>
      <p>LMCA se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés par notification ou email.</p>

      <h2>Article 9 – Droit applicable et juridiction</h2>
      <p>Les présentes CGU sont soumises au droit français. Tout litige relèvera de la compétence exclusive des tribunaux français.</p>

      <h2>Article 10 – Contact</h2>
      <p>Pour toute question relative à ces CGU ou à la gestion de vos données, vous pouvez contacter LMCA par email ou courrier à l’adresse du siège social.</p>
    </div>
  );
}
