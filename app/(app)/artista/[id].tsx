import { router, useLocalSearchParams } from 'expo-router';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import Cabecalho from '../../../src/components/Cabecalho';
import CartaoAlbum from '../../../src/components/CartaoAlbum';
import EstadoTela from '../../../src/components/EstadoTela';
import ItemFaixa from '../../../src/components/ItemFaixa';
import Secao from '../../../src/components/Secao';
import { FONT, SPACING } from '../../../src/constants/theme';
import { usePlayer } from '../../../src/context/PlayerContext';
import { useTema } from '../../../src/context/ThemeContext';
import { useEspacoInferior } from '../../../src/hooks/useEspacoInferior';
import { useFetch } from '../../../src/hooks/useFetch';
import { api } from '../../../src/services/api';
import { comCache } from '../../../src/services/cache';

export default function DetalheArtista() {
  const { tema } = useTema();
  const { tocar } = usePlayer();
  const espaco = useEspacoInferior();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { dados, loading, erro, recarregar } = useFetch(
    () => comCache(`cache:artista:${id}`, () => api.artista(Number(id))),
    [id],
  );

  return (
    <View style={[s.tela, { backgroundColor: tema.bg }]}>
      <Cabecalho titulo={dados?.artista.nome ?? 'Artista'} />
      <EstadoTela loading={loading && !dados} erro={dados ? null : erro} vazio={false} onRetry={recarregar}>
        <ScrollView contentContainerStyle={{ paddingBottom: espaco }}>
          {dados?.artista.genero ? <Text style={[s.genero, { color: tema.textSecondary }]}>{dados.artista.genero}</Text> : null}

          <Secao titulo="Músicas populares">
            {dados?.faixas.length === 0 ? <Text style={[s.vazio, { color: tema.textSecondary }]}>Nenhuma música encontrada.</Text> : null}
            {(dados?.faixas ?? []).map((f, i) => (
              <ItemFaixa key={f.id} faixa={f} onPress={() => tocar(dados?.faixas ?? [], i)} />
            ))}
          </Secao>

          <Secao titulo="Álbuns">
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={dados?.albuns ?? []}
              keyExtractor={(a) => String(a.id)}
              contentContainerStyle={{ paddingHorizontal: SPACING.md }}
              renderItem={({ item }) => (
                <CartaoAlbum
                  capa={item.capa}
                  titulo={item.titulo}
                  subtitulo={item.ano}
                  onPress={() => router.push({ pathname: '/album/[id]', params: { id: String(item.id) } })}
                />
              )}
            />
          </Secao>
        </ScrollView>
      </EstadoTela>
    </View>
  );
}

const s = StyleSheet.create({
  tela: { flex: 1 },
  genero: { fontSize: FONT.md, paddingHorizontal: SPACING.md },
  vazio: { paddingHorizontal: SPACING.md },
});
