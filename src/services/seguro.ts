import * as SecureStore from 'expo-secure-store';

// Segredos (token) ficam no Keychain/Keystore, nunca no AsyncStorage.
// Chaves do SecureStore so aceitam letras, numeros, '.', '-' e '_'.
export const seguro = {
  async salvar(chave: string, valor: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(chave, valor);
    } catch {
      // indisponivel (ex.: versao web): o app segue sem o token persistido
    }
  },
  async ler(chave: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(chave);
    } catch {
      return null;
    }
  },
  async apagar(chave: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(chave);
    } catch {
      // nada a apagar
    }
  },
};
