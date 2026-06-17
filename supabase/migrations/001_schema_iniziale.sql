-- =============================================================
-- agriturismi.app — Schema iniziale
-- Migration: 001_schema_iniziale.sql
-- =============================================================

-- Estensione UUID (già attiva su Supabase, inclusa per sicurezza)
create extension if not exists "uuid-ossp";


-- =============================================================
-- FUNZIONE UTILITY: aggiorna updated_at automaticamente
-- =============================================================

create or replace function aggiorna_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;


-- =============================================================
-- 1. PROFILES
-- Estende auth.users con dati di profilo dell'utente
-- =============================================================

create table profiles (
  id          uuid        primary key references auth.users(id) on delete cascade,
  nome        text,
  cognome     text,
  avatar_url  text,
  ruolo       text        not null default 'visitatore'
                          check (ruolo in ('visitatore', 'proprietario', 'admin')),
  created_at  timestamptz not null default now()
);

alter table profiles enable row level security;

-- Lettura pubblica: chiunque può vedere tutti i profili
create policy "profiles: lettura pubblica"
  on profiles for select
  using (true);

-- Inserimento: solo il proprio profilo
create policy "profiles: inserimento proprio"
  on profiles for insert
  with check (auth.uid() = id);

-- Modifica: solo il proprio profilo
create policy "profiles: modifica propria"
  on profiles for update
  using (auth.uid() = id);


-- Trigger: crea automaticamente il profilo alla registrazione
create or replace function crea_profilo_utente()
returns trigger as $$
begin
  insert into profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function crea_profilo_utente();


-- =============================================================
-- 2. AGRITURISMI
-- =============================================================

create table agriturismi (
  id               uuid        primary key default gen_random_uuid(),
  slug             text        unique not null,
  nome             text        not null,
  descrizione      text,
  descrizione_ai   text,
  regione          text,
  provincia        text,
  comune           text,
  indirizzo        text,
  lat              float,
  lng              float,
  telefono         text,
  email            text,
  sito_web         text,
  foto_principale  text,
  gallery          text[]      not null default '{}',
  servizi          text[]      not null default '{}',
  tipo_ospitalita  text[]      not null default '{}',
  proprietario_id  uuid        references profiles(id) on delete set null,
  verificato       boolean     not null default false,
  attivo           boolean     not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

alter table agriturismi enable row level security;

-- Lettura: tutti vedono gli agriturismi attivi
create policy "agriturismi: lettura attivi"
  on agriturismi for select
  using (attivo = true);

-- Lettura admin: vede anche quelli non attivi
create policy "agriturismi: lettura admin"
  on agriturismi for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.ruolo = 'admin'
    )
  );

-- Inserimento: solo proprietari e admin
create policy "agriturismi: inserimento proprio"
  on agriturismi for insert
  with check (auth.uid() = proprietario_id);

-- Modifica: solo il proprietario del record
create policy "agriturismi: modifica propria"
  on agriturismi for update
  using (auth.uid() = proprietario_id);

-- Eliminazione: solo il proprietario del record
create policy "agriturismi: eliminazione propria"
  on agriturismi for delete
  using (auth.uid() = proprietario_id);

create trigger agriturismi_updated_at
  before update on agriturismi
  for each row execute function aggiorna_updated_at();


-- =============================================================
-- 3. POST
-- =============================================================

create table post (
  id              uuid        primary key default gen_random_uuid(),
  slug            text        unique not null,
  titolo          text        not null,
  contenuto       text,
  excerpt         text,
  cover_url       text,
  autore_id       uuid        references profiles(id) on delete set null,
  agriturismo_id  uuid        references agriturismi(id) on delete set null,
  tags            text[]      not null default '{}',
  pubblicato      boolean     not null default false,
  og_title        text,
  og_description  text,
  og_image        text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table post enable row level security;

-- Lettura: tutti vedono i post pubblicati
create policy "post: lettura pubblicati"
  on post for select
  using (pubblicato = true);

-- Lettura: autore vede anche le proprie bozze
create policy "post: lettura proprie bozze"
  on post for select
  using (auth.uid() = autore_id);

-- Inserimento: solo l'autore può creare i propri post
create policy "post: inserimento proprio"
  on post for insert
  with check (auth.uid() = autore_id);

-- Modifica: solo l'autore
create policy "post: modifica propria"
  on post for update
  using (auth.uid() = autore_id);

-- Eliminazione: solo l'autore
create policy "post: eliminazione propria"
  on post for delete
  using (auth.uid() = autore_id);

create trigger post_updated_at
  before update on post
  for each row execute function aggiorna_updated_at();


-- =============================================================
-- 4. RICERCHE_LOG
-- =============================================================

create table ricerche_log (
  id                  uuid        primary key default gen_random_uuid(),
  query_utente        text        not null,
  query_interpretata  jsonb,
  risultati_ids       uuid[]      not null default '{}',
  utente_id           uuid        references profiles(id) on delete set null,
  created_at          timestamptz not null default now()
);

alter table ricerche_log enable row level security;

-- Inserimento: chiunque può loggare una ricerca (anche anonimi)
create policy "ricerche_log: inserimento libero"
  on ricerche_log for insert
  with check (true);

-- Lettura: l'utente vede solo le proprie ricerche
create policy "ricerche_log: lettura propria"
  on ricerche_log for select
  using (auth.uid() = utente_id);

-- Lettura admin: vede tutte le ricerche
create policy "ricerche_log: lettura admin"
  on ricerche_log for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.ruolo = 'admin'
    )
  );
