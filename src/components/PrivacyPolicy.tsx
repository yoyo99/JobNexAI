import React from 'react';
import { useTranslation } from 'react-i18next';

export default function PrivacyPolicy() {
  return (
    <div className="prose mx-auto p-8 bg-background text-white rounded-lg max-w-3xl">
      <h1>Politique de Confidentialité</h1>
      <p><strong>Version :</strong> Avril 2025</p>
      <p><strong>Éditeur :</strong> LMCA (micro-entreprise en constitution)</p>
      <p><strong>Siège social :</strong> 13 Allée des Tulipiers, 77120 Coulommiers (France)</p>
      <p><strong>Responsable du traitement :</strong> LMCA</p>
      <p><strong>Contact :</strong> <a href="mailto:contact@jobnexus.fr" className="text-primary-400 underline">contact@jobnexus.fr</a> (ou par courrier à l’adresse du siège)</p>

      <h2>1. Objet de la politique</h2>
      <p>Cette politique de confidentialité a pour objectif d’expliquer comment LMCA collecte, utilise, protège et partage les données personnelles des utilisateurs de la plateforme <strong>JobNexAI</strong> (<a href="https://jobnexus-saas-windsurf.netlify.app/" className="text-primary-400 underline" target="_blank" rel="noopener noreferrer">https://jobnexus-saas-windsurf.netlify.app/</a>), en conformité avec le Règlement Général sur la Protection des Données (RGPD).</p>

      <h2>2. Données collectées</h2>
      <p>LMCA peut collecter les catégories de données suivantes :</p>
      <ul>
        <li><strong>Identité :</strong> nom, prénom (facultatif)</li>
        <li><strong>Coordonnées :</strong> adresse email, adresse postale</li>
        <li><strong>Données professionnelles :</strong> CV, lettre de motivation, compétences, historique de candidatures</li>
        <li><strong>Données techniques :</strong> adresse IP, type de navigateur, logs de connexion</li>
      </ul>

      <h2>3. Finalités et bases légales</h2>
      <p>Les traitements de données sont fondés sur :</p>
      <ul>
        <li><strong>Consentement</strong> (art. 6.1.a RGPD) : inscription, personnalisation des alertes, candidature assistée</li>
        <li><strong>Exécution du contrat</strong> (art. 6.1.b) : accès aux services de gestion de candidatures</li>
        <li><strong>Intérêt légitime</strong> (art. 6.1.f) : sécurité de la plateforme, amélioration des performances</li>
      </ul>

      <h2>4. Durée de conservation</h2>
      <ul>
        <li>Pendant toute la durée de l’utilisation du service</li>
        <li>Et jusqu’à 3 ans après la dernière activité (ou suppression sur demande de l’utilisateur)</li>
        <li>Les données techniques (logs) : jusqu’à 12 mois maximum</li>
      </ul>

      <h2>5. Partage et sous-traitance</h2>
      <p>Vos données peuvent être transmises à des prestataires techniques dans le respect du RGPD :</p>
      <ul>
        <li>Stripe (paiement)</li>
        <li>Supabase (hébergement des données)</li>
        <li>EmailJS (notifications)</li>
        <li>Netlify (hébergement web)</li>
      </ul>
      <p>Ils agissent exclusivement sur instruction de LMCA et assurent des garanties de sécurité appropriées.</p>

      <h2>6. Transferts hors UE</h2>
      <ul>
        <li>Le pays bénéficie d’une décision d’adéquation par la Commission européenne</li>
        <li>Ou des garanties appropriées sont mises en place (clauses contractuelles types, etc.)</li>
      </ul>

      <h2>7. Droits des utilisateurs</h2>
      <p>Conformément au RGPD, vous disposez des droits suivants :</p>
      <ul>
        <li>Accès à vos données</li>
        <li>Rectification et mise à jour</li>
        <li>Suppression (droit à l’oubli)</li>
        <li>Limitation ou opposition au traitement</li>
        <li>Portabilité des données</li>
      </ul>
      <p>Vous pouvez exercer vos droits à tout moment par email ou courrier.</p>

      <h2>8. Sécurité des données</h2>
      <p>LMCA met en œuvre des mesures conformes à l’ISO 27001 :</p>
      <ul>
        <li>Chiffrement des données en transit et au repos</li>
        <li>Accès restreint aux serveurs</li>
        <li>Sauvegardes régulières</li>
        <li>Audit des accès et journalisation</li>
      </ul>

      <h2>9. Modifications de la politique</h2>
      <p>Cette politique pourra être modifiée. En cas de changement significatif, les utilisateurs seront informés via la plateforme ou par email.</p>

      <h2>10. Contact</h2>
      <p>Pour toute demande liée à cette politique ou à vos données personnelles :</p>
      <address>
        LMCA – Données personnelles<br />
        13 Allée des Tulipiers, 77120 Coulommiers – France<br />
        Email : <a href="mailto:contact@jobnexus.fr" className="text-primary-400 underline">contact@jobnexus.fr</a>
      </address>
      <h1>Politique de confidentialité</h1>
      <p>
        La présente politique de confidentialité décrit les modalités de collecte, d’utilisation, de conservation et de protection des données à caractère personnel des utilisateurs de la plateforme SaaS « JobNexAI » (ci-après « la Plateforme »), conformément au Règlement Général sur la Protection des Données (RGPD) et à la norme ISO27001.
      </p>
      <div className="prose prose-invert max-w-none">
        <h1>Politique de confidentialité</h1>
        
        <h2>Collecte des données</h2>
        <p>Nous collectons les données suivantes : informations personnelles, préférences, compétences et utilisation du service.</p>
        <ul>
          <li>Informations personnelles</li>
          <li>Préférences</li>
          <li>Compétences</li>
          <li>Utilisation du service</li>
        </ul>

        <h2>Finalité des données</h2>
        <p>Les données sont utilisées pour l’adéquation des profils, recommandations et analyses.</p>
        <ul>
          <li>Mise en relation avec des offres</li>
          <li>Recommandations personnalisées</li>
          <li>Analyse statistique</li>
        </ul>

        <h2>Durée de conservation</h2>
        <p>Vos données sont conservées aussi longtemps que nécessaire pour l’usage du service.</p>
        <ul>
          <li>Préférences</li>
          <li>Compétences</li>
          <li>Journaux de connexion</li>
        </ul>

        <h2>Sécurité</h2>
        <p>Nous appliquons des mesures de sécurité pour protéger vos données.</p>
        <ul>
          <li>Chiffrement</li>
          <li>Contrôle d’accès</li>
          <li>Surveillance</li>
          <li>Conformité RGPD</li>
        </ul>

        <h2>Vos droits</h2>
        <p>Vous disposez d’un droit d’accès, de rectification, d’effacement, de portabilité et de retrait de consentement.</p>
        <ul>
          <li>Accès</li>
          <li>Rectification</li>
          <li>Effacement</li>
          <li>Portabilité</li>
          <li>Retrait du consentement</li>
        </ul>

        <h2>Contact</h2>
        <p>Pour toute question ou demande concernant vos données personnelles, contactez-nous à l’adresse indiquée dans les mentions légales.</p>
      </div>
    </div>
  )
}