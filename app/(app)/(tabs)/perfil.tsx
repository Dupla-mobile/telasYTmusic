import { router } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinhaAtalho from '../../../src/components/LinhaAtalho';
import { FONT, SPACING } from '../../../src/constants/theme';
import { useAuth } from '../../../src/context/AuthContext';
import { useTema } from '../../../src/context/ThemeContext';
import { useEspacoInferior } from '../../../src/hooks/useEspacoInferior';
import { iniciais } from '../../../src/utils/formatar';

export default function Perfil() {
  const { tema, modo, setModo } = useTema();
  const { usuario, sair } = useAuth();
  const insets = useSafeAreaInsets();
  const espaco = useEspacoInferior(true);

  function confirmarSaida() {
    Alert.alert('Sair', 'Deseja encerrar a sessão neste aparelho?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => sair() },
    ]);
  }

  return (
    <View style={[s.tela, { backgroundColor: tema.bg, paddingTop: insets.top + SPACING.md }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: espaco }}>
        <View style={s.cabeca}>
          <View style={[s.avatar, { backgroundColor: tema.primary }]}>
            <Text style={s.iniciais}>{iniciais(usuario?.nome ?? 'Usuário')}</Text>
          </View>
          <Text style={[s.nome, { color: tema.text }]}>{usuario?.nome}</Text>
          <Text style={[s.email, { color: tema.textSecondary }]}>{usuario?.email}</Text>
        </View>

        <LinhaAtalho
          icone="moon-outline"
          titulo="Modo escuro"
          subtitulo="O tema fica salvo no aparelho"
          direita={<Switch value={modo === 'escuro'} onValueChange={(v) => setModo(v ? 'escuro' : 'claro')} trackColor={{ true: tema.primary }} />}
        />
        <LinhaAtalho icone="time-outline" titulo="Histórico de reprodução" onPress={() => router.push('/historico')} />
        <LinhaAtalho icone="settings-outline" titulo="Configurações" onPress={() => router.push('/configuracoes')} />
        <LinhaAtalho icone="chatbubble-ellipses-outline" titulo="Enviar feedback" onPress={() => router.push('/feedback')} />
        <LinhaAtalho icone="log-out-outline" titulo="Sair" cor={tema.danger} onPress={confirmarSaida} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  tela: { flex: 1 },
  cabeca: { alignItems: 'center', marginBottom: SPACING.lg },
  avatar: { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center' },
  iniciais: { color: '#FFFFFF', fontSize: FONT.xxl, fontWeight: '800' },
  nome: { fontSize: FONT.xl, fontWeight: '700', marginTop: SPACING.sm },
  email: { fontSize: FONT.md, marginTop: 2 },
});
