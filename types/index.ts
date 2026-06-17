export interface Agriturismo {
  id: string;
  slug: string;
  nome: string;
  descrizione: string | null;
  descrizione_ai: string | null;
  regione: string | null;
  provincia: string | null;
  comune: string | null;
  indirizzo: string | null;
  lat: number | null;
  lng: number | null;
  telefono: string | null;
  email: string | null;
  sito_web: string | null;
  foto_principale: string | null;
  gallery: string[];
  servizi: string[];
  tipo_ospitalita: string[];
  proprietario_id: string | null;
  verificato: boolean;
  attivo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profilo {
  id: string;
  nome: string;
  cognome: string;
  ruolo: "visitatore" | "proprietario" | "admin";
}

export interface Post {
  id: string;
  slug: string;
  titolo: string;
  contenuto: string;
  autore_id: string;
  pubblicato: boolean;
}
