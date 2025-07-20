#!/usr/bin/env python3
import json
import os
import re
import sys
from collections import defaultdict
import glob

# Chemins des répertoires
LOCALES_DIR = "public/locales"
SRC_DIR = "src"

# Fonction pour charger un fichier JSON
def load_json(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"Erreur lors du chargement de {file_path}: {e}")
        return {}

# Fonction pour extraire toutes les clés de traduction d'un dictionnaire JSON
def extract_translation_keys(json_obj, parent_key=''):
    keys = []
    if isinstance(json_obj, dict):
        for k, v in json_obj.items():
            new_key = f"{parent_key}.{k}" if parent_key else k
            if isinstance(v, dict):
                keys.extend(extract_translation_keys(v, new_key))
            else:
                keys.append(new_key)
    return keys

# Fonction pour trouver les utilisations de traduction dans les fichiers de code
def find_translation_usages(file_path):
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    # Motifs d'utilisation de traduction courants
    patterns = [
        r't\([\'"]([^\'"]+)[\'"]\)',  # t('key')
        r'useTranslation\(\)[^\}]*\.t\([\'"]([^\'"]+)[\'"]\)',  # useTranslation()...t('key')
        r'i18n\.t\([\'"]([^\'"]+)[\'"]\)',  # i18n.t('key')
        r'<Trans[^>]*i18nKey=[\'"]\s*([^\'"]+)\s*[\'"][^>]*>',  # <Trans i18nKey="key">
        r'{t\([\'"]([^\'"]+)[\'"]\)}',  # {t('key')}
        r'[\'"`]t:([^\'"`;]+)[\'"`]',  # 't:key' (interpolation)
        r'useTranslation\(\)[^\}]*\[[\'"]t[\'"]\]\([\'"]([^\'"]+)[\'"]\)'  # useTranslation()..["t"]('key')
    ]
    
    usages = []
    for pattern in patterns:
        matches = re.findall(pattern, content)
        usages.extend(matches)
    
    return usages

# Vérifier les traductions manquantes ou non utilisées
def check_translations():
    print("Vérification de l'intégration des traductions dans le code\n")
    
    # 1. Charger les clés de traduction existantes
    all_translation_keys = {}
    for lang in ["en"]:  # Nous utilisons l'anglais comme référence
        common_file = f"{LOCALES_DIR}/{lang}/common.json"
        translation_file = f"{LOCALES_DIR}/{lang}/translation.json"
        
        common_json = load_json(common_file)
        translation_json = load_json(translation_file)
        
        all_keys = extract_translation_keys(common_json)
        all_keys.extend(extract_translation_keys(translation_json))
        all_translation_keys[lang] = all_keys
    
    # 2. Trouver les utilisations de traduction dans le code
    code_files = []
    for ext in ['.js', '.jsx', '.ts', '.tsx']:
        code_files.extend(glob.glob(f"{SRC_DIR}/**/*{ext}", recursive=True))
    
    all_usages = []
    file_usages = {}
    for file_path in code_files:
        usages = find_translation_usages(file_path)
        if usages:
            all_usages.extend(usages)
            file_usages[file_path] = usages
    
    # 3. Identifier les clés de traduction manquantes et inutilisées
    used_keys = set(all_usages)
    available_keys = set(all_translation_keys["en"])
    
    missing_keys = used_keys - available_keys
    unused_keys = available_keys - used_keys
    
    # 4. Générer le rapport
    print(f"=== RÉSUMÉ ===")
    print(f"Nombre total de clés de traduction disponibles: {len(available_keys)}")
    print(f"Nombre total de clés de traduction utilisées dans le code: {len(used_keys)}")
    print(f"Nombre de clés manquantes (utilisées mais non définies): {len(missing_keys)}")
    print(f"Nombre de clés non utilisées (définies mais non utilisées): {len(unused_keys)}")
    
    if missing_keys:
        print("\n=== CLÉS MANQUANTES ===")
        print("Clés utilisées dans le code mais non définies dans les fichiers de traduction:")
        for key in sorted(missing_keys):
            files = [file for file, keys in file_usages.items() if key in keys]
            print(f"  - {key}")
            for file in files[:3]:  # Limiter à 3 fichiers pour plus de clarté
                print(f"    Utilisé dans: {file}")
            if len(files) > 3:
                print(f"    ... et {len(files) - 3} autres fichiers")
    
    # Limiter l'affichage des clés non utilisées pour éviter un rapport trop verbeux
    if unused_keys:
        unused_count = len(unused_keys)
        print(f"\n=== CLÉS NON UTILISÉES ===")
        print(f"Il y a {unused_count} clés définies dans les fichiers de traduction mais non utilisées dans le code.")
        print("Voici les 20 premières (classées par section):")
        
        # Regrouper par section pour une meilleure lisibilité
        sections = defaultdict(list)
        for key in unused_keys:
            parts = key.split('.')
            if len(parts) > 1:
                sections[parts[0]].append(key)
            else:
                sections['other'].append(key)
        
        shown = 0
        for section, keys in sorted(sections.items()):
            if shown >= 20:
                break
            print(f"\nSection '{section}':")
            for key in sorted(keys)[:5]:  # Limiter à 5 clés par section
                print(f"  - {key}")
                shown += 1
                if shown >= 20:
                    break
            remaining = len(keys) - 5
            if remaining > 0 and shown < 20:
                print(f"  ... et {remaining} autres clés dans cette section")
    
    print("\n=== SECTIONS LES PLUS UTILISÉES ===")
    section_usage = defaultdict(int)
    for key in used_keys:
        parts = key.split('.')
        if len(parts) > 0:
            section_usage[parts[0]] += 1
    
    for section, count in sorted(section_usage.items(), key=lambda x: x[1], reverse=True)[:10]:
        print(f"  - {section}: {count} utilisations")
    
    print("\nVérification terminée.")

# Programme principal
if __name__ == "__main__":
    check_translations()
