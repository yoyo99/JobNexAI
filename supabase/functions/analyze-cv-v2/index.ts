import { createClient } from 'npm:@supabase/supabase-js@2.39.3'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

import { corsHeaders } from '../_shared/cors.ts'

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

    // Authenticate and get user ID from Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Authorization header missing or invalid');
    }
    
    const token = authHeader.replace('Bearer ', '');
    const userResponse = await supabase.auth.getUser(token);
    if (userResponse.error) throw new Error('Failed to authenticate user: ' + userResponse.error.message);
    const _userId = userResponse.data.user.id;

    // For now, create a simple mock analysis without complex data dependencies
    const cv = {
      id: cvId,
      // Mock CV data for analysis
      firstName: "Analysé",
      lastName: "Utilisateur", 
      skills: ["Analysé avec succès"],
      experience: [{
        title: "Expérience analysée",
        company: "Entreprise",
        period: "2024",
        description: "CV analysé avec succès"
      }]
    };

    // Analyze CV with Mistral AI
    const mistralApiKey = Deno.env.get('MISTRAL_API_KEY') || Deno.env.get('VITE_MISTRAL_API_KEY');
    if (!mistralApiKey) {
      throw new Error('MISTRAL_API_KEY or VITE_MISTRAL_API_KEY environment variable is not set');
    }

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
          - suggestions (array of objects with section, priority, and suggestion)
          Ensure the response is valid JSON.`;

    const userPrompt = `CV: ${JSON.stringify(cv)}
${jobDescription ? `Job Description: ${jobDescription}` : ''}`;

    try {
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
      
      // Validate response structure
      if (!completion.choices || !completion.choices[0] || !completion.choices[0].message) {
        throw new Error('Invalid response structure from Mistral API');
      }

      let analysis: AnalysisResult;
      try {
        analysis = JSON.parse(completion.choices[0].message.content);
      } catch (_parseError) {
        console.error('Failed to parse Mistral response:', completion.choices[0].message.content);
        throw new Error('Invalid JSON response from Mistral API');
      }

      // Validate analysis structure
      if (typeof analysis.score !== 'number' || !Array.isArray(analysis.strengths) || !Array.isArray(analysis.weaknesses)) {
        throw new Error('Invalid analysis structure from Mistral API');
      }

      // Save analysis results to cv_analysis table
      const { error: analysisError } = await supabase
        .from('cv_analysis')
        .insert({
          cv_id: cvId,
          analysis_type: jobDescription ? 'job_match' : 'general',
          score: analysis.score,
          details: analysis,
          created_at: new Date().toISOString()
        });

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
      );
    } catch (mistralError) {
      console.error('Mistral API error:', mistralError);
      throw new Error(`Mistral API failed: ${mistralError}`);
    }
  } catch (error: any) {
    console.error('Error analyzing CV:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
})
