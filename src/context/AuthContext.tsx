import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { limparCaches } from '../services/cache';
import { seguro } from '../services/seguro';
import { storage } from '../services/storage';
import { Usuario } from '../types';
import { emailValido, nomeDoEmail } from '../utils/formatar';

type Ctx = {
  usuario: Usuario | null;
  pronto: boolean;
  entrar: (email: string, senha: string) => Promise<void>;
  sair: () => Promise<void>;
};

const AuthCtx = createContext<Ctx>({
  usuario: null,
  pronto: false,
  entrar: async () => {},
  sair: async () => {},
});

const CHAVE_SESSAO = 'app:sessao';
const CHAVE_TOKEN = 'app.token';

// Login simulado: valida os campos, guarda o usuario no AsyncStorage e o token no SecureStore.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    // ao abrir o app: le a sessao salva ANTES de decidir qual tela mostrar
    storage
      .get<Usuario | null>(CHAVE_SESSAO, null)
      .then(setUsuario)
      .finally(() => setPronto(true));
  }, []);

  async function entrar(email: string, senha: string) {
    const limpo = email.trim().toLowerCase();
    if (!emailValido(limpo)) throw new Error('Informe um e-mail válido');
    if (senha.length < 4) throw new Error('A senha precisa ter pelo menos 4 caracteres');
    const u: Usuario = { nome: nomeDoEmail(limpo), email: limpo };
    await seguro.salvar(CHAVE_TOKEN, `mock-token-${Date.now()}`);
    await storage.set(CHAVE_SESSAO, u);
    setUsuario(u);
  }

  async function sair() {
    setUsuario(null);
    await storage.remove(CHAVE_SESSAO);
    await seguro.apagar(CHAVE_TOKEN);
    await limparCaches(); // o proximo usuario nao ve dados do anterior
  }

  return <AuthCtx.Provider value={{ usuario, pronto, entrar, sair }}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
