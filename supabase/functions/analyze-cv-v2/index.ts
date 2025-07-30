import { createClient } from 'npm:@supabase/supabase-js@2.39.3'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

import { corsHeaders } from '../_shared/cors.ts';

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
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { cvId, jobDescription } = await req.json();

    // Authenticate and get user ID once
    const userResponse = await supabase.auth.getUser();
    if (userResponse.error) throw new Error('Failed to authenticate user.');
    const userId = userResponse.data.user.id;

    // Fetch the parsed CV data from cv_analysis table
    const { data: analysisRecord, error: fetchError } = await supabase
      .from('cv_analysis')
      .select('details')
      .eq('cv_id', cvId)
      .eq('analysis_type', 'parsing')
      .single();

    if (fetchError) {
      throw new Error(`Failed to fetch parsed CV data: ${fetchError.message}`);
    }

    if (!analysisRecord || !analysisRecord.details) {
      throw new Error('CV has not been parsed yet or analysis data is missing.');
    }

    const cv = {
      id: cvId,
      ...analysisRecord.details
    };

    // Analyze CV with Mistral AI
    const mistralApiKey = Deno.env.get('MISTRAL_API_KEY');
    const systemPrompt = `You are an expert CV analyst and career coach. Analyze the CV and provide detailed feedback.
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
          - suggestions (array of objects with section, priority, and suggestion)`;

    const userPrompt = `CV: ${JSON.stringify(cv)}
          ${jobDescription ? `Job Description: ${jobDescription}` : ''}`;

    const mistralResponse = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mistralApiKey}`,
      },
      body: JSON.stringify({
        model: 'mistral-large-latest',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      }),
    });

    if (!mistralResponse.ok) {
      const errorBody = await mistralResponse.text();
      throw new Error(`Mistral API error: ${mistralResponse.status} ${errorBody}`);
    }

    const completion = await mistralResponse.json();

    const analysis: AnalysisResult = JSON.parse(completion.choices[0].message.content);

    // Save analysis results to cv_analysis table
    const { error: analysisError } = await supabase
      .from('cv_analysis')
      .insert({
        cv_id: cvId,
        analysis_type: jobDescription ? 'job_match' : 'general',
        score: analysis.score,
        details: analysis,
        created_at: new Date().toISOString()
      })

    if (analysisError) {
      console.error('Analysis insertion error:', analysisError);
      throw new Error(`Failed to save analysis: ${analysisError.message}`);
    }

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
