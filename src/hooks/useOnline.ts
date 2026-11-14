import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

export function useOnline(): boolean {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const parar = NetInfo.addEventListener((s) => setOnline(s.isConnected !== false));
    return parar;
  }, []);
  return online;
}
