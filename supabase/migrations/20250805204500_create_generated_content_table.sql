CREATE TABLE generated_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    task_id TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, completed, failed
    content TEXT,
    error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE generated_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own generated content" ON generated_content
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own generated content" ON generated_content
    FOR INSERT WITH CHECK (auth.uid() = user_id);
