import { Handler } from '@netlify/functions';
import { parse } from 'csv-parse/sync';
import * as fs from 'fs';
import * as path from 'path';

// Compétences techniques populaires à ajouter au dataset ROME
const technicalSkills = [
  { libelle_competence: 'JavaScript', code_competence: 'TECH_JS' },
  { libelle_competence: 'Python', code_competence: 'TECH_PY' },
  { libelle_competence: 'Java', code_competence: 'TECH_JAVA' },
  { libelle_competence: 'React', code_competence: 'TECH_REACT' },
  { libelle_competence: 'Node.js', code_competence: 'TECH_NODE' },
  { libelle_competence: 'TypeScript', code_competence: 'TECH_TS' },
  { libelle_competence: 'HTML/CSS', code_competence: 'TECH_HTML' },
  { libelle_competence: 'SQL', code_competence: 'TECH_SQL' },
  { libelle_competence: 'Docker', code_competence: 'TECH_DOCKER' },
  { libelle_competence: 'Git', code_competence: 'TECH_GIT' },
  { libelle_competence: 'AWS', code_competence: 'TECH_AWS' },
  { libelle_competence: 'Vue.js', code_competence: 'TECH_VUE' },
  { libelle_competence: 'Angular', code_competence: 'TECH_ANGULAR' },
  { libelle_competence: 'PHP', code_competence: 'TECH_PHP' },
  { libelle_competence: 'C#', code_competence: 'TECH_CSHARP' },
  { libelle_competence: 'MongoDB', code_competence: 'TECH_MONGO' },
  { libelle_competence: 'PostgreSQL', code_competence: 'TECH_POSTGRES' },
  { libelle_competence: 'Redis', code_competence: 'TECH_REDIS' },
  { libelle_competence: 'Kubernetes', code_competence: 'TECH_K8S' },
  { libelle_competence: 'GraphQL', code_competence: 'TECH_GRAPHQL' }
];

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

    // Filtrer les compétences ROME
    const romeSkills = records
      .filter((record: any) => 
        record.libelle_competence && record.libelle_competence.toLowerCase().includes(query)
      );

    // Filtrer les compétences techniques
    const techSkills = technicalSkills
      .filter(skill => 
        skill.libelle_competence.toLowerCase().includes(query)
      );

    // Combiner et limiter les résultats
    const allSkills = [...techSkills, ...romeSkills].slice(0, 20); // Limit to 20 results

    // Gestion du cas "aucun résultat"
    if (allSkills.length === 0) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: 'Aucune compétence trouvée pour cette recherche',
          suggestions: ['JavaScript', 'Python', 'Marketing', 'Communication', 'Gestion de projet']
        }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(allSkills),
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
