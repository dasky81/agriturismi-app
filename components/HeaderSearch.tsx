"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function HeaderSearch() {
  const [dove, setDove] = useState("");
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

  return (
    <form
      onSubmit={handleSubmit}
      className="hidden md:flex items-center rounded-full border bg-white shadow-sm hover:shadow-md transition-shadow"
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
  );
}
