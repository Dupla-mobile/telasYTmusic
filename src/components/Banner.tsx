import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { FONT, RADIUS, SPACING } from '../constants/theme';

export default function Banner({ texto }: { texto: string }) {
  return (
    <View style={s.banner}>
      <Ionicons name="cloud-offline-outline" size={16} color="#1A1A1A" />
      <Text style={s.texto}>{texto}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFC107',
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
  },
  texto: { marginLeft: SPACING.sm, color: '#1A1A1A', fontSize: FONT.sm, fontWeight: '600' },
});
