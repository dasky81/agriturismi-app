"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  FileCheck,
  Mail,
  Newspaper,
  Users,
  BarChart2,
  Star,
} from "lucide-react";

const NAV = [
  { href: "/admin",                label: "Panoramica",     icon: LayoutDashboard },
  { href: "/admin/strutture",      label: "Strutture",      icon: Building2 },
  { href: "/admin/rivendicazioni", label: "Rivendicazioni", icon: FileCheck },
  { href: "/admin/contatti",       label: "Contatti",       icon: Mail },
  { href: "/admin/blog",           label: "Blog",           icon: Newspaper },
  { href: "/admin/utenti",         label: "Utenti",         icon: Users },
  { href: "/admin/analytics",      label: "Analytics",      icon: BarChart2 },
  { href: "/admin/recensioni",     label: "Recensioni",     icon: Star },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop: sidebar verticale */}
      <aside className="hidden lg:flex w-52 bg-white border-r border-gray-200 flex-col py-6 px-3 shrink-0">
        <div className="mb-6 px-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#2D6A4F]">
            Admin Panel
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">agriturismi.app</p>
        </div>

        <nav className="flex flex-col gap-0.5 flex-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const attivo =
              href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  attivo
                    ? "bg-[#2D6A4F] text-white"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon size={15} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-100 pt-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            ← Torna al sito
          </Link>
        </div>
      </aside>

      {/* Mobile: tab bar orizzontale */}
      <nav className="lg:hidden bg-white border-b border-gray-200 overflow-x-auto shrink-0">
        <div className="flex items-center gap-0.5 px-3 py-2 min-w-max">
          {NAV.map(({ href, label, icon: Icon }) => {
            const attivo =
              href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  attivo
                    ? "bg-[#2D6A4F] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon size={13} />
                {label}
              </Link>
            );
          })}
          <Link
            href="/"
            className="ml-2 pl-2 border-l border-gray-200 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-gray-400 hover:text-gray-600 whitespace-nowrap transition-colors"
          >
            ← Sito
          </Link>
        </div>
      </nav>
    </>
  );
}
