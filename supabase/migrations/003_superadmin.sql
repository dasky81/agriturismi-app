-- Set admin role for the owner account
UPDATE profiles
SET ruolo = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'davide.sarrecchia@gmail.com');

-- Extra profile fields for proprietari (nullable)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS telefono text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS nome_struttura text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS comune_struttura text;
