CREATE TABLE IF NOT EXISTS public.recensioni (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agriturismo_id uuid NOT NULL REFERENCES agriturismi(id) ON DELETE CASCADE,
  utente_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  voto text NOT NULL CHECK (voto IN ('consiglio', 'non_consiglio')),
  titolo text NOT NULL,
  testo text NOT NULL CHECK (char_length(testo) >= 30),
  risposta_gestore text,
  risposta_at timestamptz,
  moderata boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(agriturismo_id, utente_id)
);

ALTER TABLE public.recensioni ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tutti leggono recensioni moderate" ON public.recensioni
  FOR SELECT USING (moderata = true OR auth.uid() = utente_id);

CREATE POLICY "Utente inserisce propria recensione" ON public.recensioni
  FOR INSERT WITH CHECK (auth.uid() = utente_id);

CREATE POLICY "Utente modifica propria recensione" ON public.recensioni
  FOR UPDATE USING (auth.uid() = utente_id);

CREATE POLICY "Admin gestisce tutte" ON public.recensioni
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND ruolo = 'admin')
  );

ALTER TABLE public.agriturismi
  ADD COLUMN IF NOT EXISTS tot_recensioni int DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tot_consigli int DEFAULT 0;

CREATE OR REPLACE FUNCTION update_recensioni_count()
RETURNS trigger AS $$
BEGIN
  UPDATE agriturismi SET
    tot_recensioni = (SELECT COUNT(*) FROM recensioni
                      WHERE agriturismo_id = COALESCE(NEW.agriturismo_id, OLD.agriturismo_id)
                      AND moderata = true),
    tot_consigli = (SELECT COUNT(*) FROM recensioni
                    WHERE agriturismo_id = COALESCE(NEW.agriturismo_id, OLD.agriturismo_id)
                    AND voto = 'consiglio' AND moderata = true)
  WHERE id = COALESCE(NEW.agriturismo_id, OLD.agriturismo_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_recensioni_count
  AFTER INSERT OR UPDATE OR DELETE ON recensioni
  FOR EACH ROW EXECUTE FUNCTION update_recensioni_count();
