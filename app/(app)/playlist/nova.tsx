import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import Botao from '../../../src/components/Botao';
import Cabecalho from '../../../src/components/Cabecalho';
import { FONT, RADIUS, SPACING } from '../../../src/constants/theme';
import { useTema } from '../../../src/context/ThemeContext';
import { criarPlaylist, listarPlaylists } from '../../../src/db/banco';

export default function NovaPlaylist() {
  const { tema } = useTema();
  const [nome, setNome] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  async function salvar() {
    const limpo = nome.trim();
    if (limpo.length < 2) return setErro('Dê um nome com pelo menos 2 letras');
    setSalvando(true);
    setErro(null);
    try {
      const existentes = await listarPlaylists();
      if (existentes.some((p) => p.nome.toLowerCase() === limpo.toLowerCase())) {
        setErro('Você já tem uma playlist com esse nome');
        return;
      }
      const id = await criarPlaylist(limpo);
      router.replace({ pathname: '/playlist/[id]', params: { id: String(id) } });
    } catch {
      setErro('Não foi possível criar a playlist');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <KeyboardAvoidingView style={[s.tela, { backgroundColor: tema.bg }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Cabecalho titulo="Nova playlist" />
      <View style={s.corpo}>
        <Text style={[s.rotulo, { color: tema.textSecondary }]}>Nome da playlist</Text>
        <TextInput
          style={[s.campo, { backgroundColor: tema.surface, color: tema.text, borderColor: erro ? tema.danger : tema.border }]}
          placeholder="Ex.: Treino, Estudos, Viagem"
          placeholderTextColor={tema.muted}
          value={nome}
          onChangeText={setNome}
          maxLength={40}
          autoFocus
          onSubmitEditing={salvar}
        />
        {erro ? <Text style={[s.erro, { color: tema.danger }]}>{erro}</Text> : null}
        <Botao titulo="Criar playlist" onPress={salvar} carregando={salvando} style={s.botao} />
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  tela: { flex: 1 },
  corpo: { padding: SPACING.md },
  rotulo: { fontSize: FONT.md, marginBottom: SPACING.sm },
  campo: { borderWidth: 1, borderRadius: RADIUS.md, paddingHorizontal: SPACING.md, paddingVertical: SPACING.md - 2, fontSize: FONT.lg },
  erro: { marginTop: SPACING.sm, fontSize: FONT.md },
  botao: { marginTop: SPACING.lg },
});
