import React from 'react';

/**
 * Mentions légales pour une plateforme SaaS française.
 * À adapter selon les spécificités de votre société et à faire relire par un juriste pour conformité totale.
 */

export default function LegalNotice() {
  return (
    <div className="prose mx-auto p-8 bg-background text-white rounded-lg max-w-3xl">
      <h1>Mentions légales</h1>
      <p>Dernière mise à jour : 24 avril 2025</p>
      <h2>Éditeur du site</h2>
      <p>
        <strong>Nom de la société :</strong> JobNexAI SAS<br/>
        <strong>Adresse :</strong> 10 rue de la Réussite, 75000 Paris, France<br/>
        <strong>Email :</strong> <a href="mailto:boltsaas01@gmail.com" className="text-primary-400 underline">boltsaas01@gmail.com</a><br/>
        <strong>Directeur de la publication :</strong> John Doe<br/>
        <strong>SIRET :</strong> 123 456 789 00010<br/>
      </p>
      <h2>Hébergement</h2>
      <p>
        <strong>Hébergeur :</strong> OVH SAS<br/>
        2 rue Kellermann, 59100 Roubaix, France<br/>
        <strong>Téléphone :</strong> 1007<br/>
        <strong>Site web :</strong> <a href="https://www.ovh.com" target="_blank" rel="noopener noreferrer" className="text-primary-400 underline">www.ovh.com</a>
      </p>
      <h2>Propriété intellectuelle</h2>
      <p>Pour toute question concernant les mentions légales, contactez-nous à l’adresse suivante : <a href="mailto:boltsaas01@gmail.com" className="text-primary-400 underline">boltsaas01@gmail.com</a>.</p>
      <p>L’ensemble du contenu du site JobNexAI (textes, images, logos, etc.) est protégé par le droit d’auteur et la propriété intellectuelle. Toute reproduction ou représentation totale ou partielle est interdite sans autorisation écrite préalable.</p>
    </div>
  );
}
