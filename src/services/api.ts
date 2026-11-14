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
