import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OceanBackground } from '@/components/scene/OceanBackground';
import { ChicoSprite } from '@/components/ChicoSprite';
import { SpeechBubble } from '@/components/ui/SpeechBubble';
import { PearlButton } from '@/components/ui/PearlButton';
import { BubbleButton } from '@/components/ui/BubbleButton';
import { ContadorDeIdade } from '@/components/onboarding/MaoContadora';
import { colors, fontFamily } from '@/theme/colors';
import { onboardingDraft } from '@/lib/onboardingDraft';

const IDADES = [3, 4, 5, 6, 7, 8];

export default function IdadeScreen() {
  const router = useRouter();
  const [idade, setIdade] = useState(onboardingDraft.idade);

  function continuar() {
    onboardingDraft.idade = idade;
    router.push('/onboarding/universo');
  }

  return (
    <View style={styles.root}>
      <OceanBackground bubbles={8} />
      <SafeAreaView style={styles.content}>
        <ChicoSprite pose="listening" size={110} />
        <SpeechBubble>Quantos anos você tem?</SpeechBubble>

        <View style={styles.maos}>
          <ContadorDeIdade idade={idade} size={idade > 5 ? 80 : 100} />
        </View>

        <View style={styles.grid}>
          {IDADES.map((n) => (
            <View key={n} style={styles.item}>
              <BubbleButton
                size={64}
                color={n === idade ? colors.estrela : colors.turquesa}
                onPress={() => setIdade(n)}
                label={String(n)}
              />
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <PearlButton size={110} onPress={continuar}>
            <ArrowRight color={colors.fundo} size={34} strokeWidth={3} />
          </PearlButton>
          <Text style={styles.footerLabel}>Bora lá!</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.fundo },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    paddingHorizontal: 24,
  },
  maos: { height: 92, alignItems: 'center', justifyContent: 'center' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    maxWidth: 320,
  },
  item: { alignItems: 'center' },
  footer: { position: 'absolute', bottom: 56, alignItems: 'center', gap: 8 },
  footerLabel: { fontFamily: fontFamily.corpoExtra, color: colors.areia, fontSize: 16 },
});
