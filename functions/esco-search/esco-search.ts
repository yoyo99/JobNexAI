import { Handler } from '@netlify/functions';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse';

interface EscoJob {
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

  const results: EscoJob[] = [];
  const filePath = path.resolve(__dirname, '../../src/data/esco/occupations_en.csv');

  const parser = fs.createReadStream(filePath).pipe(parse({ 
    columns: true,
    trim: true,
    delimiter: ','
  }));

  try {
    for await (const record of parser) {
      const preferredLabel = record.preferredLabel?.toLowerCase() || '';
      const altLabels = record.altLabels?.toLowerCase() || '';

      if (preferredLabel.includes(searchQuery) || altLabels.includes(searchQuery)) {
        results.push({ 
          code: record.conceptUri, 
          label: record.preferredLabel 
        });
        if (results.length >= limit) {
          break;
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
    console.error('Erreur lors du traitement du fichier CSV ESCO:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erreur interne du serveur.', details: error.message }),
    };
  }
};

export { handler };
