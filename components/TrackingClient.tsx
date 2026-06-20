"use client";
import { useTracking } from "@/hooks/useTracking";

export default function TrackingClient({ agriturismo_id }: { agriturismo_id?: string }) {
  useTracking(agriturismo_id);
  return null;
}
