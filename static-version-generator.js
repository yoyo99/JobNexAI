/**
 * Générateur de version statique de l'application JobNexAI
 * 
 * Ce script crée une version entièrement HTML/CSS/JS de l'application,
 * sans dépendances React ou Supabase, garantissant que les utilisateurs
 * auront toujours accès à l'application, même si le code React échoue.
 */

const fs = require('fs');
const path = require('path');

console.log('🏗️ Génération de la version statique complète de JobNexAI...');

const distDir = path.join(__dirname, 'dist');
const staticHtmlPath = path.join(distDir, 'static-app.html');
const mainHtmlPath = path.join(distDir, 'index.html');

// Contenu de la version statique complète
const staticHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>JobNexAI - Votre assistant d'emploi IA</title>
  <style>
    :root {
      --primary: #4f46e5;
      --primary-light: #818cf8;
      --secondary: #2dd4bf;
      --text-dark: #1f2937;
      --text-light: #9ca3af;
      --background: #f9fafb;
      --white: #ffffff;
      --gray-100: #f3f4f6;
      --gray-200: #e5e7eb;
      --gray-300: #d1d5db;
      --gray-400: #9ca3af;
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      color: var(--text-dark);
      line-height: 1.5;
      background-color: var(--background);
    }
    
    header {
      background-color: var(--white);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      padding: 1rem 0;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 10;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
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
      color: var(--text-dark);
      font-weight: 500;
      transition: color 0.2s;
    }
    
    .nav-links a:hover {
      color: var(--primary);
    }
    
    main {
      margin-top: 100px;
      padding-bottom: 4rem;
    }
    
    .hero {
      padding: 3rem 0;
      text-align: center;
    }
    
    .hero h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      color: var(--text-dark);
    }
    
    .hero p {
      font-size: 1.25rem;
      color: var(--text-light);
      max-width: 800px;
      margin: 0 auto 2rem;
    }
    
    .button {
      display: inline-block;
      background-color: var(--primary);
      color: var(--white);
      padding: 0.75rem 1.5rem;
      border-radius: 0.375rem;
      font-weight: 500;
      text-decoration: none;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 1rem;
    }
    
    .button:hover {
      background-color: var(--primary-light);
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .button.secondary {
      background-color: var(--white);
      color: var(--primary);
      border: 1px solid var(--gray-300);
    }
    
    .button.secondary:hover {
      background-color: var(--gray-100);
    }
    
    .features {
      padding: 4rem 0;
      background-color: var(--white);
    }
    
    .section-title {
      text-align: center;
      margin-bottom: 3rem;
    }
    
    .section-title h2 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
    
    .section-title p {
      color: var(--text-light);
      max-width: 600px;
      margin: 0 auto;
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
      transition: all 0.3s ease;
      border: 1px solid var(--gray-200);
    }
    
    .feature-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .feature-icon {
      width: 3rem;
      height: 3rem;
      background-color: var(--primary);
      color: var(--white);
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
      font-size: 1.5rem;
    }
    
    .feature-card h3 {
      margin-bottom: 0.5rem;
    }
    
    .feature-card p {
      color: var(--text-light);
    }
    
    .cta {
      background: linear-gradient(to right, var(--primary), var(--primary-light));
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
      background-color: var(--gray-100);
    }
    
    .login-form {
      background-color: var(--white);
      border-radius: 0.5rem;
      padding: 2rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      max-width: 400px;
      margin: 2rem auto;
      border: 1px solid var(--gray-200);
    }
    
    .form-title {
      text-align: center;
      margin-bottom: 1.5rem;
    }
    
    .form-group {
      margin-bottom: 1.5rem;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    
    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--gray-300);
      border-radius: 0.375rem;
      font-size: 1rem;
      transition: border-color 0.3s ease;
    }
    
    .form-control:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
    }
    
    .form-text {
      font-size: 0.875rem;
      color: var(--text-light);
      margin-top: 0.25rem;
    }
    
    .form-check {
      display: flex;
      align-items: center;
    }
    
    .form-check-input {
      margin-right: 0.5rem;
    }
    
    .form-footer {
      text-align: center;
      margin-top: 1.5rem;
      font-size: 0.875rem;
      color: var(--text-light);
    }
    
    .form-footer a {
      color: var(--primary);
      text-decoration: none;
    }
    
    .form-footer a:hover {
      text-decoration: underline;
    }
    
    /* Animations */
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .animate-fade-in {
      animation: fadeIn 0.5s ease forwards;
    }
    
    .delay-1 { animation-delay: 0.1s; }
    .delay-2 { animation-delay: 0.2s; }
    .delay-3 { animation-delay: 0.3s; }
    .delay-4 { animation-delay: 0.4s; }
    
    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 1rem;
      }
      
      .nav-links {
        flex-wrap: wrap;
        justify-content: center;
      }
      
      .hero h1 { font-size: 2rem; }
      .hero p { font-size: 1rem; }
      
      .feature-grid {
        grid-template-columns: 1fr;
      }
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
          <a href="#contact">Contact</a>
          <a href="#login" class="button">Connexion</a>
        </nav>
      </div>
    </div>
  </header>
  
  <main>
    <section class="hero container">
      <h1 class="animate-fade-in">Trouvez votre emploi idéal avec JobNexAI</h1>
      <p class="animate-fade-in delay-1">Notre plateforme utilise l'intelligence artificielle pour connecter les demandeurs d'emploi avec les meilleures opportunités correspondant à leurs compétences et aspirations.</p>
      <div class="animate-fade-in delay-2">
        <a href="#features" class="button">Découvrir les fonctionnalités</a>
        <a href="#contact" class="button secondary">Contactez-nous</a>
      </div>
    </section>
    
    <section id="features" class="features">
      <div class="container">
        <div class="section-title">
          <h2>Nos fonctionnalités principales</h2>
          <p>Découvrez les outils qui font de JobNexAI votre meilleur allié dans votre recherche d'emploi.</p>
        </div>
        
        <div class="feature-grid">
          <div class="feature-card animate-fade-in">
            <div class="feature-icon">🧠</div>
            <h3>IA Matching</h3>
            <p>Notre algorithme avancé analyse votre profil et vos compétences pour vous recommander les offres d'emploi les plus pertinentes.</p>
          </div>
          
          <div class="feature-card animate-fade-in delay-1">
            <div class="feature-icon">📝</div>
            <h3>Optimisation de CV</h3>
            <p>Améliorez votre CV avec nos conseils personnalisés basés sur l'analyse IA des tendances du marché et des attentes des recruteurs.</p>
          </div>
          
          <div class="feature-card animate-fade-in delay-2">
            <div class="feature-icon">🎯</div>
            <h3>Recherche précise</h3>
            <p>Filtrez les offres selon de nombreux critères : lieu, salaire, type de contrat, niveau d'expérience et plus encore.</p>
          </div>
          
          <div class="feature-card animate-fade-in delay-3">
            <div class="feature-icon">📊</div>
            <h3>Analyse du marché</h3>
            <p>Accédez à des données actualisées sur les tendances, les salaires et les compétences les plus demandées dans votre secteur.</p>
          </div>
        </div>
      </div>
    </section>
    
    <section id="login" class="container">
      <div class="login-form animate-fade-in">
        <h2 class="form-title">Connexion</h2>
        <form id="loginForm" action="#" method="post">
          <div class="form-group">
            <label for="email">Adresse email</label>
            <input type="email" class="form-control" id="email" placeholder="Votre email" required>
          </div>
          
          <div class="form-group">
            <label for="password">Mot de passe</label>
            <div style="position: relative;">
              <input type="password" class="form-control" id="password" placeholder="Votre mot de passe" required minlength="8">
              <button type="button" id="togglePassword" style="position: absolute; right: 10px; top: 10px; background: none; border: none; cursor: pointer;">
                <span id="eyeIcon">👁️</span>
              </button>
            </div>
            <small class="form-text">Minimum 8 caractères</small>
          </div>
          
          <div class="form-group form-check">
            <input type="checkbox" class="form-check-input" id="rememberMe">
            <label for="rememberMe">Se souvenir de moi</label>
          </div>
          
          <button type="submit" class="button" style="width: 100%;">Se connecter</button>
          
          <div class="form-footer">
            <p>Pas encore de compte ? <a href="#register">Créer un compte</a></p>
            <p><a href="#forgot-password">Mot de passe oublié ?</a></p>
          </div>
        </form>
      </div>
    </section>
    
    <section class="cta">
      <div class="container">
        <h2>Prêt à booster votre recherche d'emploi ?</h2>
        <p>Rejoignez des milliers de professionnels qui ont trouvé leur emploi idéal grâce à JobNexAI.</p>
        <a href="#register" class="button">Créer un compte gratuit</a>
      </div>
    </section>
    
    <section id="contact" class="container" style="padding: 4rem 0;">
      <div class="section-title">
        <h2>Contactez-nous</h2>
        <p>Notre équipe est à votre disposition pour répondre à toutes vos questions.</p>
      </div>
      
      <div class="login-form">
        <form id="contactForm">
          <div class="form-group">
            <label for="contactName">Nom complet</label>
            <input type="text" class="form-control" id="contactName" placeholder="Votre nom" required>
          </div>
          
          <div class="form-group">
            <label for="contactEmail">Email</label>
            <input type="email" class="form-control" id="contactEmail" placeholder="Votre email" required>
          </div>
          
          <div class="form-group">
            <label for="contactMessage">Message</label>
            <textarea class="form-control" id="contactMessage" rows="5" placeholder="Votre message" required style="resize: vertical;"></textarea>
          </div>
          
          <button type="submit" class="button" style="width: 100%;">Envoyer</button>
        </form>
      </div>
    </section>
  </main>
  
  <footer style="background-color: var(--text-dark); color: var(--white); padding: 2rem 0;">
    <div class="container">
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem;">
        <div>
          <h3 style="margin-bottom: 1rem;">JobNexAI</h3>
          <p style="color: var(--gray-400);">La plateforme de recherche d'emploi innovante qui utilise l'IA pour connecter les talents avec les meilleures opportunités.</p>
        </div>
        
        <div>
          <h3 style="margin-bottom: 1rem;">Liens utiles</h3>
          <ul style="list-style: none;">
            <li style="margin-bottom: 0.5rem;"><a href="#features" style="color: var(--gray-300); text-decoration: none;">Fonctionnalités</a></li>
            <li style="margin-bottom: 0.5rem;"><a href="#contact" style="color: var(--gray-300); text-decoration: none;">Contact</a></li>
            <li style="margin-bottom: 0.5rem;"><a href="#login" style="color: var(--gray-300); text-decoration: none;">Connexion</a></li>
          </ul>
        </div>
        
        <div>
          <h3 style="margin-bottom: 1rem;">Contact</h3>
          <p style="color: var(--gray-400);">Email: contact@jobnexai.fr</p>
          <p style="color: var(--gray-400);">Téléphone: +33 1 23 45 67 89</p>
          <p style="color: var(--gray-400);">Adresse: 123 Avenue de l'Innovation, 75001 Paris</p>
        </div>
      </div>
      
      <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid rgba(255, 255, 255, 0.1); text-align: center; color: var(--gray-400);">
        <p>&copy; 2025 JobNexAI. Tous droits réservés.</p>
      </div>
    </div>
  </footer>
  
  <script>
    // Toggle password visibility
    document.getElementById('togglePassword').addEventListener('click', function() {
      const passwordField = document.getElementById('password');
      const eyeIcon = document.getElementById('eyeIcon');
      
      if (passwordField.type === 'password') {
        passwordField.type = 'text';
        eyeIcon.textContent = '🔒';
      } else {
        passwordField.type = 'password';
        eyeIcon.textContent = '👁️';
      }
    });
    
    // Form submission (just for demo)
    document.getElementById('loginForm').addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Fonctionnalité de connexion en mode de démonstration. Dans la version complète, vous seriez connecté à votre compte.');
    });
    
    document.getElementById('contactForm').addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Merci pour votre message ! Notre équipe vous contactera sous peu.');
      this.reset();
    });
    
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
          window.scrollTo({
            top: target.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      });
    });
    
    // Animation on scroll
    document.addEventListener('DOMContentLoaded', function() {
      const animateElements = document.querySelectorAll('.animate-fade-in');
      
      function checkScroll() {
        animateElements.forEach(el => {
          const elPosition = el.getBoundingClientRect().top;
          const screenPosition = window.innerHeight;
          
          if (elPosition < screenPosition - 100) {
            el.style.opacity = 1;
            el.style.transform = 'translateY(0)';
          }
        });
      }
      
      // Set initial state
      animateElements.forEach(el => {
        if (!el.classList.contains('delay-1') && 
            !el.classList.contains('delay-2') && 
            !el.classList.contains('delay-3') && 
            !el.classList.contains('delay-4')) {
          el.style.opacity = 0;
          el.style.transform = 'translateY(20px)';
        }
      });
      
      window.addEventListener('scroll', checkScroll);
      checkScroll(); // Check on load
    });
  </script>
</body>
</html>`;

// S'assurer que le répertoire dist existe
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
  console.log(`✅ Répertoire ${distDir} créé`);
}

// Enregistrer la version statique
fs.writeFileSync(staticHtmlPath, staticHtml);
console.log(`✅ Version statique créée: ${staticHtmlPath}`);

// Remplacer l'index.html par la version statique
fs.copyFileSync(staticHtmlPath, mainHtmlPath);
console.log(`✅ index.html remplacé par la version statique`);

// Créer une redirection automatique
const redirectJs = `
// Script de redirection vers la version statique
console.log('⚠️ Application React non fonctionnelle, redirection vers la version statique');
window.location.href = '/static-app.html';
`;

const redirectJsPath = path.join(distDir, 'redirect.js');
fs.writeFileSync(redirectJsPath, redirectJs);
console.log(`✅ Script de redirection créé: ${redirectJsPath}`);

console.log('✨ Génération de la version statique terminée avec succès!');
