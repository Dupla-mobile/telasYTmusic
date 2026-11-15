import { router } from 'expo-router';
import { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinhaAtalho from '../../../src/components/LinhaAtalho';
import Secao from '../../../src/components/Secao';
import { FONT, SPACING } from '../../../src/constants/theme';
import { useBiblioteca } from '../../../src/context/BibliotecaContext';
import { useTema } from '../../../src/context/ThemeContext';
import { listarPlaylists } from '../../../src/db/banco';
import { useEspacoInferior } from '../../../src/hooks/useEspacoInferior';
import { useFetch } from '../../../src/hooks/useFetch';
import { useRecarregarAoFocar } from '../../../src/hooks/useRecarregarAoFocar';

export default function Biblioteca() {
  const { tema } = useTema();
  const insets = useSafeAreaInsets();
  const espaco = useEspacoInferior(true);
  const { curtidas, recarregarCurtidas } = useBiblioteca();
  const [atualizando, setAtualizando] = useState(false);
  const playlists = useFetch(() => listarPlaylists(), []);
  useRecarregarAoFocar(playlists.recarregar);

  async function puxar() {
    setAtualizando(true);
    await Promise.all([playlists.recarregar(), recarregarCurtidas()]);
    setAtualizando(false);
  }

  return (
    <View style={[s.tela, { backgroundColor: tema.bg, paddingTop: insets.top + SPACING.sm }]}>
      <Text style={[s.titulo, { color: tema.text }]}>Biblioteca</Text>
      <ScrollView
        contentContainerStyle={{ paddingBottom: espaco }}
        refreshControl={<RefreshControl refreshing={atualizando} onRefresh={puxar} tintColor={tema.primary} />}
      >
        <LinhaAtalho
          icone="heart"
          cor={tema.primary}
          titulo="Músicas curtidas"
          subtitulo={`${curtidas.size} ${curtidas.size === 1 ? 'música' : 'músicas'}`}
          onPress={() => router.push('/curtidas')}
        />
        <LinhaAtalho icone="time-outline" titulo="Histórico" subtitulo="O que você ouviu recentemente" onPress={() => router.push('/historico')} />

        <Secao titulo="Suas playlists" acao={{ rotulo: 'Nova', onPress: () => router.push('/playlist/nova') }}>
          {playlists.erro ? <Text style={{ color: tema.danger, paddingHorizontal: SPACING.md }}>{playlists.erro}</Text> : null}
          {playlists.dados && playlists.dados.length === 0 ? (
            <Text style={[s.vazio, { color: tema.textSecondary }]}>Você ainda não criou nenhuma playlist.</Text>
          ) : null}
          {(playlists.dados ?? []).map((p) => (
            <LinhaAtalho
              key={p.id}
              icone="list"
              titulo={p.nome}
              subtitulo={`${p.total} ${p.total === 1 ? 'faixa' : 'faixas'}`}
              onPress={() => router.push({ pathname: '/playlist/[id]', params: { id: String(p.id) } })}
            />
          ))}
        </Secao>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  tela: { flex: 1 },
  titulo: { fontSize: FONT.xxl, fontWeight: '800', paddingHorizontal: SPACING.md, marginBottom: SPACING.sm },
  vazio: { paddingHorizontal: SPACING.md, fontSize: FONT.md },
});
