import { Album, Artista, Faixa, FeedbackEnviado, NovoFeedback } from '../types';
import { ehAlbum, ehFaixa, paraAlbum, paraFaixa, RespostaItunes } from './mapeadores';

const ITUNES = process.env.EXPO_PUBLIC_API_URL ?? 'https://itunes.apple.com';
const FEEDBACK = process.env.EXPO_PUBLIC_FEEDBACK_URL ?? 'https://jsonplaceholder.typicode.com';

// Unica porta de entrada HTTP do app: telas nao conhecem URL, cabecalhos nem erros de rede.
async function req<T>(url: string, init?: RequestInit, timeoutMs = 10000): Promise<T> {
  const controle = new AbortController();
  const timer = setTimeout(() => controle.abort(), timeoutMs);
  try {
    const r = await fetch(url, {
      headers: init?.body ? { 'Content-Type': 'application/json' } : undefined,
      ...init,
      signal: controle.signal,
    });
    if (r.status === 404) throw new Error('Conteúdo não encontrado');
    if (!r.ok) throw new Error(`Falha ${r.status}`);
    return (await r.json()) as T;
  } catch (e) {
    const erro = e as Error;
    if (erro.name === 'AbortError') throw new Error('Tempo esgotado. Verifique sua conexão.');
    if (erro.message.includes('Network request failed')) throw new Error('Sem conexão com a internet');
    throw erro;
  } finally {
    clearTimeout(timer);
  }
}

const enc = encodeURIComponent;

export async function buscarMusicas(termo: string, limite = 25): Promise<Faixa[]> {
  const d = await req<RespostaItunes>(
    `${ITUNES}/search?term=${enc(termo)}&media=music&entity=song&country=BR&limit=${limite}`,
  );
  return d.results.filter(ehFaixa).map(paraFaixa);
}

export async function buscarAlbuns(termo: string, limite = 20): Promise<Album[]> {
  const d = await req<RespostaItunes>(
    `${ITUNES}/search?term=${enc(termo)}&media=music&entity=album&country=BR&limit=${limite}`,
  );
  return d.results.filter(ehAlbum).map(paraAlbum);
}

export type ResultadoAlbum = { album: Album; faixas: Faixa[] };
export type ResultadoArtista = { artista: Artista; albuns: Album[]; faixas: Faixa[] };

export async function buscarAlbum(id: number): Promise<ResultadoAlbum> {
  const d = await req<RespostaItunes>(`${ITUNES}/lookup?id=${id}&entity=song&country=BR`);
  const colecao = d.results.find(ehAlbum);
  if (!colecao) throw new Error('Álbum não encontrado');
  return { album: paraAlbum(colecao), faixas: d.results.filter(ehFaixa).map(paraFaixa) };
}

export async function buscarArtista(id: number): Promise<ResultadoArtista> {
  const [a, b] = await Promise.all([
    req<RespostaItunes>(`${ITUNES}/lookup?id=${id}&entity=album&limit=20&country=BR`),
    req<RespostaItunes>(`${ITUNES}/lookup?id=${id}&entity=song&limit=10&country=BR`),
  ]);
  const info = a.results.find((i) => i.wrapperType === 'artist');
  if (!info) throw new Error('Artista não encontrado');
  return {
    artista: { id, nome: info.artistName ?? 'Artista', genero: info.primaryGenreName },
    albuns: a.results.filter(ehAlbum).map(paraAlbum),
    faixas: b.results.filter(ehFaixa).map(paraFaixa),
  };
}
