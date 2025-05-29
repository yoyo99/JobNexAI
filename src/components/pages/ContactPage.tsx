import React, { useState } from 'react';
import SiteHeader from '../SiteHeader';
import { supabase } from '../../supabaseClient'; // Adjust path if supabaseClient is located elsewhere

const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitError(null);
    setIsSubmitted(false); // Reset submission status at the beginning of a new attempt

    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: { name, email, subject, message },
      });

      if (error) {
        console.error('Error invoking Supabase function:', error);
        throw new Error(error.message || 'Failed to invoke Supabase function.');
      }

      if (data && data.error) { // Check for error returned from the function itself
        console.error('Error from Supabase function execution:', data.error);
        throw new Error(data.error || 'An error occurred in the email sending process.');
      }
      
      console.log('Supabase function invoked successfully, response:', data);

      setIsSubmitted(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');

      // Reset isSubmitted after a delay so the success message is visible
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);

    } catch (error) {
      console.error('Failed to send email:', error);
      setSubmitError('Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer plus tard.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SiteHeader />
      <div className="max-w-2xl mx-auto p-6 md:p-10 bg-gray-800 text-gray-200 rounded-lg shadow-xl my-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-primary-400">Contactez-nous</h1>

        {isSubmitted ? (
          <div className="text-center p-4 bg-green-700 text-white rounded-md">
            <p className="font-semibold">Merci !</p>
            <p>Votre message a été envoyé avec succès. Nous vous répondrons bientôt.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {submitError && (
              <div className="p-3 bg-red-200 text-red-800 border border-red-400 rounded-md">
                <p>{submitError}</p>
              </div>
            )}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Nom complet
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm text-white"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Adresse e-mail
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm text-white"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">
                Sujet
              </label>
              <input
                type="text"
                name="subject"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm text-white"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm text-white"
              ></textarea>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-primary-500 transition duration-150 ease-in-out"
              >
                {isLoading ? 'Envoi en cours...' : 'Envoyer le message'}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default ContactPage;
