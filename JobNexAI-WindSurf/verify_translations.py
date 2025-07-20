#!/usr/bin/env python3
import json
import os
import difflib
import re

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

# 1. Vérifier que toutes les clés existent dans toutes les langues
def check_missing_keys():
    reference = load_json(f"{LOCALES_DIR}/en/common.json")
    missing_keys = {}
    
    for lang in LANGUAGES:
        if lang == "en":
            continue
            
        translation = load_json(f"{LOCALES_DIR}/{lang}/common.json")
        missing = []
        
        def check_nested(ref, trans, path=""):
            for key in ref:
                current_path = f"{path}.{key}" if path else key
                if key not in trans:
                    missing.append(current_path)
                elif isinstance(ref[key], dict) and isinstance(trans[key], dict):
                    check_nested(ref[key], trans[key], current_path)
        
        check_nested(reference, translation)
        
        if missing:
            missing_keys[lang] = missing
    
    return missing_keys

# 2. Vérifier les valeurs qui pourraient être des erreurs de traduction
def check_suspect_translations():
    reference = load_json(f"{LOCALES_DIR}/en/common.json")
    suspect_translations = {}
    
    # Mots qui doivent être identiques dans toutes les langues
    preserved_words = ["email", "LinkedIn", "Google"]
    
    for lang in LANGUAGES:
        if lang == "en":
            continue
            
        translation = load_json(f"{LOCALES_DIR}/{lang}/common.json")
        suspects = []
        
        def check_nested_values(ref, trans, path=""):
            for key in ref:
                if key not in trans:
                    continue
                    
                current_path = f"{path}.{key}" if path else key
                
                if isinstance(ref[key], dict) and isinstance(trans[key], dict):
                    check_nested_values(ref[key], trans[key], current_path)
                elif isinstance(ref[key], str) and isinstance(trans[key], str):
                    # Vérifier les mots qui doivent être identiques
                    for word in preserved_words:
                        if word in ref[key] and word not in trans[key]:
                            suspects.append((current_path, "Mot préservé manquant", ref[key], trans[key]))
                    
                    # Vérifier les valeurs qui pourraient être des placeholders non traduits
                    if ref[key] == trans[key] and not any(word in ref[key] for word in preserved_words) and len(ref[key]) > 3:
                        # Ignorer les valeurs courtes qui pourraient être identiques (ex: "OK")
                        suspects.append((current_path, "Valeur potentiellement non traduite", ref[key], trans[key]))
                    
                    # Vérifier les différences de longueur importantes
                    if len(trans[key]) < len(ref[key]) * 0.5 or len(trans[key]) > len(ref[key]) * 2:
                        suspects.append((current_path, "Différence de longueur importante", ref[key], trans[key]))
        
        check_nested_values(reference, translation)
        
        if suspects:
            suspect_translations[lang] = suspects
    
    return suspect_translations

# 3. Vérifier les problèmes de formatage
def check_formatting_issues():
    reference = load_json(f"{LOCALES_DIR}/en/common.json")
    formatting_issues = {}
    
    # Expressions régulières pour les motifs de formatage
    format_patterns = [
        r'%\w',  # formats style C (%s, %d, etc.)
        r'\{\w+\}', # formats style template (ex: {name})
        r'\$\{\w+\}', # formats style template ES6 (ex: ${name})
        r'#\{\w+\}' # formats style Ruby (ex: #{name})
    ]
    
    for lang in LANGUAGES:
        if lang == "en":
            continue
            
        translation = load_json(f"{LOCALES_DIR}/{lang}/common.json")
        issues = []
        
        def check_nested_formats(ref, trans, path=""):
            for key in ref:
                if key not in trans:
                    continue
                    
                current_path = f"{path}.{key}" if path else key
                
                if isinstance(ref[key], dict) and isinstance(trans[key], dict):
                    check_nested_formats(ref[key], trans[key], current_path)
                elif isinstance(ref[key], str) and isinstance(trans[key], str):
                    # Vérifier chaque motif de formatage
                    for pattern in format_patterns:
                        ref_formats = re.findall(pattern, ref[key])
                        trans_formats = re.findall(pattern, trans[key])
                        
                        if ref_formats != trans_formats:
                            issues.append((current_path, "Motifs de formatage différents", ref[key], trans[key]))
                            break
        
        check_nested_formats(reference, translation)
        
        if issues:
            formatting_issues[lang] = issues
    
    return formatting_issues

# 4. Suggérer des améliorations pour les traductions trop littérales
def suggest_improvements():
    # Suggestions basées sur des erreurs courantes de traduction
    common_errors = {
        "fr": {
            "auth.passwordChanged": (
                "Your password has been changed successfully",
                "Votre mot de passe a été modifié avec succès",
                "Votre mot de passe a été changé avec succès",
                "trop littéral: 'changé' au lieu de 'modifié'"
            ),
            "auth.verificationSent": (
                "Verification email has been sent",
                "L'email de vérification a été envoyé",
                "Un email de vérification a été envoyé",
                "article indéfini plus naturel"
            )
        },
        "de": {
            "forms.fieldRequired": (
                "This field is required",
                "Dieses Feld ist erforderlich",
                "Pflichtfeld",
                "plus concis et idiomatique"
            )
        },
        "es": {
            "search.noResults": (
                "No results found",
                "No se encontraron resultados",
                "Sin resultados",
                "plus concis pour l'interface utilisateur"
            )
        },
        "it": {
            "dashboard.welcome": (
                "Welcome back",
                "Bentornato",
                "Bentornato/a",
                "ajouter une forme inclusive"
            )
        }
    }
    
    improvements = {}
    
    for lang, suggestions in common_errors.items():
        improvements[lang] = []
        translation = load_json(f"{LOCALES_DIR}/{lang}/common.json")
        
        for path, (en_value, current, suggested, reason) in suggestions.items():
            # Obtenir la valeur actuelle dans la traduction
            parts = path.split('.')
            current_dict = translation
            found = True
            
            for part in parts:
                if part not in current_dict:
                    found = False
                    break
                current_dict = current_dict[part]
            
            if found:
                actual_current = current_dict
                if actual_current == current:
                    improvements[lang].append((path, en_value, current, suggested, reason))
    
    return improvements

# Programme principal
def main():
    print("Vérification de la qualité des traductions\n")
    
    # 1. Vérifier les clés manquantes
    print("=== VÉRIFICATION DES CLÉS MANQUANTES ===")
    missing_keys = check_missing_keys()
    if not missing_keys:
        print("Aucune clé manquante trouvée dans les traductions.")
    else:
        for lang, keys in missing_keys.items():
            print(f"\nLangue: {lang}")
            print(f"Nombre de clés manquantes: {len(keys)}")
            for key in keys[:10]:  # Limiter l'affichage pour éviter la surcharge
                print(f"  - {key}")
            if len(keys) > 10:
                print(f"  ... et {len(keys) - 10} autres")
    
    # 2. Vérifier les valeurs suspectes
    print("\n=== VÉRIFICATION DES TRADUCTIONS SUSPECTES ===")
    suspect_translations = check_suspect_translations()
    if not suspect_translations:
        print("Aucune traduction suspecte trouvée.")
    else:
        for lang, suspects in suspect_translations.items():
            print(f"\nLangue: {lang}")
            print(f"Nombre de traductions suspectes: {len(suspects)}")
            for path, issue_type, ref, trans in suspects[:10]:
                print(f"  - {path} ({issue_type}):")
                print(f"    EN: \"{ref}\"")
                print(f"    {lang.upper()}: \"{trans}\"")
            if len(suspects) > 10:
                print(f"  ... et {len(suspects) - 10} autres")
    
    # 3. Vérifier les problèmes de formatage
    print("\n=== VÉRIFICATION DES PROBLÈMES DE FORMATAGE ===")
    formatting_issues = check_formatting_issues()
    if not formatting_issues:
        print("Aucun problème de formatage trouvé.")
    else:
        for lang, issues in formatting_issues.items():
            print(f"\nLangue: {lang}")
            print(f"Nombre de problèmes de formatage: {len(issues)}")
            for path, issue_type, ref, trans in issues[:10]:
                print(f"  - {path} ({issue_type}):")
                print(f"    EN: \"{ref}\"")
                print(f"    {lang.upper()}: \"{trans}\"")
            if len(issues) > 10:
                print(f"  ... et {len(issues) - 10} autres")
    
    # 4. Suggestions d'amélioration
    print("\n=== SUGGESTIONS D'AMÉLIORATION ===")
    improvements = suggest_improvements()
    has_improvements = False
    for lang, suggestions in improvements.items():
        if suggestions:
            has_improvements = True
            print(f"\nLangue: {lang}")
            for path, en_value, current, suggested, reason in suggestions:
                print(f"  - {path}:")
                print(f"    EN: \"{en_value}\"")
                print(f"    Actuel: \"{current}\"")
                print(f"    Suggestion: \"{suggested}\"")
                print(f"    Raison: {reason}")
    
    if not has_improvements:
        print("Pas de suggestions d'amélioration pour le moment.")
    
    print("\nVérification terminée.")

if __name__ == "__main__":
    main()
