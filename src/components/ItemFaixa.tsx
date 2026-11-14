import { Ionicons } from '@expo/vector-icons';
import { ReactNode, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FONT, SPACING } from '../constants/theme';
import { useBiblioteca } from '../context/BibliotecaContext';
import { usePlayer } from '../context/PlayerContext';
import { useTema } from '../context/ThemeContext';
import { Faixa } from '../types';
import { formatarTempo } from '../utils/formatar';
import Capa from './Capa';
import SeletorPlaylist from './SeletorPlaylist';

type Props = { faixa: Faixa; onPress: () => void; acaoExtra?: ReactNode };

export default function ItemFaixa({ faixa, onPress, acaoExtra }: Props) {
  const { tema } = useTema();
  const { curtidas, alternarCurtida } = useBiblioteca();
  const { atual } = usePlayer();
  const [menu, setMenu] = useState(false);
  const curtida = curtidas.has(faixa.id);
  const ativa = atual?.id === faixa.id;

  return (
    <Pressable onPress={onPress} style={s.linha}>
      <Capa uri={faixa.capa} tamanho={48} />
      <View style={s.info}>
        <Text numberOfLines={1} style={[s.titulo, { color: ativa ? tema.primary : tema.text }]}>
          {faixa.titulo}
        </Text>
        <Text numberOfLines={1} style={[s.sub, { color: tema.textSecondary }]}>
          {faixa.artista}
          {faixa.duracaoMs ? ` · ${formatarTempo(faixa.duracaoMs / 1000)}` : ''}
        </Text>
      </View>
      {acaoExtra}
      <Pressable hitSlop={10} onPress={() => alternarCurtida(faixa)} style={s.icone}>
        <Ionicons name={curtida ? 'heart' : 'heart-outline'} size={22} color={curtida ? tema.primary : tema.textSecondary} />
      </Pressable>
      <Pressable hitSlop={10} onPress={() => setMenu(true)} style={s.icone}>
        <Ionicons name="ellipsis-vertical" size={20} color={tema.textSecondary} />
      </Pressable>
      {menu ? <SeletorPlaylist faixa={faixa} onFechar={() => setMenu(false)} /> : null}
    </Pressable>
  );
}

const s = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md },
  info: { flex: 1, marginLeft: SPACING.md },
  titulo: { fontSize: FONT.lg, fontWeight: '600' },
  sub: { fontSize: FONT.sm, marginTop: 2 },
  icone: { marginLeft: SPACING.md },
});
