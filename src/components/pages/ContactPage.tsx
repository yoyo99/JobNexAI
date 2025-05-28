import React from 'react';

const ContactPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 bg-gray-800 text-gray-200 rounded-lg shadow-xl my-8 text-left">
      <h1 className="text-3xl font-bold mb-6 text-primary-400">Contactez-nous</h1>
      <p className="mb-4">
        Vous avez des questions, des suggestions ou besoin d'assistance ? N'hésitez pas à nous contacter.
      </p>
      <p className="mb-4">
        <strong>Email :</strong> <a href="mailto:contact@jobnexai.fr" className="text-primary-400 underline">contact@jobnexai.fr</a>
      </p>
      <p className="mb-4">
        <strong>Adresse :</strong> LMCA, 13 Allée des Tulipiers, 77120 Coulommiers, France
      </p>
      <p>
        Nous nous efforçons de répondre à toutes les demandes dans les plus brefs délais.
      </p>
      {/* Vous pourriez ajouter un formulaire de contact ici plus tard */}
    </div>
  );
};

export default ContactPage;
