import { creaClientBrowser } from "./supabase";

export async function accedi(email: string, password: string) {
  const supabase = creaClientBrowser();
  return supabase.auth.signInWithPassword({ email, password });
}

export async function registrati(
  nome: string,
  cognome: string,
  email: string,
  password: string
) {
  const supabase = creaClientBrowser();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nome, cognome },
    },
  });

  if (error) return { data: null, error };

  // Se email confirmation è disabilitata la sessione è già attiva
  if (data.session && data.user) {
    await supabase
      .from("profiles")
      .upsert({ id: data.user.id, nome, cognome });
  }

  return { data, error: null };
}

export async function esci() {
  const supabase = creaClientBrowser();
  return supabase.auth.signOut();
}

export async function getUser() {
  const supabase = creaClientBrowser();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  return { user, error };
}

export async function accediConGoogle(redirectTo: string) {
  const supabase = creaClientBrowser();
  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });
}
