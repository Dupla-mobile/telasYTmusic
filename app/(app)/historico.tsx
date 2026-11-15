import { Ionicons } from '@expo/vector-icons';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import Cabecalho from '../../src/components/Cabecalho';
import EstadoTela from '../../src/components/EstadoTela';
import ItemFaixa from '../../src/components/ItemFaixa';
import { usePlayer } from '../../src/context/PlayerContext';
import { useTema } from '../../src/context/ThemeContext';
import { limparHistorico, listarHistorico } from '../../src/db/banco';
import { useEspacoInferior } from '../../src/hooks/useEspacoInferior';
import { useFetch } from '../../src/hooks/useFetch';

export default function Historico() {
  const { tema } = useTema();
  const { tocar } = usePlayer();
  const espaco = useEspacoInferior();
  const { dados, loading, erro, recarregar } = useFetch(() => listarHistorico(50), []);
  const lista = dados ?? [];

  function confirmarLimpeza() {
    Alert.alert('Limpar histórico', 'Apagar todo o histórico de reprodução?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Limpar',
        style: 'destructive',
        onPress: async () => {
          await limparHistorico();
          recarregar();
        },
      },
    ]);
  }

  return (
    <View style={[s.tela, { backgroundColor: tema.bg }]}>
      <Cabecalho
        titulo="Histórico"
        direita={
          lista.length > 0 ? (
            <Pressable onPress={confirmarLimpeza} hitSlop={10}>
              <Text style={{ color: tema.primary, fontWeight: '600' }}>Limpar</Text>
            </Pressable>
          ) : null
        }
      />
      <EstadoTela
        loading={loading && !dados}
        erro={dados ? null : erro}
        vazio={!!dados && lista.length === 0}
        iconeVazio="time-outline"
        mensagemVazio="Você ainda não ouviu nenhuma música."
        onRetry={recarregar}
      >
        <FlatList
          data={lista}
          keyExtractor={(f, i) => `${f.id}-${i}`}
          contentContainerStyle={{ paddingBottom: espaco }}
          onRefresh={recarregar}
          refreshing={false}
          renderItem={({ item, index }) => <ItemFaixa faixa={item} onPress={() => tocar(lista, index)} />}
        />
      </EstadoTela>
    </View>
  );
}

const s = StyleSheet.create({ tela: { flex: 1 } });
