import json, csv, os
langs = ['en','fr','es','it','de']
base = '/Volumes/Seagate1TO/WindSurf/JobNexus-WindSurf/public/locales'

def flatten(d, prefix=''):
    r = {}
    for k, v in d.items():
        key = f'{prefix}{k}'
        if isinstance(v, dict):
            r.update(flatten(v, key + '.'))
        else:
            r[key] = v
    return r

files = {l: json.load(open(os.path.join(base, l, 'translation.json'))) for l in langs}
flat = {l: flatten(files[l]) for l in langs}
keys = set()
for l in langs:
    keys.update(flat[l].keys())

with open('/Volumes/Seagate1TO/WindSurf/JobNexus-WindSurf/translation_audit.csv', 'w', newline='', encoding='utf-8') as f:
    w = csv.writer(f)
    w.writerow(['key'] + langs)
    for k in sorted(keys):
        w.writerow([k] + [flat[l].get(k, '') for l in langs])
