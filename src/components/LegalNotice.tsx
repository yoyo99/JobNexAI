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
        <strong>Nom de la société :</strong> JobifyAI SAS<br/>
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
      <p>
        L’ensemble du contenu du site JobifyAI (textes, images, logos, etc.) est protégé par le droit d’auteur et la propriété intellectuelle. Toute reproduction ou représentation totale ou partielle est interdite sans autorisation écrite préalable.
      </p>
      <h2>Données personnelles</h2>
      <p>
        Les informations recueillies font l’objet d’un traitement informatique destiné à la gestion des utilisateurs et des services. Conformément à la loi « Informatique et Libertés » et au RGPD, vous disposez d’un droit d’accès, de rectification et de suppression des données vous concernant.
      </p>
      <h2>Responsabilité</h2>
      <p>
        L’éditeur ne saurait être tenu responsable des dommages directs ou indirects résultant de l’accès ou de l’utilisation du site.
      </p>
      <h2>Contact</h2>
      <p>
        Pour toute question, contactez-nous à <a href="mailto:boltsaas01@gmail.com" className="text-primary-400 underline">boltsaas01@gmail.com</a>
      </p>
    </div>
  );
}
