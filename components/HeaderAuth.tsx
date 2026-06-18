"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, User, Menu } from "lucide-react";
import { esci } from "@/lib/auth";

interface Props {
  utente: { nome: string | null } | null;
}

export default function HeaderAuth({ utente }: Props) {
  const router = useRouter();

  async function handleEsci() {
    await esci();
    router.push("/");
    router.refresh();
  }

  if (!utente) {
    return (
      <div
        className="flex items-center gap-1 rounded-full border px-3 py-2 hover:shadow-md transition-shadow cursor-pointer"
        style={{ borderColor: "#DDDDDD" }}
      >
        <Menu size={16} className="text-gray-700 shrink-0" />
        <Link
          href="/login"
          className="hidden sm:flex items-center gap-1.5 ml-2 text-sm font-medium text-gray-700"
        >
          <User size={14} />
          Accedi
        </Link>
        <span className="hidden sm:block mx-1.5 text-gray-300">·</span>
        <Link
          href="/registrati"
          className="hidden sm:block text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
        >
          Registrati
        </Link>
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-1 rounded-full border px-3 py-2 hover:shadow-md transition-shadow"
      style={{ borderColor: "#DDDDDD" }}
    >
      <Menu size={16} className="text-gray-700 shrink-0" />
      <div className="flex items-center gap-2 ml-2">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
          style={{ backgroundColor: "#2D6A4F" }}
        >
          {utente.nome ? utente.nome[0].toUpperCase() : <User size={13} />}
        </div>
        <button
          onClick={handleEsci}
          className="hidden sm:flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 transition-colors"
          title="Esci"
        >
          <LogOut size={13} />
        </button>
      </div>
    </div>
  );
}
