import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BarraProgresso from '../../src/components/BarraProgresso';
import Botao from '../../src/components/Botao';
import Capa from '../../src/components/Capa';
import SeletorPlaylist from '../../src/components/SeletorPlaylist';
import { CHAVE_PREFS, PREFS_PADRAO } from '../../src/constants/prefs';
import { FONT, SPACING } from '../../src/constants/theme';
import { useBiblioteca } from '../../src/context/BibliotecaContext';
import { usePlayer, useProgresso } from '../../src/context/PlayerContext';
import { useTema } from '../../src/context/ThemeContext';
import { usePersistedState } from '../../src/hooks/usePersistedState';
import { Preferencias } from '../../src/types';
import { formatarTempo } from '../../src/utils/formatar';

export default function Player() {
  const { tema } = useTema();
  const insets = useSafeAreaInsets();
  const { atual, tocando, aleatorio, repeticao, alternar, proxima, anterior, buscar, alternarAleatorio, alternarRepeticao } = usePlayer();
  const { posicao, duracao } = useProgresso();
  const { curtidas, alternarCurtida } = useBiblioteca();
  const [prefs] = usePersistedState<Preferencias>(CHAVE_PREFS, PREFS_PADRAO);
  const [menu, setMenu] = useState(false);

  if (!atual) {
    return (
      <View style={[s.vazio, { backgroundColor: tema.bg }]}>
        <Ionicons name="musical-notes-outline" size={64} color={tema.muted} />
        <Text style={[s.vazioTexto, { color: tema.textSecondary }]}>Nada tocando agora.</Text>
        <Botao titulo="Voltar" onPress={() => router.back()} style={{ marginTop: SPACING.md }} />
      </View>
    );
  }

  const curtida = curtidas.has(atual.id);
  const capa = prefs.capaHD ? atual.capa?.replace('300x300', '600x600') : atual.capa;

  return (
    <View style={[s.tela, { backgroundColor: tema.bg, paddingTop: insets.top + SPACING.sm, paddingBottom: insets.bottom + SPACING.md }]}>
      <View style={s.topo}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-down" size={30} color={tema.text} />
        </Pressable>
        <Text style={[s.topoTitulo, { color: tema.textSecondary }]} numberOfLines={1}>
          {atual.album ?? 'Tocando agora'}
        </Text>
        <Pressable onPress={() => setMenu(true)} hitSlop={12}>
          <Ionicons name="add-circle-outline" size={28} color={tema.text} />
        </Pressable>
      </View>

      <View style={s.capaBox}>
        <Capa uri={capa} tamanho={300} raio={12} />
      </View>

      <View style={s.infoLinha}>
        <View style={s.info}>
          <Text style={[s.titulo, { color: tema.text }]} numberOfLines={2}>
            {atual.titulo}
          </Text>
          <Pressable
            disabled={!atual.artistaId}
            onPress={() => {
              router.back();
              router.push({ pathname: '/artista/[id]', params: { id: String(atual.artistaId) } });
            }}
          >
            <Text style={[s.artista, { color: tema.textSecondary }]} numberOfLines={1}>
              {atual.artista}
            </Text>
          </Pressable>
        </View>
        <Pressable hitSlop={12} onPress={() => alternarCurtida(atual)}>
          <Ionicons name={curtida ? 'heart' : 'heart-outline'} size={28} color={curtida ? tema.primary : tema.text} />
        </Pressable>
      </View>

      <BarraProgresso onBuscar={buscar} altura={5} />
      <View style={s.tempos}>
        <Text style={[s.tempo, { color: tema.textSecondary }]}>{formatarTempo(posicao)}</Text>
        <Text style={[s.tempo, { color: tema.textSecondary }]}>{formatarTempo(duracao)}</Text>
      </View>

      <View style={s.controles}>
        <Pressable onPress={alternarAleatorio} hitSlop={10}>
          <Ionicons name="shuffle" size={26} color={aleatorio ? tema.primary : tema.textSecondary} />
        </Pressable>
        <Pressable onPress={anterior} hitSlop={10}>
          <Ionicons name="play-skip-back" size={34} color={tema.text} />
        </Pressable>
        <Pressable onPress={alternar} style={[s.play, { backgroundColor: tema.text }]}>
          <Ionicons name={tocando ? 'pause' : 'play'} size={36} color={tema.bg} />
        </Pressable>
        <Pressable onPress={proxima} hitSlop={10}>
          <Ionicons name="play-skip-forward" size={34} color={tema.text} />
        </Pressable>
        <Pressable onPress={alternarRepeticao} hitSlop={10}>
          <Ionicons name="repeat" size={26} color={repeticao === 'nenhuma' ? tema.textSecondary : tema.primary} />
          {repeticao === 'faixa' ? <Text style={[s.um, { color: tema.primary }]}>1</Text> : null}
        </Pressable>
      </View>
      <Text style={[s.rodape, { color: tema.muted }]}>Prévia de 30 segundos fornecida pelo iTunes</Text>

      {menu ? <SeletorPlaylist faixa={atual} onFechar={() => setMenu(false)} /> : null}
    </View>
  );
}

const s = StyleSheet.create({
  tela: { flex: 1, paddingHorizontal: SPACING.lg },
  vazio: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  vazioTexto: { fontSize: FONT.lg, marginTop: SPACING.md },
  topo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  topoTitulo: { flex: 1, textAlign: 'center', marginHorizontal: SPACING.md, fontSize: FONT.md },
  capaBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  infoLinha: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
  info: { flex: 1, marginRight: SPACING.md },
  titulo: { fontSize: FONT.xl, fontWeight: '800' },
  artista: { fontSize: FONT.lg, marginTop: 2 },
  tempos: { flexDirection: 'row', justifyContent: 'space-between', marginTop: SPACING.sm, marginBottom: SPACING.md },
  tempo: { fontSize: FONT.sm },
  controles: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  play: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
  um: { position: 'absolute', right: -2, top: -4, fontSize: 10, fontWeight: '800' },
  rodape: { textAlign: 'center', fontSize: FONT.sm, marginTop: SPACING.lg },
});
