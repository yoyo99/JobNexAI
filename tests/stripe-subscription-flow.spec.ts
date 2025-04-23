import { test, expect } from '@playwright/test';

// Ce test simule le parcours d'inscription et d'abonnement Stripe (mode test)
test('Flux abonnement Stripe opérationnel', async ({ page }) => {
  // Aller sur la page d’inscription
  await page.goto('https://jobnexus-saas-windsurf.netlify.app/signup');

  // S'assurer que le formulaire d'inscription est visible
  await Promise.any([
    page.locator('button:has-text("Créer un compte")').click({ timeout: 5000 }),
    page.locator('text="Créer un compte"').click({ timeout: 5000 }),
    page.locator('button:has-text("S’inscrire")').click({ timeout: 5000 }),
    page.locator('a:has-text("Créer un compte")').click({ timeout: 5000 }),
  ]).catch(() => {});

  // Générer un email unique pour chaque test
  const email = `stripe-test-${Date.now()}@mail.com`;

  // Attendre et remplir le champ Nom complet (plusieurs variantes)
  let fullNameSelector = null;
  const selectors = [
    'input#full-name',
    'input[name="fullName"]',
    'input[placeholder*="Nom"]',
    'input[type="text"]',
  ];
  for (const sel of selectors) {
    try {
      await page.waitForSelector(sel, { timeout: 4000 });
      fullNameSelector = sel;
      break;
    } catch {}
  }
  if (!fullNameSelector) {
    await page.screenshot({ path: 'signup-form-error.png' });
    throw new Error('Champ "Nom complet" introuvable. Voir signup-form-error.png');
  }
  await page.fill(fullNameSelector, 'Test Stripe');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', 'Test1234!');
  await page.check('input[name="acceptTerms"]');
  await page.click('button[type="submit"]');

  // Attendre la redirection vers la page de tarifs
  await page.waitForURL('**/pricing', { timeout: 10000 });

  // Cliquer sur le bouton d’abonnement (adapter le selector si besoin)
  await page.click('button[data-plan="pro"]');

  // Attendre la redirection vers Stripe Checkout
  await page.waitForURL(/checkout.stripe.com/, { timeout: 10000 });

  // Remplir le formulaire Stripe (numéro test officiel)
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="cardnumber"]', '4242 4242 4242 4242');
  await page.fill('input[name="exp-date"]', '12/34');
  await page.fill('input[name="cvc"]', '123');
  await page.fill('input[name="postal"]', '75001');
  await page.click('button[type="submit"]');

  // Attendre la redirection retour app
  await page.waitForURL('**/dashboard', { timeout: 20000 });

  // Vérifier le statut d’abonnement (ex : badge, message, etc.)
  // Adapter le sélecteur selon l'UI réelle
  const status = await page.locator('.subscription-status').innerText();
  expect(status).toMatch(/actif|active|pro/i);
});
