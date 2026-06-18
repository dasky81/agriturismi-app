-- =============================================================
-- agriturismi.app — Migration 002: rivendicazioni e fonti_dati
-- =============================================================

-- =============================================================
-- 1. RIVENDICAZIONI
-- Richieste di rivendicazione scheda da parte di gestori
-- =============================================================

create table rivendicazioni (
  id              uuid        primary key default gen_random_uuid(),
  agriturismo_id  uuid        not null references agriturismi(id) on delete cascade,
  utente_id       uuid        not null references profiles(id) on delete cascade,
  stato           text        not null default 'pending'
                              check (stato in ('pending', 'approvata', 'rifiutata')),
  messaggio       text,
  created_at      timestamptz not null default now()
);

alter table rivendicazioni enable row level security;

-- Inserimento: solo l'utente loggato può creare la propria rivendicazione
create policy "rivendicazioni: inserimento proprio"
  on rivendicazioni for insert
  with check (auth.uid() = utente_id);

-- Lettura: l'utente vede solo le proprie rivendicazioni
create policy "rivendicazioni: lettura propria"
  on rivendicazioni for select
  using (auth.uid() = utente_id);

-- Lettura admin: vede tutto
create policy "rivendicazioni: lettura admin"
  on rivendicazioni for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.ruolo = 'admin'
    )
  );


-- =============================================================
-- 2. FONTI_DATI
-- Tracciabilità delle fonti pubbliche usate per le schede
-- =============================================================

create table fonti_dati (
  id              uuid        primary key default gen_random_uuid(),
  agriturismo_id  uuid        not null references agriturismi(id) on delete cascade,
  fonte           text        not null,
  url_fonte       text,
  data_raccolta   date        not null default current_date
);

alter table fonti_dati enable row level security;

-- Lettura pubblica: chiunque può vedere le fonti
create policy "fonti_dati: lettura pubblica"
  on fonti_dati for select
  using (true);

-- Inserimento: solo admin
create policy "fonti_dati: inserimento admin"
  on fonti_dati for insert
  with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.ruolo = 'admin'
    )
  );
