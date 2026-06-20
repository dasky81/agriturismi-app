"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, User, Menu, X, Shield, Settings } from "lucide-react";
import { esci } from "@/lib/auth";

interface Props {
  utente: { nome: string | null; ruolo: string | null } | null;
}

export default function HeaderAuth({ utente }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const isAdmin = utente?.ruolo === "admin";

  async function handleEsci() {
    setIsMenuOpen(false);
    await esci();
    router.push("/");
    router.refresh();
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <>
      {/* ── PILL HAMBURGER ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2">

        {/* Admin link desktop */}
        {utente && isAdmin && (
          <Link
            href="/admin"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#E8956D" }}
          >
            <Settings size={13} />
            Admin
          </Link>
        )}

        {/* Desktop CTA (solo se non loggato) */}
        {!utente && (
          <div className="hidden sm:flex items-center gap-2">
            <Link
              href="/login"
              className="px-4 py-2 rounded-full border text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              style={{ borderColor: "#DDDDDD" }}
            >
              Accedi
            </Link>
            <Link
              href="/registrati"
              className="px-4 py-2 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#2D6A4F" }}
            >
              Registrati
            </Link>
          </div>
        )}

        {/* Pill con hamburger/avatar */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center gap-1 rounded-full border px-3 py-2 hover:shadow-md transition-shadow cursor-pointer"
          style={{ borderColor: "#DDDDDD" }}
          aria-label="Apri menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? (
            <X size={16} className="text-gray-700 shrink-0" />
          ) : (
            <Menu size={16} className="text-gray-700 shrink-0" />
          )}
          {utente && (
            <div
              className="ml-1 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: isAdmin ? "#E8956D" : "#2D6A4F" }}
            >
              {utente.nome ? utente.nome[0].toUpperCase() : <User size={13} />}
            </div>
          )}
        </button>
      </div>

      {/* ── MOBILE MENU ────────────────────────────────────────────── */}
      {isMenuOpen && (
        <>
          {/* Overlay chiudi-menu — parte sotto l'header per non bloccare il pulsante hamburger */}
          <div
            className="fixed inset-x-0 top-20 bottom-0 z-30"
            aria-hidden="true"
            onClick={closeMenu}
          />

          {/* Pannello menu */}
          <div className="fixed top-20 inset-x-0 z-40 bg-white border-b shadow-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-1">

              {/* Navigazione */}
              <Link
                href="/"
                onClick={closeMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                🌿 Esplora agriturismi
              </Link>
              <Link
                href="/blog"
                onClick={closeMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                📖 Blog
              </Link>
              <Link
                href="/per-gestori"
                onClick={closeMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                🏡 Per gestori
              </Link>

              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white transition-colors"
                  style={{ backgroundColor: "#E8956D" }}
                >
                  <Shield size={15} />
                  Admin panel
                </Link>
              )}

              <div className="h-px bg-gray-100 my-1" />

              {!utente ? (
                /* Non loggato */
                <div className="flex flex-col gap-2 pt-1">
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="w-full text-center py-3 rounded-xl border text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    style={{ borderColor: "#DDDDDD" }}
                  >
                    Accedi
                  </Link>
                  <Link
                    href="/registrati"
                    onClick={closeMenu}
                    className="w-full text-center py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "#2D6A4F" }}
                  >
                    Registrati — sono un viaggiatore
                  </Link>
                  <Link
                    href="/registrati?ruolo=proprietario"
                    onClick={closeMenu}
                    className="w-full text-center py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "#E8956D" }}
                  >
                    Aggiungi la tua struttura
                  </Link>
                </div>
              ) : (
                /* Loggato */
                <div className="flex flex-col gap-1 pt-1">
                  <div className="px-4 py-2">
                    <p className="text-xs text-gray-400">Connesso come</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {utente.nome ?? "Utente"}
                    </p>
                    {utente.ruolo && (
                      <span
                        className="inline-block mt-0.5 text-[10px] px-2 py-0.5 rounded-full font-medium capitalize text-white"
                        style={{ backgroundColor: isAdmin ? "#E8956D" : "#2D6A4F" }}
                      >
                        {utente.ruolo}
                      </span>
                    )}
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleEsci}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                  >
                    <LogOut size={15} />
                    Esci
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
