import { Ionicons } from '@expo/vector-icons';
import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { RADIUS } from '../constants/theme';
import { useTema } from '../context/ThemeContext';

type Props = { uri?: string; tamanho: number; raio?: number; style?: StyleProp<ViewStyle> };

export default function Capa({ uri, tamanho, raio = RADIUS.sm, style }: Props) {
  const { tema } = useTema();
  return (
    <View
      style={[s.caixa, { width: tamanho, height: tamanho, borderRadius: raio, backgroundColor: tema.surfaceAlt }, style]}
    >
      {uri ? (
        <Image source={{ uri }} style={{ width: tamanho, height: tamanho }} resizeMode="cover" />
      ) : (
        <Ionicons name="musical-notes" size={tamanho / 3} color={tema.muted} />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  caixa: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
});
