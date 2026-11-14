import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';
import { FONT, RADIUS, SPACING } from '../constants/theme';
import { useTema } from '../context/ThemeContext';

type Props = {
  titulo: string;
  onPress: () => void;
  variante?: 'primario' | 'secundario' | 'perigo';
  icone?: keyof typeof Ionicons.glyphMap;
  carregando?: boolean;
  desabilitado?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function Botao({ titulo, onPress, variante = 'primario', icone, carregando, desabilitado, style }: Props) {
  const { tema } = useTema();
  const fundo = variante === 'primario' ? tema.primary : variante === 'perigo' ? tema.danger : tema.surfaceAlt;
  const cor = variante === 'secundario' ? tema.text : '#FFFFFF';
  const inativo = desabilitado || carregando;
  return (
    <Pressable
      onPress={onPress}
      disabled={inativo}
      style={[s.botao, { backgroundColor: fundo, opacity: inativo ? 0.6 : 1 }, style]}
    >
      {carregando ? (
        <ActivityIndicator color={cor} />
      ) : (
        <>
          {icone ? <Ionicons name={icone} size={18} color={cor} style={s.icone} /> : null}
          <Text style={[s.texto, { color: cor }]}>{titulo}</Text>
        </>
      )}
    </Pressable>
  );
}

const s = StyleSheet.create({
  botao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md - 4,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.pill,
    minHeight: 46,
  },
  icone: { marginRight: SPACING.sm },
  texto: { fontSize: FONT.lg, fontWeight: '700' },
});
