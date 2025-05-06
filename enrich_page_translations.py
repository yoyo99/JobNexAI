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

# Structure des traductions pour les pages spécifiques
page_translations = {
    "en": {
        "pages": {
            "home": {
                "title": "Find Your Dream Job with AI",
                "subtitle": "The smartest job search platform powered by artificial intelligence",
                "getStarted": "Get Started",
                "learnMore": "Learn More",
                "featuredJobs": "Featured Jobs",
                "viewAllJobs": "View All Jobs",
                "howItWorks": "How It Works",
                "testimonials": "What Our Users Say",
                "partners": "Trusted by Leading Companies",
                "stats": {
                    "users": "Active Users",
                    "companies": "Partner Companies",
                    "jobs": "Available Jobs",
                    "placements": "Successful Placements"
                },
                "features": {
                    "title": "Why Choose JobNexus",
                    "aiMatching": {
                        "title": "AI-Powered Job Matching",
                        "description": "Our advanced algorithms match your skills and preferences with the perfect job opportunities."
                    },
                    "careerGrowth": {
                        "title": "Career Growth Tools",
                        "description": "Access personalized resources to enhance your skills and advance your career."
                    },
                    "smartApplications": {
                        "title": "Smart Application Tracking",
                        "description": "Keep track of all your applications in one place with real-time status updates."
                    },
                    "marketInsights": {
                        "title": "Market Insights",
                        "description": "Get valuable data on salary trends, in-demand skills, and industry growth."
                    }
                }
            },
            "dashboard": {
                "welcomeMessage": "Welcome back, {{name}}!",
                "quickStats": "Quick Stats",
                "recentActivity": "Recent Activity",
                "upcomingInterviews": "Upcoming Interviews",
                "jobRecommendations": "Recommended for You",
                "completeProfile": "Complete Your Profile",
                "profileCompleteness": "Profile Completeness",
                "newMessages": "New Messages",
                "savedJobs": "Saved Jobs",
                "appliedJobs": "Applied Jobs",
                "viewAllMessages": "View All Messages",
                "viewAllSaved": "View All Saved Jobs",
                "viewAllApplications": "View All Applications",
                "marketInsights": "Market Insights",
                "skills": {
                    "trending": "Trending Skills",
                    "inDemand": "In-Demand Skills",
                    "suggested": "Suggested for You"
                },
                "activity": {
                    "appliedJob": "Applied to {{job}} at {{company}}",
                    "savedJob": "Saved {{job}} at {{company}}",
                    "profileView": "Your profile was viewed by {{company}}",
                    "messageReceived": "Received a message from {{sender}}"
                }
            }
        },
        "landingPage": {
            "hero": {
                "title": "Find Your Dream Job with JobNexus",
                "subtitle": "Discover opportunities that match your skills and career goals",
                "searchPlaceholder": "Search for jobs, skills, or companies",
                "ctaButton": "Start Your Search"
            },
            "features": {
                "title": "Why Choose JobNexus",
                "subtitle": "A smarter way to find your next career opportunity",
                "aiMatching": {
                    "title": "AI-Powered Matching",
                    "description": "Get personalized job recommendations based on your skills and experience"
                },
                "careerTools": {
                    "title": "Career Development Tools",
                    "description": "Access resources to enhance your skills and advance your career"
                },
                "marketInsights": {
                    "title": "Market Insights",
                    "description": "Stay informed about industry trends and salary benchmarks"
                },
                "applicationTracking": {
                    "title": "Smart Application Tracking",
                    "description": "Manage all your applications in one place with real-time updates"
                }
            },
            "howItWorks": {
                "title": "How It Works",
                "step1": {
                    "title": "Create Your Profile",
                    "description": "Build your professional profile and showcase your skills and experience"
                },
                "step2": {
                    "title": "Discover Opportunities",
                    "description": "Explore job listings tailored to your career goals and preferences"
                },
                "step3": {
                    "title": "Apply with Ease",
                    "description": "Submit applications directly through our platform with just a few clicks"
                },
                "step4": {
                    "title": "Track Your Progress",
                    "description": "Monitor your applications and receive updates on your job search journey"
                }
            },
            "testimonials": {
                "title": "Success Stories",
                "subtitle": "Hear from professionals who found their dream job with JobNexus"
            },
            "stats": {
                "title": "JobNexus by the Numbers",
                "users": "Active Users",
                "companies": "Partner Companies",
                "jobs": "Jobs Available",
                "placements": "Successful Placements"
            },
            "cta": {
                "title": "Ready to Take the Next Step in Your Career?",
                "subtitle": "Join thousands of professionals who have found their dream job with JobNexus",
                "button": "Create Your Free Account"
            }
        }
    }
}

# Fonction pour enrichir les fichiers translation.json pour toutes les langues
def enrich_page_translations():
    # Liste des langues à traiter
    languages = ["en", "fr", "de", "es", "it"]
    
    # Traductions pour les autres langues
    # Nous allons garder les clés en anglais, mais ajouter les traductions dans les autres langues
    translations = {}
    
    # Charger les traductions en anglais comme référence
    translations["en"] = page_translations["en"]
    
    # Pour l'instant, les autres langues auront les mêmes clés que l'anglais
    # Dans une application réelle, on utiliserait des traductions professionnelles
    for lang in languages:
        if lang != "en":
            # Charger le fichier translation.json existant
            file_path = f"public/locales/{lang}/translation.json"
            existing_data = load_json(file_path)
            
            # Fusionner avec les traductions en anglais (pour conserver la structure)
            translations[lang] = page_translations["en"]
            
            # Ajouter des adaptations mineures pour les langues autres que l'anglais
            if lang == "fr":
                translations[lang]["pages"]["home"]["title"] = "Trouvez l'emploi de vos rêves avec l'IA"
                translations[lang]["pages"]["home"]["subtitle"] = "La plateforme de recherche d'emploi la plus intelligente, alimentée par l'intelligence artificielle"
                translations[lang]["pages"]["home"]["getStarted"] = "Commencer"
                translations[lang]["pages"]["home"]["learnMore"] = "En savoir plus"
                translations[lang]["pages"]["home"]["featuredJobs"] = "Emplois en vedette"
                translations[lang]["pages"]["home"]["viewAllJobs"] = "Voir tous les emplois"
                translations[lang]["pages"]["home"]["howItWorks"] = "Comment ça marche"
                translations[lang]["pages"]["home"]["testimonials"] = "Ce que disent nos utilisateurs"
                translations[lang]["pages"]["home"]["partners"] = "Entreprises partenaires"
                translations[lang]["landingPage"]["hero"]["title"] = "Trouvez l'emploi de vos rêves avec JobNexus"
                translations[lang]["landingPage"]["hero"]["subtitle"] = "Découvrez des opportunités qui correspondent à vos compétences et objectifs de carrière"
                translations[lang]["landingPage"]["hero"]["searchPlaceholder"] = "Rechercher des emplois, des compétences ou des entreprises"
                translations[lang]["landingPage"]["hero"]["ctaButton"] = "Commencer votre recherche"
                
            # Autres adaptations pour les autres langues pourraient être ajoutées ici
    
    # Sauvegarder les traductions dans les fichiers translation.json
    for lang, content in translations.items():
        file_path = f"public/locales/{lang}/translation.json"
        
        # Créer une sauvegarde du fichier existant
        if os.path.exists(file_path):
            backup_path = f"public/locales/backup/{lang}/translation.json.bak"
            os.makedirs(os.path.dirname(backup_path), exist_ok=True)
            shutil.copy2(file_path, backup_path)
            print(f"Sauvegarde créée: {backup_path}")
        
        # Sauvegarder le fichier enrichi
        save_json(file_path, content)
        print(f"Fichier {file_path} enrichi avec succès")

# Programme principal
def main():
    print("Enrichissement des fichiers translation.json pour les pages spécifiques...")
    enrich_page_translations()
    print("\nEnrichissement terminé.")

if __name__ == "__main__":
    main()
