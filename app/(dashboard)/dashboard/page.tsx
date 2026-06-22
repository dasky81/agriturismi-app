"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Search, Home, User, LogOut, ChevronRight, MapPin, Globe, Star, BarChart2, Settings } from "lucide-react";
import { creaClientBrowser } from "@/lib/supabase";

interface ProfiloUtente {
  id: string;
  nome: string | null;
  cognome: string | null;
  ruolo: string;
  email: string;
}

interface AgriPref {
  id: string;
  nome: string;
  regione: string | null;
  slug: string;
}

interface Preferito {
  id: string;
  agriturismo_id: string;
  created_at: string;
  agriturismi: AgriPref | null;
}

interface Ricerca {
  id: string;
  query_utente: string;
  created_at: string;
}

interface StrutturaUtente {
  id: string;
  nome: string;
  slug: string;
  verificato: boolean;
  regione: string | null;
  tot_recensioni: number | null;
  tot_consigli: number | null;
}

interface RecensionePreview {
  id: string;
  voto: string;
  titolo: string;
  testo: string;
  created_at: string;
}

export default function DashboardPage() {
  const [profilo, setProfilo] = useState<ProfiloUtente | null>(null);
  const [preferiti, setPreferiti] = useState<Preferito[]>([]);
  const [ricerche, setRicerche] = useState<Ricerca[]>([]);
  const [struttura, setStruttura] = useState<StrutturaUtente | null>(null);
  const [recensioniPreview, setRecensioniPreview] = useState<RecensionePreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [formNome, setFormNome] = useState("");
  const [formCognome, setFormCognome] = useState("");

  useEffect(() => {
    const sb = creaClientBrowser();

    async function carica() {
      const { data: { user } } = await sb.auth.getUser();
      if (!user) return;

      const { data: prof } = await sb
        .from("profiles")
        .select("nome, cognome, ruolo")
        .eq("id", user.id)
        .single();

      setProfilo({
        id: user.id,
        nome: prof?.nome ?? null,
        cognome: prof?.cognome ?? null,
        ruolo: prof?.ruolo ?? "visitatore",
        email: user.email ?? "",
      });
      setFormNome(prof?.nome ?? "");
      setFormCognome(prof?.cognome ?? "");

      const { data: prefs } = await sb
        .from("preferiti")
        .select("id, agriturismo_id, created_at, agriturismi(id, nome, regione, slug)")
        .eq("utente_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);
      if (prefs) setPreferiti(prefs as unknown as Preferito[]);

      const { data: rice } = await sb
        .from("ricerche_log")
        .select("id, query_utente, created_at")
        .eq("utente_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);
      if (rice) setRicerche(rice as Ricerca[]);

      if (prof?.ruolo === "proprietario" || prof?.ruolo === "admin") {
        const { data: strutt } = await sb
          .from("agriturismi")
          .select("id, nome, slug, verificato, regione, tot_recensioni, tot_consigli")
          .eq("proprietario_id", user.id)
          .maybeSingle();
        if (strutt) {
          setStruttura(strutt as StrutturaUtente);
          // Carica ultime 3 recensioni moderate
          const { data: recs } = await sb
            .from("recensioni")
            .select("id, voto, titolo, testo, created_at")
            .eq("agriturismo_id", strutt.id)
            .eq("moderata", true)
            .order("created_at", { ascending: false })
            .limit(3);
          if (recs) setRecensioniPreview(recs as RecensionePreview[]);
        }
      }

      setLoading(false);
    }

    void carica();
  }, []);

  async function salvaProfilo(e: React.FormEvent) {
    e.preventDefault();
    if (!profilo) return;
    setSavingProfile(true);
    const sb = creaClientBrowser();
    await sb.from("profiles").update({
      nome: formNome.trim() || null,
      cognome: formCognome.trim() || null,
    }).eq("id", profilo.id);
    setProfilo((p) => p ? { ...p, nome: formNome, cognome: formCognome } : p);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
    setSavingProfile(false);
  }

  async function logout() {
    const sb = creaClientBrowser();
    await sb.auth.signOut();
    window.location.href = "/";
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-6 h-6 border-2 border-[#2D6A4F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const iniziali =
    [profilo?.nome, profilo?.cognome]
      .filter(Boolean)
      .map((n) => n![0].toUpperCase())
      .join("") || (profilo?.email[0]?.toUpperCase() ?? "U");

  const nomeCompleto =
    [profilo?.nome, profilo?.cognome].filter(Boolean).join(" ") || "Utente";

  return (
    <div className="flex flex-col gap-4 lg:gap-6 w-full max-w-2xl">

      {/* Header avatar */}
      <div className="flex items-center gap-3 lg:gap-4">
        <div
          className="w-12 h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center text-base lg:text-xl font-bold text-white shrink-0"
          style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)" }}
        >
          {iniziali}
        </div>
        <div className="min-w-0">
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 truncate">Ciao {nomeCompleto}! 👋</h1>
          <p className="text-sm text-gray-400">Benvenuto nella tua area personale</p>
        </div>
      </div>

      {/* 1. Preferiti */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-4">
          <Heart size={16} className="text-[#E8956D]" />
          I miei preferiti
        </h2>
        {preferiti.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-2xl mb-2">🌿</p>
            <p className="text-sm text-gray-500 mb-3">Nessun agriturismo salvato ancora</p>
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#2D6A4F] hover:underline"
            >
              Esplora gli agriturismi
              <ChevronRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-gray-50">
            {preferiti.map((p) => {
              const agri = p.agriturismi;
              if (!agri) return null;
              return (
                <Link
                  key={p.id}
                  href={`/agriturismo/${agri.slug}`}
                  className="flex items-center justify-between py-3 hover:opacity-70 transition-opacity"
                >
                  <div>
                    <p className="font-medium text-sm text-gray-900">{agri.nome}</p>
                    {agri.regione && (
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <MapPin size={10} />
                        {agri.regione}
                      </p>
                    )}
                  </div>
                  <ChevronRight size={16} className="text-gray-300 shrink-0" />
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* 2. Ultime ricerche */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-4">
          <Search size={16} className="text-[#2D6A4F]" />
          Le mie ultime ricerche
        </h2>
        {ricerche.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">
            Nessuna ricerca effettuata ancora
          </p>
        ) : (
          <div className="flex flex-col divide-y divide-gray-50">
            {ricerche.map((r) => (
              <div key={r.id} className="flex items-center justify-between py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 truncate">&ldquo;{r.query_utente}&rdquo;</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(r.created_at).toLocaleDateString("it-IT", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
                <Link
                  href={`/?q=${encodeURIComponent(r.query_utente)}`}
                  className="ml-3 shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Ripeti
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. La mia struttura (solo proprietario/admin) */}
      {(profilo?.ruolo === "proprietario" || profilo?.ruolo === "admin") && (
        <>
          {struttura ? (
            <>
              {/* Struttura header */}
              <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="min-w-0">
                    <h2 className="font-bold text-gray-900 text-base truncate">{struttura.nome}</h2>
                    {struttura.regione && (
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <MapPin size={10} />
                        {struttura.regione}
                      </p>
                    )}
                    <span
                      className={`inline-block mt-2 text-[11px] px-2 py-0.5 rounded-full font-medium ${
                        struttura.verificato
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {struttura.verificato ? "✓ Verificata" : "⏳ In attesa di verifica"}
                    </span>
                  </div>
                  <Link
                    href={`/agriturismo/${struttura.slug}`}
                    className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                    style={{ backgroundColor: "#2D6A4F" }}
                  >
                    Vedi scheda
                    <ChevronRight size={14} />
                  </Link>
                </div>

                {/* KPI */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-gray-900">{struttura.tot_recensioni ?? 0}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Recensioni</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold" style={{ color: "#2D6A4F" }}>
                      {struttura.tot_recensioni
                        ? Math.round(((struttura.tot_consigli ?? 0) / struttura.tot_recensioni) * 100)
                        : 0}%
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">Consigliano</p>
                  </div>
                </div>

                {/* Azioni rapide */}
                <div className="mt-4 pt-4 border-t border-gray-50 flex flex-wrap gap-2">
                  {[
                    { href: "/dashboard/analytics", icon: BarChart2, label: "Statistiche" },
                    { href: "/onboarding-struttura", icon: Settings, label: "Configura" },
                    { href: "/itinerario", icon: Globe, label: "Itinerario AI" },
                  ].map(({ href, icon: Icon, label }) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <Icon size={12} />
                      {label}
                    </Link>
                  ))}
                </div>
              </section>

              {/* Recensioni recenti */}
              {recensioniPreview.length > 0 && (
                <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-4">
                    <Star size={16} className="text-[#E8956D]" />
                    Recensioni recenti
                  </h2>
                  <div className="flex flex-col divide-y divide-gray-50">
                    {recensioniPreview.map((r) => (
                      <div key={r.id} className="py-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-semibold ${r.voto === "consiglio" ? "text-green-600" : "text-red-500"}`}>
                            {r.voto === "consiglio" ? "👍 Consiglia" : "👎 Non consiglia"}
                          </span>
                          <span className="text-xs text-gray-300">·</span>
                          <span className="text-xs text-gray-400">
                            {new Date(r.created_at).toLocaleDateString("it-IT", { day: "numeric", month: "short" })}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-800">{r.titolo}</p>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{r.testo}</p>
                      </div>
                    ))}
                  </div>
                  <Link
                    href={`/agriturismo/${struttura.slug}#recensioni`}
                    className="flex items-center gap-1 mt-3 text-xs font-semibold text-[#2D6A4F] hover:underline"
                  >
                    Vedi tutte →
                  </Link>
                </section>
              )}

              {/* Presenza nel network */}
              <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-3">
                  <Globe size={16} className="text-[#2D6A4F]" />
                  Presenza nel network viaggi.app
                </h2>
                <p className="text-xs text-gray-500 mb-4">
                  La tua struttura è automaticamente visibile su questi portali del network.
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "agriturismi.app", href: `https://www.agriturismi.app/agriturismo/${struttura.slug}`, attivo: true },
                    { label: "soggiorni.app", href: "https://soggiorni.app", attivo: false },
                    { label: "viaggi.app", href: "https://viaggi.app", attivo: true },
                  ].map(({ label, href, attivo }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors"
                      style={attivo
                        ? { borderColor: "#2D6A4F", color: "#2D6A4F", backgroundColor: "#F0FDF4" }
                        : { borderColor: "#E5E7EB", color: "#9CA3AF" }}
                    >
                      {attivo ? "✓" : "○"} {label}
                    </a>
                  ))}
                </div>
              </section>
            </>
          ) : (
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <Home size={16} className="text-[#2D6A4F]" />
                La mia struttura
              </h2>
              <div className="text-center py-4">
                <p className="text-2xl mb-2">🌾</p>
                <p className="text-sm text-gray-500 mb-4">Nessuna struttura collegata al tuo account</p>
                <Link
                  href="/onboarding-struttura"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ backgroundColor: "#2D6A4F" }}
                >
                  <Home size={14} />
                  Aggiungi il tuo agriturismo
                </Link>
              </div>
            </section>
          )}
        </>
      )}

      {/* 4. Il mio profilo */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-4">
          <User size={16} className="text-[#2D6A4F]" />
          Il mio profilo
        </h2>
        <form onSubmit={(e) => void salvaProfilo(e)} className="flex flex-col gap-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Nome</label>
              <input
                type="text"
                value={formNome}
                onChange={(e) => setFormNome(e.target.value)}
                placeholder="Il tuo nome"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Cognome</label>
              <input
                type="text"
                value={formCognome}
                onChange={(e) => setFormCognome(e.target.value)}
                placeholder="Il tuo cognome"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Email</label>
            <input
              type="email"
              value={profilo?.email ?? ""}
              disabled
              className="w-full px-3 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-sm text-gray-400 cursor-not-allowed"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={savingProfile}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: "#2D6A4F" }}
            >
              {savingProfile ? "Salvataggio…" : "Salva modifiche"}
            </button>
            {profileSaved && (
              <span className="text-sm text-green-600 font-medium">✓ Salvato!</span>
            )}
          </div>
        </form>

        <div className="mt-5 pt-5 border-t border-gray-100">
          <button
            onClick={() => void logout()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-500 border border-red-100 hover:bg-red-50 transition-colors"
          >
            <LogOut size={14} />
            Esci dall&apos;account
          </button>
        </div>
      </section>
    </div>
  );
}
