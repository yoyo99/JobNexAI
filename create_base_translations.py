#!/usr/bin/env python3
import json
import os
import glob

# Structure minimale pour chaque langue
base_translations = {
    "en": {
        "navigation": {
            "dashboard": "Dashboard",
            "jobSearch": "Job Search",
            "applications": "Applications",
            "cvBuilder": "CV Builder",
            "network": "Network",
            "profile": "Profile",
            "settings": "Settings",
            "marketAnalysis": "Market Analysis"
        },
        "auth": {
            "login": "Login",
            "signup": "Sign Up",
            "logout": "Logout"
        },
        "common": {
            "save": "Save",
            "cancel": "Cancel",
            "search": "Search",
            "view": "View"
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
            "marketAnalysis": "Analyse de marché"
        },
        "auth": {
            "login": "Connexion",
            "signup": "S'inscrire",
            "logout": "Déconnexion"
        },
        "common": {
            "save": "Sauvegarder",
            "cancel": "Annuler",
            "search": "Rechercher",
            "view": "Voir"
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
            "marketAnalysis": "Marktanalyse"
        },
        "auth": {
            "login": "Anmelden",
            "signup": "Registrieren",
            "logout": "Abmelden"
        },
        "common": {
            "save": "Speichern",
            "cancel": "Abbrechen",
            "search": "Suchen",
            "view": "Ansehen"
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
            "marketAnalysis": "Análisis de mercado"
        },
        "auth": {
            "login": "Iniciar sesión",
            "signup": "Registrarse",
            "logout": "Cerrar sesión"
        },
        "common": {
            "save": "Guardar",
            "cancel": "Cancelar",
            "search": "Buscar",
            "view": "Ver"
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
            "marketAnalysis": "Analisi di mercato"
        },
        "auth": {
            "login": "Accedi",
            "signup": "Registrati",
            "logout": "Esci"
        },
        "common": {
            "save": "Salva",
            "cancel": "Annulla",
            "search": "Cerca",
            "view": "Visualizza"
        }
    }
}

# Créer les fichiers de traduction de base
os.makedirs("public/locales/backup", exist_ok=True)

# Sauvegarder les fichiers existants
for file_path in glob.glob("public/locales/*/*.json"):
    if "backup" not in file_path:
        backup_path = file_path.replace("/locales/", "/locales/backup/")
        os.makedirs(os.path.dirname(backup_path), exist_ok=True)
        try:
            with open(file_path, "r", encoding="utf-8") as src, open(backup_path, "w", encoding="utf-8") as dst:
                dst.write(src.read())
            print(f"Sauvegarde de {file_path} vers {backup_path}")
        except Exception as e:
            print(f"Erreur lors de la sauvegarde de {file_path}: {e}")

# Créer les nouveaux fichiers
for lang, content in base_translations.items():
    # Créer common.json
    os.makedirs(f"public/locales/{lang}", exist_ok=True)
    with open(f"public/locales/{lang}/common.json", "w", encoding="utf-8") as f:
        json.dump(content, f, ensure_ascii=False, indent=2)
    
    # Créer translation.json (minimal)
    with open(f"public/locales/{lang}/translation.json", "w", encoding="utf-8") as f:
        json.dump({}, f, ensure_ascii=False, indent=2)
    
    if lang == "fr":
        # Créer demo.json et privacy.json
        with open(f"public/locales/{lang}/demo.json", "w", encoding="utf-8") as f:
            json.dump({"demo": {"title": "Démo", "description": "Description de démo"}}, f, ensure_ascii=False, indent=2)
        
        with open(f"public/locales/{lang}/privacy.json", "w", encoding="utf-8") as f:
            json.dump({"privacy": {"title": "Politique de confidentialité", 
                                  "consent": "Je consens à...", 
                                  "accept": "Accepter",
                                  "decline": "Refuser"}}, f, ensure_ascii=False, indent=2)

print("Fichiers de traduction de base créés avec succès!")
print("Les fichiers originaux ont été sauvegardés dans public/locales/backup/")
