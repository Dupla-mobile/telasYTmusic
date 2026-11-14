import { Ionicons } from '@expo/vector-icons';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Botao from '../src/components/Botao';
import { FONT, RADIUS, SPACING } from '../src/constants/theme';
import { useAuth } from '../src/context/AuthContext';
import { useTema } from '../src/context/ThemeContext';
import { usePersistedState } from '../src/hooks/usePersistedState';

export default function Login() {
  const { tema } = useTema();
  const { usuario, entrar } = useAuth();
  const insets = useSafeAreaInsets();
  const [ultimoEmail, setUltimoEmail, ultimoPronto] = usePersistedState('app:ultimoEmail', '');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  // preenche o campo com o ultimo e-mail usado (lembrado no aparelho)
  useEffect(() => {
    if (ultimoPronto && ultimoEmail) setEmail(ultimoEmail);
  }, [ultimoPronto]);

  if (usuario) return <Redirect href="/" />;

  async function enviar() {
    setErro(null);
    setEnviando(true);
    try {
      await entrar(email, senha);
      setUltimoEmail(email.trim().toLowerCase());
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setEnviando(false);
    }
  }

  const campo = [s.campo, { backgroundColor: tema.surface, color: tema.text, borderColor: tema.border }];

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: tema.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={[s.conteudo, { paddingTop: insets.top + SPACING.xl }]} keyboardShouldPersistTaps="handled">
        <View style={[s.logo, { backgroundColor: tema.primary }]}>
          <Ionicons name="play" size={40} color="#FFFFFF" />
        </View>
        <Text style={[s.titulo, { color: tema.text }]}>TelasYTmusic</Text>
        <Text style={[s.sub, { color: tema.textSecondary }]}>Entre para ouvir suas músicas</Text>

        <TextInput
          style={campo}
          placeholder="E-mail"
          placeholderTextColor={tema.muted}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={campo}
          placeholder="Senha"
          placeholderTextColor={tema.muted}
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
          onSubmitEditing={enviar}
        />
        {erro ? <Text style={[s.erro, { color: tema.danger }]}>{erro}</Text> : null}
        <Botao titulo="Entrar" onPress={enviar} carregando={enviando} style={s.botao} />
        <Text style={[s.dica, { color: tema.muted }]}>Login simulado: use qualquer e-mail válido e senha com 4+ caracteres.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  conteudo: { flexGrow: 1, padding: SPACING.lg, alignItems: 'stretch' },
  logo: { alignSelf: 'center', width: 84, height: 84, borderRadius: 42, alignItems: 'center', justifyContent: 'center' },
  titulo: { fontSize: FONT.xxl, fontWeight: '800', textAlign: 'center', marginTop: SPACING.md },
  sub: { fontSize: FONT.md, textAlign: 'center', marginBottom: SPACING.xl },
  campo: { borderWidth: 1, borderRadius: RADIUS.md, paddingHorizontal: SPACING.md, paddingVertical: SPACING.md - 2, fontSize: FONT.lg, marginBottom: SPACING.md },
  erro: { fontSize: FONT.md, marginBottom: SPACING.sm },
  botao: { marginTop: SPACING.sm },
  dica: { fontSize: FONT.sm, textAlign: 'center', marginTop: SPACING.lg },
});
