import { createContext, ReactNode, useContext, useMemo } from 'react';
import { claro, escuro, Tema } from '../constants/theme';
import { usePersistedState } from '../hooks/usePersistedState';

type Modo = 'claro' | 'escuro';
type Ctx = { tema: Tema; modo: Modo; setModo: (m: Modo) => void; pronto: boolean };

const ThemeCtx = createContext<Ctx>({ tema: escuro, modo: 'escuro', setModo: () => {}, pronto: false });

// Tema claro/escuro persistido: escolheu escuro, fechou o app, abriu: continua escuro.
export function TemaProvider({ children }: { children: ReactNode }) {
  const [modo, setModo, pronto] = usePersistedState<Modo>('app:tema', 'escuro');
  const valor = useMemo(
    () => ({ tema: modo === 'claro' ? claro : escuro, modo, setModo, pronto }),
    [modo, setModo, pronto],
  );
  return <ThemeCtx.Provider value={valor}>{children}</ThemeCtx.Provider>;
}

export const useTema = () => useContext(ThemeCtx);
