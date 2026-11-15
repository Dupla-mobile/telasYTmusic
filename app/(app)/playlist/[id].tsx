import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import Botao from '../../../src/components/Botao';
import Cabecalho from '../../../src/components/Cabecalho';
import EstadoTela from '../../../src/components/EstadoTela';
import ItemFaixa from '../../../src/components/ItemFaixa';
import { FONT, SPACING } from '../../../src/constants/theme';
import { usePlayer } from '../../../src/context/PlayerContext';
import { useTema } from '../../../src/context/ThemeContext';
import { buscarPlaylist, excluirPlaylist, listarFaixasDaPlaylist, removerDaPlaylist } from '../../../src/db/banco';
import { useEspacoInferior } from '../../../src/hooks/useEspacoInferior';
import { useFetch } from '../../../src/hooks/useFetch';
import { useRecarregarAoFocar } from '../../../src/hooks/useRecarregarAoFocar';

export default function DetalhePlaylist() {
  const { tema } = useTema();
  const { tocar } = usePlayer();
  const espaco = useEspacoInferior();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { dados, loading, erro, recarregar } = useFetch(async () => {
    const playlist = await buscarPlaylist(Number(id));
    if (!playlist) throw new Error('Playlist não encontrada');
    return { playlist, faixas: await listarFaixasDaPlaylist(playlist.id) };
  }, [id]);
  useRecarregarAoFocar(recarregar);

  const faixas = dados?.faixas ?? [];

  function confirmarExclusao() {
    Alert.alert('Excluir playlist', `Excluir "${dados?.playlist.nome}"? As músicas não serão apagadas das curtidas.`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await excluirPlaylist(Number(id));
          router.back();
        },
      },
    ]);
  }

  async function remover(trackId: number) {
    await removerDaPlaylist(Number(id), trackId);
    recarregar();
  }

  return (
    <View style={[s.tela, { backgroundColor: tema.bg }]}>
      <Cabecalho
        titulo={dados?.playlist.nome ?? 'Playlist'}
        direita={
          <Pressable onPress={confirmarExclusao} hitSlop={10}>
            <Ionicons name="trash-outline" size={24} color={tema.danger} />
          </Pressable>
        }
      />
      <EstadoTela
        loading={loading && !dados}
        erro={dados ? null : erro}
        vazio={!!dados && faixas.length === 0}
        mensagemVazio="Playlist vazia. Use o menu (⋮) de uma música para adicioná-la aqui."
        onRetry={recarregar}
      >
        <FlatList
          data={faixas}
          keyExtractor={(f) => String(f.id)}
          contentContainerStyle={{ paddingBottom: espaco }}
          ListHeaderComponent={
            <View style={s.topo}>
              <Text style={[s.contagem, { color: tema.textSecondary }]}>{faixas.length} faixas</Text>
              <Botao titulo="Tocar" icone="play" onPress={() => tocar(faixas, 0)} />
            </View>
          }
          renderItem={({ item, index }) => (
            <ItemFaixa
              faixa={item}
              onPress={() => tocar(faixas, index)}
              acaoExtra={
                <Pressable hitSlop={10} onPress={() => remover(item.id)}>
                  <Ionicons name="close" size={20} color={tema.textSecondary} />
                </Pressable>
              }
            />
          )}
        />
      </EstadoTela>
    </View>
  );
}

const s = StyleSheet.create({
  tela: { flex: 1 },
  topo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingBottom: SPACING.sm },
  contagem: { fontSize: FONT.md },
});
