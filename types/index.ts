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
  contenuto: string | null;
  excerpt: string | null;
  cover_url: string | null;
  autore_id: string | null;
  agriturismo_id: string | null;
  tags: string[];
  pubblicato: boolean;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  created_at: string;
  updated_at: string;
}

export interface PostConAutore extends Post {
  autore: { nome: string | null; cognome: string | null } | null;
  agriturismo: { id: string; slug: string; nome: string; regione: string | null } | null;
}
