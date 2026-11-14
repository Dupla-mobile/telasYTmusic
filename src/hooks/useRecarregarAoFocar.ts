import { useFocusEffect } from 'expo-router';
import { useCallback, useRef } from 'react';

// Recarrega os dados quando a tela volta ao foco (ex.: depois de curtir ou criar playlist em outra tela).
export function useRecarregarAoFocar(recarregar: () => void) {
  const primeira = useRef(true);
  useFocusEffect(
    useCallback(() => {
      if (primeira.current) {
        primeira.current = false;
        return;
      }
      recarregar();
    }, [recarregar]),
  );
}
