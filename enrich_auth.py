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

# Structure des traductions pour la section "auth"
auth_translations = {
    "en": {
        "auth": {
            "login": "Login",
            "signup": "Sign Up",
            "logout": "Logout",
            "forgotPassword": "Forgot Password?",
            "resetPassword": "Reset Password",
            "email": "Email",
            "password": "Password",
            "confirmPassword": "Confirm Password",
            "rememberMe": "Remember Me",
            "or": "Or",
            "continueWith": "Continue with",
            "google": "Google",
            "linkedin": "LinkedIn",
            "createAccount": "Create Account",
            "alreadyHaveAccount": "Already have an account?",
            "dontHaveAccount": "Don't have an account?",
            "passwordRequirements": "Password must be at least 8 characters",
            "emailVerification": "Email Verification",
            "checkYourEmail": "Check your email to verify your account",
            "resendEmail": "Resend verification email",
            "verificationSent": "Verification email has been sent",
            "passwordChanged": "Your password has been changed successfully",
            "accountCreated": "Account created successfully! Please check your email.",
            "invalidCredentials": "Invalid email or password",
            "accountLocked": "Your account has been locked. Please contact support.",
            "accountNotVerified": "Your account is not verified. Please check your email.",
            "requiredField": "This field is required",
            "invalidEmail": "Please enter a valid email address",
            "passwordsDoNotMatch": "Passwords do not match",
            "agreeToTerms": "I agree to the Terms of Service and Privacy Policy",
            "termsRequired": "You must agree to the Terms of Service and Privacy Policy",
            "passwordTooWeak": "Password is too weak",
            "passwordStrength": "Password strength",
            "weak": "Weak",
            "medium": "Medium",
            "strong": "Strong"
        }
    },
    "fr": {
        "auth": {
            "login": "Connexion",
            "signup": "S'inscrire",
            "logout": "Déconnexion",
            "forgotPassword": "Mot de passe oublié ?",
            "resetPassword": "Réinitialiser le mot de passe",
            "email": "Email",
            "password": "Mot de passe",
            "confirmPassword": "Confirmer le mot de passe",
            "rememberMe": "Se souvenir de moi",
            "or": "Ou",
            "continueWith": "Continuer avec",
            "google": "Google",
            "linkedin": "LinkedIn",
            "createAccount": "Créer un compte",
            "alreadyHaveAccount": "Vous avez déjà un compte ?",
            "dontHaveAccount": "Vous n'avez pas de compte ?",
            "passwordRequirements": "Le mot de passe doit contenir au moins 8 caractères",
            "emailVerification": "Vérification de l'email",
            "checkYourEmail": "Vérifiez votre email pour valider votre compte",
            "resendEmail": "Renvoyer l'email de vérification",
            "verificationSent": "L'email de vérification a été envoyé",
            "passwordChanged": "Votre mot de passe a été modifié avec succès",
            "accountCreated": "Compte créé avec succès ! Veuillez vérifier votre email.",
            "invalidCredentials": "Email ou mot de passe invalide",
            "accountLocked": "Votre compte a été verrouillé. Veuillez contacter le support.",
            "accountNotVerified": "Votre compte n'est pas vérifié. Veuillez vérifier votre email.",
            "requiredField": "Ce champ est obligatoire",
            "invalidEmail": "Veuillez saisir une adresse email valide",
            "passwordsDoNotMatch": "Les mots de passe ne correspondent pas",
            "agreeToTerms": "J'accepte les Conditions d'utilisation et la Politique de confidentialité",
            "termsRequired": "Vous devez accepter les Conditions d'utilisation et la Politique de confidentialité",
            "passwordTooWeak": "Le mot de passe est trop faible",
            "passwordStrength": "Force du mot de passe",
            "weak": "Faible",
            "medium": "Moyen",
            "strong": "Fort"
        }
    },
    "de": {
        "auth": {
            "login": "Anmelden",
            "signup": "Registrieren",
            "logout": "Abmelden",
            "forgotPassword": "Passwort vergessen?",
            "resetPassword": "Passwort zurücksetzen",
            "email": "E-Mail",
            "password": "Passwort",
            "confirmPassword": "Passwort bestätigen",
            "rememberMe": "Angemeldet bleiben",
            "or": "Oder",
            "continueWith": "Fortfahren mit",
            "google": "Google",
            "linkedin": "LinkedIn",
            "createAccount": "Konto erstellen",
            "alreadyHaveAccount": "Haben Sie bereits ein Konto?",
            "dontHaveAccount": "Haben Sie kein Konto?",
            "passwordRequirements": "Das Passwort muss mindestens 8 Zeichen enthalten",
            "emailVerification": "E-Mail-Bestätigung",
            "checkYourEmail": "Überprüfen Sie Ihre E-Mail, um Ihr Konto zu bestätigen",
            "resendEmail": "Bestätigungsmail erneut senden",
            "verificationSent": "Bestätigungsmail wurde gesendet",
            "passwordChanged": "Ihr Passwort wurde erfolgreich geändert",
            "accountCreated": "Konto erfolgreich erstellt! Bitte überprüfen Sie Ihre E-Mail.",
            "invalidCredentials": "Ungültige E-Mail oder Passwort",
            "accountLocked": "Ihr Konto wurde gesperrt. Bitte kontaktieren Sie den Support.",
            "accountNotVerified": "Ihr Konto ist nicht verifiziert. Bitte überprüfen Sie Ihre E-Mail.",
            "requiredField": "Dieses Feld ist erforderlich",
            "invalidEmail": "Bitte geben Sie eine gültige E-Mail-Adresse ein",
            "passwordsDoNotMatch": "Passwörter stimmen nicht überein",
            "agreeToTerms": "Ich stimme den Nutzungsbedingungen und der Datenschutzrichtlinie zu",
            "termsRequired": "Sie müssen den Nutzungsbedingungen und der Datenschutzrichtlinie zustimmen",
            "passwordTooWeak": "Passwort ist zu schwach",
            "passwordStrength": "Passwortstärke",
            "weak": "Schwach",
            "medium": "Mittel",
            "strong": "Stark"
        }
    },
    "es": {
        "auth": {
            "login": "Iniciar sesión",
            "signup": "Registrarse",
            "logout": "Cerrar sesión",
            "forgotPassword": "¿Olvidó su contraseña?",
            "resetPassword": "Restablecer contraseña",
            "email": "Correo electrónico",
            "password": "Contraseña",
            "confirmPassword": "Confirmar contraseña",
            "rememberMe": "Recordarme",
            "or": "O",
            "continueWith": "Continuar con",
            "google": "Google",
            "linkedin": "LinkedIn",
            "createAccount": "Crear cuenta",
            "alreadyHaveAccount": "¿Ya tiene una cuenta?",
            "dontHaveAccount": "¿No tiene una cuenta?",
            "passwordRequirements": "La contraseña debe tener al menos 8 caracteres",
            "emailVerification": "Verificación de correo electrónico",
            "checkYourEmail": "Revise su correo electrónico para verificar su cuenta",
            "resendEmail": "Reenviar correo de verificación",
            "verificationSent": "El correo de verificación ha sido enviado",
            "passwordChanged": "Su contraseña ha sido cambiada con éxito",
            "accountCreated": "¡Cuenta creada con éxito! Por favor, revise su correo electrónico.",
            "invalidCredentials": "Correo electrónico o contraseña inválidos",
            "accountLocked": "Su cuenta ha sido bloqueada. Por favor, contacte con soporte.",
            "accountNotVerified": "Su cuenta no está verificada. Por favor, revise su correo electrónico.",
            "requiredField": "Este campo es obligatorio",
            "invalidEmail": "Por favor, introduzca una dirección de correo electrónico válida",
            "passwordsDoNotMatch": "Las contraseñas no coinciden",
            "agreeToTerms": "Acepto los Términos de servicio y la Política de privacidad",
            "termsRequired": "Debe aceptar los Términos de servicio y la Política de privacidad",
            "passwordTooWeak": "La contraseña es demasiado débil",
            "passwordStrength": "Fortaleza de la contraseña",
            "weak": "Débil",
            "medium": "Media",
            "strong": "Fuerte"
        }
    },
    "it": {
        "auth": {
            "login": "Accedi",
            "signup": "Registrati",
            "logout": "Esci",
            "forgotPassword": "Password dimenticata?",
            "resetPassword": "Reimposta password",
            "email": "Email",
            "password": "Password",
            "confirmPassword": "Conferma password",
            "rememberMe": "Ricordami",
            "or": "O",
            "continueWith": "Continua con",
            "google": "Google",
            "linkedin": "LinkedIn",
            "createAccount": "Crea account",
            "alreadyHaveAccount": "Hai già un account?",
            "dontHaveAccount": "Non hai un account?",
            "passwordRequirements": "La password deve contenere almeno 8 caratteri",
            "emailVerification": "Verifica email",
            "checkYourEmail": "Controlla la tua email per verificare il tuo account",
            "resendEmail": "Reinvia email di verifica",
            "verificationSent": "Email di verifica inviata",
            "passwordChanged": "La tua password è stata modificata con successo",
            "accountCreated": "Account creato con successo! Controlla la tua email.",
            "invalidCredentials": "Email o password non validi",
            "accountLocked": "Il tuo account è stato bloccato. Contatta l'assistenza.",
            "accountNotVerified": "Il tuo account non è verificato. Controlla la tua email.",
            "requiredField": "Questo campo è obbligatorio",
            "invalidEmail": "Inserisci un indirizzo email valido",
            "passwordsDoNotMatch": "Le password non corrispondono",
            "agreeToTerms": "Accetto i Termini di servizio e l'Informativa sulla privacy",
            "termsRequired": "Devi accettare i Termini di servizio e l'Informativa sulla privacy",
            "passwordTooWeak": "La password è troppo debole",
            "passwordStrength": "Robustezza della password",
            "weak": "Debole",
            "medium": "Media",
            "strong": "Forte"
        }
    }
}

# Créer une sauvegarde des fichiers existants
print("Création d'une sauvegarde des fichiers existants...")
for lang in auth_translations.keys():
    src_file = f"public/locales/{lang}/common.json"
    backup_dir = "public/locales/backup"
    backup_lang_dir = f"{backup_dir}/{lang}"
    os.makedirs(backup_lang_dir, exist_ok=True)
    backup_file = f"{backup_lang_dir}/common.json"
    
    try:
        # Vérifier si le fichier source existe
        if os.path.exists(src_file):
            shutil.copy2(src_file, backup_file)
            print(f"Sauvegarde créée: {backup_file}")
    except Exception as e:
        print(f"Erreur lors de la sauvegarde de {src_file}: {e}")

# Enrichir les fichiers existants
print("\nEnrichissement des fichiers de traduction pour la section 'auth'...")
for lang, content in auth_translations.items():
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

print("\nEnrichissement terminé pour la section 'auth'.")
