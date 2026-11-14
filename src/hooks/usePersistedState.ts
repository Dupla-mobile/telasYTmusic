import { useCallback, useEffect, useState } from 'react';
import { storage } from '../services/storage';

// useState que sobrevive ao fechar o app. "pronto" indica que o storage ja foi lido (hidratacao).
export function usePersistedState<T>(chave: string, inicial: T) {
  const [valor, setValor] = useState<T>(inicial);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    let ativo = true;
    storage.get(chave, inicial).then((v) => {
      if (!ativo) return;
      setValor(v);
      setPronto(true);
    });
    return () => {
      ativo = false;
    };
  }, [chave]);

  const atualizar = useCallback(
    (novo: T) => {
      setValor(novo);
      storage.set(chave, novo);
    },
    [chave],
  );

  return [valor, atualizar, pronto] as const;
}
