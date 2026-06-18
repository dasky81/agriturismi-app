import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
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

interface Props {
  agriturismo: Agriturismo;
}

export default function AgriCard({ agriturismo: a }: Props) {
  const primiServizi = a.servizi.slice(0, 3);
  const altriServizi = a.servizi.length - 3;

  return (
    <div className="flex flex-col gap-1.5">
      <Link
        href={`/agriturismo/${a.slug}`}
        className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      >
        {/* Cover */}
        <div className="relative h-48 w-full overflow-hidden">
          {a.foto_principale ? (
            <Image
              src={a.foto_principale}
              alt={a.nome}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-2"
              style={{
                background:
                  "linear-gradient(135deg, #1B4332 0%, #2D6A4F 55%, #52B788 100%)",
              }}
            >
              <span className="text-5xl opacity-30 select-none">🌿</span>
              <span className="text-white/50 text-xs font-medium select-none">
                Foto non ancora disponibile
              </span>
            </div>
          )}

          {/* Badge regione */}
          {a.regione && (
            <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm shadow-sm text-[#1B4332]">
              {a.regione}
            </span>
          )}
        </div>

        {/* Contenuto */}
        <div className="p-4 flex flex-col gap-1.5">
          {/* Tipo ospitalità */}
          {a.tipo_ospitalita.length > 0 && (
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#52B788]">
              {a.tipo_ospitalita.slice(0, 2).join(" · ")}
            </p>
          )}

          {/* Nome */}
          <h3 className="font-display font-bold text-[#1B4332] text-base leading-tight group-hover:text-[#2D6A4F] transition-colors">
            {a.nome}
          </h3>

          {/* Comune */}
          {(a.comune ?? a.provincia) && (
            <p className="flex items-center gap-1 text-xs text-gray-400">
              <MapPin size={11} />
              {[a.comune, a.provincia].filter(Boolean).join(", ")}
            </p>
          )}

          {/* Servizi */}
          {a.servizi.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {primiServizi.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1 text-[10px] bg-[#FAFAF7] border border-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                >
                  {SERVIZI_EMOJI[s] ?? "✓"} {s}
                </span>
              ))}
              {altriServizi > 0 && (
                <span className="text-[10px] text-gray-400 px-1 py-0.5">
                  +{altriServizi}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>

      {/* Banner scheda non rivendicata */}
      {!a.verificato && (
        <Link
          href={`/rivendica-scheda?slug=${a.slug}`}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-100 text-[10px] text-gray-400 hover:text-[#2D6A4F] hover:border-[#2D6A4F] hover:bg-white transition-colors"
        >
          <span>⚑</span>
          <span>
            Scheda non rivendicata. Sei il titolare?{" "}
            <span className="font-semibold underline underline-offset-2">
              Rivendica gratuitamente
            </span>
          </span>
        </Link>
      )}
    </div>
  );
}
