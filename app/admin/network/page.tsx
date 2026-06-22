import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import { creaClientServer } from "@/lib/supabase-server";
import FormAggiungiLuogo from "./FormAggiungiLuogo";

function serviceRole() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

interface StatRow {
  tipo: string;
  dominio_fonte: string;
  totale: number;
  verificati: number;
  attivi: number;
}

interface NetworkLuogo {
  id: string;
  nome: string;
  tipo: string;
  dominio_fonte: string;
  comune: string | null;
  regione: string | null;
  verificato: boolean;
  attivo: boolean;
  created_at: string;
}

const EMOJI: Record<string, string> = {
  agriturismo: "🌾", cantina: "🍷", ristorante: "🍽️", noleggio: "🚲",
  campeggio: "⛺", glamping: "✨", hotel: "🏨", beb: "🛏️", attrazione: "🏛️",
};

export default async function AdminNetworkPage() {
  const auth = await creaClientServer();
  const { data: { user } } = await auth.auth.getUser();
  if (!user) notFound();

  const { data: prof } = await serviceRole()
    .from("profiles")
    .select("ruolo")
    .eq("id", user.id)
    .single();
  if (prof?.ruolo !== "admin") notFound();

  const [{ data: stats }, { data: recenti }] = await Promise.all([
    serviceRole().from("network_statistiche").select("*").order("totale", { ascending: false }),
    serviceRole()
      .from("network_luoghi")
      .select("id, nome, tipo, dominio_fonte, comune, regione, verificato, attivo, created_at")
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const statRows = (stats ?? []) as StatRow[];
  const luoghi = (recenti ?? []) as NetworkLuogo[];

  const totale = statRows.reduce((s, r) => s + r.totale, 0);
  const verificati = statRows.reduce((s, r) => s + r.verificati, 0);
  const attivi = statRows.reduce((s, r) => s + r.attivi, 0);

  const perTipo: Record<string, number> = {};
  for (const r of statRows) {
    perTipo[r.tipo] = (perTipo[r.tipo] ?? 0) + r.totale;
  }

  return (
    <div className="p-4 lg:p-8 flex flex-col gap-6 w-full max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">🌐 Network luoghi</h1>
        <p className="text-sm text-gray-500 mt-1">
          Gestisci le strutture del network viaggi.app visibili nell&apos;itinerario AI e nel widget &quot;Nelle vicinanze&quot;.
        </p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Totale luoghi", value: totale, color: "#2D6A4F" },
          { label: "Verificati", value: verificati, color: "#1B4332" },
          { label: "Attivi", value: attivi, color: "#52B788" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
            <p className="text-3xl font-bold" style={{ color }}>{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Distribuzione per tipo */}
      {Object.keys(perTipo).length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Distribuzione per tipo</h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(perTipo)
              .sort(([, a], [, b]) => b - a)
              .map(([tipo, n]) => (
                <span
                  key={tipo}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-100"
                >
                  {EMOJI[tipo] ?? "📍"} {tipo} <span className="font-bold text-[#2D6A4F]">({n})</span>
                </span>
              ))}
          </div>
        </div>
      )}

      {/* Aggiungi luogo */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Aggiungi luogo al network</h2>
        <FormAggiungiLuogo onAggiunto={() => {}} />
      </div>

      {/* Ultimi aggiunti */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Ultimi 20 aggiunti</h2>
        {luoghi.length === 0 ? (
          <p className="text-sm text-gray-400">Nessun luogo nel network.</p>
        ) : (
          <div className="flex flex-col divide-y divide-gray-50">
            {luoghi.map((l) => (
              <div key={l.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-base shrink-0">{EMOJI[l.tipo] ?? "📍"}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{l.nome}</p>
                    <p className="text-xs text-gray-400">
                      {l.comune ?? l.regione ?? "—"} · {l.dominio_fonte}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {l.verificato ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                      ✓ Verificato
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-medium">
                      Non verificato
                    </span>
                  )}
                  {!l.attivo && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">
                      Inattivo
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
