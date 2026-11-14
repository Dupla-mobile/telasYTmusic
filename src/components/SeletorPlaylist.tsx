import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Alert, FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { FONT, RADIUS, SPACING } from '../constants/theme';
import { useTema } from '../context/ThemeContext';
import { adicionarNaPlaylist, listarPlaylists } from '../db/banco';
import { useFetch } from '../hooks/useFetch';
import { Faixa, PlaylistLocal } from '../types';

type Props = { faixa: Faixa; onFechar: () => void };

// Folha inferior para escolher em qual playlist (SQLite) a faixa sera adicionada.
export default function SeletorPlaylist({ faixa, onFechar }: Props) {
  const { tema } = useTema();
  const { dados, loading, erro } = useFetch(() => listarPlaylists(), []);

  async function escolher(p: PlaylistLocal) {
    try {
      const nova = await adicionarNaPlaylist(p.id, faixa);
      onFechar();
      Alert.alert(nova ? 'Adicionada' : 'Já está na playlist', `"${faixa.titulo}" — ${p.nome}`);
    } catch {
      Alert.alert('Erro', 'Não foi possível adicionar a faixa.');
    }
  }

  function criarNova() {
    onFechar();
    router.push('/playlist/nova');
  }

  return (
    <Modal transparent animationType="slide" onRequestClose={onFechar}>
      <Pressable style={s.fundo} onPress={onFechar}>
        <Pressable style={[s.folha, { backgroundColor: tema.surface }]} onPress={() => {}}>
          <Text style={[s.titulo, { color: tema.text }]}>Adicionar à playlist</Text>
          <Text style={[s.sub, { color: tema.textSecondary }]} numberOfLines={1}>
            {faixa.titulo} · {faixa.artista}
          </Text>
          <Pressable style={s.linha} onPress={criarNova}>
            <Ionicons name="add-circle-outline" size={26} color={tema.primary} />
            <Text style={[s.nome, { color: tema.text }]}>Nova playlist</Text>
          </Pressable>
          {loading ? <Text style={{ color: tema.textSecondary }}>Carregando...</Text> : null}
          {erro ? <Text style={{ color: tema.danger }}>{erro}</Text> : null}
          <FlatList
            data={dados ?? []}
            keyExtractor={(p) => String(p.id)}
            style={s.lista}
            renderItem={({ item }) => (
              <Pressable style={s.linha} onPress={() => escolher(item)}>
                <Ionicons name="list" size={24} color={tema.textSecondary} />
                <Text style={[s.nome, { color: tema.text }]} numberOfLines={1}>
                  {item.nome}
                </Text>
                <Text style={{ color: tema.muted, fontSize: FONT.sm }}>{item.total} faixas</Text>
              </Pressable>
            )}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const s = StyleSheet.create({
  fundo: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  folha: {
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
    maxHeight: '70%',
  },
  titulo: { fontSize: FONT.xl, fontWeight: '700' },
  sub: { fontSize: FONT.sm, marginBottom: SPACING.md },
  lista: { flexGrow: 0 },
  linha: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.sm + 2 },
  nome: { flex: 1, marginHorizontal: SPACING.md, fontSize: FONT.lg },
});
