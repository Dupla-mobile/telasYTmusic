import { storage } from './storage';

type Entrada<T> = { dados: T; salvoEm: number };

export const PREFIXO_CACHE = 'cache:';

// Cache com validade (TTL): usa o dado guardado se ainda for fresco; se a API falhar (offline),
// devolve o dado antigo em vez de mostrar erro.
export async function comCache<T>(chave: string, buscar: () => Promise<T>, ttlMs = 5 * 60_000): Promise<T> {
  const guardado = await storage.get<Entrada<T> | null>(chave, null);
  const fresco = guardado !== null && Date.now() - guardado.salvoEm < ttlMs;
  if (guardado && fresco) return guardado.dados;

  try {
    const dados = await buscar();
    await storage.set(chave, { dados, salvoEm: Date.now() });
    return dados;
  } catch (e) {
    if (guardado) return guardado.dados;
    throw e;
  }
}

export const removerCache = (chave: string) => storage.remove(chave);
export const limparCaches = () => storage.removerPrefixo(PREFIXO_CACHE);
