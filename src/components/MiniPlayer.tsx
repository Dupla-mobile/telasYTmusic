import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ALTURA_MINI } from '../constants/layout';
import { FONT, RADIUS, SPACING } from '../constants/theme';
import { usePlayer } from '../context/PlayerContext';
import { useTema } from '../context/ThemeContext';
import BarraProgresso from './BarraProgresso';
import Capa from './Capa';

export default function MiniPlayer() {
  const { tema } = useTema();
  const { atual, tocando, alternar, proxima } = usePlayer();
  if (!atual) return null;

  return (
    <Pressable
      onPress={() => router.push('/player')}
      style={[s.caixa, { backgroundColor: tema.surfaceAlt, height: ALTURA_MINI }]}
    >
      <View style={s.linha}>
        <Capa uri={atual.capa} tamanho={42} />
        <View style={s.info}>
          <Text numberOfLines={1} style={[s.titulo, { color: tema.text }]}>
            {atual.titulo}
          </Text>
          <Text numberOfLines={1} style={[s.sub, { color: tema.textSecondary }]}>
            {atual.artista}
          </Text>
        </View>
        <Pressable hitSlop={10} onPress={alternar} style={s.botao}>
          <Ionicons name={tocando ? 'pause' : 'play'} size={26} color={tema.text} />
        </Pressable>
        <Pressable hitSlop={10} onPress={proxima} style={s.botao}>
          <Ionicons name="play-skip-forward" size={22} color={tema.text} />
        </Pressable>
      </View>
      <BarraProgresso altura={2} />
    </Pressable>
  );
}

const s = StyleSheet.create({
  caixa: { marginHorizontal: SPACING.sm, borderRadius: RADIUS.md, paddingTop: SPACING.sm, paddingHorizontal: SPACING.sm, justifyContent: 'space-between', paddingBottom: 0, overflow: 'hidden' },
  linha: { flexDirection: 'row', alignItems: 'center' },
  info: { flex: 1, marginLeft: SPACING.sm },
  titulo: { fontSize: FONT.md, fontWeight: '600' },
  sub: { fontSize: FONT.sm },
  botao: { marginLeft: SPACING.md },
});
