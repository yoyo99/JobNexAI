import 'dotenv/config';

/**
 * @file This file contains the Supabase function for job matching.
 * It retrieves user skills and job requirements, analyzes the match using OpenAI's GPT-4,
 * and updates the match score in the database.
 */

import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface JobMatchAnalysis {
  score: number;
  matchingSkills: string[];
  missingSkills: string[];
  recommendations: string[];
}

// Define error response interface
interface ErrorResponse {
  error: string;
  code?: number;
}

interface SuccessResponse {
  data: JobMatchAnalysis;
}

interface Input {
  userId: string;
  jobId: string;
}

/**
 * Validates the input data.
 * @param input - The input data containing userId and jobId.
 */
const validateInput = (input: Input): string | null => {
  if (!input.userId || !input.jobId) {
    return 'Missing userId or jobId';
  }
  if (!uuidValidate(input.userId)) {
    return 'Invalid userId';
  }
  if (!uuidValidate(input.jobId)) {
    return 'Invalid jobId';
  }
  return null;
}

interface JobSkill {
  name: string;
  category: string;
  importance: number;
}

/**
 * Authenticates the request by verifying the JWT token.
 * @param req - The request object.
 */
const authenticate = async (req: Request): Promise<string> => {
  // Get the authorization header
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    throw new Error('Unauthorized');
  }

  // Extract the token from the header
  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET as string;
  try {
    jwt.verify(token, secret);
    return token;
  } catch {
    throw new Error('Unauthorized');
  }
};

/**
 * Retrieves user skills from Supabase.
 * @param userId - The ID of the user.
 */
const getUserSkills = async (userId: string) => {
  const { data: userData, error: userError } = await supabase
    .from('user_skills')
    .select(`
      skill:skills (
        name,
        category
      ),
      proficiency_level,
      years_experience
    `)
    .eq('user_id', userId);
  if (userError) {
    throw new Error('Error fetching user data');
  }
  return userData;
};

/**
 * Retrieves job data from Supabase.
 * @param jobId - The ID of the job.
 */
const getJobData = async (jobId: string) => {
  const { data: jobData, error: jobError } = await supabase
    .from('jobs')
    .select(`
      *,
      job_skills (
        skill:skills (
          name,
          category
        ),
        importance
      )
    `)
    .eq('id', jobId)
    .single();
  if (jobError) {
    throw new Error('Error fetching job data');
  }
  return jobData;
};

/**
 * Transforms user skills data.
 * @param userData - The user data.
 */
const transformUserSkills = (userData: any) => {
  return userData.map((skill: any) => ({
    name: skill.skill.name,
    category: skill.skill.category,
    proficiency: skill.proficiency_level,
    experience: skill.years_experience,
  }));
};

/**
 * Transforms job skills data.
 * @param jobData - The job data.
 */
const transformJobSkills = (jobData: any) => {
  return jobData.job_skills.map((skill: any) => ({
    name: skill.skill.name,
    category: skill.skill.category,
    importance: skill.importance,
  }));
};

/**
 * Analyzes the job match using OpenAI's GPT-4.
 * @param jobData - The job data.
 * @param userSkills - The user skills.
 * @param jobSkills - The job skills.
 */
const analyzeJobMatch = async (jobData: any, userSkills: any, jobSkills: any) => {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `Tu es un expert en recrutement chargé d'évaluer la correspondance entre un candidat et un poste.\n          Analyse les compétences du candidat et les exigences du poste pour calculer un score de correspondance et fournir des recommandations.\n          Retourne un objet JSON avec :\n          - score : pourcentage de correspondance (0-100)\n          - matchingSkills : tableau des compétences correspondantes\n          - missingSkills : tableau des compétences manquantes importantes\n          - recommendations : suggestions pour améliorer la correspondance`
        },
        {
          role: 'user',
          content: JSON.stringify({
            jobTitle: jobData.title ?? '',
            jobDescription: jobData.description ?? '',
            jobSkills: jobSkills ?? [],
            userSkills: userSkills ?? []
          })
        }
      ],
      temperature: 0.5,
    });
    // GPT-4 renvoie du texte, on tente de parser
    const content = completion.choices[0].message.content;
    if (!content) throw new Error('OpenAI did not return any content');
    return JSON.parse(content);
  } catch (openaiError) {
    throw new Error('Error with OpenAI');
  }
};

// Express/Node.js handler compatible
// import { Request, Response } from 'express'; // Si besoin, sinon laisse req/res en any

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');
    return res.status(200).send('ok');
  }

  try {
    // Authenticate the request
    await authenticate(req);

    // Get input data
    let { userId, jobId } = req.body || req.query || {};
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'userId is required', code: 400 });
    }
    if (!jobId || typeof jobId !== 'string') {
      return res.status(400).json({ error: 'jobId is required', code: 400 });
    }

    // Validate the input data
    const validationError = validateInput({ userId, jobId });
    if (validationError) {
      console.error('Validation error:', validationError);
      return res.status(400).json({ error: validationError, code: 400 });
    }
    // Force le typage pour TypeScript après validation stricte
    const userIdStr = userId as string;
    const jobIdStr = jobId as string;

    // Récupérer les informations de l'utilisateur
    const userSkills = await getUserSkills(userIdStr);

    // Récupérer les informations du poste
    const jobData = await getJobData(jobIdStr);

    // Préparer les données pour l'analyse
    const transformedUserSkills = transformUserSkills(userSkills);
    const jobSkills = transformJobSkills(jobData);

    // Analyser la correspondance avec GPT-4
    const analysis = await analyzeJobMatch(jobData, userSkills, jobSkills);

    if (!analysis.score || !analysis.matchingSkills || !analysis.missingSkills || !analysis.recommendations) {
      throw new Error('Error during the analyse');
    }

    // Mettre à jour le score de correspondance dans la base de données
    const { error: updateError } = await supabase
      .from('job_matches')
      .upsert({
        user_id: userIdStr,
        job_id: jobIdStr,
        match_score: analysis.score,
        skills_match_percentage: jobSkills.length > 0 ? (analysis.matchingSkills.length / jobSkills.length) * 100 : 0,
        ai_analysis: analysis,
        updated_at: new Date().toISOString(),
      });

    if (updateError) {
      console.error('Supabase updateError:', updateError);
      return res.status(500).json({ error: 'Error updating job match', code: 500 });
    }

    // Return the analysis in the response
    return res.status(200).json({ data: analysis });
  } catch (error) {
    console.error('Error:', error);
    return res.status(400).json({ error: 'An unexpected error occurred', code: 500 });
  }
}