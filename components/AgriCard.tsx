"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, MapPin } from "lucide-react";
import type { Agriturismo } from "@/types";

const SERVIZI_EMOJI: Record<string, string> = {
  piscina: "🏊",
  ristorante: "🍽️",
  "Wi-Fi": "📶",
  parcheggio: "🚗",
  "animali ammessi": "🐾",
  "area giochi bambini": "🎠",
  "degustazione vini": "🍷",
  trekking: "🥾",
  maneggio: "🐴",
  spa: "♨️",
};

const REGIONE_EMOJI: Record<string, string> = {
  Toscana: "🌻",
  Umbria: "🫒",
  Sicilia: "🍋",
  Puglia: "🏺",
  Piemonte: "🍇",
  Veneto: "🍾",
  Sardegna: "🌊",
  Campania: "🍕",
  Liguria: "⚓",
  Lombardia: "🏔",
  Lazio: "🏛",
  Calabria: "🌶",
  Basilicata: "🦅",
  Abruzzo: "🐻",
  Molise: "🌾",
  Marche: "🏰",
  "Friuli-Venezia Giulia": "🍷",
  "Trentino-Alto Adige": "⛷",
  "Valle d'Aosta": "🏔",
  "Emilia-Romagna": "🧀",
};

interface Props {
  agriturismo: Agriturismo;
  distanza_km?: number;
}

export default function AgriCard({ agriturismo: a, distanza_km }: Props) {
  const [salvato, setSalvato] = useState(false);
  const router = useRouter();

  const primiServizi = a.servizi.slice(0, 3);
  const regioneEmoji = a.regione ? (REGIONE_EMOJI[a.regione] ?? "🌿") : "🌿";

  return (
    <article className="flex flex-col gap-1.5">
      {/* Card principale */}
      <div
        className="group cursor-pointer"
        onClick={() => router.push(`/agriturismo/${a.slug}`)}
        role="link"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && router.push(`/agriturismo/${a.slug}`)}
      >
        {/* Foto 4/3 */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100 mb-3">
          {a.foto_principale ? (
            <Image
              src={a.foto_principale}
              alt={a.nome}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, #1B4332 0%, #2D6A4F 55%, #52B788 100%)",
              }}
            >
              <span className="text-5xl opacity-40 select-none">{regioneEmoji}</span>
              <span className="text-white/50 text-xs select-none">Foto non disponibile</span>
            </div>
          )}

          {/* Cuore salva */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSalvato(!salvato);
            }}
            className="absolute top-3 right-3 z-10 p-1.5 rounded-full hover:scale-110 transition-transform"
            aria-label={salvato ? "Rimuovi dai salvati" : "Salva"}
          >
            <Heart
              size={20}
              className={
                salvato
                  ? "text-[#E8956D] fill-[#E8956D]"
                  : "text-white drop-shadow-sm"
              }
              strokeWidth={salvato ? 2 : 2.5}
            />
          </button>

          {/* Badge regione */}
          {a.regione && (
            <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm shadow-sm text-gray-900">
              {a.regione}
            </span>
          )}

          {/* Badge distanza */}
          {distanza_km !== undefined && (
            <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/95 backdrop-blur-sm shadow-sm text-gray-900">
              📍 {distanza_km < 1 ? "< 1 km" : `${distanza_km} km`} da te
            </span>
          )}
        </div>

        {/* Info testuale */}
        <div className="flex flex-col gap-1 px-0.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-[#222222] text-sm leading-snug line-clamp-1">
              {a.nome}
            </h3>
          </div>

          {(a.comune ?? a.regione) && (
            <p className="flex items-center gap-1 text-xs text-[#717171]">
              <MapPin size={11} className="shrink-0" />
              {[a.comune, a.regione].filter(Boolean).join(", ")}
            </p>
          )}

          {a.tipo_ospitalita.length > 0 && (
            <p className="text-xs text-[#717171]">
              {a.tipo_ospitalita.slice(0, 2).join(" · ")}
            </p>
          )}

          {primiServizi.length > 0 && (
            <p className="text-xs text-[#717171]">
              {primiServizi.map((s) => `${SERVIZI_EMOJI[s] ?? "✓"} ${s}`).join(" · ")}
            </p>
          )}
        </div>
      </div>

      {/* Banner scheda non rivendicata (fuori dal link) */}
      {!a.verificato && (
        <Link
          href={`/rivendica-scheda?slug=${a.slug}`}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] transition-colors hover:bg-gray-100"
          style={{ color: "#717171" }}
        >
          <span>⚑</span>
          <span>
            Scheda non rivendicata —{" "}
            <span className="underline underline-offset-2 font-medium">
              Rivendica gratuitamente
            </span>
          </span>
        </Link>
      )}
    </article>
  );
}
