import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { curtir, descurtir, idsCurtidos } from '../db/banco';
import { Faixa } from '../types';

type Ctx = {
  curtidas: Set<number>;
  alternarCurtida: (f: Faixa) => Promise<void>;
  recarregarCurtidas: () => Promise<void>;
};

const BibliotecaCtx = createContext<Ctx>({
  curtidas: new Set(),
  alternarCurtida: async () => {},
  recarregarCurtidas: async () => {},
});

// Mantem em memoria o conjunto de ids curtidos (espelho do SQLite) para os coracoes reagirem na hora.
export function BibliotecaProvider({ children }: { children: ReactNode }) {
  const [curtidas, setCurtidas] = useState<Set<number>>(new Set());

  const recarregarCurtidas = useCallback(async () => {
    try {
      setCurtidas(new Set(await idsCurtidos()));
    } catch {
      // banco indisponivel: mantem o que ja tem
    }
  }, []);

  useEffect(() => {
    recarregarCurtidas();
  }, [recarregarCurtidas]);

  const alternarCurtida = useCallback(
    async (f: Faixa) => {
      const ja = curtidas.has(f.id);
      setCurtidas((atual) => {
        const novo = new Set(atual);
        if (ja) novo.delete(f.id);
        else novo.add(f.id);
        return novo;
      });
      try {
        if (ja) await descurtir(f.id);
        else await curtir(f);
      } catch {
        recarregarCurtidas(); // desfaz o otimismo se o banco falhar
      }
    },
    [curtidas, recarregarCurtidas],
  );

  const valor = useMemo(() => ({ curtidas, alternarCurtida, recarregarCurtidas }), [curtidas, alternarCurtida, recarregarCurtidas]);
  return <BibliotecaCtx.Provider value={valor}>{children}</BibliotecaCtx.Provider>;
}

export const useBiblioteca = () => useContext(BibliotecaCtx);
