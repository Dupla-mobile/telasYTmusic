import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import Botao from '../../src/components/Botao';
import Cabecalho from '../../src/components/Cabecalho';
import { FONT, RADIUS, SPACING } from '../../src/constants/theme';
import { useAuth } from '../../src/context/AuthContext';
import { useTema } from '../../src/context/ThemeContext';
import { useDebounce } from '../../src/hooks/useDebounce';
import { api } from '../../src/services/api';
import { storage } from '../../src/services/storage';

type Rascunho = { assunto: string; mensagem: string };
const CHAVE_RASCUNHO = 'app:rascunhoFeedback';

export default function Feedback() {
  const { tema } = useTema();
  const { usuario } = useAuth();
  const [assunto, setAssunto] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [lido, setLido] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  // le o rascunho salvo ao abrir a tela
  useEffect(() => {
    storage.get<Rascunho>(CHAVE_RASCUNHO, { assunto: '', mensagem: '' }).then((r) => {
      setAssunto(r.assunto);
      setMensagem(r.mensagem);
      setLido(true);
    });
  }, []);

  // grava o rascunho com debounce de 500 ms (nao grava a cada tecla)
  const rascunho = useDebounce<Rascunho>({ assunto, mensagem }, 500);
  useEffect(() => {
    if (lido) storage.set(CHAVE_RASCUNHO, rascunho);
  }, [rascunho, lido]);

  async function enviar() {
    if (assunto.trim().length < 3) return setErro('Informe um assunto com pelo menos 3 letras');
    if (mensagem.trim().length < 10) return setErro('Escreva uma mensagem com pelo menos 10 caracteres');
    setErro(null);
    setEnviando(true);
    try {
      const resposta = await api.feedback({ title: assunto.trim(), body: `${mensagem.trim()}\n\n— ${usuario?.email ?? ''}`, userId: 1 });
      await storage.remove(CHAVE_RASCUNHO);
      Alert.alert('Feedback enviado', `Obrigado! Protocolo nº ${resposta.id}.`, [{ text: 'OK', onPress: () => router.back() }]);
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setEnviando(false);
    }
  }

  const campo = { backgroundColor: tema.surface, color: tema.text, borderColor: tema.border };

  return (
    <KeyboardAvoidingView style={[s.tela, { backgroundColor: tema.bg }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Cabecalho titulo="Enviar feedback" />
      <ScrollView contentContainerStyle={s.corpo} keyboardShouldPersistTaps="handled">
        <Text style={[s.rotulo, { color: tema.textSecondary }]}>Assunto</Text>
        <TextInput style={[s.campo, campo]} value={assunto} onChangeText={setAssunto} placeholder="Ex.: Sugestão para o player" placeholderTextColor={tema.muted} maxLength={80} />
        <Text style={[s.rotulo, { color: tema.textSecondary }]}>Mensagem</Text>
        <TextInput
          style={[s.campo, s.area, campo]}
          value={mensagem}
          onChangeText={setMensagem}
          placeholder="Conte o que você achou do app"
          placeholderTextColor={tema.muted}
          multiline
          textAlignVertical="top"
        />
        <Text style={[s.nota, { color: tema.muted }]}>Seu rascunho é salvo automaticamente neste aparelho.</Text>
        {erro ? <Text style={[s.erro, { color: tema.danger }]}>{erro}</Text> : null}
        <Botao titulo="Enviar" icone="send" onPress={enviar} carregando={enviando} style={s.botao} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  tela: { flex: 1 },
  corpo: { padding: SPACING.md },
  rotulo: { fontSize: FONT.md, marginBottom: SPACING.sm, marginTop: SPACING.sm },
  campo: { borderWidth: 1, borderRadius: RADIUS.md, paddingHorizontal: SPACING.md, paddingVertical: SPACING.md - 2, fontSize: FONT.lg },
  area: { minHeight: 140 },
  nota: { fontSize: FONT.sm, marginTop: SPACING.sm },
  erro: { marginTop: SPACING.sm, fontSize: FONT.md },
  botao: { marginTop: SPACING.lg },
});
