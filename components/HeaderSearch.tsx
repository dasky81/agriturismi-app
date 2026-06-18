"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Loader2 } from "lucide-react";

export default function HeaderSearch() {
  const [dove, setDove] = useState("");
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoErrore, setGeoErrore] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = dove.trim();
    if (q) {
      router.push(`/?q=${encodeURIComponent(q)}`);
    } else {
      router.push("/");
    }
  }

  function handleVicinoAMe() {
    if (!("geolocation" in navigator)) {
      setGeoErrore("Il browser non supporta la geolocalizzazione.");
      return;
    }
    setGeoErrore("");
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoLoading(false);
        const { latitude: lat, longitude: lng } = pos.coords;
        router.push(`/?vicino=${lat},${lng}`);
      },
      () => {
        setGeoLoading(false);
        setGeoErrore("Attiva la posizione nel browser.");
      },
      { timeout: 10000 }
    );
  }

  return (
    <div className="hidden md:flex items-center gap-2 relative">
      <form
        onSubmit={handleSubmit}
        className="flex items-center rounded-full border bg-white shadow-sm hover:shadow-md transition-shadow"
        style={{ borderColor: "#DDDDDD" }}
      >
        {/* Dove? */}
        <div className="flex flex-col px-5 py-2.5 cursor-text min-w-0">
          <span className="text-[10px] font-semibold text-gray-900 whitespace-nowrap">Dove?</span>
          <input
            type="text"
            value={dove}
            onChange={(e) => setDove(e.target.value)}
            placeholder="Regione o tipo di esperienza"
            className="text-xs text-gray-500 placeholder:text-gray-400 bg-transparent focus:outline-none w-40"
          />
        </div>

        {/* Divider */}
        <div className="self-stretch w-px bg-gray-200" />

        {/* Quando? */}
        <button
          type="button"
          className="flex flex-col px-5 py-2.5 hover:bg-gray-50 rounded-full transition-colors"
        >
          <span className="text-[10px] font-semibold text-gray-900">Quando?</span>
          <span className="text-xs text-gray-400">Qualsiasi data</span>
        </button>

        {/* Divider */}
        <div className="self-stretch w-px bg-gray-200" />

        {/* Ospiti */}
        <button
          type="button"
          className="flex flex-col pl-5 pr-3 py-2.5 hover:bg-gray-50 rounded-r-full transition-colors"
        >
          <span className="text-[10px] font-semibold text-gray-900">Ospiti</span>
          <span className="text-xs text-gray-400">Aggiungi ospiti</span>
        </button>

        {/* Search button */}
        <button
          type="submit"
          className="m-1.5 p-2.5 rounded-full text-white transition-opacity hover:opacity-90 shrink-0"
          style={{ backgroundColor: "#2D6A4F" }}
          aria-label="Cerca"
        >
          <Search size={15} />
        </button>
      </form>

      {/* Vicino a me */}
      <div className="relative">
        <button
          type="button"
          onClick={handleVicinoAMe}
          disabled={geoLoading}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border bg-white text-sm font-medium text-gray-700 hover:shadow-md transition-shadow disabled:opacity-60 shrink-0"
          style={{ borderColor: "#DDDDDD" }}
          title="Cerca agriturismi vicino a te"
        >
          {geoLoading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <MapPin size={14} />
          )}
          Vicino a me
        </button>
        {geoErrore && (
          <div className="absolute top-full mt-2 right-0 bg-red-50 border border-red-100 text-red-600 text-xs px-3 py-2 rounded-xl whitespace-nowrap shadow-sm">
            {geoErrore}
          </div>
        )}
      </div>
    </div>
  );
}
