import { creaClientServer } from "@/lib/supabase-server";

function KpiCard({
  label,
  value,
  emoji,
  colore,
}: {
  label: string;
  value: number;
  emoji: string;
  colore?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
      <p className="text-xl mb-2">{emoji}</p>
      <p className="text-3xl font-bold" style={{ color: colore ?? "#2D6A4F" }}>
        {value}
      </p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}

export default async function AdminPanoramica() {
  const supabase = await creaClientServer();

  const [
    { count: totaleStrutture },
    { count: strutturVerificate },
    { count: struttureAttive },
    { count: totaleUtenti },
    { count: pendingRiv },
    { count: articoliPubblicati },
  ] = await Promise.all([
    supabase.from("agriturismi").select("*", { count: "exact", head: true }),
    supabase.from("agriturismi").select("*", { count: "exact", head: true }).eq("verificato", true),
    supabase.from("agriturismi").select("*", { count: "exact", head: true }).eq("attivo", true),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("rivendicazioni").select("*", { count: "exact", head: true }).eq("stato", "pending"),
    supabase.from("post").select("*", { count: "exact", head: true }).eq("pubblicato", true),
  ]);

  const [{ data: ultimeRiv }, { data: ultimiUtenti }] = await Promise.all([
    supabase
      .from("rivendicazioni")
      .select("id, stato, created_at, agriturismo:agriturismi(nome), utente:profiles(nome, cognome)")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("profiles")
      .select("id, nome, cognome, ruolo, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Panoramica</h1>
        <p className="text-sm text-gray-500 mt-1">Stato della piattaforma agriturismi.app</p>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <KpiCard label="Totale strutture"      value={totaleStrutture ?? 0}    emoji="🏡" />
        <KpiCard label="Strutture verificate"  value={strutturVerificate ?? 0} emoji="✅" />
        <KpiCard label="Strutture attive"      value={struttureAttive ?? 0}    emoji="🟢" />
        <KpiCard label="Utenti registrati"     value={totaleUtenti ?? 0}       emoji="👥" />
        <KpiCard
          label="Rivendicazioni pending"
          value={pendingRiv ?? 0}
          emoji="⏳"
          colore={(pendingRiv ?? 0) > 0 ? "#F59E0B" : "#2D6A4F"}
        />
        <KpiCard label="Articoli pubblicati"   value={articoliPubblicati ?? 0} emoji="📰" />
      </div>

      {/* ── Ultime rivendicazioni ── */}
      <section>
        <h2 className="text-base font-semibold text-gray-900 mb-3">Ultime rivendicazioni</h2>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {!ultimeRiv?.length ? (
            <p className="text-sm text-gray-400 text-center py-8">Nessuna rivendicazione</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Struttura</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Richiedente</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stato</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {ultimeRiv.map((r) => {
                  const agri = r.agriturismo as unknown as { nome: string } | null;
                  const utente = r.utente as unknown as { nome: string | null; cognome: string | null } | null;
                  return (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-900">{agri?.nome ?? "—"}</td>
                      <td className="px-5 py-3 text-gray-500 hidden sm:table-cell">
                        {[utente?.nome, utente?.cognome].filter(Boolean).join(" ") || "—"}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          r.stato === "pending" ? "bg-yellow-100 text-yellow-700"
                            : r.stato === "approvata" ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {r.stato}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-xs text-gray-400 hidden md:table-cell">
                        {new Date(r.created_at as string).toLocaleDateString("it-IT")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* ── Ultimi utenti registrati ── */}
      <section>
        <h2 className="text-base font-semibold text-gray-900 mb-3">Ultimi utenti registrati</h2>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {!ultimiUtenti?.length ? (
            <p className="text-sm text-gray-400 text-center py-8">Nessun utente</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Ruolo</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Registrato il</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {ultimiUtenti.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-900">
                      {[u.nome, u.cognome].filter(Boolean).join(" ") || "—"}
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell">
                      <span className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 capitalize">
                        {u.ruolo ?? "visitatore"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-400 hidden md:table-cell">
                      {new Date(u.created_at as string).toLocaleDateString("it-IT")}
                    </td>
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
