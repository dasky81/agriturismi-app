-- Tabella contatti (messaggi dal form pubblico)
CREATE TABLE IF NOT EXISTS public.contatti (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  email text NOT NULL,
  telefono text,
  messaggio text NOT NULL,
  tipo text CHECK (tipo IN ('info','rivendicazione','partnership','altro')) DEFAULT 'info',
  letto boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.contatti ENABLE ROW LEVEL SECURITY;

-- Chiunque può inviare un messaggio (form pubblico)
CREATE POLICY "chiunque_invia_contatti" ON public.contatti
  FOR INSERT WITH CHECK (true);

-- Solo admin può leggere
CREATE POLICY "admin_legge_contatti" ON public.contatti
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND ruolo = 'admin')
  );

-- Solo admin può aggiornare (es. segnare come letto)
CREATE POLICY "admin_aggiorna_contatti" ON public.contatti
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND ruolo = 'admin')
  );
