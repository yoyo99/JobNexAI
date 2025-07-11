declare namespace NodeJS {
  interface ProcessEnv {
    MISTRAL_API_KEY?: string;
    VITE_STRIPE_PUBLIC_KEY?: string;
    // Ajoutez d'autres variables d'environnement ici si nécessaire
  }
}
