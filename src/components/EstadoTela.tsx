import { Ionicons } from '@expo/vector-icons';
import { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { FONT, SPACING } from '../constants/theme';
import { useTema } from '../context/ThemeContext';
import Botao from './Botao';

type Props = {
  loading: boolean;
  erro: string | null;
  vazio: boolean;
  mensagemVazio?: string;
  iconeVazio?: keyof typeof Ionicons.glyphMap;
  onRetry: () => void;
  children: ReactNode;
};

// Os 4 estados de toda tela com dados: carregando -> erro -> vazio -> sucesso (nunca dois ao mesmo tempo).
export default function EstadoTela({
  loading,
  erro,
  vazio,
  mensagemVazio = 'Nada por aqui ainda.',
  iconeVazio = 'albums-outline',
  onRetry,
  children,
}: Props) {
  const { tema } = useTema();
  if (loading) {
    return (
      <View style={s.centro}>
        <ActivityIndicator size="large" color={tema.primary} />
        <Text style={[s.texto, { color: tema.textSecondary }]}>Carregando...</Text>
      </View>
    );
  }
  if (erro) {
    return (
      <View style={s.centro}>
        <Ionicons name="alert-circle-outline" size={48} color={tema.danger} />
        <Text style={[s.texto, { color: tema.text }]}>{erro}</Text>
        <Botao titulo="Tentar de novo" icone="refresh" onPress={onRetry} style={s.botao} />
      </View>
    );
  }
  if (vazio) {
    return (
      <View style={s.centro}>
        <Ionicons name={iconeVazio} size={48} color={tema.muted} />
        <Text style={[s.texto, { color: tema.textSecondary }]}>{mensagemVazio}</Text>
      </View>
    );
  }
  return <>{children}</>;
}

const s = StyleSheet.create({
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.lg },
  texto: { marginTop: SPACING.md, fontSize: FONT.lg, textAlign: 'center' },
  botao: { marginTop: SPACING.md },
});
