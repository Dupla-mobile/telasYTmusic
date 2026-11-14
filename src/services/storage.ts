import AsyncStorage from '@react-native-async-storage/async-storage';

// Wrapper tipado: as telas nunca lidam com JSON.stringify/parse.
export const storage = {
  async get<T>(chave: string, padrao: T): Promise<T> {
    try {
      const bruto = await AsyncStorage.getItem(chave);
      return bruto ? (JSON.parse(bruto) as T) : padrao;
    } catch {
      return padrao; // dado corrompido: usa o padrao
    }
  },
  async set<T>(chave: string, valor: T): Promise<void> {
    await AsyncStorage.setItem(chave, JSON.stringify(valor));
  },
  remove: (chave: string) => AsyncStorage.removeItem(chave),
  async removerPrefixo(prefixo: string): Promise<number> {
    const chaves = (await AsyncStorage.getAllKeys()).filter((k) => k.startsWith(prefixo));
    if (chaves.length > 0) await AsyncStorage.multiRemove(chaves);
    return chaves.length;
  },
};
