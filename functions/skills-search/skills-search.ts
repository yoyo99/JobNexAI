import { Handler } from '@netlify/functions';
import { parse } from 'csv-parse/sync';
import * as fs from 'fs';
import * as path from 'path';

const handler: Handler = async (event, context) => {
  if (!event.queryStringParameters || !event.queryStringParameters.q) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Query parameter "q" is required.' }),
    };
  }

  const query = event.queryStringParameters.q.toLowerCase();
  const csvFilePath = path.resolve(__dirname, '../../data/unix_arborescence_competences_v459_utf8.csv');

  try {
    const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });

    const filteredRecords = records
      .filter((record: any) => 
        record.libelle_competence && record.libelle_competence.toLowerCase().includes(query)
      )
      .slice(0, 20); // Limit to 20 results

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filteredRecords),
    };
  } catch (error) {
    console.error('Error processing skills search:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process skills data.' }),
    };
  }
};

export { handler };
