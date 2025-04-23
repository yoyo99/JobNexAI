# Test info

- Name: Flux abonnement Stripe opérationnel
- Location: /Volumes/Seagate1TO/WindSurf/JobNexus-WindSurf/tests/stripe-subscription-flow.spec.ts:4:1

# Error details

```
Error: page.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[name="fullName"]')

    at /Volumes/Seagate1TO/WindSurf/JobNexus-WindSurf/tests/stripe-subscription-flow.spec.ts:12:14
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
   8 |   // Générer un email unique pour chaque test
   9 |   const email = `stripe-test-${Date.now()}@mail.com`;
  10 |
  11 |   // Remplir le formulaire d'inscription
> 12 |   await page.fill('input[name="fullName"]', 'Test Stripe');
     |              ^ Error: page.fill: Test timeout of 30000ms exceeded.
  13 |   await page.fill('input[name="email"]', email);
  14 |   await page.fill('input[name="password"]', 'Test1234!');
  15 |   await page.check('input[name="acceptTerms"]');
  16 |   await page.click('button[type="submit"]');
  17 |
  18 |   // Attendre la redirection vers la page de tarifs
  19 |   await page.waitForURL('**/pricing', { timeout: 10000 });
  20 |
  21 |   // Cliquer sur le bouton d’abonnement (adapter le selector si besoin)
  22 |   await page.click('button[data-plan="pro"]');
  23 |
  24 |   // Attendre la redirection vers Stripe Checkout
  25 |   await page.waitForURL(/checkout.stripe.com/, { timeout: 10000 });
  26 |
  27 |   // Remplir le formulaire Stripe (numéro test officiel)
  28 |   await page.fill('input[name="email"]', email);
  29 |   await page.fill('input[name="cardnumber"]', '4242 4242 4242 4242');
  30 |   await page.fill('input[name="exp-date"]', '12/34');
  31 |   await page.fill('input[name="cvc"]', '123');
  32 |   await page.fill('input[name="postal"]', '75001');
  33 |   await page.click('button[type="submit"]');
  34 |
  35 |   // Attendre la redirection retour app
  36 |   await page.waitForURL('**/dashboard', { timeout: 20000 });
  37 |
  38 |   // Vérifier le statut d’abonnement (ex : badge, message, etc.)
  39 |   // Adapter le sélecteur selon l'UI réelle
  40 |   const status = await page.locator('.subscription-status').innerText();
  41 |   expect(status).toMatch(/actif|active|pro/i);
  42 | });
  43 |
```