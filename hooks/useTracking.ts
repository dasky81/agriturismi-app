"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function useTracking(agriturismo_id?: string) {
  const pathname = usePathname();
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    if (
      pathname.startsWith("/admin") ||
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/api")
    )
      return;

    tracked.current = true;

    let sessionId = sessionStorage.getItem("ag_session");
    if (!sessionId) {
      sessionId = Math.random().toString(36).slice(2);
      sessionStorage.setItem("ag_session", sessionId);
    }

    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pagina: pathname,
        agriturismo_id: agriturismo_id ?? null,
        referrer: document.referrer || null,
        sessione_id: sessionId,
      }),
    }).catch(() => {});
  }, [pathname, agriturismo_id]);
}
