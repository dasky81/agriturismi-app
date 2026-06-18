import { NextRequest, NextResponse } from "next/server";
import { creaClientServer } from "@/lib/supabase-server";
import type { Agriturismo } from "@/types";

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { lat: number; lng: number };
  const { lat, lng } = body;

  if (typeof lat !== "number" || typeof lng !== "number") {
    return NextResponse.json({ error: "lat e lng sono richiesti" }, { status: 400 });
  }

  const supabase = await creaClientServer();
  const { data } = await supabase
    .from("agriturismi")
    .select("*")
    .eq("attivo", true)
    .not("lat", "is", null)
    .not("lng", "is", null);

  const risultati = ((data ?? []) as Agriturismo[])
    .map((a) => ({
      ...a,
      distanza_km: Math.round(haversine(lat, lng, a.lat!, a.lng!) * 10) / 10,
    }))
    .filter((a) => a.distanza_km <= 15)
    .sort((a, b) => a.distanza_km - b.distanza_km)
    .slice(0, 20);

  return NextResponse.json({ agriturismi: risultati });
}
