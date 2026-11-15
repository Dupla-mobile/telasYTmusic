import { FlatList, StyleSheet, Text, View } from 'react-native';
import Botao from '../../src/components/Botao';
import Cabecalho from '../../src/components/Cabecalho';
import EstadoTela from '../../src/components/EstadoTela';
import ItemFaixa from '../../src/components/ItemFaixa';
import { FONT, SPACING } from '../../src/constants/theme';
import { useBiblioteca } from '../../src/context/BibliotecaContext';
import { usePlayer } from '../../src/context/PlayerContext';
import { useTema } from '../../src/context/ThemeContext';
import { listarCurtidas } from '../../src/db/banco';
import { useEspacoInferior } from '../../src/hooks/useEspacoInferior';
import { useFetch } from '../../src/hooks/useFetch';

export default function Curtidas() {
  const { tema } = useTema();
  const { tocar } = usePlayer();
  const { curtidas } = useBiblioteca();
  const espaco = useEspacoInferior();
  // recarrega do SQLite sempre que o conjunto de curtidas mudar (curtir/descurtir em qualquer tela)
  const { dados, loading, erro, recarregar } = useFetch(() => listarCurtidas(), [curtidas]);
  const lista = dados ?? [];

  return (
    <View style={[s.tela, { backgroundColor: tema.bg }]}>
      <Cabecalho titulo="Músicas curtidas" />
      <EstadoTela
        loading={loading && !dados}
        erro={dados ? null : erro}
        vazio={!!dados && lista.length === 0}
        iconeVazio="heart-outline"
        mensagemVazio="Toque no coração de uma música para ela aparecer aqui."
        onRetry={recarregar}
      >
        <FlatList
          data={lista}
          keyExtractor={(f) => String(f.id)}
          contentContainerStyle={{ paddingBottom: espaco }}
          ListHeaderComponent={
            <View style={s.topo}>
              <Text style={[s.contagem, { color: tema.textSecondary }]}>{lista.length} músicas</Text>
              <Botao titulo="Tocar todas" icone="play" onPress={() => tocar(lista, 0)} />
            </View>
          }
          renderItem={({ item, index }) => <ItemFaixa faixa={item} onPress={() => tocar(lista, index)} />}
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
