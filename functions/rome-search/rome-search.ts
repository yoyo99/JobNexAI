import { Handler } from '@netlify/functions';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse';

interface RomeJob {
  code: string;
  label: string;
}

const handler: Handler = async (event) => {
  const searchQuery = event.queryStringParameters?.q?.toLowerCase() || '';
  const limit = parseInt(event.queryStringParameters?.limit || '10', 10);

  if (!searchQuery) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Le paramètre de recherche "q" est manquant.' }),
    };
  }

  const results: RomeJob[] = [];
  const filePath = path.resolve(__dirname, './rome_appellations.csv');

  const parser = fs.createReadStream(filePath).pipe(parse({ delimiter: ';' }));

  try {
    for await (const record of parser) {
      const [code, label] = record;
      // Vérifier si le label existe et est une chaîne de caractères non vide
      if (typeof label === 'string' && label.toLowerCase().includes(searchQuery)) {
        // Vérifier si le code a le format typique (ex: A1101)
        if (typeof code === 'string' && /^[A-Z]\d{4}$/.test(code)) {
          results.push({ code, label });
          if (results.length >= limit) {
            break; // Arrêter la lecture si la limite est atteinte
          }
        }
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(results),
    };
  } catch (error: any) {
    console.error('Erreur lors du traitement du fichier CSV:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erreur interne du serveur.', details: error.message }),
    };
  }
};

export { handler };
