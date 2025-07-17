import { Handler } from '@netlify/functions';
import { parse } from 'csv-parse/sync';
import * as fs from 'fs';
import * as path from 'path';

// Compétences techniques populaires à ajouter au dataset ROME
const technicalSkills = [
  // Langages de programmation
  { libelle_competence: 'JavaScript', code_competence: 'TECH_JS' },
  { libelle_competence: 'Python', code_competence: 'TECH_PY' },
  { libelle_competence: 'Java', code_competence: 'TECH_JAVA' },
  { libelle_competence: 'TypeScript', code_competence: 'TECH_TS' },
  { libelle_competence: 'PHP', code_competence: 'TECH_PHP' },
  { libelle_competence: 'C#', code_competence: 'TECH_CSHARP' },
  { libelle_competence: 'C++', code_competence: 'TECH_CPP' },
  { libelle_competence: 'Go', code_competence: 'TECH_GO' },
  { libelle_competence: 'Rust', code_competence: 'TECH_RUST' },
  { libelle_competence: 'Swift', code_competence: 'TECH_SWIFT' },
  { libelle_competence: 'Kotlin', code_competence: 'TECH_KOTLIN' },
  
  // Frameworks et bibliothèques
  { libelle_competence: 'React', code_competence: 'TECH_REACT' },
  { libelle_competence: 'Vue.js', code_competence: 'TECH_VUE' },
  { libelle_competence: 'Angular', code_competence: 'TECH_ANGULAR' },
  { libelle_competence: 'Node.js', code_competence: 'TECH_NODE' },
  { libelle_competence: 'Express.js', code_competence: 'TECH_EXPRESS' },
  { libelle_competence: 'Django', code_competence: 'TECH_DJANGO' },
  { libelle_competence: 'Flask', code_competence: 'TECH_FLASK' },
  { libelle_competence: 'Spring Boot', code_competence: 'TECH_SPRING' },
  { libelle_competence: 'Laravel', code_competence: 'TECH_LARAVEL' },
  { libelle_competence: '.NET', code_competence: 'TECH_DOTNET' },
  
  // Technologies web
  { libelle_competence: 'HTML/CSS', code_competence: 'TECH_HTML' },
  { libelle_competence: 'Sass/SCSS', code_competence: 'TECH_SASS' },
  { libelle_competence: 'Tailwind CSS', code_competence: 'TECH_TAILWIND' },
  { libelle_competence: 'Bootstrap', code_competence: 'TECH_BOOTSTRAP' },
  { libelle_competence: 'GraphQL', code_competence: 'TECH_GRAPHQL' },
  { libelle_competence: 'REST API', code_competence: 'TECH_REST' },
  
  // Bases de données
  { libelle_competence: 'SQL', code_competence: 'TECH_SQL' },
  { libelle_competence: 'MySQL', code_competence: 'TECH_MYSQL' },
  { libelle_competence: 'PostgreSQL', code_competence: 'TECH_POSTGRES' },
  { libelle_competence: 'MongoDB', code_competence: 'TECH_MONGO' },
  { libelle_competence: 'Redis', code_competence: 'TECH_REDIS' },
  { libelle_competence: 'Elasticsearch', code_competence: 'TECH_ELASTIC' },
  
  // DevOps et Cloud
  { libelle_competence: 'Docker', code_competence: 'TECH_DOCKER' },
  { libelle_competence: 'Kubernetes', code_competence: 'TECH_K8S' },
  { libelle_competence: 'AWS', code_competence: 'TECH_AWS' },
  { libelle_competence: 'Azure', code_competence: 'TECH_AZURE' },
  { libelle_competence: 'Google Cloud', code_competence: 'TECH_GCP' },
  { libelle_competence: 'Jenkins', code_competence: 'TECH_JENKINS' },
  { libelle_competence: 'GitLab CI/CD', code_competence: 'TECH_GITLAB' },
  { libelle_competence: 'Terraform', code_competence: 'TECH_TERRAFORM' },
  { libelle_competence: 'Ansible', code_competence: 'TECH_ANSIBLE' },
  
  // Outils de développement
  { libelle_competence: 'Git', code_competence: 'TECH_GIT' },
  { libelle_competence: 'GitHub', code_competence: 'TECH_GITHUB' },
  { libelle_competence: 'Jira', code_competence: 'TECH_JIRA' },
  { libelle_competence: 'Confluence', code_competence: 'TECH_CONFLUENCE' },
  { libelle_competence: 'Slack', code_competence: 'TECH_SLACK' },
  
  // Méthodologies Agile
  { libelle_competence: 'Scrum', code_competence: 'METH_SCRUM' },
  { libelle_competence: 'Kanban', code_competence: 'METH_KANBAN' },
  { libelle_competence: 'Agile', code_competence: 'METH_AGILE' },
  { libelle_competence: 'Lean', code_competence: 'METH_LEAN' },
  { libelle_competence: 'SAFe', code_competence: 'METH_SAFE' },
  { libelle_competence: 'Extreme Programming (XP)', code_competence: 'METH_XP' },
  { libelle_competence: 'DevOps', code_competence: 'METH_DEVOPS' },
  
  // Frameworks ITIL et gouvernance
  { libelle_competence: 'ITIL', code_competence: 'FRAM_ITIL' },
  { libelle_competence: 'COBIT', code_competence: 'FRAM_COBIT' },
  { libelle_competence: 'PRINCE2', code_competence: 'FRAM_PRINCE2' },
  { libelle_competence: 'PMP', code_competence: 'FRAM_PMP' },
  { libelle_competence: 'ISO 27001', code_competence: 'FRAM_ISO27001' },
  { libelle_competence: 'GDPR', code_competence: 'FRAM_GDPR' },
  { libelle_competence: 'SOX', code_competence: 'FRAM_SOX' },
  
  // Architecture et design
  { libelle_competence: 'Microservices', code_competence: 'ARCH_MICRO' },
  { libelle_competence: 'Architecture SOA', code_competence: 'ARCH_SOA' },
  { libelle_competence: 'Design Patterns', code_competence: 'ARCH_PATTERNS' },
  { libelle_competence: 'UML', code_competence: 'ARCH_UML' },
  { libelle_competence: 'Domain Driven Design', code_competence: 'ARCH_DDD' },
  
  // Tests et qualité
  { libelle_competence: 'Test Driven Development (TDD)', code_competence: 'TEST_TDD' },
  { libelle_competence: 'Behavior Driven Development (BDD)', code_competence: 'TEST_BDD' },
  { libelle_competence: 'Jest', code_competence: 'TEST_JEST' },
  { libelle_competence: 'Cypress', code_competence: 'TEST_CYPRESS' },
  { libelle_competence: 'Selenium', code_competence: 'TEST_SELENIUM' },
  { libelle_competence: 'SonarQube', code_competence: 'TEST_SONAR' }
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
