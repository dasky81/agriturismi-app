import { createClient } from "@supabase/supabase-js";
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

function pct(now: number, prev: number): string {
  if (prev === 0) return now > 0 ? "+∞%" : "—";
  const p = Math.round(((now - prev) / prev) * 100);
  return (p >= 0 ? "+" : "") + p + "%";
}

function pctColor(now: number, prev: number): string {
  if (prev === 0) return "text-gray-400";
  return now >= prev ? "text-green-600" : "text-red-500";
}

function uniq(arr: (string | null | undefined)[]): number {
  return new Set(arr.filter(Boolean)).size;
}

export default async function AdminAnalytics() {
  const supabase = sb();

  const oggi = new Date();
  oggi.setHours(0, 0, 0, 0);
  const fa1  = subDays(oggi, 1);
  const fa7  = subDays(oggi, 7);
  const fa14 = subDays(oggi, 14);
  const fa30 = subDays(oggi, 30);
  const fa60 = subDays(oggi, 60);

  // Fetch visite ultimi 60 giorni
  const { data: rawVisite } = await supabase
    .from("visite")
    .select("created_at, sessione_id, utente_id, pagina, agriturismo_id, referrer")
    .gte("created_at", fa60.toISOString());
  const visite = rawVisite ?? [];

  // Fetch ricerche_log ultimi 60 giorni
  const { data: rawRicerche } = await supabase
    .from("ricerche_log")
    .select("id, created_at, query_utente")
    .gte("created_at", fa60.toISOString())
    .order("created_at", { ascending: false });
  const ricerche = rawRicerche ?? [];

  // ── Filtri temporali ──
  const inR = (t: Date, from: Date, to?: Date) => t >= from && (!to || t < to);

  const vOggi = visite.filter(v => inR(new Date(v.created_at), oggi));
  const vIeri = visite.filter(v => inR(new Date(v.created_at), fa1, oggi));
  const v7    = visite.filter(v => inR(new Date(v.created_at), fa7));
  const vP7   = visite.filter(v => inR(new Date(v.created_at), fa14, fa7));
  const v30   = visite.filter(v => inR(new Date(v.created_at), fa30));
  const vP30  = visite.filter(v => inR(new Date(v.created_at), fa60, fa30));

  const rOggi = ricerche.filter(v => inR(new Date(v.created_at), oggi));
  const rIeri = ricerche.filter(v => inR(new Date(v.created_at), fa1, oggi));
  const r7    = ricerche.filter(v => inR(new Date(v.created_at), fa7));
  const rP7   = ricerche.filter(v => inR(new Date(v.created_at), fa14, fa7));
  const r30   = ricerche.filter(v => inR(new Date(v.created_at), fa30));
  const rP30  = ricerche.filter(v => inR(new Date(v.created_at), fa60, fa30));

  // ── Grafico: ultimi 30 giorni ──
  const grafico: { g: string; v: number; s: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d    = subDays(oggi, i);
    const next = subDays(oggi, i - 1);
    const day  = v30.filter(v => inR(new Date(v.created_at), d, next));
    grafico.push({
      g: d.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit" }),
      v: day.length,
      s: uniq(day.map(v => v.sessione_id)),
    });
  }
  const maxV = Math.max(...grafico.map(d => d.v), 1);

  // ── Top pagine ──
  const pagineMap = new Map<string, { v: number; s: Set<string> }>();
  v30.forEach(v => {
    const p = v.pagina ?? "/";
    const e = pagineMap.get(p) ?? { v: 0, s: new Set<string>() };
    e.v++;
    if (v.sessione_id) e.s.add(v.sessione_id);
    pagineMap.set(p, e);
  });
  const topPagine = [...pagineMap.entries()]
    .map(([p, e]) => ({ p, v: e.v, s: e.s.size }))
    .sort((a, b) => b.v - a.v)
    .slice(0, 10);

  // ── Top query AI ──
  const qMap = new Map<string, number>();
  r30.forEach(r => { qMap.set(r.query_utente, (qMap.get(r.query_utente) ?? 0) + 1); });
  const topQuery = [...qMap.entries()]
    .map(([q, n]) => ({ q, n }))
    .sort((a, b) => b.n - a.n)
    .slice(0, 10);

  // ── Top referrer ──
  const refMap = new Map<string, number>();
  v30.forEach(v => {
    const d = dominio(v.referrer as string | null);
    refMap.set(d, (refMap.get(d) ?? 0) + 1);
  });
  const topRef = [...refMap.entries()]
    .map(([d, n]) => ({ d, n }))
    .sort((a, b) => b.n - a.n)
    .slice(0, 10);

  // ── Strutture più visitate ──
  const agriMap = new Map<string, number>();
  v30.filter(v => v.agriturismo_id).forEach(v => {
    agriMap.set(v.agriturismo_id as string, (agriMap.get(v.agriturismo_id as string) ?? 0) + 1);
  });
  const topAgriIds = [...agriMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([id]) => id);

  type Agri = { id: string; nome: string; slug: string; visite: number };
  let topStrutture: Agri[] = [];
  if (topAgriIds.length > 0) {
    const { data: agriData } = await supabase
      .from("agriturismi")
      .select("id, nome, slug")
      .in("id", topAgriIds);
    if (agriData) {
      topStrutture = topAgriIds
        .map(id => {
          const a = agriData.find(x => x.id === id);
          return a
            ? { id, nome: a.nome as string, slug: a.slug as string, visite: agriMap.get(id) ?? 0 }
            : null;
        })
        .filter((x): x is Agri => x !== null);
    }
  }

  const kpiRows = [
    {
      label: "Visite totali",
      o: vOggi.length, i: vIeri.length,
      s7: v7.length, p7: vP7.length,
      s30: v30.length, p30: vP30.length,
    },
    {
      label: "Sessioni uniche",
      o: uniq(vOggi.map(v => v.sessione_id)), i: uniq(vIeri.map(v => v.sessione_id)),
      s7: uniq(v7.map(v => v.sessione_id)), p7: uniq(vP7.map(v => v.sessione_id)),
      s30: uniq(v30.map(v => v.sessione_id)), p30: uniq(vP30.map(v => v.sessione_id)),
    },
    {
      label: "Utenti registrati",
      o: uniq(vOggi.map(v => v.utente_id)), i: uniq(vIeri.map(v => v.utente_id)),
      s7: uniq(v7.map(v => v.utente_id)), p7: uniq(vP7.map(v => v.utente_id)),
      s30: uniq(v30.map(v => v.utente_id)), p30: uniq(vP30.map(v => v.utente_id)),
    },
    {
      label: "Ricerche AI",
      o: rOggi.length, i: rIeri.length,
      s7: r7.length, p7: rP7.length,
      s30: r30.length, p30: rP30.length,
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Traffico e statistiche della piattaforma</p>
      </div>

      {/* ── S1: KPI ── */}
      <section>
        <h2 className="text-base font-semibold text-gray-900 mb-4">KPI principali</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Metrica</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Oggi</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">vs ieri</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">7 gg</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">vs prec.</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">30 gg</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">vs prec.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {kpiRows.map(row => (
                <tr key={row.label} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-900">{row.label}</td>
                  <td className="px-5 py-3 text-right font-bold text-[#2D6A4F]">{row.o}</td>
                  <td className={`px-4 py-3 text-right text-xs ${pctColor(row.o, row.i)}`}>{pct(row.o, row.i)}</td>
                  <td className="px-5 py-3 text-right font-bold text-[#2D6A4F]">{row.s7}</td>
                  <td className={`px-4 py-3 text-right text-xs ${pctColor(row.s7, row.p7)}`}>{pct(row.s7, row.p7)}</td>
                  <td className="px-5 py-3 text-right font-bold text-[#2D6A4F]">{row.s30}</td>
                  <td className={`px-4 py-3 text-right text-xs ${pctColor(row.s30, row.p30)}`}>{pct(row.s30, row.p30)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── S2: Grafico visite ── */}
      <section>
        <h2 className="text-base font-semibold text-gray-900 mb-4">Visite ultimi 30 giorni</h2>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-20">Data</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">Visite</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-20">Sessioni</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {grafico.map(row => (
                <tr key={row.g} className="hover:bg-gray-50">
                  <td className="px-5 py-1.5 text-xs text-gray-500 font-mono">{row.g}</td>
                  <td className="px-5 py-1.5 text-right text-sm font-semibold text-gray-900">{row.v}</td>
                  <td className="px-5 py-1.5 text-right text-xs text-gray-400">{row.s}</td>
                  <td className="px-5 py-1.5 w-full">
                    <div
                      className="h-3 rounded-full bg-[#2D6A4F] transition-all"
                      style={{ width: `${Math.round((row.v / maxV) * 100)}%`, minWidth: row.v > 0 ? "3px" : "0" }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── S3: Top pagine ── */}
      <section>
        <h2 className="text-base font-semibold text-gray-900 mb-4">Top 10 pagine visitate (30 gg)</h2>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {topPagine.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Nessuna visita registrata</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Pagina</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Visite</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sessioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {topPagine.map(r => (
                  <tr key={r.p} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-mono text-xs text-gray-600 max-w-xs truncate">{r.p}</td>
                    <td className="px-5 py-3 text-right font-bold text-[#2D6A4F]">{r.v}</td>
                    <td className="px-5 py-3 text-right text-gray-400">{r.s}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* ── S4: Ricerche AI ── */}
      <section>
        <h2 className="text-base font-semibold text-gray-900 mb-4">Ricerche AI</h2>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Top 10 query (30 gg)</h3>
            {topQuery.length === 0 ? (
              <p className="text-sm text-gray-400">Nessuna ricerca registrata</p>
            ) : (
              <div className="flex flex-col gap-2.5">
                {topQuery.map((r, i) => (
                  <div key={r.q} className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-5 shrink-0 text-right">{i + 1}.</span>
                    <span className="text-sm text-gray-700 flex-1 truncate">{r.q}</span>
                    <span className="text-sm font-bold text-[#2D6A4F] shrink-0">{r.n}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Ultime 10 ricerche</h3>
            {ricerche.length === 0 ? (
              <p className="text-sm text-gray-400">Nessuna ricerca registrata</p>
            ) : (
              <div className="flex flex-col gap-2.5">
                {ricerche.slice(0, 10).map(r => (
                  <div key={r.id} className="flex items-start justify-between gap-3">
                    <span className="text-sm text-gray-700 flex-1 line-clamp-2">&ldquo;{r.query_utente}&rdquo;</span>
                    <span className="text-xs text-gray-400 shrink-0">
                      {new Date(r.created_at as string).toLocaleDateString("it-IT", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── S5: Provenienza ── */}
      <section>
        <h2 className="text-base font-semibold text-gray-900 mb-4">Provenienza visitatori (30 gg)</h2>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {topRef.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Nessun dato disponibile</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sorgente</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Visite</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {topRef.map(r => (
                  <tr key={r.d} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-900">{r.d}</td>
                    <td className="px-5 py-3 text-right font-bold text-[#2D6A4F]">{r.n}</td>
                    <td className="px-5 py-3 text-right text-gray-400 text-xs">
                      {Math.round((r.n / Math.max(v30.length, 1)) * 100)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* ── S6: Strutture più visitate ── */}
      <section>
        <h2 className="text-base font-semibold text-gray-900 mb-4">Strutture più visitate (30 gg)</h2>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {topStrutture.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Nessun dato disponibile</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Struttura</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Visite</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {topStrutture.map(a => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <Link
                        href={`/agriturismo/${a.slug}`}
                        className="font-medium text-gray-900 hover:text-[#2D6A4F] transition-colors"
                        target="_blank"
                      >
                        {a.nome}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-right font-bold text-[#2D6A4F]">{a.visite}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
