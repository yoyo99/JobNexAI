const nodemailer = require('nodemailer');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Méthode non autorisée' };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch (err) {
    return { statusCode: 400, body: 'Format JSON invalide' };
  }

  const { to, subject, text, html } = data;

  // Vérification basique des champs obligatoires
  if (!to || !subject || (!text && !html)) {
    return { statusCode: 400, body: 'Champs requis manquants' };
  }

  // Transport SMTP Brevo
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
    secure: false, // true pour 465, false pour 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      text,
      html,
    });
    return { statusCode: 200, body: 'Email envoyé avec succès !' };
  } catch (error) {
    return { statusCode: 500, body: 'Erreur SMTP : ' + error.message };
  }
};
