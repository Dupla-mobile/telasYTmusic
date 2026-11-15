import Constants from 'expo-constants';
import { Alert, ScrollView, StyleSheet, Switch, View } from 'react-native';
import Cabecalho from '../../src/components/Cabecalho';
import LinhaAtalho from '../../src/components/LinhaAtalho';
import { CHAVE_PREFS, PREFS_PADRAO } from '../../src/constants/prefs';
import { SPACING } from '../../src/constants/theme';
import { useTema } from '../../src/context/ThemeContext';
import { limparHistorico } from '../../src/db/banco';
import { usePersistedState } from '../../src/hooks/usePersistedState';
import { limparCaches } from '../../src/services/cache';
import { Preferencias } from '../../src/types';

export default function Configuracoes() {
  const { tema, modo, setModo } = useTema();
  const [prefs, setPrefs] = usePersistedState<Preferencias>(CHAVE_PREFS, PREFS_PADRAO);

  async function limparCache() {
    const qtd = await limparCaches();
    Alert.alert('Cache limpo', `${qtd} item(ns) removido(s).`);
  }

  function confirmarHistorico() {
    Alert.alert('Limpar histórico', 'Apagar todo o histórico de reprodução?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Limpar', style: 'destructive', onPress: () => limparHistorico() },
    ]);
  }

  const trilho = { true: tema.primary };

  return (
    <View style={[s.tela, { backgroundColor: tema.bg }]}>
      <Cabecalho titulo="Configurações" />
      <ScrollView contentContainerStyle={s.conteudo}>
        <LinhaAtalho
          icone="moon-outline"
          titulo="Modo escuro"
          direita={<Switch value={modo === 'escuro'} onValueChange={(v) => setModo(v ? 'escuro' : 'claro')} trackColor={trilho} />}
        />
        <LinhaAtalho
          icone="play-skip-forward"
          titulo="Tocar a próxima automaticamente"
          subtitulo="Ao fim da prévia, segue para a próxima da fila"
          direita={<Switch value={prefs.autoplay} onValueChange={(v) => setPrefs({ ...prefs, autoplay: v })} trackColor={trilho} />}
        />
        <LinhaAtalho
          icone="image-outline"
          titulo="Capa em alta resolução"
          subtitulo="Usada na tela do player"
          direita={<Switch value={prefs.capaHD} onValueChange={(v) => setPrefs({ ...prefs, capaHD: v })} trackColor={trilho} />}
        />
        <LinhaAtalho icone="trash-outline" titulo="Limpar cache de dados" subtitulo="Remove listas salvas para uso offline" onPress={limparCache} />
        <LinhaAtalho icone="time-outline" titulo="Limpar histórico" onPress={confirmarHistorico} />
        <LinhaAtalho icone="information-circle-outline" titulo="Versão do app" subtitulo={Constants.expoConfig?.version ?? '2.0.0'} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  tela: { flex: 1 },
  conteudo: { paddingBottom: SPACING.xl },
});
