import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FONT, SPACING } from '../constants/theme';
import { useTema } from '../context/ThemeContext';

type Props = { titulo: string; direita?: ReactNode; semVoltar?: boolean };

export default function Cabecalho({ titulo, direita, semVoltar }: Props) {
  const { tema } = useTema();
  const insets = useSafeAreaInsets();
  return (
    <View style={[s.barra, { paddingTop: insets.top + SPACING.sm }]}>
      {semVoltar ? null : (
        <Pressable onPress={() => router.back()} hitSlop={12} style={s.voltar}>
          <Ionicons name="chevron-back" size={26} color={tema.text} />
        </Pressable>
      )}
      <Text style={[s.titulo, { color: tema.text }]} numberOfLines={1}>
        {titulo}
      </Text>
      <View style={s.direita}>{direita}</View>
    </View>
  );
}

const s = StyleSheet.create({
  barra: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingBottom: SPACING.sm },
  voltar: { marginRight: SPACING.sm },
  titulo: { flex: 1, fontSize: FONT.xl, fontWeight: '700' },
  direita: { flexDirection: 'row', alignItems: 'center' },
});
