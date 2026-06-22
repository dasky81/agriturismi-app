-- Bucket per foto strutture (pubblico)
INSERT INTO storage.buckets (id, name, public)
VALUES ('strutture', 'strutture', true)
ON CONFLICT (id) DO NOTHING;

-- Lettura pubblica
CREATE POLICY "strutture_lettura_pubblica"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'strutture');

-- Upload: solo utenti autenticati, nella propria cartella /<uid>/...
CREATE POLICY "strutture_upload_proprietario"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'strutture'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Update: solo le proprie foto
CREATE POLICY "strutture_update_proprietario"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'strutture'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Delete: solo le proprie foto
CREATE POLICY "strutture_delete_proprietario"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'strutture'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
