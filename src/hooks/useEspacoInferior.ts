import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ALTURA_MINI } from '../constants/layout';
import { usePlayer } from '../context/PlayerContext';

// Espaco no fim das listas para o conteudo nao ficar escondido atras do mini-player.
export function useEspacoInferior(naTabs = false): number {
  const { atual } = usePlayer();
  const insets = useSafeAreaInsets();
  return (atual ? ALTURA_MINI + 24 : 16) + (naTabs ? 0 : insets.bottom);
}
