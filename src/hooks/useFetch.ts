import { DependencyList, useCallback, useEffect, useRef, useState } from 'react';

// Hook generico da Aula 9: loading, erro, dados e recarregar.
// Ignora respostas antigas quando uma nova chamada ja foi disparada.
export function useFetch<T>(buscar: () => Promise<T>, deps: DependencyList = []) {
  const [dados, setDados] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const ultima = useRef(0);
  const funcao = useRef(buscar);
  funcao.current = buscar;

  const carregar = useCallback(async () => {
    const id = ++ultima.current;
    setLoading(true);
    setErro(null);
    try {
      const resultado = await funcao.current();
      if (id === ultima.current) setDados(resultado);
    } catch (e) {
      if (id === ultima.current) setErro((e as Error).message);
    } finally {
      if (id === ultima.current) setLoading(false);
    }
  }, deps);

  useEffect(() => {
    carregar();
  }, [carregar]);

  return { dados, loading, erro, recarregar: carregar };
}
