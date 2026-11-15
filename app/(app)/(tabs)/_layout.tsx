import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { ColorValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ALTURA_TABS } from '../../../src/constants/layout';
import { useTema } from '../../../src/context/ThemeContext';

type Icone = keyof typeof Ionicons.glyphMap;

function icone(nome: Icone, ativo: Icone) {
  return ({ color, size, focused }: { color: ColorValue; size: number; focused: boolean }) => (
    <Ionicons name={focused ? ativo : nome} size={size} color={color} />
  );
}

export default function TabsLayout() {
  const { tema } = useTema();
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: tema.primary,
        tabBarInactiveTintColor: tema.textSecondary,
        tabBarStyle: {
          backgroundColor: tema.surface,
          borderTopColor: tema.border,
          height: ALTURA_TABS + insets.bottom,
          paddingBottom: insets.bottom,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Início', tabBarIcon: icone('home-outline', 'home') }} />
      <Tabs.Screen name="explorar" options={{ title: 'Explorar', tabBarIcon: icone('compass-outline', 'compass') }} />
      <Tabs.Screen name="biblioteca" options={{ title: 'Biblioteca', tabBarIcon: icone('library-outline', 'library') }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil', tabBarIcon: icone('person-outline', 'person') }} />
    </Tabs>
  );
}
