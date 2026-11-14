import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { CHAVE_PREFS, PREFS_PADRAO } from '../constants/prefs';
import { registrarHistorico } from '../db/banco';
import { storage } from '../services/storage';
import { Faixa, Preferencias } from '../types';

export type Repeticao = 'nenhuma' | 'fila' | 'faixa';

type Estado = {
  atual: Faixa | null;
  fila: Faixa[];
  indice: number;
  tocando: boolean;
  aleatorio: boolean;
  repeticao: Repeticao;
  tocar: (fila: Faixa[], indice: number) => void;
  alternar: () => void;
  proxima: () => void;
  anterior: () => void;
  buscar: (segundos: number) => void;
  alternarAleatorio: () => void;
  alternarRepeticao: () => void;
};

const vazio: Estado = {
  atual: null,
  fila: [],
  indice: 0,
  tocando: false,
  aleatorio: false,
  repeticao: 'nenhuma',
  tocar: () => {},
  alternar: () => {},
  proxima: () => {},
  anterior: () => {},
  buscar: () => {},
  alternarAleatorio: () => {},
  alternarRepeticao: () => {},
};

const PlayerCtx = createContext<Estado>(vazio);
// Posicao muda varias vezes por segundo: fica em outro contexto para nao re-renderizar o app inteiro.
const ProgressoCtx = createContext({ posicao: 0, duracao: 0 });

export function PlayerProvider({ children }: { children: ReactNode }) {
  const player = useAudioPlayer(null);
  const status = useAudioPlayerStatus(player);
  const [fila, setFila] = useState<Faixa[]>([]);
  const [indice, setIndice] = useState(0);
  const [disparo, setDisparo] = useState(0);
  const [aleatorio, setAleatorio] = useState(false);
  const [repeticao, setRepeticao] = useState<Repeticao>('nenhuma');
  const atual = fila[indice] ?? null;

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  }, []);

  // Toda vez que uma faixa e escolhida (mesmo a mesma de novo), carrega o audio e toca.
  useEffect(() => {
    if (!atual?.previewUrl) return;
    try {
      player.replace(atual.previewUrl);
      player.play();
    } catch {
      Alert.alert('Erro', 'Não foi possível reproduzir esta faixa.');
    }
    registrarHistorico(atual).catch(() => {});
  }, [disparo]);

  const irPara = useCallback((i: number) => {
    setIndice(i);
    setDisparo((d) => d + 1);
  }, []);

  const calcularProximo = useCallback(
    (automatico: boolean): number | null => {
      if (fila.length === 0) return null;
      if (aleatorio && fila.length > 1) {
        let n = indice;
        while (n === indice) n = Math.floor(Math.random() * fila.length);
        return n;
      }
      if (indice + 1 < fila.length) return indice + 1;
      if (repeticao === 'fila' || !automatico) return 0;
      return null;
    },
    [fila, indice, aleatorio, repeticao],
  );

  // Fim da faixa: repete, avanca (se autoplay estiver ligado) ou para.
  useEffect(() => {
    if (!status.didJustFinish) return;
    (async () => {
      if (repeticao === 'faixa') {
        await player.seekTo(0);
        player.play();
        return;
      }
      const prefs = await storage.get<Preferencias>(CHAVE_PREFS, PREFS_PADRAO);
      if (!prefs.autoplay) return;
      const n = calcularProximo(true);
      if (n !== null) irPara(n);
    })().catch(() => {});
  }, [status.didJustFinish]);

  const tocar = useCallback(
    (lista: Faixa[], i: number) => {
      const alvo = lista[i];
      const jogaveis = lista.filter((f) => !!f.previewUrl);
      const novo = jogaveis.findIndex((f) => f.id === alvo?.id);
      if (!alvo || novo < 0) {
        Alert.alert('Prévia indisponível', 'Esta faixa não tem trecho disponível para reprodução.');
        return;
      }
      setFila(jogaveis);
      irPara(novo);
    },
    [irPara],
  );

  const alternar = useCallback(() => {
    if (player.playing) {
      player.pause();
      return;
    }
    if (status.duration > 0 && status.currentTime >= status.duration - 0.2) player.seekTo(0).catch(() => {});
    player.play();
  }, [player, status.duration, status.currentTime]);

  const proxima = useCallback(() => {
    const n = calcularProximo(false);
    if (n !== null) irPara(n);
  }, [calcularProximo, irPara]);

  const anterior = useCallback(() => {
    if (status.currentTime > 3 || indice === 0) {
      player.seekTo(0).catch(() => {});
      return;
    }
    irPara(indice - 1);
  }, [status.currentTime, indice, irPara, player]);

  const buscar = useCallback((s: number) => player.seekTo(Math.max(0, s)).catch(() => {}), [player]);
  const alternarAleatorio = useCallback(() => setAleatorio((a) => !a), []);
  const alternarRepeticao = useCallback(
    () => setRepeticao((r) => (r === 'nenhuma' ? 'fila' : r === 'fila' ? 'faixa' : 'nenhuma')),
    [],
  );

  const estado = useMemo<Estado>(
    () => ({
      atual,
      fila,
      indice,
      tocando: status.playing,
      aleatorio,
      repeticao,
      tocar,
      alternar,
      proxima,
      anterior,
      buscar,
      alternarAleatorio,
      alternarRepeticao,
    }),
    [atual, fila, indice, status.playing, aleatorio, repeticao, tocar, alternar, proxima, anterior, buscar, alternarAleatorio, alternarRepeticao],
  );
  const progresso = useMemo(
    () => ({ posicao: status.currentTime, duracao: status.duration }),
    [status.currentTime, status.duration],
  );

  return (
    <PlayerCtx.Provider value={estado}>
      <ProgressoCtx.Provider value={progresso}>{children}</ProgressoCtx.Provider>
    </PlayerCtx.Provider>
  );
}

export const usePlayer = () => useContext(PlayerCtx);
export const useProgresso = () => useContext(ProgressoCtx);
