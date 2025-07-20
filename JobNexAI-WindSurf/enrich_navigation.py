#!/usr/bin/env python3
import json
import os
import glob
import shutil

# Fonction pour charger un fichier JSON existant
def load_json(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}

# Fonction pour sauvegarder un fichier JSON
def save_json(file_path, data):
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

# Structure des traductions pour la section "navigation"
navigation_translations = {
    "en": {
        "navigation": {
            "dashboard": "Dashboard",
            "jobSearch": "Job Search",
            "applications": "Applications",
            "cvBuilder": "CV Builder",
            "network": "Network",
            "profile": "Profile",
            "settings": "Settings",
            "marketAnalysis": "Market Analysis",
            "notifications": "Notifications",
            "messages": "Messages",
            "help": "Help & Support",
            "premium": "Premium Features",
            "logout": "Log Out",
            "backToHome": "Back to Home",
            "mobileMenu": "Menu",
            "closeMenu": "Close",
            "searchJobs": "Search Jobs",
            "savedJobs": "Saved Jobs",
            "companies": "Companies",
            "events": "Events",
            "learning": "Learning",
            "resources": "Resources",
            "blog": "Blog",
            "career": "Career Advice",
            "interviews": "Interviews",
            "about": "About Us",
            "contact": "Contact",
            "faq": "FAQ",
            "terms": "Terms of Service",
            "privacy": "Privacy Policy",
            "language": "Language",
            "theme": "Theme",
            "accessibility": "Accessibility",
            "subscriptions": "Subscriptions",
            "billing": "Billing",
            "security": "Security"
        }
    },
    "fr": {
        "navigation": {
            "dashboard": "Tableau de bord",
            "jobSearch": "Recherche d'emploi",
            "applications": "Candidatures",
            "cvBuilder": "Créateur de CV",
            "network": "Réseau",
            "profile": "Profil",
            "settings": "Paramètres",
            "marketAnalysis": "Analyse de marché",
            "notifications": "Notifications",
            "messages": "Messages",
            "help": "Aide & Support",
            "premium": "Fonctionnalités Premium",
            "logout": "Déconnexion",
            "backToHome": "Retour à l'accueil",
            "mobileMenu": "Menu",
            "closeMenu": "Fermer",
            "searchJobs": "Rechercher des emplois",
            "savedJobs": "Emplois sauvegardés",
            "companies": "Entreprises",
            "events": "Événements",
            "learning": "Apprentissage",
            "resources": "Ressources",
            "blog": "Blog",
            "career": "Conseils de carrière",
            "interviews": "Entretiens",
            "about": "À propos de nous",
            "contact": "Contact",
            "faq": "FAQ",
            "terms": "Conditions d'utilisation",
            "privacy": "Politique de confidentialité",
            "language": "Langue",
            "theme": "Thème",
            "accessibility": "Accessibilité",
            "subscriptions": "Abonnements",
            "billing": "Facturation",
            "security": "Sécurité"
        }
    },
    "de": {
        "navigation": {
            "dashboard": "Dashboard",
            "jobSearch": "Jobsuche",
            "applications": "Bewerbungen",
            "cvBuilder": "Lebenslauf-Builder",
            "network": "Netzwerk",
            "profile": "Profil",
            "settings": "Einstellungen",
            "marketAnalysis": "Marktanalyse",
            "notifications": "Benachrichtigungen",
            "messages": "Nachrichten",
            "help": "Hilfe & Support",
            "premium": "Premium-Funktionen",
            "logout": "Abmelden",
            "backToHome": "Zurück zur Startseite",
            "mobileMenu": "Menü",
            "closeMenu": "Schließen",
            "searchJobs": "Jobs suchen",
            "savedJobs": "Gespeicherte Jobs",
            "companies": "Unternehmen",
            "events": "Veranstaltungen",
            "learning": "Lernen",
            "resources": "Ressourcen",
            "blog": "Blog",
            "career": "Karriereberatung",
            "interviews": "Vorstellungsgespräche",
            "about": "Über uns",
            "contact": "Kontakt",
            "faq": "FAQ",
            "terms": "Nutzungsbedingungen",
            "privacy": "Datenschutzrichtlinie",
            "language": "Sprache",
            "theme": "Thema",
            "accessibility": "Barrierefreiheit",
            "subscriptions": "Abonnements",
            "billing": "Abrechnung",
            "security": "Sicherheit"
        }
    },
    "es": {
        "navigation": {
            "dashboard": "Panel de control",
            "jobSearch": "Búsqueda de empleo",
            "applications": "Solicitudes",
            "cvBuilder": "Constructor de CV",
            "network": "Red",
            "profile": "Perfil",
            "settings": "Configuración",
            "marketAnalysis": "Análisis de mercado",
            "notifications": "Notificaciones",
            "messages": "Mensajes",
            "help": "Ayuda y Soporte",
            "premium": "Funciones Premium",
            "logout": "Cerrar sesión",
            "backToHome": "Volver al inicio",
            "mobileMenu": "Menú",
            "closeMenu": "Cerrar",
            "searchJobs": "Buscar empleos",
            "savedJobs": "Empleos guardados",
            "companies": "Empresas",
            "events": "Eventos",
            "learning": "Aprendizaje",
            "resources": "Recursos",
            "blog": "Blog",
            "career": "Consejos profesionales",
            "interviews": "Entrevistas",
            "about": "Sobre nosotros",
            "contact": "Contacto",
            "faq": "Preguntas frecuentes",
            "terms": "Términos de servicio",
            "privacy": "Política de privacidad",
            "language": "Idioma",
            "theme": "Tema",
            "accessibility": "Accesibilidad",
            "subscriptions": "Suscripciones",
            "billing": "Facturación",
            "security": "Seguridad"
        }
    },
    "it": {
        "navigation": {
            "dashboard": "Dashboard",
            "jobSearch": "Ricerca di lavoro",
            "applications": "Candidature",
            "cvBuilder": "Creatore di CV",
            "network": "Rete",
            "profile": "Profilo",
            "settings": "Impostazioni",
            "marketAnalysis": "Analisi di mercato",
            "notifications": "Notifiche",
            "messages": "Messaggi",
            "help": "Aiuto e Supporto",
            "premium": "Funzionalità Premium",
            "logout": "Esci",
            "backToHome": "Torna alla home",
            "mobileMenu": "Menu",
            "closeMenu": "Chiudi",
            "searchJobs": "Cerca lavori",
            "savedJobs": "Lavori salvati",
            "companies": "Aziende",
            "events": "Eventi",
            "learning": "Formazione",
            "resources": "Risorse",
            "blog": "Blog",
            "career": "Consigli di carriera",
            "interviews": "Colloqui",
            "about": "Chi siamo",
            "contact": "Contatti",
            "faq": "FAQ",
            "terms": "Termini di servizio",
            "privacy": "Informativa sulla privacy",
            "language": "Lingua",
            "theme": "Tema",
            "accessibility": "Accessibilità",
            "subscriptions": "Abbonamenti",
            "billing": "Fatturazione",
            "security": "Sicurezza"
        }
    }
}

# Enrichir les fichiers existants
print("Enrichissement des fichiers de traduction pour la section 'navigation'...")
for lang, content in navigation_translations.items():
    file_path = f"public/locales/{lang}/common.json"
    existing_data = load_json(file_path)
    
    # Fusion des données (priorité aux nouvelles)
    for section, values in content.items():
        if section not in existing_data:
            existing_data[section] = {}
        existing_data[section].update(values)
    
    # Sauvegarde du fichier enrichi
    save_json(file_path, existing_data)
    print(f"Fichier {file_path} enrichi avec succès")

print("\nEnrichissement terminé pour la section 'navigation'.")
