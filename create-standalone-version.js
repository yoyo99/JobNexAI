/**
 * Script de création d'une version autonome du site JobNexAI
 * 
 * Ce script crée une version simplifiée entièrement HTML/CSS/JS qui remplace complètement
 * l'application React existante en cas de problème de chargement.
 */

const fs = require('fs');
const path = require('path');

console.log('===================================================');
console.log('Démarrage de create-standalone-version.js - ' + new Date().toISOString());
console.log('Environnement : Node ' + process.version);
console.log('===================================================');

try {
  console.log('🏗️ Création d\'une version autonome simplifiée du site JobNexAI...');

  // Chemin vers le répertoire de build
  const distDir = path.join(__dirname, 'dist');
  const indexPath = path.join(distDir, 'index.html');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
  console.log(`✅ Répertoire ${distDir} créé`);
}

// Contenu de la page standalone complète
const standaloneHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>JobNexAI - La plateforme de recherche d'emploi innovante</title>
  <meta name="description" content="JobNexAI connecte les demandeurs d'emploi avec les meilleures opportunités grâce à l'intelligence artificielle.">
  <style>
    :root {
      --primary: #3b82f6;
      --primary-dark: #2563eb;
      --secondary: #f3f4f6;
      --secondary-dark: #e5e7eb;
      --text: #1f2937;
      --text-light: #6b7280;
      --white: #ffffff;
      --success: #10b981;
      --warning: #f59e0b;
      --error: #ef4444;
      --border: #d1d5db;
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      color: var(--text);
      line-height: 1.5;
      background-color: #f9fafb;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    
    header {
      background-color: var(--white);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      padding: 1rem 0;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .logo {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--primary);
      text-decoration: none;
    }
    
    .nav-links {
      display: flex;
      gap: 1.5rem;
    }
    
    .nav-links a {
      text-decoration: none;
      color: var(--text);
      font-weight: 500;
      transition: color 0.2s;
    }
    
    .nav-links a:hover {
      color: var(--primary);
    }
    
    .hero {
      padding: 4rem 0;
      text-align: center;
      background-color: var(--white);
      border-bottom: 1px solid var(--border);
    }
    
    .hero h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      color: var(--text);
    }
    
    .hero p {
      font-size: 1.25rem;
      color: var(--text-light);
      margin-bottom: 2rem;
      max-width: 800px;
      margin-left: auto;
      margin-right: auto;
    }
    
    .button {
      display: inline-block;
      background-color: var(--primary);
      color: var(--white);
      padding: 0.75rem 1.5rem;
      border-radius: 0.375rem;
      font-weight: 500;
      text-decoration: none;
      transition: background-color 0.2s;
      border: none;
      cursor: pointer;
    }
    
    .button:hover {
      background-color: var(--primary-dark);
    }
    
    .button.secondary {
      background-color: var(--secondary);
      color: var(--text);
    }
    
    .button.secondary:hover {
      background-color: var(--secondary-dark);
    }
    
    .features {
      padding: 4rem 0;
    }
    
    .section-title {
      text-align: center;
      margin-bottom: 3rem;
    }
    
    .section-title h2 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      color: var(--text);
    }
    
    .section-title p {
      color: var(--text-light);
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }
    
    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }
    
    .feature-card {
      background-color: var(--white);
      border-radius: 0.5rem;
      padding: 2rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .feature-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .feature-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 3rem;
      height: 3rem;
      background-color: var(--primary);
      color: var(--white);
      border-radius: 0.5rem;
      margin-bottom: 1rem;
    }
    
    .feature-card h3 {
      margin-bottom: 0.5rem;
      color: var(--text);
    }
    
    .feature-card p {
      color: var(--text-light);
    }
    
    .cta {
      background-color: var(--primary);
      color: var(--white);
      padding: 4rem 0;
      text-align: center;
    }
    
    .cta h2 {
      font-size: 2rem;
      margin-bottom: 1rem;
    }
    
    .cta p {
      margin-bottom: 2rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }
    
    .cta .button {
      background-color: var(--white);
      color: var(--primary);
    }
    
    .cta .button:hover {
      background-color: var(--secondary);
    }
    
    .how-it-works {
      padding: 4rem 0;
      background-color: var(--secondary);
    }
    
    .steps {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }
    
    .step {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    
    .step-number {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 3rem;
      height: 3rem;
      background-color: var(--primary);
      color: var(--white);
      border-radius: 50%;
      font-weight: 700;
      margin-bottom: 1rem;
    }
    
    .step h3 {
      margin-bottom: 0.5rem;
      color: var(--text);
    }
    
    .step p {
      color: var(--text-light);
    }
    
    .testimonials {
      padding: 4rem 0;
    }
    
    .testimonial-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }
    
    .testimonial-card {
      background-color: var(--white);
      border-radius: 0.5rem;
      padding: 2rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .testimonial-text {
      margin-bottom: 1.5rem;
      font-style: italic;
      color: var(--text);
    }
    
    .testimonial-author {
      display: flex;
      align-items: center;
    }
    
    .testimonial-avatar {
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      background-color: var(--secondary);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 1rem;
      font-weight: 700;
      color: var(--primary);
    }
    
    .testimonial-info h4 {
      margin-bottom: 0.25rem;
      color: var(--text);
    }
    
    .testimonial-info p {
      color: var(--text-light);
      font-size: 0.875rem;
    }
    
    footer {
      background-color: var(--text);
      color: var(--white);
      padding: 4rem 0;
    }
    
    .footer-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
    }
    
    .footer-column h3 {
      margin-bottom: 1rem;
      font-size: 1.125rem;
    }
    
    .footer-links {
      list-style: none;
    }
    
    .footer-links li {
      margin-bottom: 0.5rem;
    }
    
    .footer-links a {
      color: var(--secondary);
      text-decoration: none;
      transition: color 0.2s;
    }
    
    .footer-links a:hover {
      color: var(--white);
    }
    
    .footer-bottom {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      text-align: center;
      color: var(--secondary);
      font-size: 0.875rem;
    }
    
    .language-switcher {
      display: flex;
      gap: 8px;
      margin-top: 1rem;
      justify-content: center;
    }
    
    .language-button {
      background-color: transparent;
      border: 1px solid var(--border);
      border-radius: 4px;
      padding: 4px 8px;
      cursor: pointer;
      color: var(--secondary);
      transition: background-color 0.2s;
    }
    
    .language-button:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    .social-links {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
      justify-content: center;
    }
    
    .social-link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      background-color: rgba(255, 255, 255, 0.1);
      color: var(--white);
      background-color: rgba(255, 255, 255, 0.2);
    }
    
    /* Animations et effets visuels */
    .page-loaded h1,
    .page-loaded .hero p,
    .page-loaded .notice-box,
    .page-loaded .button {
      opacity: 0;
      transform: translateY(20px);
      animation: fadeInUp 0.8s forwards;
    }
    
    .page-loaded h1 { animation-delay: 0.1s; }
    .page-loaded .hero p { animation-delay: 0.3s; }
    .page-loaded .notice-box { animation-delay: 0.5s; }
    .page-loaded .button { animation-delay: 0.7s; }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .loading-dots:after {
      content: '.';
      animation: dots 1.5s steps(5, end) infinite;
    }
    
    @keyframes dots {
      0%, 20% { content: '.'; }
      40% { content: '..'; }
      60% { content: '...'; }
      80%, 100% { content: ''; }
    }
    
    #reload-app {
      transition: all 0.3s ease;
    }
    
    #reload-app:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    
    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 1rem;
      }
      
      .nav-links {
        flex-wrap: wrap;
        justify-content: center;
      }
      
      .hero h1 {
        font-size: 2rem;
      }
      
      .hero p {
        font-size: 1rem;
      }
    }
    
    .notice-box {
      background-color: #fff8e6;
      border-left: 4px solid var(--warning);
      padding: 1rem;
      margin: 2rem 0;
      border-radius: 0.25rem;
    }
    
    .notice-box h3 {
      color: var(--warning);
      margin-bottom: 0.5rem;
    }
  </style>
</head>
<body>
  <header>
    <div class="container">
      <div class="header-content">
        <a href="#" class="logo">JobNexAI</a>
        <nav class="nav-links">
          <a href="#features">Fonctionnalités</a>
          <a href="#how-it-works">Comment ça marche</a>
          <a href="#testimonials">Témoignages</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
    </div>
  </header>
  
  <section class="hero">
    <div class="container">
      <h1>Trouvez votre emploi idéal avec JobNexAI</h1>
      <p>Notre plateforme utilise l'intelligence artificielle pour connecter les demandeurs d'emploi avec les meilleures opportunités correspondant à leurs compétences et aspirations.</p>
      <div class="notice-box">
        <h3>Bienvenue sur JobNexAI !</h3>
        <p>Notre application est en cours de chargement. Si vous voyez cette page, cliquez sur le bouton ci-dessous pour accéder à toutes nos fonctionnalités. Nous travaillons continuellement à améliorer votre expérience.</p>
      </div>
      <a href="/" class="button" id="reload-app">Accéder à l'application complète</a>
      <a href="mailto:contact@jobnexai.fr" class="button secondary">Contactez-nous</a>
    </div>
  </section>
  
  <section class="features" id="features">
    <div class="container">
      <div class="section-title">
        <h2>Fonctionnalités principales</h2>
        <p>Découvrez les outils innovants qui font de JobNexAI la meilleure plateforme pour votre recherche d'emploi.</p>
      </div>
      
      <div class="feature-grid">
        <div class="feature-card">
          <div class="feature-icon">AI</div>
          <h3>Matching intelligent</h3>
          <p>Notre algorithme d'IA analyse votre profil et vos compétences pour vous recommander les offres d'emploi les plus pertinentes.</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">CV</div>
          <h3>Générateur de CV</h3>
          <p>Créez un CV professionnel en quelques minutes grâce à nos modèles optimisés pour retenir l'attention des recruteurs.</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">📊</div>
          <h3>Analyses du marché</h3>
          <p>Accédez à des données actualisées sur les tendances du marché, les salaires et les compétences les plus demandées dans votre secteur.</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">🔍</div>
          <h3>Recherche avancée</h3>
          <p>Filtrez les offres selon de nombreux critères : lieu, salaire, type de contrat, niveau d'expérience et plus encore.</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">🔔</div>
          <h3>Alertes personnalisées</h3>
          <p>Recevez des notifications dès qu'une offre correspondant à vos critères est publiée.</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">💬</div>
          <h3>Coach carrière IA</h3>
          <p>Obtenez des conseils personnalisés pour améliorer votre candidature et préparer vos entretiens.</p>
        </div>
      </div>
    </div>
  </section>
  
  <section class="cta">
    <div class="container">
      <h2>Prêt à booster votre recherche d'emploi ?</h2>
      <p>Rejoignez des milliers de professionnels qui ont trouvé leur emploi idéal grâce à JobNexAI.</p>
      <a href="mailto:contact@jobnexai.fr" class="button">Nous contacter</a>
    </div>
  </section>
  
  <section class="how-it-works" id="how-it-works">
    <div class="container">
      <div class="section-title">
        <h2>Comment ça marche</h2>
        <p>Un processus simple et efficace pour trouver l'emploi qui vous correspond.</p>
      </div>
      
      <div class="steps">
        <div class="step">
          <div class="step-number">1</div>
          <h3>Créez votre profil</h3>
          <p>Renseignez vos compétences, expériences et préférences pour personnaliser votre recherche.</p>
        </div>
        
        <div class="step">
          <div class="step-number">2</div>
          <h3>Explorez les offres</h3>
          <p>Découvrez des opportunités pertinentes recommandées par notre algorithme d'IA.</p>
        </div>
        
        <div class="step">
          <div class="step-number">3</div>
          <h3>Postulez facilement</h3>
          <p>Envoyez vos candidatures en quelques clics et suivez leur progression.</p>
        </div>
        
        <div class="step">
          <div class="step-number">4</div>
          <h3>Décrochez votre emploi</h3>
          <p>Préparez-vous aux entretiens avec notre coach IA et obtenez le poste de vos rêves.</p>
        </div>
      </div>
    </div>
  </section>
  
  <section class="testimonials" id="testimonials">
    <div class="container">
      <div class="section-title">
        <h2>Ce que disent nos utilisateurs</h2>
        <p>Découvrez les expériences positives de ceux qui ont utilisé JobNexAI pour leur recherche d'emploi.</p>
      </div>
      
      <div class="testimonial-grid">
        <div class="testimonial-card">
          <p class="testimonial-text">
            "Grâce à JobNexAI, j'ai trouvé un poste parfaitement adapté à mes compétences en seulement deux semaines. Le processus était incroyablement facile et intuitif."
          </p>
          <div class="testimonial-author">
            <div class="testimonial-avatar">SL</div>
            <div class="testimonial-info">
              <h4>Sophie L.</h4>
              <p>Développeuse Web</p>
            </div>
          </div>
        </div>
        
        <div class="testimonial-card">
          <p class="testimonial-text">
            "Les recommandations d'emploi étaient vraiment pertinentes et le générateur de CV m'a aidé à mettre en valeur mon parcours. Je recommande vivement !"
          </p>
          <div class="testimonial-author">
            <div class="testimonial-avatar">TM</div>
            <div class="testimonial-info">
              <h4>Thomas M.</h4>
              <p>Chef de Projet Marketing</p>
            </div>
          </div>
        </div>
        
        <div class="testimonial-card">
          <p class="testimonial-text">
            "L'analyse du marché m'a permis de mieux comprendre les attentes salariales dans mon secteur et d'ajuster mes prétentions. Un atout majeur lors des négociations !"
          </p>
          <div class="testimonial-author">
            <div class="testimonial-avatar">JD</div>
            <div class="testimonial-info">
              <h4>Julie D.</h4>
              <p>Responsable RH</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  
  <footer id="contact">
    <div class="container">
      <div class="footer-content">
        <div class="footer-column">
          <h3>JobNexAI</h3>
          <p>La plateforme de recherche d'emploi innovante qui utilise l'IA pour connecter les talents avec les meilleures opportunités.</p>
        </div>
        
        <div class="footer-column">
          <h3>Liens utiles</h3>
          <ul class="footer-links">
            <li><a href="#features">Fonctionnalités</a></li>
            <li><a href="#how-it-works">Comment ça marche</a></li>
            <li><a href="#testimonials">Témoignages</a></li>
            <li><a href="#">Tarifs</a></li>
          </ul>
        </div>
        
        <div class="footer-column">
          <h3>Légal</h3>
          <ul class="footer-links">
            <li><a href="#">Conditions d'utilisation</a></li>
            <li><a href="#">Politique de confidentialité</a></li>
            <li><a href="#">Mentions légales</a></li>
            <li><a href="#">Cookies</a></li>
          </ul>
        </div>
        
        <div class="footer-column">
          <h3>Contact</h3>
          <ul class="footer-links">
            <li><a href="mailto:contact@jobnexai.fr">contact@jobnexai.fr</a></li>
            <li><a href="tel:+33123456789">+33 1 23 45 67 89</a></li>
            <li>123 Avenue de l'Innovation</li>
            <li>75001 Paris, France</li>
          </ul>
        </div>
      </div>
      
      <div class="language-switcher">
        <button class="language-button">FR</button>
        <button class="language-button">EN</button>
        <button class="language-button">DE</button>
        <button class="language-button">ES</button>
        <button class="language-button">IT</button>
      </div>
      
      <div class="social-links">
        <a href="#" class="social-link">FB</a>
        <a href="#" class="social-link">TW</a>
        <a href="#" class="social-link">LI</a>
        <a href="#" class="social-link">IG</a>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; 2025 JobNexAI. Tous droits réservés.</p>
      </div>
    </div>
  </footer>
  
  <script>
    // Fonction pour vérifier si l'application principale est disponible
    function checkMainAppAvailability() {
      return fetch('/', {
        method: 'HEAD',
        cache: 'no-cache'
      })
      .then(response => response.ok)
      .catch(() => false);
    }

    // Gestionnaire du bouton de rechargement
    document.getElementById('reload-app').addEventListener('click', (e) => {
      e.preventDefault();
      const button = e.currentTarget;
      
      // Animation simple pour indiquer le chargement
      button.innerHTML = 'Chargement en cours... <span class="loading-dots"></span>';
      button.style.opacity = '0.7';
      button.style.pointerEvents = 'none';
      
      // Timeout court pour montrer l'animation
      setTimeout(() => {
        // Rediriger avec un paramètre de timestamp pour éviter le cache
        window.location.href = '/?reload=' + Date.now();
      }, 800);
    });

    // Script pour la navigation fluide
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          window.scrollTo({
            top: target.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      });
    });
    
    // Script pour simuler un changement de langue
    document.querySelectorAll('.language-button').forEach(button => {
      button.addEventListener('click', function() {
        alert('Fonctionnalité de changement de langue non disponible dans cette version simplifiée.');
      });
    });

    // Ajouter des animations simples au chargement de la page
    document.addEventListener('DOMContentLoaded', () => {
      // Ajouter une classe spéciale pour les animations CSS
      document.body.classList.add('page-loaded');
      
      // Vérifier si l'application principale est disponible toutes les 10 secondes
      const checkInterval = setInterval(() => {
        checkMainAppAvailability().then(available => {
          if (available) {
            const reloadButton = document.getElementById('reload-app');
            reloadButton.textContent = 'Application prête ! Cliquez pour accéder';
            reloadButton.style.backgroundColor = '#10b981'; // Couleur verte
            reloadButton.style.opacity = '1';
            reloadButton.style.pointerEvents = 'auto';
            clearInterval(checkInterval);
          }
        });
      }, 10000);

      // Tentative automatique de vérification et rechargement après 30 secondes
      setTimeout(() => {
        checkMainAppAvailability().then(available => {
          if (available) {
            window.location.href = '/?auto_reload=' + Date.now();
          }
        });
      }, 30000);
    });

    // Ajouter un gestionnaire d'erreurs global pour capturer les problèmes JavaScript
    window.addEventListener('error', (event) => {
      console.error('Erreur JavaScript capturée:', event.error);
      // Vous pourriez envoyer ces erreurs à un service de monitoring
    });
  </script>
</body>
</html>`;

// Écrire le fichier
fs.writeFileSync(indexPath, standaloneHtml);
console.log(`✅ Version autonome créée: ${indexPath}`);

// Créer aussi une page 404.html avec le même contenu pour capturer les erreurs de route
const notFoundPath = path.join(distDir, '404.html');
fs.writeFileSync(notFoundPath, standaloneHtml);
console.log(`✅ Page 404 créée: ${notFoundPath}`);

// Créer un fichier redirect.js qui redirige l'ancien site vers notre version autonome
const redirectJs = `
// Script de redirection vers la version autonome
console.log('⚠️ Redirection vers la version autonome du site');
window.location.href = '/index.html';
`;

const redirectJsPath = path.join(distDir, 'redirect.js');
fs.writeFileSync(redirectJsPath, redirectJs);
console.log(`✅ Script de redirection créé: ${redirectJsPath}`);

console.log('✨ Création de la version autonome terminée avec succès!');
} catch (error) {
  console.error('
❌ ERREUR CRITIQUE dans create-standalone-version.js:', error);
  console.error('Détails de l\'erreur:', error.stack);
  console.error('Tentative de création d\'une page de secours minimale...');
  
  try {
    // Créer une page de secours minimale en cas d'erreur dans le script principal
    const distDir = path.join(__dirname, 'dist');
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }
    
    const indexPath = path.join(distDir, 'index.html');
    const minimalHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>JobNexAI - Site en maintenance</title>
  <style>
    body { font-family: Arial, sans-serif; background-color: #0F172A; color: white; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
    .container { max-width: 600px; text-align: center; padding: 2rem; }
    h1 { background: linear-gradient(to right, #ec4899, #8b5cf6); -webkit-background-clip: text; background-clip: text; color: transparent; }
    .btn { display: inline-block; background: linear-gradient(to right, #db2777, #7c3aed); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; font-weight: bold; margin-top: 1rem; }
  </style>
</head>
<body>
  <div class="container">
    <h1>JobNexAI</h1>
    <h2>Site en maintenance temporaire</h2>
    <p>Nous travaillons actuellement à l'amélioration de JobNexAI. Le site sera de nouveau disponible très prochainement.</p>
    <p>Nous vous prions de nous excuser pour ce désagrément.</p>
    <a href="mailto:contact@jobnexai.com" class="btn">Contactez-nous</a>
  </div>
</body>
</html>`;
    
    fs.writeFileSync(indexPath, minimalHtml);
    console.log(`✅ Page de secours minimale créée: ${indexPath}`);
  } catch (fallbackError) {
    console.error('Impossible de créer la page de secours minimale:', fallbackError);
  }
}
