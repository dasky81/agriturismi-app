"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BenvenutoPage() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      router.replace("/dashboard");
    }, 2500);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center gap-6 px-4 text-center"
      style={{ backgroundColor: "#1B4332" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <svg width="48" height="48" viewBox="0 0 30 30" fill="none" aria-hidden="true">
          <path
            d="M15 2C15 2 5 9 5 18C5 23.5 9.5 28 15 28C20.5 28 25 23.5 25 18C25 9 15 2 15 2Z"
            fill="#52B788"
          />
          <path d="M15 2C15 2 15 13 10.5 20" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M15 2C15 2 15 15 19.5 21" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <div className="text-left">
          <p className="text-2xl font-bold text-white tracking-tight">agriturismi.app</p>
          <p className="text-xs text-white/50">by viaggi.app</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white">Benvenuto!</h1>
        <p className="text-white/70 max-w-xs text-sm">
          Il tuo account è stato creato con successo. Stiamo caricando la tua dashboard&hellip;
        </p>
      </div>

      <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
    </div>
  );
}
