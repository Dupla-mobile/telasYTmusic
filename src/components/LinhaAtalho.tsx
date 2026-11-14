import { Ionicons } from '@expo/vector-icons';
import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FONT, RADIUS, SPACING } from '../constants/theme';
import { useTema } from '../context/ThemeContext';

type Props = {
  icone: keyof typeof Ionicons.glyphMap;
  titulo: string;
  subtitulo?: string;
  onPress?: () => void;
  direita?: ReactNode;
  cor?: string;
};

export default function LinhaAtalho({ icone, titulo, subtitulo, onPress, direita, cor }: Props) {
  const { tema } = useTema();
  const corIcone = cor ?? tema.text;
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={s.linha}>
      <View style={[s.icone, { backgroundColor: tema.surfaceAlt }]}>
        <Ionicons name={icone} size={22} color={corIcone} />
      </View>
      <View style={s.info}>
        <Text style={[s.titulo, { color: cor ?? tema.text }]}>{titulo}</Text>
        {subtitulo ? <Text style={[s.sub, { color: tema.textSecondary }]}>{subtitulo}</Text> : null}
      </View>
      {direita ?? (onPress ? <Ionicons name="chevron-forward" size={18} color={tema.muted} /> : null)}
    </Pressable>
  );
}

const s = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.sm + 2, paddingHorizontal: SPACING.md },
  icone: { width: 44, height: 44, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1, marginLeft: SPACING.md },
  titulo: { fontSize: FONT.lg, fontWeight: '600' },
  sub: { fontSize: FONT.sm, marginTop: 2 },
});
