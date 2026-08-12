import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { ContadorDeIdade } from '@/components/onboarding/MaoContadora';
import { BubbleButton } from '@/components/ui/BubbleButton';
import { usePicoFlow } from '@/components/onboarding/PicoFlowChrome';
import { fontFamily } from '@/theme/colors';
import { onboardingBrand, PICO_INSTRUCTION_TOP } from '@/theme/onboardingBrand';
import { onboardingDraft } from '@/lib/onboardingDraft';
import { hapticMedio } from '@/lib/haptics';
import { useParallaxStyle } from '@/lib/parallax';
import { playIdade, preloadIdadeAudio, stopIdadeAudio, unloadIdadeAudio } from '@/lib/idadeAudio';

const IDADES = [3, 4, 5, 6, 7, 8];
const picoIdadeSource = require('../../assets/pico-idade.mp3');

export default function IdadeScreen() {
  const router = useRouter();
  const [idade, setIdade] = useState(onboardingDraft.idade);
  const scale = useSharedValue(1);
  const pressStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const { tilt, setPicoTapHandler } = usePicoFlow();
  const bubbleStyle = useParallaxStyle(tilt, { px: 12, py: 9, rotate: 1.5 });

  const promptRef = useRef<Audio.Sound | null>(null);
  const playPromptRef = useRef<() => Promise<void>>(async () => {});

  useEffect(() => {
    let cancelled = false;

    async function playPrompt() {
      if (cancelled) return;
      try {
        await stopIdadeAudio();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
        });
        if (promptRef.current) {
          await promptRef.current.setPositionAsync(0);
          await promptRef.current.playAsync();
          return;
        }
        const { sound } = await Audio.Sound.createAsync(picoIdadeSource, { shouldPlay: true });
        if (cancelled) {
          await sound.unloadAsync();
          return;
        }
        promptRef.current = sound;
      } catch {
        // áudio não deve bloquear o ecrã
      }
    }

    playPromptRef.current = playPrompt;
    setPicoTapHandler(() => {
      void playPromptRef.current();
    });
    void preloadIdadeAudio();
    void playPrompt();

    return () => {
      cancelled = true;
      setPicoTapHandler(null);
      const s = promptRef.current;
      promptRef.current = null;
      void s?.stopAsync().then(() => s.unloadAsync());
      void unloadIdadeAudio();
    };
  }, [setPicoTapHandler]);

  function escolher(n: number) {
    setIdade(n);
    void promptRef.current?.stopAsync();
    void playIdade(n);
  }

  function continuar() {
    void promptRef.current?.stopAsync();
    void stopIdadeAudio();
    onboardingDraft.idade = idade;
    hapticMedio();
    router.push('/onboarding/universo');
  }

  const ageBtn = 58;

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.content}>
        {/* Zona superior: pergunta + mãos (encolhe se preciso) */}
        <View style={styles.upper}>
          <Animated.View style={[styles.bubble, bubbleStyle]}>
            <Text style={styles.bubbleText}>Quantos anos você tem?</Text>
          </Animated.View>
          <View style={styles.maos}>
            <ContadorDeIdade idade={idade} size={220} />
          </View>
        </View>

        {/* Zona inferior fixa: idades + CTA — nunca se sobrepõem */}
        <View style={styles.lower}>
          <View style={[styles.grid, { width: ageBtn * 3 + 16 * 2 }]}>
            {IDADES.map((n) => (
              <BubbleButton
                key={n}
                size={ageBtn}
                labelSize={26}
                color={n === idade ? onboardingBrand.idadeAtiva : onboardingBrand.idadeInativa}
                onPress={() => escolher(n)}
                label={String(n)}
              />
            ))}
          </View>

          <Pressable
            onPressIn={() => {
              scale.value = withSpring(0.94, { damping: 12 });
            }}
            onPressOut={() => {
              scale.value = withSpring(1, { damping: 9 });
            }}
            onPress={continuar}
          >
            <Animated.View style={[styles.cta, pressStyle]}>
              <Text style={styles.ctaLabel}>Bora lá!</Text>
              <ArrowRight color="#FFFFFF" size={22} strokeWidth={3} />
            </Animated.View>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: 'transparent' },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: PICO_INSTRUCTION_TOP,
    paddingBottom: 28,
    minHeight: 0,
    justifyContent: 'space-between',
    zIndex: 10,
  },
  upper: {
    flex: 1,
    minHeight: 0,
    alignItems: 'center',
    gap: 8,
    zIndex: 11,
  },
  bubble: {
    backgroundColor: onboardingBrand.balão,
    paddingHorizontal: 26,
    paddingVertical: 14,
    borderRadius: 28,
    maxWidth: '92%',
    alignItems: 'center',
    flexShrink: 0,
    zIndex: 20,
    shadowColor: '#9B6BFF',
    shadowOpacity: 0.14,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  bubbleText: {
    fontFamily: fontFamily.titulo,
    color: onboardingBrand.tinta,
    fontSize: 28,
    textAlign: 'center',
    lineHeight: 34,
  },
  maos: {
    flex: 1,
    minHeight: 0,
    width: '100%',
    maxHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  lower: {
    flexShrink: 0,
    alignItems: 'center',
    gap: 22,
    paddingTop: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: onboardingBrand.roxo,
    paddingVertical: 16,
    paddingHorizontal: 34,
    borderRadius: 26,
    minWidth: 200,
    shadowColor: onboardingBrand.roxoEscuro,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  ctaLabel: {
    fontFamily: fontFamily.titulo,
    color: '#FFFFFF',
    fontSize: 22,
  },
});
