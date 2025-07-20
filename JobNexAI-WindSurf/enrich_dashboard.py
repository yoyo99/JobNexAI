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

# Structure des traductions pour la section "dashboard"
dashboard_translations = {
    "en": {
        "dashboard": {
            "welcome": "Welcome back",
            "jobsApplied": "Jobs applied",
            "interviews": "Interviews",
            "savedJobs": "Saved jobs",
            "recentActivity": "Recent activity",
            "upcomingInterviews": "Upcoming interviews",
            "jobRecommendations": "Job recommendations",
            "applicationStatus": "Application status",
            "pending": "Pending",
            "inReview": "In review",
            "interviewed": "Interviewed",
            "offered": "Offered",
            "rejected": "Rejected",
            "applicationStats": "Application statistics",
            "viewAll": "View all",
            "todayTasks": "Today's tasks",
            "completeProfile": "Complete your profile",
            "updateCV": "Update your CV",
            "checkNewJobs": "Check new job offers",
            "prepareInterview": "Prepare for interview",
            "profileCompleteness": "Profile completeness",
            "complete": "Complete",
            "incomplete": "Incomplete",
            "activityFeed": "Activity feed",
            "noActivity": "No recent activity",
            "profileViews": "Profile views",
            "searchAppearances": "Search appearances",
            "topSkills": "Top skills",
            "jobMatchScore": "Job match score",
            "suggestedSkills": "Suggested skills to add",
            "marketInsights": "Market insights",
            "trendingSkills": "Trending skills in your field",
            "industryNews": "Industry news",
            "careerTips": "Career tips",
            "yourNetwork": "Your network",
            "newConnections": "New connections",
            "pendingInvitations": "Pending invitations",
            "peopleYouMayKnow": "People you may know",
            "recentlyApplied": "Recently applied jobs",
            "applicationDeadlines": "Application deadlines"
        }
    },
    "fr": {
        "dashboard": {
            "welcome": "Bienvenue",
            "jobsApplied": "Emplois postulés",
            "interviews": "Entretiens",
            "savedJobs": "Emplois sauvegardés",
            "recentActivity": "Activité récente",
            "upcomingInterviews": "Entretiens à venir",
            "jobRecommendations": "Recommandations d'emploi",
            "applicationStatus": "Statut des candidatures",
            "pending": "En attente",
            "inReview": "En cours d'examen",
            "interviewed": "Entretien passé",
            "offered": "Offre reçue",
            "rejected": "Refusé",
            "applicationStats": "Statistiques de candidature",
            "viewAll": "Voir tout",
            "todayTasks": "Tâches du jour",
            "completeProfile": "Compléter votre profil",
            "updateCV": "Mettre à jour votre CV",
            "checkNewJobs": "Consulter les nouvelles offres",
            "prepareInterview": "Préparer un entretien",
            "profileCompleteness": "Complétude du profil",
            "complete": "Complet",
            "incomplete": "Incomplet",
            "activityFeed": "Fil d'activité",
            "noActivity": "Aucune activité récente",
            "profileViews": "Vues du profil",
            "searchAppearances": "Apparitions dans les recherches",
            "topSkills": "Compétences principales",
            "jobMatchScore": "Score de correspondance d'emploi",
            "suggestedSkills": "Compétences suggérées à ajouter",
            "marketInsights": "Aperçus du marché",
            "trendingSkills": "Compétences tendances dans votre domaine",
            "industryNews": "Actualités du secteur",
            "careerTips": "Conseils de carrière",
            "yourNetwork": "Votre réseau",
            "newConnections": "Nouvelles connexions",
            "pendingInvitations": "Invitations en attente",
            "peopleYouMayKnow": "Personnes que vous pourriez connaître",
            "recentlyApplied": "Emplois récemment postulés",
            "applicationDeadlines": "Date limite de candidature"
        }
    },
    "de": {
        "dashboard": {
            "welcome": "Willkommen zurück",
            "jobsApplied": "Beworbene Jobs",
            "interviews": "Vorstellungsgespräche",
            "savedJobs": "Gespeicherte Jobs",
            "recentActivity": "Neueste Aktivitäten",
            "upcomingInterviews": "Bevorstehende Gespräche",
            "jobRecommendations": "Job-Empfehlungen",
            "applicationStatus": "Bewerbungsstatus",
            "pending": "Ausstehend",
            "inReview": "In Prüfung",
            "interviewed": "Vorstellungsgespräch geführt",
            "offered": "Angebot erhalten",
            "rejected": "Abgelehnt",
            "applicationStats": "Bewerbungsstatistiken",
            "viewAll": "Alle anzeigen",
            "todayTasks": "Heutige Aufgaben",
            "completeProfile": "Profil vervollständigen",
            "updateCV": "Lebenslauf aktualisieren",
            "checkNewJobs": "Neue Jobangebote prüfen",
            "prepareInterview": "Vorstellungsgespräch vorbereiten",
            "profileCompleteness": "Profilvollständigkeit",
            "complete": "Vollständig",
            "incomplete": "Unvollständig",
            "activityFeed": "Aktivitäts-Feed",
            "noActivity": "Keine neuen Aktivitäten",
            "profileViews": "Profilaufrufe",
            "searchAppearances": "Sucherscheinungen",
            "topSkills": "Top-Fähigkeiten",
            "jobMatchScore": "Job-Match-Bewertung",
            "suggestedSkills": "Empfohlene Fähigkeiten",
            "marketInsights": "Markteinblicke",
            "trendingSkills": "Aktuelle Fähigkeiten in Ihrem Bereich",
            "industryNews": "Branchennachrichten",
            "careerTips": "Karrieretipps",
            "yourNetwork": "Ihr Netzwerk",
            "newConnections": "Neue Verbindungen",
            "pendingInvitations": "Ausstehende Einladungen",
            "peopleYouMayKnow": "Personen, die Sie kennen könnten",
            "recentlyApplied": "Kürzlich beworbene Jobs",
            "applicationDeadlines": "Bewerbungsfristen"
        }
    },
    "es": {
        "dashboard": {
            "welcome": "Bienvenido de nuevo",
            "jobsApplied": "Empleos solicitados",
            "interviews": "Entrevistas",
            "savedJobs": "Empleos guardados",
            "recentActivity": "Actividad reciente",
            "upcomingInterviews": "Próximas entrevistas",
            "jobRecommendations": "Recomendaciones de empleo",
            "applicationStatus": "Estado de la solicitud",
            "pending": "Pendiente",
            "inReview": "En revisión",
            "interviewed": "Entrevistado",
            "offered": "Oferta recibida",
            "rejected": "Rechazado",
            "applicationStats": "Estadísticas de solicitud",
            "viewAll": "Ver todo",
            "todayTasks": "Tareas de hoy",
            "completeProfile": "Completar tu perfil",
            "updateCV": "Actualizar tu CV",
            "checkNewJobs": "Consultar nuevas ofertas",
            "prepareInterview": "Preparar entrevista",
            "profileCompleteness": "Grado de compleción del perfil",
            "complete": "Completo",
            "incomplete": "Incompleto",
            "activityFeed": "Feed de actividad",
            "noActivity": "No hay actividad reciente",
            "profileViews": "Visitas al perfil",
            "searchAppearances": "Apariciones en búsquedas",
            "topSkills": "Habilidades destacadas",
            "jobMatchScore": "Puntuación de coincidencia de empleo",
            "suggestedSkills": "Habilidades sugeridas para añadir",
            "marketInsights": "Información del mercado",
            "trendingSkills": "Habilidades en tendencia en tu campo",
            "industryNews": "Noticias del sector",
            "careerTips": "Consejos profesionales",
            "yourNetwork": "Tu red",
            "newConnections": "Nuevas conexiones",
            "pendingInvitations": "Invitaciones pendientes",
            "peopleYouMayKnow": "Personas que quizás conozcas",
            "recentlyApplied": "Empleos solicitados recientemente",
            "applicationDeadlines": "Fechas límite de solicitud"
        }
    },
    "it": {
        "dashboard": {
            "welcome": "Bentornato",
            "jobsApplied": "Lavori candidati",
            "interviews": "Colloqui",
            "savedJobs": "Lavori salvati",
            "recentActivity": "Attività recente",
            "upcomingInterviews": "Prossimi colloqui",
            "jobRecommendations": "Lavori consigliati",
            "applicationStatus": "Stato della candidatura",
            "pending": "In attesa",
            "inReview": "In revisione",
            "interviewed": "Colloquio effettuato",
            "offered": "Offerta ricevuta",
            "rejected": "Rifiutato",
            "applicationStats": "Statistiche candidature",
            "viewAll": "Vedi tutto",
            "todayTasks": "Compiti di oggi",
            "completeProfile": "Completa il tuo profilo",
            "updateCV": "Aggiorna il tuo CV",
            "checkNewJobs": "Controlla nuove offerte",
            "prepareInterview": "Prepara colloquio",
            "profileCompleteness": "Completezza del profilo",
            "complete": "Completo",
            "incomplete": "Incompleto",
            "activityFeed": "Feed attività",
            "noActivity": "Nessuna attività recente",
            "profileViews": "Visualizzazioni profilo",
            "searchAppearances": "Apparizioni nelle ricerche",
            "topSkills": "Competenze principali",
            "jobMatchScore": "Punteggio di corrispondenza lavoro",
            "suggestedSkills": "Competenze suggerite da aggiungere",
            "marketInsights": "Analisi di mercato",
            "trendingSkills": "Competenze di tendenza nel tuo settore",
            "industryNews": "Notizie del settore",
            "careerTips": "Consigli di carriera",
            "yourNetwork": "La tua rete",
            "newConnections": "Nuove connessioni",
            "pendingInvitations": "Inviti in attesa",
            "peopleYouMayKnow": "Persone che potresti conoscere",
            "recentlyApplied": "Lavori a cui ti sei candidato recentemente",
            "applicationDeadlines": "Scadenze candidature"
        }
    }
}

# Enrichir les fichiers existants
print("Enrichissement des fichiers de traduction pour la section 'dashboard'...")
for lang, content in dashboard_translations.items():
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

print("\nEnrichissement terminé pour la section 'dashboard'.")
