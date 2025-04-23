# Test info

- Name: Flux abonnement Stripe opérationnel
- Location: /Volumes/Seagate1TO/WindSurf/JobNexus-WindSurf/tests/stripe-subscription-flow.spec.ts:4:1

# Error details

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('button:has-text("Créer un compte")')

    at /Volumes/Seagate1TO/WindSurf/JobNexus-WindSurf/tests/stripe-subscription-flow.spec.ts:9:14
```

# Page snapshot

```yaml
- paragraph: ISO 27001
- paragraph: RGPD compliant
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | // Ce test simule le parcours d'inscription et d'abonnement Stripe (mode test)
   4 | test('Flux abonnement Stripe opérationnel', async ({ page }) => {
   5 |   // Aller sur la page d’inscription
   6 |   await page.goto('https://jobnexus-saas-windsurf.netlify.app/signup');
   7 |
   8 |   // S'assurer que le formulaire d'inscription est visible
>  9 |   await page.click('button:has-text("Créer un compte")');
     |              ^ Error: page.click: Test timeout of 30000ms exceeded.
  10 |
  11 |   // Générer un email unique pour chaque test
  12 |   const email = `stripe-test-${Date.now()}@mail.com`;
  13 |
  14 |   // Remplir le formulaire d'inscription
  15 |   await page.fill('input#full-name', 'Test Stripe');
  16 |   await page.fill('input[name="email"]', email);
  17 |   await page.fill('input[name="password"]', 'Test1234!');
  18 |   await page.check('input[name="acceptTerms"]');
  19 |   await page.click('button[type="submit"]');
  20 |
  21 |   // Attendre la redirection vers la page de tarifs
  22 |   await page.waitForURL('**/pricing', { timeout: 10000 });
  23 |
  24 |   // Cliquer sur le bouton d’abonnement (adapter le selector si besoin)
  25 |   await page.click('button[data-plan="pro"]');
  26 |
  27 |   // Attendre la redirection vers Stripe Checkout
  28 |   await page.waitForURL(/checkout.stripe.com/, { timeout: 10000 });
  29 |
  30 |   // Remplir le formulaire Stripe (numéro test officiel)
  31 |   await page.fill('input[name="email"]', email);
  32 |   await page.fill('input[name="cardnumber"]', '4242 4242 4242 4242');
  33 |   await page.fill('input[name="exp-date"]', '12/34');
  34 |   await page.fill('input[name="cvc"]', '123');
  35 |   await page.fill('input[name="postal"]', '75001');
  36 |   await page.click('button[type="submit"]');
  37 |
  38 |   // Attendre la redirection retour app
  39 |   await page.waitForURL('**/dashboard', { timeout: 20000 });
  40 |
  41 |   // Vérifier le statut d’abonnement (ex : badge, message, etc.)
  42 |   // Adapter le sélecteur selon l'UI réelle
  43 |   const status = await page.locator('.subscription-status').innerText();
  44 |   expect(status).toMatch(/actif|active|pro/i);
  45 | });
  46 |
```