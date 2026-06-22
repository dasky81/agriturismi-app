-- Trigger che sincronizza agriturismi → network_luoghi
CREATE OR REPLACE FUNCTION sync_agriturismo_to_network()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    DELETE FROM network_luoghi
    WHERE dominio_fonte = 'agriturismi.app'
      AND record_originale_id = OLD.id;
    RETURN OLD;
  END IF;

  INSERT INTO network_luoghi (
    nome, slug, tipo, dominio_fonte, url_scheda,
    regione, provincia, comune, indirizzo,
    lat, lng, descrizione, foto_principale, servizi,
    attivo, verificato, record_originale_id
  ) VALUES (
    NEW.nome, NEW.slug, 'agriturismo', 'agriturismi.app',
    'https://www.agriturismi.app/agriturismo/' || NEW.slug,
    NEW.regione, NEW.provincia,
    COALESCE(NEW.comune, NEW.regione, 'Italia'),
    NEW.indirizzo,
    NEW.lat, NEW.lng, NEW.descrizione, NEW.foto_principale,
    COALESCE(NEW.servizi, '{}'),
    NEW.attivo, NEW.verificato, NEW.id
  )
  ON CONFLICT (dominio_fonte, slug) DO UPDATE SET
    nome            = EXCLUDED.nome,
    descrizione     = EXCLUDED.descrizione,
    foto_principale = EXCLUDED.foto_principale,
    servizi         = EXCLUDED.servizi,
    lat             = EXCLUDED.lat,
    lng             = EXCLUDED.lng,
    comune          = EXCLUDED.comune,
    regione         = EXCLUDED.regione,
    attivo          = EXCLUDED.attivo,
    verificato      = EXCLUDED.verificato,
    updated_at      = now();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_sync_agriturismo_network
  AFTER INSERT OR UPDATE OR DELETE ON agriturismi
  FOR EACH ROW EXECUTE FUNCTION sync_agriturismo_to_network();

-- Sync iniziale: popola network con tutti gli agriturismi esistenti
INSERT INTO network_luoghi (
  nome, slug, tipo, dominio_fonte, url_scheda,
  regione, provincia, comune, indirizzo,
  lat, lng, descrizione, foto_principale, servizi,
  attivo, verificato, record_originale_id
)
SELECT
  nome, slug, 'agriturismo', 'agriturismi.app',
  'https://www.agriturismi.app/agriturismo/' || slug,
  regione, provincia,
  COALESCE(comune, regione, 'Italia'),
  indirizzo,
  lat, lng, descrizione, foto_principale,
  COALESCE(servizi, '{}'),
  attivo, verificato, id
FROM agriturismi
ON CONFLICT (dominio_fonte, slug) DO NOTHING;
