CREATE TABLE IF NOT EXISTS public.iscritti_newsletter (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  nome text,
  lat float,
  lng float,
  citta text,
  attivo boolean DEFAULT true,
  fonte text DEFAULT 'widget_weekend',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.iscritti_newsletter ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Insert pubblico newsletter" ON public.iscritti_newsletter
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin legge newsletter" ON public.iscritti_newsletter
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND ruolo = 'admin')
  );
