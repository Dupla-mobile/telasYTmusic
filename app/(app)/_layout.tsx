import { Redirect, Stack, useSegments } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MiniPlayer from '../../src/components/MiniPlayer';
import { ALTURA_TABS } from '../../src/constants/layout';
import { useAuth } from '../../src/context/AuthContext';
import { usePlayer } from '../../src/context/PlayerContext';
import { useTema } from '../../src/context/ThemeContext';

// Guarda de rota: so entra aqui quem tem sessao. O mini-player flutua sobre todas as telas.
export default function AppLayout() {
  const { usuario } = useAuth();
  const { tema } = useTema();
  const { atual } = usePlayer();
  const insets = useSafeAreaInsets();
  const segmentos = useSegments() as string[];

  if (!usuario) return <Redirect href="/login" />;

  const naTabs = segmentos.includes('(tabs)');
  const noPlayer = segmentos.includes('player');
  const base = naTabs ? ALTURA_TABS + insets.bottom : insets.bottom;

  return (
    <View style={{ flex: 1, backgroundColor: tema.bg }}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: tema.bg } }}>
        <Stack.Screen name="player" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      </Stack>
      {atual && !noPlayer ? (
        <View style={[s.mini, { bottom: base + 8 }]} pointerEvents="box-none">
          <MiniPlayer />
        </View>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  mini: { position: 'absolute', left: 0, right: 0 },
});
