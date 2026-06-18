import { redirect } from "next/navigation";
import { creaClientServer } from "@/lib/supabase-server";
import AdminPannel, { type Rivendicazione, type AgriturismoBrief } from "./AdminPannel";

export default async function AdminPage() {
  const supabase = await creaClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/admin");

  const { data: profilo } = await supabase
    .from("profiles")
    .select("ruolo")
    .eq("id", user.id)
    .single();

  if (profilo?.ruolo !== "admin") redirect("/dashboard");

  const { data: rivendicazioni } = await supabase
    .from("rivendicazioni")
    .select("*, agriturismo:agriturismi(nome, slug), utente:profiles(nome, cognome)")
    .eq("stato", "pending")
    .order("created_at", { ascending: false });

  const { data: agriturismi } = await supabase
    .from("agriturismi")
    .select("id, nome, slug, regione, attivo, verificato")
    .order("nome");

  const { count: totaleUtenti } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  const stats = {
    totaleStrutture: agriturismi?.length ?? 0,
    totaleUtenti: totaleUtenti ?? 0,
    totalePending: rivendicazioni?.length ?? 0,
  };

  return (
    <AdminPannel
      rivendicazioniInitial={(rivendicazioni ?? []) as Rivendicazione[]}
      agriturismiInitial={(agriturismi ?? []) as AgriturismoBrief[]}
      stats={stats}
    />
  );
}
