import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { RADIUS } from '../constants/theme';
import { useProgresso } from '../context/PlayerContext';
import { useTema } from '../context/ThemeContext';

type Props = { onBuscar?: (segundos: number) => void; altura?: number };

// Barra de progresso: toque para pular para aquele ponto da faixa.
export default function BarraProgresso({ onBuscar, altura = 4 }: Props) {
  const { tema } = useTema();
  const { posicao, duracao } = useProgresso();
  const [largura, setLargura] = useState(1);
  const pct = duracao > 0 ? Math.min(1, posicao / duracao) : 0;

  return (
    <Pressable
      disabled={!onBuscar}
      onLayout={(e) => setLargura(e.nativeEvent.layout.width)}
      onPress={(e) => onBuscar?.((e.nativeEvent.locationX / largura) * duracao)}
      hitSlop={{ top: 12, bottom: 12 }}
    >
      <View style={[s.trilho, { height: altura, backgroundColor: tema.surfaceAlt }]}>
        <View style={{ width: `${pct * 100}%`, height: '100%', backgroundColor: tema.primary }} />
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  trilho: { width: '100%', borderRadius: RADIUS.pill, overflow: 'hidden' },
});
