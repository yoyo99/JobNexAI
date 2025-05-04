import json
import requests
import time

API_KEY = 'AIzaSyDhd303FOVCG2w-0I3IJ-shdx9ffrhOxfE'

def google_translate(text, target_lang):
	if not text or not isinstance(text, str):
		return ''
	url = 'https://translation.googleapis.com/language/translate/v2'
	params = {
		'q': text,
		'target': target_lang,
		'format': 'text',
		'key': API_KEY
	}
	response = requests.post(url, data=params)
	if response.ok:
		return response.json()['data']['translations'][0]['translatedText']
	else:
		print(f"Erreur traduction: {response.text}")
		return text

def translate_json(data, target_lang):
	if isinstance(data, dict):
		return {k: translate_json(v, target_lang) for k, v in data.items()}
	elif isinstance(data, list):
		return [translate_json(item, target_lang) for item in data]
	elif isinstance(data, str):
		if data.strip() == "":
			return ""
		translated = google_translate(data, target_lang)
		time.sleep(0.2)
		return translated
	else:
		return data

with open('public/locales/en/translation.json', 'r', encoding='utf-8') as f:
	en_json = json.load(f)

# Traduction espagnole
es_json = translate_json(en_json, 'es')
with open('public/locales/es/translation.json', 'w', encoding='utf-8') as f:
	json.dump(es_json, f, ensure_ascii=False, indent=2)
print("Fichier espagnol généré.")

# Traduction italienne
it_json = translate_json(en_json, 'it')
with open('public/locales/it/translation.json', 'w', encoding='utf-8') as f:
	json.dump(it_json, f, ensure_ascii=False, indent=2)
print("Fichier italien généré.")