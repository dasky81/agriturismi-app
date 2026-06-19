import { redirect } from "next/navigation";
import { creaClientServer } from "@/lib/supabase-server";
import AdminSidebar from "@/components/AdminSidebar";

export const metadata = { title: "Admin — agriturismi.app" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  return (
    <div className="flex flex-1 min-h-0 bg-[#F8FAFC]">
      <AdminSidebar />
      <main className="flex-1 min-w-0 p-8 overflow-auto">{children}</main>
    </div>
  );
}
