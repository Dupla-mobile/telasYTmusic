import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import Botao from '../../../src/components/Botao';
import Cabecalho from '../../../src/components/Cabecalho';
import Capa from '../../../src/components/Capa';
import EstadoTela from '../../../src/components/EstadoTela';
import ItemFaixa from '../../../src/components/ItemFaixa';
import { FONT, SPACING } from '../../../src/constants/theme';
import { usePlayer } from '../../../src/context/PlayerContext';
import { useTema } from '../../../src/context/ThemeContext';
import { useEspacoInferior } from '../../../src/hooks/useEspacoInferior';
import { useFetch } from '../../../src/hooks/useFetch';
import { api } from '../../../src/services/api';
import { comCache } from '../../../src/services/cache';

export default function DetalheAlbum() {
  const { tema } = useTema();
  const { tocar } = usePlayer();
  const espaco = useEspacoInferior();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { dados, loading, erro, recarregar } = useFetch(
    () => comCache(`cache:album:${id}`, () => api.album(Number(id))),
    [id],
  );

  const faixas = dados?.faixas ?? [];
  const album = dados?.album;

  function tocarAleatorio() {
    if (faixas.length === 0) return;
    tocar(faixas, Math.floor(Math.random() * faixas.length));
  }

  const topo = album ? (
    <View style={s.topo}>
      <Capa uri={album.capa?.replace('300x300', '600x600')} tamanho={220} raio={10} />
      <Text style={[s.titulo, { color: tema.text }]}>{album.titulo}</Text>
      <Pressable
        disabled={!album.artistaId}
        onPress={() => router.push({ pathname: '/artista/[id]', params: { id: String(album.artistaId) } })}
      >
        <Text style={[s.artista, { color: tema.primary }]}>{album.artista}</Text>
      </Pressable>
      <Text style={[s.meta, { color: tema.textSecondary }]}>
        {[album.genero, album.ano, `${faixas.length} faixas`].filter(Boolean).join(' · ')}
      </Text>
      <View style={s.acoes}>
        <Botao titulo="Tocar" icone="play" onPress={() => tocar(faixas, 0)} style={s.botao} />
        <Botao titulo="Aleatório" icone="shuffle" variante="secundario" onPress={tocarAleatorio} style={s.botao} />
      </View>
    </View>
  ) : null;

  return (
    <View style={[s.tela, { backgroundColor: tema.bg }]}>
      <Cabecalho titulo="Álbum" />
      <EstadoTela loading={loading && !dados} erro={dados ? null : erro} vazio={!!dados && faixas.length === 0} mensagemVazio="Este álbum não tem faixas disponíveis." onRetry={recarregar}>
        <FlatList
          data={faixas}
          keyExtractor={(f) => String(f.id)}
          ListHeaderComponent={topo ?? undefined}
          contentContainerStyle={{ paddingBottom: espaco }}
          renderItem={({ item, index }) => <ItemFaixa faixa={item} onPress={() => tocar(faixas, index)} />}
        />
      </EstadoTela>
    </View>
  );
}

const s = StyleSheet.create({
  tela: { flex: 1 },
  topo: { alignItems: 'center', paddingHorizontal: SPACING.md, paddingBottom: SPACING.md },
  titulo: { fontSize: FONT.xl, fontWeight: '800', marginTop: SPACING.md, textAlign: 'center' },
  artista: { fontSize: FONT.lg, fontWeight: '600', marginTop: 4 },
  meta: { fontSize: FONT.sm, marginTop: 4 },
  acoes: { flexDirection: 'row', marginTop: SPACING.md },
  botao: { marginHorizontal: SPACING.sm, minWidth: 130 },
});
