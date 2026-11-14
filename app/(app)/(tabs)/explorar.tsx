import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CartaoAlbum from '../../../src/components/CartaoAlbum';
import Secao from '../../../src/components/Secao';
import { FONT, RADIUS, SPACING } from '../../../src/constants/theme';
import { useTema } from '../../../src/context/ThemeContext';
import { useEspacoInferior } from '../../../src/hooks/useEspacoInferior';
import { useFetch } from '../../../src/hooks/useFetch';
import { api } from '../../../src/services/api';
import { comCache } from '../../../src/services/cache';
import { ActivityIndicator } from 'react-native';

const GENEROS = [
  { nome: 'Pop', cor: '#E91E63' },
  { nome: 'Rock', cor: '#3F51B5' },
  { nome: 'Sertanejo', cor: '#FF9800' },
  { nome: 'Funk', cor: '#9C27B0' },
  { nome: 'MPB', cor: '#009688' },
  { nome: 'Hip Hop', cor: '#607D8B' },
  { nome: 'Eletrônica', cor: '#00ACC1' },
  { nome: 'Samba', cor: '#43A047' },
  { nome: 'Pagode', cor: '#F4511E' },
  { nome: 'Gospel', cor: '#6D4C41' },
  { nome: 'Reggae', cor: '#7CB342' },
  { nome: 'Jazz', cor: '#5D4037' },
];

export default function Explorar() {
  const { tema } = useTema();
  const insets = useSafeAreaInsets();
  const espaco = useEspacoInferior(true);
  const destaques = useFetch(() => comCache('cache:explorar:destaques', () => api.albuns('top hits', 12)), []);

  const cabecalho = (
    <View>
      <Secao titulo="Álbuns em alta">
        {destaques.loading && !destaques.dados ? <ActivityIndicator color={tema.primary} style={{ marginVertical: SPACING.lg }} /> : null}
        {destaques.erro && !destaques.dados ? (
          <Pressable onPress={destaques.recarregar}>
            <Text style={{ color: tema.danger, paddingHorizontal: SPACING.md }}>{destaques.erro} — toque para tentar de novo</Text>
          </Pressable>
        ) : null}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={destaques.dados ?? []}
          keyExtractor={(a) => String(a.id)}
          contentContainerStyle={{ paddingHorizontal: SPACING.md }}
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
      <Text style={[s.titulo, { color: tema.text }]}>Navegar por gênero</Text>
    </View>
  );

  return (
    <View style={[s.tela, { backgroundColor: tema.bg, paddingTop: insets.top + SPACING.sm }]}>
      <Text style={[s.cabeca, { color: tema.text }]}>Explorar</Text>
      <FlatList
        data={GENEROS}
        numColumns={2}
        keyExtractor={(g) => g.nome}
        ListHeaderComponent={cabecalho}
        contentContainerStyle={{ paddingBottom: espaco }}
        columnWrapperStyle={s.coluna}
        renderItem={({ item }) => (
          <Pressable
            style={[s.genero, { backgroundColor: item.cor }]}
            onPress={() => router.push({ pathname: '/busca', params: { termo: item.nome } })}
          >
            <Text style={s.generoTexto}>{item.nome}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  tela: { flex: 1 },
  cabeca: { fontSize: FONT.xxl, fontWeight: '800', paddingHorizontal: SPACING.md, marginBottom: SPACING.sm },
  titulo: { fontSize: FONT.xl, fontWeight: '700', paddingHorizontal: SPACING.md, marginTop: SPACING.lg, marginBottom: SPACING.sm },
  coluna: { paddingHorizontal: SPACING.md, justifyContent: 'space-between' },
  genero: { width: '48.5%', height: 84, borderRadius: RADIUS.md, justifyContent: 'flex-end', padding: SPACING.md - 2, marginBottom: SPACING.md - 4 },
  generoTexto: { color: '#FFFFFF', fontSize: FONT.lg, fontWeight: '800' },
});
