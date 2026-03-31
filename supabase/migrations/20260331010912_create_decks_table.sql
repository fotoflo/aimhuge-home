-- Define explicit decks table for metadata scaling
CREATE TABLE IF NOT EXISTS decks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deck_slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    target_audience TEXT,
    owner_email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for speedy queries by slug
CREATE INDEX IF NOT EXISTS decks_slug_idx ON decks (deck_slug);
