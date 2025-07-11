import React, { useState } from 'react';

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setError(null);
    try {
      const res = await fetch('/.netlify/functions/sendMail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'contact@jobnexai.com', // Change to your destination email
          subject: `Contact JobNexAI: ${form.name}`,
          text: `Message de ${form.name} <${form.email}> :\n\n${form.message}`,
        }),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', message: '' });
      } else {
        const err = await res.text();
        setStatus('error');
        setError(err);
      }
    } catch (err: any) {
      setStatus('error');
      setError(err.message || 'Erreur inconnue');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-background rounded-lg shadow-md space-y-4">
      <h2 className="text-2xl font-bold mb-4">Contactez-nous</h2>
      <div>
        <label htmlFor="name" className="block font-semibold mb-1">Nom</label>
        <input
          type="text"
          name="name"
          id="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full p-2 rounded border border-gray-300 text-black"
        />
      </div>
      <div>
        <label htmlFor="email" className="block font-semibold mb-1">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full p-2 rounded border border-gray-300 text-black"
        />
      </div>
      <div>
        <label htmlFor="message" className="block font-semibold mb-1">Message</label>
        <textarea
          name="message"
          id="message"
          value={form.message}
          onChange={handleChange}
          required
          rows={5}
          className="w-full p-2 rounded border border-gray-300 text-black"
        />
      </div>
      <button
        type="submit"
        className="bg-primary-400 text-white px-4 py-2 rounded hover:bg-primary-500 disabled:opacity-50"
        disabled={status === 'sending'}
      >
        {status === 'sending' ? 'Envoi en cours…' : 'Envoyer'}
      </button>
      {status === 'success' && <p className="text-green-600 font-semibold">Message envoyé avec succès !</p>}
      {status === 'error' && <p className="text-red-600 font-semibold">Erreur : {error}</p>}
    </form>
  );
}
