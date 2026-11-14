import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { BibliotecaProvider } from '../src/context/BibliotecaContext';
import { PlayerProvider } from '../src/context/PlayerContext';
import { TemaProvider, useTema } from '../src/context/ThemeContext';

// Segura a splash ate o app ler tema e sessao do storage (flag "pronto").
SplashScreen.preventAutoHideAsync();

function Raiz() {
  const { pronto: authPronto } = useAuth();
  const { pronto: temaPronto, tema, modo } = useTema();
  const pronto = authPronto && temaPronto;

  useEffect(() => {
    if (pronto) SplashScreen.hideAsync();
  }, [pronto]);

  if (!pronto) return null;

  return (
    <>
      <StatusBar style={modo === 'escuro' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: tema.bg } }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="(app)" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <TemaProvider>
      <AuthProvider>
        <BibliotecaProvider>
          <PlayerProvider>
            <Raiz />
          </PlayerProvider>
        </BibliotecaProvider>
      </AuthProvider>
    </TemaProvider>
  );
}
