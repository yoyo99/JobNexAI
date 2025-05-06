#!/usr/bin/env python3
import json
import os
import shutil

# Définition des chemins
LOCALES_DIR = "public/locales"
LANGUAGES = ["en", "fr", "de", "es", "it"]

# Fonction pour charger un fichier JSON
def load_json(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"Erreur lors du chargement de {file_path}: {e}")
        return {}

# Fonction pour sauvegarder un fichier JSON
def save_json(file_path, data):
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

# Corrections suggérées à partir de la vérification
suggested_fixes = {
    "fr": {
        # Corrections des traductions suspects
        "auth.email": "E-mail", # Plus conforme au français
        "auth.invalidCredentials": "E-mail ou mot de passe invalide",
        "auth.checkYourEmail": "Vérifiez votre e-mail pour valider votre compte",
        "auth.resendEmail": "Renvoyer l'e-mail de vérification",
        "auth.verificationSent": "Un e-mail de vérification a été envoyé", # Article indéfini plus naturel
        "auth.accountCreated": "Compte créé avec succès ! Veuillez vérifier votre e-mail.",
        "auth.accountNotVerified": "Votre compte n'est pas vérifié. Veuillez vérifier votre e-mail.",
        "auth.invalidEmail": "Veuillez saisir une adresse e-mail valide",
        "common.save": "Enregistrer", # Plus court que "Sauvegarder"
        "forms.email": "Adresse e-mail",
        # Autres corrections pour le français
        "forms.invalidEmail": "Veuillez saisir une adresse e-mail valide"
    },
    "de": {
        # Conservation de termes anglais communs
        "navigation.dashboard": "Dashboard", # Terme couramment utilisé en allemand aussi
        "auth.checkYourEmail": "Überprüfen Sie Ihre E-Mail, um Ihr Konto zu bestätigen",
        "auth.resendEmail": "Bestätigungs-E-Mail erneut senden",
        "auth.verificationSent": "Bestätigungs-E-Mail wurde gesendet",
        "auth.accountCreated": "Konto erfolgreich erstellt! Bitte überprüfen Sie Ihre E-Mail.",
        "auth.invalidCredentials": "Ungültige E-Mail oder Passwort",
        "auth.accountNotVerified": "Ihr Konto ist nicht verifiziert. Bitte überprüfen Sie Ihre E-Mail.",
        "auth.invalidEmail": "Bitte geben Sie eine gültige E-Mail-Adresse ein",
        # Rendre plus concis
        "forms.fieldRequired": "Pflichtfeld"
    },
    "es": {
        "auth.checkYourEmail": "Revise su correo electrónico para verificar su cuenta",
        "auth.resendEmail": "Reenviar correo de verificación",
        "auth.verificationSent": "El correo de verificación ha sido enviado",
        "auth.accountCreated": "¡Cuenta creada con éxito! Por favor, revise su correo electrónico.",
        "auth.invalidCredentials": "Correo electrónico o contraseña inválidos",
        "auth.accountNotVerified": "Su cuenta no está verificada. Por favor, revise su correo electrónico.",
        "auth.invalidEmail": "Por favor, introduzca una dirección de correo electrónico válida",
        # Rendre plus concis
        "search.noResults": "Sin resultados"
    },
    "it": {
        "auth.verificationSent": "Email di verifica inviata",
        "auth.invalidCredentials": "Email o password non validi",
        "auth.accountNotVerified": "Il tuo account non è verificato. Controlla la tua email.",
        "auth.invalidEmail": "Inserisci un indirizzo email valido",
        # Forme inclusive
        "dashboard.welcome": "Bentornato/a"
    }
}

def apply_fixes():
    print("Application des corrections suggérées aux fichiers de traduction...")
    
    for lang, fixes in suggested_fixes.items():
        file_path = f"{LOCALES_DIR}/{lang}/common.json"
        data = load_json(file_path)
        changes_made = 0
        
        for path, new_value in fixes.items():
            # Découper le chemin en parties
            parts = path.split('.')
            
            # Naviguer à travers le dictionnaire
            current = data
            found = True
            
            for i, part in enumerate(parts):
                if i == len(parts) - 1:  # Dernier élément du chemin
                    if part in current:
                        old_value = current[part]
                        if old_value != new_value:
                            current[part] = new_value
                            changes_made += 1
                            print(f"  - {lang}.{path}: \"{old_value}\" -> \"{new_value}\"")
                else:
                    if part not in current:
                        found = False
                        break
                    current = current[part]
        
        if changes_made > 0:
            # Faire une sauvegarde avant de modifier
            backup_path = f"{LOCALES_DIR}/backup/{lang}/common.json.fix"
            os.makedirs(os.path.dirname(backup_path), exist_ok=True)
            shutil.copy2(file_path, backup_path)
            
            # Sauvegarder les modifications
            save_json(file_path, data)
            print(f"\nFichier {file_path} mis à jour avec {changes_made} corrections.")
        else:
            print(f"\nAucune correction appliquée pour {lang}.")

def main():
    print("Correction des problèmes de traduction identifiés\n")
    apply_fixes()
    print("\nCorrections terminées.")

if __name__ == "__main__":
    main()
