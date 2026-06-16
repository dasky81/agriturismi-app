export interface Agriturismo {
  id: string;
  slug: string;
  nome: string;
  descrizione: string;
  regione: string;
  provincia: string;
  comune: string;
  lat: number;
  lng: number;
  servizi: string[];
  foto: string[];
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
