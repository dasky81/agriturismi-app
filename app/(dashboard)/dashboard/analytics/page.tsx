import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { creaClientServer } from "@/lib/supabase-server";
import Link from "next/link";

function sb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

function subDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() - n);
  return r;
}

function dominio(ref: string | null): string {
  if (!ref) return "Diretto";
  try {
    return new URL(ref).hostname.replace(/^www\./, "");
  } catch {
    return "Altro";
  }
}

function uniq(arr: (string | null | undefined)[]): number {
  return new Set(arr.filter(Boolean)).size;
}

export default async function ProprietarioAnalytics() {
  const authClient = await creaClientServer();
  const {
    data: { user },
  } = await authClient.auth.getUser();
  if (!user) redirect("/login?redirect=/dashboard/analytics");

  const { data: profilo } = await authClient
    .from("profiles")
    .select("ruolo")
    .eq("id", user.id)
    .single();

  if (!["proprietario", "admin"].includes(profilo?.ruolo ?? "")) {
    redirect("/dashboard");
  }

  const service = sb();

  const { data: struttura } = await service
    .from("agriturismi")
    .select("id, nome, slug, verificato, descrizione, foto_principale, servizi")
    .eq("proprietario_id", user.id)
    .maybeSingle();

  if (!struttura) {
    return (
      <div className="flex flex-col gap-4 max-w-2xl">
        <h1 className="text-xl font-bold text-gray-900">Le mie statistiche</h1>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <p className="text-4xl mb-3">🏡</p>
          <p className="text-sm text-gray-500 mb-4">Nessuna struttura collegata al tuo account</p>
          <Link
            href="/aggiungi-struttura"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white"
            style={{ backgroundColor: "#2D6A4F" }}
          >
            Aggiungi il tuo agriturismo
          </Link>
        </div>
      </div>
    );
  }

  const oggi = new Date();
  oggi.setHours(0, 0, 0, 0);
  const fa7  = subDays(oggi, 7);
  const fa30 = subDays(oggi, 30);
  const fa60 = subDays(oggi, 60);

  const inR = (t: Date, from: Date, to?: Date) => t >= from && (!to || t < to);

  // Visite per questa struttura (ultimi 60gg per avere il confronto)
  const { data: rawVisite } = await service
    .from("visite")
    .select("created_at, sessione_id, referrer")
    .eq("agriturismo_id", struttura.id)
    .gte("created_at", fa60.toISOString());
  const visite = rawVisite ?? [];

  // Ricerche che hanno restituito questa struttura
  const { data: rawRicerche } = await service
    .from("ricerche_log")
    .select("id, created_at, query_utente")
    .contains("risultati_ids", [struttura.id as string])
    .order("created_at", { ascending: false })
    .limit(50);
  const ricerche = rawRicerche ?? [];

  const vOggi = visite.filter(v => inR(new Date(v.created_at), oggi));
  const v7    = visite.filter(v => inR(new Date(v.created_at), fa7));
  const v30   = visite.filter(v => inR(new Date(v.created_at), fa30));
  const r30   = ricerche.filter(r => inR(new Date(r.created_at), fa30));

  // Grafico 30 giorni
  const grafico: { g: string; v: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d    = subDays(oggi, i);
    const next = subDays(oggi, i - 1);
    const day  = v30.filter(v => inR(new Date(v.created_at), d, next));
    grafico.push({
      g: d.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit" }),
      v: day.length,
    });
  }
  const maxV = Math.max(...grafico.map(d => d.v), 1);

  // Top referrer
  const refMap = new Map<string, number>();
  v30.forEach(v => {
    const d = dominio(v.referrer as string | null);
    refMap.set(d, (refMap.get(d) ?? 0) + 1);
  });
  const topRef = [...refMap.entries()]
    .map(([d, n]) => ({ d, n }))
    .sort((a, b) => b.n - a.n)
    .slice(0, 5);

  // Consigli automatici
  const consigli: string[] = [];
  if (!struttura.verificato)
    consigli.push("✅ Rivendica la scheda per aumentare la visibilità");
  if (!struttura.foto_principale)
    consigli.push("📸 Aggiungi foto per ricevere più visite");
  if (!struttura.descrizione || (struttura.descrizione as string).length < 100)
    consigli.push("✍️ Completa la descrizione (almeno 100 caratteri)");
  if (!struttura.servizi || (struttura.servizi as string[]).length === 0)
    consigli.push("🏊 Aggiungi i servizi offerti");

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900">📊 Le mie statistiche</h1>
        <p className="text-sm text-gray-400 mt-0.5">{struttura.nome as string}</p>
      </div>

      {/* ── S1: KPI ── */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Visite alla tua scheda</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { label: "Oggi",          v: vOggi.length, s: uniq(vOggi.map(v => v.sessione_id)) },
            { label: "Ultimi 7 gg",   v: v7.length,    s: uniq(v7.map(v => v.sessione_id)) },
            { label: "Ultimi 30 gg",  v: v30.length,   s: uniq(v30.map(v => v.sessione_id)) },
          ].map(k => (
            <div key={k.label}>
              <p className="text-3xl font-bold" style={{ color: "#2D6A4F" }}>{k.v}</p>
              <p className="text-xs text-gray-500 mt-1">{k.label}</p>
              <p className="text-[11px] text-gray-300 mt-0.5">{k.s} sessioni</p>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-50">
          <p className="text-xs text-gray-500">
            La tua struttura è apparsa nei risultati AI{" "}
            <span className="font-bold text-[#2D6A4F]">{r30.length}</span>{" "}
            volt{r30.length === 1 ? "a" : "e"} negli ultimi 30 giorni
          </p>
        </div>
      </section>

      {/* ── S2: Grafico ── */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Visite ultimi 30 giorni</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left px-5 py-2 text-xs font-semibold text-gray-400">Data</th>
              <th className="text-right px-5 py-2 text-xs font-semibold text-gray-400 w-16">Visite</th>
              <th className="px-5 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {grafico.map(row => (
              <tr key={row.g} className="hover:bg-gray-50">
                <td className="px-5 py-1.5 text-xs text-gray-500 font-mono">{row.g}</td>
                <td className="px-5 py-1.5 text-right text-sm font-medium text-gray-900">{row.v}</td>
                <td className="px-5 py-1.5 w-full">
                  <div
                    className="h-2.5 rounded-full bg-[#2D6A4F]"
                    style={{ width: `${Math.round((row.v / maxV) * 100)}%`, minWidth: row.v > 0 ? "3px" : "0" }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ── S3: Referrer ── */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Da dove arrivano i visitatori (30 gg)</h2>
        {topRef.length === 0 ? (
          <p className="text-sm text-gray-400">Nessun dato disponibile</p>
        ) : (
          <div className="flex flex-col gap-2">
            {topRef.map(r => (
              <div key={r.d} className="flex items-center justify-between py-1">
                <span className="text-sm text-gray-700">{r.d}</span>
                <span className="text-sm font-bold text-[#2D6A4F]">{r.n}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── S4: Ricerche AI ── */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">
          Ricerche AI che hanno trovato la tua struttura (30 gg)
        </h2>
        {r30.length === 0 ? (
          <p className="text-sm text-gray-400">
            La tua struttura non è ancora apparsa nei risultati di ricerca
          </p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {r30.slice(0, 15).map(r => (
              <div key={r.id} className="flex items-start justify-between gap-3">
                <span className="text-sm text-gray-700 flex-1">&ldquo;{r.query_utente}&rdquo;</span>
                <span className="text-xs text-gray-400 shrink-0">
                  {new Date(r.created_at as string).toLocaleDateString("it-IT", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── S5: Consigli ── */}
      {consigli.length > 0 && (
        <section className="bg-amber-50 rounded-2xl border border-amber-100 p-5">
          <h2 className="text-sm font-semibold text-amber-800 mb-3">
            Suggerimenti per migliorare la scheda
          </h2>
          <div className="flex flex-col gap-2">
            {consigli.map((c, i) => (
              <p key={i} className="text-sm text-amber-700">
                {c}
              </p>
            ))}
          </div>
        </section>
      )}

      <Link
        href="/dashboard"
        className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
      >
        ← Torna alla dashboard
      </Link>
    </div>
  );
}
