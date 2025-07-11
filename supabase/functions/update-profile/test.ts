import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";
import { validateProfile } from "./index.ts";

Deno.test("Refuse profil sans userType", () => {
  const form = { fiscalCountry: "FR", address: "Paris" };
  const result = validateProfile(form);
  assertEquals(result, "Type utilisateur, pays de résidence fiscale et adresse sont obligatoires.");
});

Deno.test("Refuse profil physique sans legalStatus", () => {
  const form = { userType: "physique", fiscalCountry: "FR", address: "Paris" };
  const result = validateProfile(form);
  assertEquals(result, "Le statut légal est obligatoire pour une personne physique.");
});

Deno.test("Refuse société/freelance sans companyName/siren", () => {
  const form = { userType: "morale", fiscalCountry: "FR", address: "Paris", legalStatus: "SARL" };
  const result = validateProfile(form);
  assertEquals(result, "Raison sociale et SIREN/SIRET sont obligatoires pour une société ou un freelance.");
});

Deno.test("Refuse SIREN/SIRET invalide", () => {
  const form = { userType: "morale", fiscalCountry: "FR", address: "Paris", legalStatus: "SARL", companyName: "Acme", siren: "123" };
  const result = validateProfile(form);
  assertEquals(result, "Le numéro SIREN/SIRET doit comporter 9 à 14 chiffres.");
});

Deno.test("Refuse TVA invalide", () => {
  const form = { userType: "morale", fiscalCountry: "FR", address: "Paris", legalStatus: "SARL", companyName: "Acme", siren: "123456789", tva: "FR" };
  const result = validateProfile(form);
  assertEquals(result, "Le numéro de TVA intracommunautaire semble invalide.");
});

Deno.test("Accepte profil société valide", () => {
  const form = {
    userType: "morale",
    fiscalCountry: "FR",
    address: "Paris",
    companyName: "Acme",
    siren: "123456789",
    legalStatus: "SARL"
  };
  const result = validateProfile(form);
  assertEquals(result, null);
});
