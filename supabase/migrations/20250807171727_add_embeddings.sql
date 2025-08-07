-- Extension pour les vecteurs
CREATE EXTENSION IF NOT EXISTS vector;

-- Table pour stocker les embeddings
CREATE TABLE job_embeddings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id),
  embedding vector(1536), -- dimension Mistral AI 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE user_cv_embeddings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  cv_text TEXT,
  embedding vector(1536),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour similarity search
CREATE INDEX idx_job_embeddings_vector ON job_embeddings 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
