import { Pressable, StyleSheet, Text } from 'react-native';
import { FONT, RADIUS, SPACING } from '../constants/theme';
import { useTema } from '../context/ThemeContext';
import Capa from './Capa';

type Props = { capa?: string; titulo: string; subtitulo?: string; onPress: () => void; tamanho?: number };

export default function CartaoAlbum({ capa, titulo, subtitulo, onPress, tamanho = 140 }: Props) {
  const { tema } = useTema();
  return (
    <Pressable onPress={onPress} style={[s.cartao, { width: tamanho }]}>
      <Capa uri={capa} tamanho={tamanho} raio={RADIUS.md} />
      <Text numberOfLines={1} style={[s.titulo, { color: tema.text }]}>
        {titulo}
      </Text>
      {subtitulo ? (
        <Text numberOfLines={1} style={[s.sub, { color: tema.textSecondary }]}>
          {subtitulo}
        </Text>
      ) : null}
    </Pressable>
  );
}

const s = StyleSheet.create({
  cartao: { marginRight: SPACING.md },
  titulo: { marginTop: SPACING.sm, fontSize: FONT.md, fontWeight: '600' },
  sub: { fontSize: FONT.sm, marginTop: 2 },
});
