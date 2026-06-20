-- ============================================================
-- agriturismi.app — Tabella preferiti utente
-- Migration: 005_preferiti.sql
-- Eseguire in Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS public.preferiti (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  utente_id      uuid        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  agriturismo_id uuid        NOT NULL REFERENCES agriturismi(id) ON DELETE CASCADE,
  created_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (utente_id, agriturismo_id)
);

ALTER TABLE preferiti ENABLE ROW LEVEL SECURITY;

CREATE POLICY "preferiti: lettura propria"
  ON preferiti FOR SELECT
  USING (auth.uid() = utente_id);

CREATE POLICY "preferiti: inserimento proprio"
  ON preferiti FOR INSERT
  WITH CHECK (auth.uid() = utente_id);

CREATE POLICY "preferiti: eliminazione propria"
  ON preferiti FOR DELETE
  USING (auth.uid() = utente_id);
