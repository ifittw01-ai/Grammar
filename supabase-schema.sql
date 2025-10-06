-- Grammar History Table
-- This table stores the history of grammar checks performed by users

CREATE TABLE IF NOT EXISTS grammar_history (
  id BIGSERIAL PRIMARY KEY,
  sentence TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  corrected_sentence TEXT,
  feedback TEXT NOT NULL,
  suggestions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS idx_grammar_history_created_at 
ON grammar_history (created_at DESC);

-- Optional: Add Row Level Security (RLS) if you want to add user authentication later
-- ALTER TABLE grammar_history ENABLE ROW LEVEL SECURITY;

-- Optional: Create a policy to allow all operations (modify based on your needs)
-- CREATE POLICY "Enable all access for grammar_history" 
-- ON grammar_history FOR ALL 
-- USING (true);

