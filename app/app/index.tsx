import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { View } from 'react-native';
import { storage } from '@/lib/storage';
import { colors } from '@/theme/colors';

export default function Index() {
  const [dest, setDest] = useState<'onboarding' | 'mapa' | null>(null);

  useEffect(() => {
    storage.isOnboardingCompleto().then((done) => {
      setDest(done ? 'mapa' : 'onboarding');
    });
  }, []);

  if (!dest) {
    return <View style={{ flex: 1, backgroundColor: colors.fundo }} />;
  }

  return <Redirect href={dest === 'mapa' ? '/mapa' : '/onboarding/nome'} />;
}
