"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, User } from "lucide-react";
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
      <Link
        href="/login"
        className="px-4 py-1.5 rounded-full border-2 border-[#2D6A4F] text-[#2D6A4F] text-sm font-semibold hover:bg-[#2D6A4F] hover:text-white transition-colors"
      >
        Accedi
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <span className="flex items-center gap-1.5 text-gray-700 text-sm">
        <User size={14} />
        {utente.nome ?? "Profilo"}
      </span>
      <button
        onClick={handleEsci}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-600 transition-colors"
      >
        <LogOut size={14} />
        Esci
      </button>
    </div>
  );
}
