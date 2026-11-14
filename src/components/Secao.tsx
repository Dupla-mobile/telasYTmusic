import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FONT, SPACING } from '../constants/theme';
import { useTema } from '../context/ThemeContext';

type Props = { titulo: string; acao?: { rotulo: string; onPress: () => void }; children: ReactNode };

export default function Secao({ titulo, acao, children }: Props) {
  const { tema } = useTema();
  return (
    <View style={s.secao}>
      <View style={s.topo}>
        <Text style={[s.titulo, { color: tema.text }]}>{titulo}</Text>
        {acao ? (
          <Pressable onPress={acao.onPress} hitSlop={8}>
            <Text style={{ color: tema.primary, fontSize: FONT.md, fontWeight: '600' }}>{acao.rotulo}</Text>
          </Pressable>
        ) : null}
      </View>
      {children}
    </View>
  );
}

const s = StyleSheet.create({
  secao: { marginTop: SPACING.lg },
  topo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, marginBottom: SPACING.sm + 2 },
  titulo: { fontSize: FONT.xl, fontWeight: '700' },
});
