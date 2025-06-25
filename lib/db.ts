import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

// Vérifier que la variable d'environnement est définie
const connectionString = process.env.NEON_DATABASE_URL;
if (!connectionString) {
  throw new Error('NEON_DATABASE_URL n\'est pas défini dans les variables d\'environnement');
}

// Créer une connexion SQL
const sql = neon(connectionString);

// Exporter l'instance Drizzle
export const db = drizzle(sql);

// Fonction d'utilitaire pour exécuter des requêtes SQL brutes
export async function executeRawQuery(query: string, params: any[] = []) {
  try {
    return await sql(query, params);
  } catch (error) {
    console.error('Erreur lors de l\'exécution de la requête SQL :', error);
    throw error;
  }
}
