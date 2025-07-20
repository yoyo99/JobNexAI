import jwt from 'jsonwebtoken';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CVSection {
  type: string
  title: string
  content: string
}

interface CV {
  id: string
  sections: CVSection[]
  jobTitle?: string
  industry?: string
}

interface AnalysisResult {
  score: number
  strengths: string[]
  weaknesses: string[]
  suggestions: {
    section: string
    priority: 'high' | 'medium' | 'low'
    suggestion: string
  }[]
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');
  if (req.method === 'OPTIONS') {
    res.status(200).send('ok');
    return;
  }

  try {
    const { cv, jobDescription } = req.body

    // Analyze CV with GPT-4
    const prompt = `You are an expert CV analyst and career coach. Analyze the CV and provide detailed feedback.
          If a job description is provided, analyze the CV's relevance for that position.
          Focus on:
          1. Content completeness and clarity
          2. Professional experience presentation
          3. Skills relevance and presentation
          4. Overall impact and effectiveness
          5. ATS optimization
          Return a JSON object with:
          - score (0-100)
          - strengths (array of strings)
          - weaknesses (array of strings)
          - suggestions (array of objects with section, priority, and suggestion)
          CV: ${JSON.stringify(cv)}
          ${jobDescription ? `Job Description: ${jobDescription}` : ''}`

    const completion = await openai.completions.create({
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: 300,
      temperature: 0.7
    })

    const analysis: AnalysisResult = JSON.parse(completion.choices[0].text ?? '{}')

    // Save analysis results
    const { error: analysisError } = await supabase
      .from('cv_analysis')
      .insert({
        cv_id: cv.id,
        analysis_type: jobDescription ? 'job_match' : 'general',
        score: analysis.score,
        details: analysis,
      })

    if (analysisError) throw analysisError

    // Save improvement suggestions
    const { error: suggestionsError } = await supabase
      .from('cv_improvements')
      .insert(
        analysis.suggestions.map(suggestion => ({
          cv_id: cv.id,
          section: suggestion.section,
          suggestion: suggestion.suggestion,
          priority: suggestion.priority,
        }))
      )

    if (suggestionsError) throw suggestionsError

    res.status(200).json(analysis);
    return;
  } catch (error) {
    console.error('Error analyzing CV:', error)
    res.status(400).json({ error: error.message });
    return;
  }
}