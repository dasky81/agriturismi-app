# Configurazione Google OAuth con Supabase

## 1. Google Cloud Console

1. Vai su https://console.cloud.google.com
2. Crea o seleziona un progetto
3. Vai su **APIs & Services → Credentials**
4. Clicca **Create Credentials → OAuth 2.0 Client IDs**
5. Tipo applicazione: **Web application**
6. Aggiungi gli Authorized Redirect URIs:
   - `https://<tuo-progetto>.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (solo per sviluppo)
7. Copia **Client ID** e **Client Secret**

## 2. Supabase Dashboard

1. Vai su https://app.supabase.com → tuo progetto → **Authentication → Providers**
2. Abilita **Google**
3. Incolla il **Client ID** e **Client Secret** da Google Cloud
4. Salva

## 3. Variabili d'ambiente (.env.local)

Nessuna variabile aggiuntiva necessaria — le credenziali vivono in Supabase.

Assicurati però che queste siano presenti:
```
NEXT_PUBLIC_SUPABASE_URL=https://<tuo-progetto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

## 4. Callback URL nel codice

Il callback è già configurato in `app/auth/callback/route.ts`.

Quando l'utente clicca "Accedi con Google", viene reindirizzato a:
```
/auth/callback?code=<code>
```

Il route handler scambia il codice per una sessione con `exchangeCodeForSession()`.

### Primo accesso vs. accessi successivi

Il callback rileva il primo accesso confrontando `created_at` con `last_sign_in_at`.
- **Primo accesso**: redirect a `/auth/benvenuto?tipo=nuovo`
- **Accessi successivi**: redirect a `/`

## 5. Test

1. Vai su `http://localhost:3000/login`
2. Clicca "Accedi con Google"
3. Completa il flusso OAuth di Google
4. Verifica il redirect a `/` (o `/auth/benvenuto` se primo accesso)

## 6. Problemi comuni

| Problema | Causa | Soluzione |
|----------|-------|-----------|
| `redirect_uri_mismatch` | URI non autorizzato in Google Cloud | Aggiungi l'URI corretto nelle autorizzazioni |
| Loop di redirect | Cookie di sessione non salvati | Controlla `setAll` in `creaClientServer()` |
| "accesso non autorizzato" | Provider non abilitato in Supabase | Abilita Google in Authentication → Providers |
