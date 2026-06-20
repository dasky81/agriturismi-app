-- =============================================================
-- agriturismi.app — Analytics
-- Migration: 006_analytics.sql
-- =============================================================

-- Visite pagine
CREATE TABLE IF NOT EXISTS public.visite (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pagina text NOT NULL,
  agriturismo_id uuid REFERENCES agriturismi(id) ON DELETE CASCADE,
  utente_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  sessione_id text,
  referrer text,
  user_agent text,
  paese text,
  citta text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.visite ENABLE ROW LEVEL SECURITY;

-- Chiunque può inserire (tracking)
CREATE POLICY "Insert visite pubblico" ON public.visite
  FOR INSERT WITH CHECK (true);

-- Solo admin legge tutto
CREATE POLICY "Admin legge visite" ON public.visite
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND ruolo = 'admin')
  );

-- Proprietario vede visite del proprio agriturismo
CREATE POLICY "Proprietario vede visite struttura" ON public.visite
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.agriturismi a
      WHERE a.id = visite.agriturismo_id
      AND a.proprietario_id = auth.uid()
    )
  );

-- Vista aggregata visite per giorno
CREATE OR REPLACE VIEW public.visite_per_giorno AS
SELECT
  DATE(created_at) as giorno,
  COUNT(*) as totale,
  COUNT(DISTINCT sessione_id) as sessioni_uniche,
  COUNT(DISTINCT utente_id) as utenti_registrati
FROM public.visite
GROUP BY DATE(created_at)
ORDER BY giorno DESC;

-- Vista top pagine
CREATE OR REPLACE VIEW public.top_pagine AS
SELECT
  pagina,
  COUNT(*) as visite,
  COUNT(DISTINCT sessione_id) as sessioni_uniche
FROM public.visite
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY pagina
ORDER BY visite DESC
LIMIT 20;
