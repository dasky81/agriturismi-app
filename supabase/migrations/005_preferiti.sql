CREATE TABLE IF NOT EXISTS public.preferiti (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  utente_id      uuid        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  agriturismo_id uuid        NOT NULL REFERENCES agriturismi(id) ON DELETE CASCADE,
  created_at     timestamptz DEFAULT now(),
  UNIQUE(utente_id, agriturismo_id)
);

ALTER TABLE public.preferiti ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Utente vede i propri preferiti" ON public.preferiti
  FOR SELECT USING (auth.uid() = utente_id);

CREATE POLICY "Utente aggiunge preferiti" ON public.preferiti
  FOR INSERT WITH CHECK (auth.uid() = utente_id);

CREATE POLICY "Utente rimuove preferiti" ON public.preferiti
  FOR DELETE USING (auth.uid() = utente_id);
