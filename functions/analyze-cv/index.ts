import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY')
})

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { cv, jobDescription } = await req.json()

    // Analyze CV with GPT-4
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an expert CV analyst and career coach. Analyze the CV and provide detailed feedback.
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
          - suggestions (array of objects with section, priority, and suggestion)`
        },
        {
          role: 'user',
          content: `CV: ${JSON.stringify(cv)}
          ${jobDescription ? `Job Description: ${jobDescription}` : ''}`
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    })

    const analysis: AnalysisResult = JSON.parse(completion.choices[0].message.content)

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

    return new Response(
      JSON.stringify(analysis),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error analyzing CV:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})