#!/usr/bin/env python3
import json
import os
import glob
import re

def fix_json_file(filepath):
    print(f"Traitement de {filepath}")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Sauvegarde
    with open(filepath + '.bak', 'w', encoding='utf-8') as f:
        f.write(content)
    
    # Trouve la première accolade ouvrante et la dernière fermante
    first_brace = content.find('{')
    
    if first_brace == -1:
        print(f"  ERREUR: Pas d'accolade ouvrante dans {filepath}")
        return False
    
    # Reconstruit un JSON valide en partant de zéro
    try:
        # Essai de parsing pour voir si c'est déjà valide
        json.loads(content)
        print(f"  OK: {filepath} est déjà valide")
        return True
    except json.JSONDecodeError as e:
        print(f"  ERREUR JSON: {e}")
        
        # Essai de correction des guillemets manquants aux noms de propriétés
        try:
            # Correction 1: propriétés sans guillemets
            fixed_content = re.sub(r'([{,]\s*)([a-zA-Z0-9_\.]+)(\s*:)', r'\1"\2"\3', content)
            
            # Correction 2: virgules en trop
            fixed_content = re.sub(r',(\s*[}\]])', r'\1', fixed_content)
            
            # Correction 3: valeurs sans guillemets qui ne sont pas des nombres ou bool
            fixed_content = re.sub(r':\s*([a-zA-Z][a-zA-Z0-9_\.]*)(\s*[,}])', r': "\1"\2', fixed_content)
            
            # Essai de parsing pour vérifier la validité
            parsed = json.loads(fixed_content)
            
            # Si on arrive ici, le JSON est valide
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(parsed, f, ensure_ascii=False, indent=2)
            print(f"  CORRIGÉ: {filepath}")
            return True
            
        except Exception as e2:
            print(f"  ÉCHEC DE CORRECTION: {e2}")
            
            # Dernière tentative: Utiliser un parsing plus robuste
            try:
                # Utilise le module 'demjson' s'il est disponible
                # pip install demjson3
                import demjson3
                parsed = demjson3.decode(content)
                
                # Si on arrive ici, le parsing a réussi
                with open(filepath, 'w', encoding='utf-8') as f:
                    json.dump(parsed, f, ensure_ascii=False, indent=2)
                print(f"  CORRIGÉ AVEC DEMJSON: {filepath}")
                return True
                
            except ImportError:
                print("  Module demjson3 non disponible, installation nécessaire: pip install demjson3")
                return False
            except Exception as e3:
                print(f"  ÉCHEC FINAL: {e3}")
                
                # Dernière tentative simpliste: prendre la partie entre les accolades
                try:
                    # Trouve l'accolade fermante
                    depth = 0
                    pos = 0
                    for i, char in enumerate(content):
                        if char == '{':
                            depth += 1
                        elif char == '}':
                            depth -= 1
                            if depth == 0:
                                pos = i
                                break
                    
                    if pos > 0:
                        simplified = content[:pos+1]
                        # Ajoute les propriétés manquantes si nécessaire
                        if simplified[-1] != '}':
                            simplified += '}'
                        
                        # Valide à nouveau
                        json.loads(simplified)
                        
                        # Écriture du fichier simplifié
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(simplified)
                        print(f"  CORRIGÉ PAR SIMPLIFICATION: {filepath}")
                        return True
                except Exception as e4:
                    print(f"  ÉCHEC DE SIMPLIFICATION: {e4}")
                    return False

# Parcourir tous les fichiers JSON de langues
count_total = 0
count_fixed = 0
count_failed = 0

for filepath in glob.glob('public/locales/*/*.json'):
    count_total += 1
    if fix_json_file(filepath):
        count_fixed += 1
    else:
        count_failed += 1

print(f"\nRésumé: {count_total} fichiers traités, {count_fixed} corrigés, {count_failed} en échec")
print("Les fichiers originaux ont été sauvegardés avec l'extension .bak")
