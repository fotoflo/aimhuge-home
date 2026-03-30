CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS "godMode" BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
DO $$ BEGIN
  CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Trigger function to automatically create profile on sign up or insert
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, "godMode")
  VALUES (
    NEW.id,
    NEW.email,
    NEW.email = 'fotoflo@gmail.com'
  )
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, "godMode" = EXCLUDED."godMode";
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger event
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Provide RPC for safely incrementing login count cleanly via client JS without updating directly
CREATE OR REPLACE FUNCTION public.increment_login_count()
RETURNS VOID AS $$
BEGIN
  IF auth.uid() IS NOT NULL THEN
    UPDATE public.profiles
    SET login_count = COALESCE(login_count, 0) + 1
    WHERE id = auth.uid();
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Backfill any existing users into the profiles table and update their columns
INSERT INTO public.profiles (id, email, "godMode")
SELECT id, email, email = 'fotoflo@gmail.com'
FROM auth.users
ON CONFLICT (id) DO UPDATE 
SET email = EXCLUDED.email, "godMode" = EXCLUDED."godMode";
