import { sendNotificationEmail } from './emailService';

global.fetch = jest.fn(() =>
  Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve('Email envoyé') })
);

describe('sendNotificationEmail', () => {
  it('envoie un email avec succès', async () => {
    const response = await sendNotificationEmail({
      to: 'test@email.com',
      subject: 'Test',
      text: 'Ceci est un test',
      html: '<b>Ceci est un test</b>'
    });
    expect(response.ok).toBe(true);
  });

  it('gère une erreur d’envoi', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({ ok: false, status: 429, text: () => Promise.resolve('Quota dépassé') })
    );
    const response = await sendNotificationEmail({
      to: 'test@email.com',
      subject: 'Test',
      text: 'Ceci est un test',
      html: '<b>Ceci est un test</b>'
    });
    expect(response.ok).toBe(false);
    expect(await response.text()).toBe('Quota dépassé');
  });
});
