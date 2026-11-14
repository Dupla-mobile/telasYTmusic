import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Banner from '../../../src/components/Banner';
import CartaoAlbum from '../../../src/components/CartaoAlbum';
import EstadoTela from '../../../src/components/EstadoTela';
import ItemFaixa from '../../../src/components/ItemFaixa';
import Secao from '../../../src/components/Secao';
import { FONT, SPACING } from '../../../src/constants/theme';
import { usePlayer } from '../../../src/context/PlayerContext';
import { useTema } from '../../../src/context/ThemeContext';
import { listarOuvidasRecentes } from '../../../src/db/banco';
import { useEspacoInferior } from '../../../src/hooks/useEspacoInferior';
import { useFetch } from '../../../src/hooks/useFetch';
import { useOnline } from '../../../src/hooks/useOnline';
import { useRecarregarAoFocar } from '../../../src/hooks/useRecarregarAoFocar';
import { api } from '../../../src/services/api';
import { comCache, removerCache } from '../../../src/services/cache';
import { Album, Faixa } from '../../../src/types';

type DadosHome = { escolhas: Faixa[]; albuns: Album[]; relax: Faixa[] };
const CHAVE = 'cache:home';

async function buscarHome(): Promise<DadosHome> {
  const [escolhas, albuns, relax] = await Promise.all([
    api.musicas('pop brasil', 12),
    api.albuns('rock nacional', 12),
    api.musicas('mpb', 12),
  ]);
  return { escolhas, albuns, relax };
}

export default function Inicio() {
  const { tema } = useTema();
  const { tocar } = usePlayer();
  const insets = useSafeAreaInsets();
  const online = useOnline();
  const espaco = useEspacoInferior(true);
  const [atualizando, setAtualizando] = useState(false);

  const { dados, loading, erro, recarregar } = useFetch(() => comCache(CHAVE, buscarHome), []);
  const recentes = useFetch(() => listarOuvidasRecentes(), []);
  useRecarregarAoFocar(recentes.recarregar);

  async function puxar() {
    setAtualizando(true);
    await removerCache(CHAVE); // pull-to-refresh ignora o cache
    await Promise.all([recarregar(), recentes.recarregar()]);
    setAtualizando(false);
  }

  return (
    <View style={[s.tela, { backgroundColor: tema.bg, paddingTop: insets.top + SPACING.sm }]}>
      <View style={s.topo}>
        <Text style={[s.titulo, { color: tema.text }]}>Início</Text>
        <Pressable hitSlop={10} onPress={() => router.push('/busca')}>
          <Ionicons name="search" size={26} color={tema.text} />
        </Pressable>
      </View>
      {!online ? <Banner texto="Você está offline. Os dados podem estar desatualizados." /> : null}

      <EstadoTela loading={loading && !dados} erro={dados ? null : erro} vazio={false} onRetry={recarregar}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: espaco }}
          refreshControl={<RefreshControl refreshing={atualizando} onRefresh={puxar} tintColor={tema.primary} />}
          showsVerticalScrollIndicator={false}
        >
          {recentes.dados && recentes.dados.length > 0 ? (
            <Secao titulo="Ouça de novo" acao={{ rotulo: 'Histórico', onPress: () => router.push('/historico') }}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={recentes.dados}
                keyExtractor={(f) => String(f.id)}
                contentContainerStyle={s.carrossel}
                renderItem={({ item, index }) => (
                  <CartaoAlbum
                    capa={item.capa}
                    titulo={item.titulo}
                    subtitulo={item.artista}
                    tamanho={120}
                    onPress={() => tocar(recentes.dados ?? [], index)}
                  />
                )}
              />
            </Secao>
          ) : null}

          <Secao titulo="Seleção para você">
            {(dados?.escolhas ?? []).slice(0, 6).map((f, i) => (
              <ItemFaixa key={f.id} faixa={f} onPress={() => tocar(dados?.escolhas ?? [], i)} />
            ))}
          </Secao>

          <Secao titulo="Álbuns em destaque">
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={dados?.albuns ?? []}
              keyExtractor={(a) => String(a.id)}
              contentContainerStyle={s.carrossel}
              renderItem={({ item }) => (
                <CartaoAlbum
                  capa={item.capa}
                  titulo={item.titulo}
                  subtitulo={item.artista}
                  onPress={() => router.push({ pathname: '/album/[id]', params: { id: String(item.id) } })}
                />
              )}
            />
          </Secao>

          <Secao titulo="Para relaxar">
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={dados?.relax ?? []}
              keyExtractor={(f) => String(f.id)}
              contentContainerStyle={s.carrossel}
              renderItem={({ item, index }) => (
                <CartaoAlbum
                  capa={item.capa}
                  titulo={item.titulo}
                  subtitulo={item.artista}
                  onPress={() => tocar(dados?.relax ?? [], index)}
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
  topo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, marginBottom: SPACING.sm },
  titulo: { fontSize: FONT.xxl, fontWeight: '800' },
  carrossel: { paddingHorizontal: SPACING.md },
});
