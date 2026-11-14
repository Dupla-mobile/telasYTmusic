import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Capa from '../../src/components/Capa';
import EstadoTela from '../../src/components/EstadoTela';
import ItemFaixa from '../../src/components/ItemFaixa';
import { FONT, RADIUS, SPACING } from '../../src/constants/theme';
import { usePlayer } from '../../src/context/PlayerContext';
import { useTema } from '../../src/context/ThemeContext';
import { useDebounce } from '../../src/hooks/useDebounce';
import { useFetch } from '../../src/hooks/useFetch';
import { api } from '../../src/services/api';
import { comCache } from '../../src/services/cache';
import { storage } from '../../src/services/storage';
import { Album, Faixa } from '../../src/types';
import { useEspacoInferior } from '../../src/hooks/useEspacoInferior';

const CHAVE_RECENTES = 'app:buscasRecentes';
type Aba = 'musicas' | 'albuns';

export default function Busca() {
  const { tema } = useTema();
  const { tocar } = usePlayer();
  const insets = useSafeAreaInsets();
  const espaco = useEspacoInferior();
  const params = useLocalSearchParams<{ termo?: string }>();
  const [texto, setTexto] = useState(params.termo ?? '');
  const [aba, setAba] = useState<Aba>('musicas');
  const [limite, setLimite] = useState(25);
  const [recentes, setRecentes] = useState<string[]>([]);
  const termo = useDebounce(texto.trim(), 500);
  const ativo = termo.length >= 2;

  useEffect(() => {
    storage.get<string[]>(CHAVE_RECENTES, []).then(setRecentes);
  }, []);
  useEffect(() => setLimite(25), [termo, aba]);

  const musicas = useFetch<Faixa[]>(
    () => (ativo && aba === 'musicas' ? comCache(`cache:busca:m:${termo}:${limite}`, () => api.musicas(termo, limite)) : Promise.resolve([])),
    [termo, aba, limite],
  );
  const albuns = useFetch<Album[]>(
    () => (ativo && aba === 'albuns' ? comCache(`cache:busca:a:${termo}:${limite}`, () => api.albuns(termo, limite)) : Promise.resolve([])),
    [termo, aba, limite],
  );
  const atual = aba === 'musicas' ? musicas : albuns;

  async function salvarRecente(t: string) {
    const valor = t.trim();
    if (valor.length < 2) return;
    const novo = [valor, ...recentes.filter((r) => r.toLowerCase() !== valor.toLowerCase())].slice(0, 8);
    setRecentes(novo);
    await storage.set(CHAVE_RECENTES, novo);
  }

  async function limparRecentes() {
    setRecentes([]);
    await storage.remove(CHAVE_RECENTES);
  }

  function maisResultados(qtd: number) {
    if (limite < 100 && qtd >= limite) setLimite((l) => l + 25); // "scroll infinito": pede mais itens a API
  }

  const caixa = [s.caixa, { backgroundColor: tema.surface }];

  return (
    <View style={[s.tela, { backgroundColor: tema.bg, paddingTop: insets.top + SPACING.sm }]}>
      <View style={s.topo}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={26} color={tema.text} />
        </Pressable>
        <View style={caixa}>
          <Ionicons name="search" size={18} color={tema.textSecondary} />
          <TextInput
            style={[s.input, { color: tema.text }]}
            placeholder="Músicas, álbuns, artistas"
            placeholderTextColor={tema.muted}
            value={texto}
            onChangeText={setTexto}
            onSubmitEditing={() => salvarRecente(texto)}
            returnKeyType="search"
            autoFocus={!params.termo}
          />
          {texto ? (
            <Pressable hitSlop={10} onPress={() => setTexto('')}>
              <Ionicons name="close-circle" size={18} color={tema.muted} />
            </Pressable>
          ) : null}
        </View>
      </View>

      <View style={s.abas}>
        {(['musicas', 'albuns'] as Aba[]).map((a) => (
          <Pressable key={a} onPress={() => setAba(a)} style={[s.aba, { backgroundColor: aba === a ? tema.text : tema.surface }]}>
            <Text style={{ color: aba === a ? tema.bg : tema.text, fontWeight: '600' }}>{a === 'musicas' ? 'Músicas' : 'Álbuns'}</Text>
          </Pressable>
        ))}
      </View>

      {!ativo ? (
        <View style={s.recentes}>
          {recentes.length > 0 ? (
            <>
              <View style={s.recentesTopo}>
                <Text style={[s.rotulo, { color: tema.text }]}>Buscas recentes</Text>
                <Pressable onPress={limparRecentes} hitSlop={8}>
                  <Text style={{ color: tema.primary, fontWeight: '600' }}>Limpar</Text>
                </Pressable>
              </View>
              <View style={s.chips}>
                {recentes.map((r) => (
                  <Pressable key={r} style={[s.chip, { backgroundColor: tema.surface }]} onPress={() => setTexto(r)}>
                    <Ionicons name="time-outline" size={14} color={tema.textSecondary} />
                    <Text style={{ color: tema.text, marginLeft: 6 }}>{r}</Text>
                  </Pressable>
                ))}
              </View>
            </>
          ) : (
            <Text style={[s.dica, { color: tema.muted }]}>Digite ao menos 2 letras para buscar.</Text>
          )}
        </View>
      ) : (
        <EstadoTela
          loading={atual.loading && !atual.dados}
          erro={atual.dados ? null : atual.erro}
          vazio={!!atual.dados && atual.dados.length === 0}
          mensagemVazio={`Nenhum resultado para "${termo}"`}
          iconeVazio="search-outline"
          onRetry={atual.recarregar}
        >
          {aba === 'musicas' ? (
            <FlatList
              data={musicas.dados ?? []}
              keyExtractor={(f) => String(f.id)}
              contentContainerStyle={{ paddingBottom: espaco }}
              onEndReachedThreshold={0.4}
              onEndReached={() => maisResultados(musicas.dados?.length ?? 0)}
              onRefresh={musicas.recarregar}
              refreshing={false}
              renderItem={({ item, index }) => (
                <ItemFaixa
                  faixa={item}
                  onPress={() => {
                    salvarRecente(termo);
                    tocar(musicas.dados ?? [], index);
                  }}
                />
              )}
            />
          ) : (
            <FlatList
              data={albuns.dados ?? []}
              keyExtractor={(a) => String(a.id)}
              contentContainerStyle={{ paddingBottom: espaco }}
              onEndReachedThreshold={0.4}
              onEndReached={() => maisResultados(albuns.dados?.length ?? 0)}
              renderItem={({ item }) => (
                <Pressable
                  style={s.linhaAlbum}
                  onPress={() => {
                    salvarRecente(termo);
                    router.push({ pathname: '/album/[id]', params: { id: String(item.id) } });
                  }}
                >
                  <Capa uri={item.capa} tamanho={56} />
                  <View style={{ flex: 1, marginLeft: SPACING.md }}>
                    <Text numberOfLines={1} style={{ color: tema.text, fontSize: FONT.lg, fontWeight: '600' }}>
                      {item.titulo}
                    </Text>
                    <Text numberOfLines={1} style={{ color: tema.textSecondary, fontSize: FONT.sm }}>
                      {item.artista}
                      {item.ano ? ` · ${item.ano}` : ''}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={tema.muted} />
                </Pressable>
              )}
            />
          )}
        </EstadoTela>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  tela: { flex: 1 },
  topo: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md },
  caixa: { flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: SPACING.sm, borderRadius: RADIUS.pill, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
  input: { flex: 1, marginLeft: SPACING.sm, fontSize: FONT.lg, paddingVertical: 0 },
  abas: { flexDirection: 'row', paddingHorizontal: SPACING.md, marginVertical: SPACING.md },
  aba: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: RADIUS.pill, marginRight: SPACING.sm },
  recentes: { paddingHorizontal: SPACING.md },
  recentesTopo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  rotulo: { fontSize: FONT.lg, fontWeight: '700' },
  chips: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md - 4, paddingVertical: SPACING.sm, borderRadius: RADIUS.pill, marginRight: SPACING.sm, marginBottom: SPACING.sm },
  dica: { textAlign: 'center', marginTop: SPACING.xl },
  linhaAlbum: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
});
