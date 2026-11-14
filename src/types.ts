export type Faixa = {
  id: number;
  titulo: string;
  artista: string;
  artistaId?: number;
  album?: string;
  albumId?: number;
  capa?: string;
  previewUrl?: string;
  duracaoMs?: number;
  genero?: string;
};

export type Album = {
  id: number;
  titulo: string;
  artista: string;
  artistaId?: number;
  capa?: string;
  faixas?: number;
  ano?: string;
  genero?: string;
};

export type Artista = { id: number; nome: string; genero?: string };

export type Usuario = { nome: string; email: string };

export type PlaylistLocal = { id: number; nome: string; criadaEm: number; total: number };

export type Preferencias = { autoplay: boolean; capaHD: boolean };

export type NovoFeedback = { title: string; body: string; userId: number };
export type FeedbackEnviado = NovoFeedback & { id: number };
