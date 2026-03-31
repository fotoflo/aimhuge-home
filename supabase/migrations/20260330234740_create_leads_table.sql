-- Create the leads table for newsletter and contact form submissions
CREATE TABLE IF NOT EXISTS leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    contact_info TEXT NOT NULL,
    source_page TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert new leads
CREATE POLICY "Allow anonymous users to insert leads" 
ON leads FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Only allow authenticated users with certain roles (or simple superuser check) to read/manage leads.
-- For now, letting developers/admins see it:
CREATE POLICY "Allow authenticated full access" 
ON leads FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);
