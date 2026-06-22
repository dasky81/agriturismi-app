-- Tabella centralizzata di tutti i luoghi del network
CREATE TABLE IF NOT EXISTS public.network_luoghi (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  slug text NOT NULL,
  tipo text NOT NULL CHECK (tipo IN (
    'agriturismo', 'cantina', 'ristorante',
    'noleggio', 'campeggio', 'glamping',
    'hotel', 'beb', 'attrazione'
  )),
  dominio_fonte text NOT NULL CHECK (dominio_fonte IN (
    'agriturismi.app', 'cantine.app', 'ristoranti.app',
    'noleggio.app', 'green.camp', 'soggiorni.app',
    'crociera.app', 'viaggi.app'
  )),
  url_scheda text NOT NULL,
  regione text,
  provincia text,
  comune text,
  indirizzo text,
  lat float,
  lng float,
  descrizione text,
  foto_principale text,
  servizi text[] DEFAULT '{}',
  attivo boolean DEFAULT true,
  verificato boolean DEFAULT false,
  record_originale_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(dominio_fonte, slug)
);

ALTER TABLE public.network_luoghi ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tutti leggono luoghi attivi" ON public.network_luoghi
  FOR SELECT USING (attivo = true);

CREATE POLICY "Admin gestisce tutto" ON public.network_luoghi
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND ruolo = 'admin')
  );

CREATE INDEX IF NOT EXISTS idx_network_luoghi_tipo ON network_luoghi(tipo);
CREATE INDEX IF NOT EXISTS idx_network_luoghi_regione ON network_luoghi(regione);
CREATE INDEX IF NOT EXISTS idx_network_luoghi_geo ON network_luoghi(lat, lng);
CREATE INDEX IF NOT EXISTS idx_network_luoghi_dominio ON network_luoghi(dominio_fonte);

-- Funzione distanza Haversine per ricerca geografica
CREATE OR REPLACE FUNCTION network_luoghi_vicini(
  lat_utente float,
  lng_utente float,
  raggio_km float DEFAULT 50,
  tipo_filtro text DEFAULT NULL
)
RETURNS TABLE (
  id uuid, nome text, tipo text, dominio_fonte text,
  url_scheda text, comune text, regione text,
  lat float, lng float, descrizione text,
  foto_principale text, servizi text[],
  verificato boolean, distanza_km float
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    l.id, l.nome, l.tipo, l.dominio_fonte,
    l.url_scheda, l.comune, l.regione,
    l.lat, l.lng, l.descrizione,
    l.foto_principale, l.servizi,
    l.verificato,
    (6371 * acos(
      GREATEST(-1.0, LEAST(1.0,
        cos(radians(lat_utente)) * cos(radians(l.lat)) *
        cos(radians(l.lng) - radians(lng_utente)) +
        sin(radians(lat_utente)) * sin(radians(l.lat))
      ))
    ))::float AS distanza_km
  FROM network_luoghi l
  WHERE l.attivo = true
    AND l.lat IS NOT NULL
    AND l.lng IS NOT NULL
    AND (tipo_filtro IS NULL OR l.tipo = tipo_filtro)
  HAVING (6371 * acos(
    GREATEST(-1.0, LEAST(1.0,
      cos(radians(lat_utente)) * cos(radians(l.lat)) *
      cos(radians(l.lng) - radians(lng_utente)) +
      sin(radians(lat_utente)) * sin(radians(l.lat))
    ))
  )) <= raggio_km
  ORDER BY distanza_km ASC;
END;
$$ LANGUAGE plpgsql;

-- Vista aggregata per statistiche network
CREATE OR REPLACE VIEW public.network_statistiche AS
SELECT
  dominio_fonte,
  tipo,
  COUNT(*) as totale,
  COUNT(*) FILTER (WHERE verificato = true) as verificati,
  COUNT(*) FILTER (WHERE attivo = true) as attivi
FROM network_luoghi
GROUP BY dominio_fonte, tipo
ORDER BY dominio_fonte, tipo;

-- Tabella itinerari generati dall'AI
CREATE TABLE IF NOT EXISTS public.itinerari (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  utente_id uuid REFERENCES profiles(id),
  destinazione text NOT NULL,
  giorni int NOT NULL,
  tipo_viaggiatore text,
  interessi text[],
  contenuto jsonb NOT NULL,
  strutture_network_usate int DEFAULT 0,
  condivisibile boolean DEFAULT true,
  share_token text UNIQUE DEFAULT encode(gen_random_bytes(6), 'hex'),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.itinerari ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tutti leggono itinerari condivisibili" ON public.itinerari
  FOR SELECT USING (condivisibile = true OR auth.uid() = utente_id);

CREATE POLICY "Utenti creano itinerari" ON public.itinerari
  FOR INSERT WITH CHECK (true);
