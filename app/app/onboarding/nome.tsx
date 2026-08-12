import React, { useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight, Settings } from 'lucide-react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { usePicoFlow } from '@/components/onboarding/PicoFlowChrome';
import { fontFamily } from '@/theme/colors';
import { onboardingBrand, PICO_INSTRUCTION_TOP } from '@/theme/onboardingBrand';
import { onboardingDraft } from '@/lib/onboardingDraft';
import { hapticMedio } from '@/lib/haptics';
import { useParallaxStyle } from '@/lib/parallax';
import { useKeyboardLift } from '@/lib/keyboardLift';

const picoOiSource = require('../../assets/pico-oi.mp3');

export default function NomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [nome, setNome] = useState('');
  const scale = useSharedValue(1);
  const pressStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const { tilt, setPicoTapHandler, keyboardLift } = usePicoFlow();
  const bubbleParallax = useParallaxStyle(tilt, { px: 12, py: 9, rotate: 1.5 });

  useKeyboardLift(keyboardLift, true);

  const bubbleKbStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -keyboardLift.mid.value }],
  }));

  const formKbStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -keyboardLift.form.value }],
  }));

  const soundRef = useRef<Audio.Sound | null>(null);
  const playOiRef = useRef<() => Promise<void>>(async () => {});

  useEffect(() => {
    let cancelled = false;

    async function playOi() {
      if (cancelled) return;
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
        });
        if (soundRef.current) {
          await soundRef.current.setPositionAsync(0);
          await soundRef.current.playAsync();
          return;
        }
        const { sound } = await Audio.Sound.createAsync(picoOiSource, { shouldPlay: true });
        if (cancelled) {
          await sound.unloadAsync();
          return;
        }
        soundRef.current = sound;
      } catch {
        // áudio não deve bloquear o ecrã
      }
    }

    playOiRef.current = playOi;
    setPicoTapHandler(() => {
      void playOiRef.current();
    });
    void playOi();

    return () => {
      cancelled = true;
      setPicoTapHandler(null);
      const s = soundRef.current;
      soundRef.current = null;
      void s?.stopAsync().then(() => s.unloadAsync());
    };
  }, [setPicoTapHandler]);

  async function continuar() {
    Keyboard.dismiss();
    onboardingDraft.nome = nome.trim() || 'amigo';
    hapticMedio();
    try {
      await soundRef.current?.stopAsync();
      await soundRef.current?.unloadAsync();
    } catch {
      // ignore
    }
    soundRef.current = null;
    router.push('/onboarding/idade');
  }

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <Pressable
        onPress={() => router.push('/adulto')}
        hitSlop={10}
        style={({ pressed }) => [
          styles.adultoBtn,
          { top: insets.top + 8 },
          pressed && { opacity: 0.6 },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Modo Adulto"
      >
        <Settings color={onboardingBrand.tinta} size={20} />
      </Pressable>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.content}>
          <View style={styles.hero}>
            <Animated.View style={bubbleKbStyle}>
              <Animated.View style={[styles.bubble, bubbleParallax]}>
                <Text style={styles.bubbleEyebrow}>Oi! Eu sou o Pico!</Text>
                <Text style={styles.bubbleText}>Como você se chama?</Text>
              </Animated.View>
            </Animated.View>
          </View>

          <Animated.View style={[styles.bottom, formKbStyle]}>
            <TextInput
              value={nome}
              onChangeText={setNome}
              placeholder="Seu Nome"
              placeholderTextColor="rgba(42,51,80,0.35)"
              style={styles.input}
              maxLength={20}
              autoCapitalize="words"
              returnKeyType="done"
              blurOnSubmit
              onSubmitEditing={continuar}
            />

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
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: 'transparent' },
  adultoBtn: {
    position: 'absolute',
    right: 16,
    zIndex: 30,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.4,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingTop: PICO_INSTRUCTION_TOP,
    paddingBottom: Platform.OS === 'ios' ? 12 : 16,
    zIndex: 10,
  },
  hero: {
    flexShrink: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    zIndex: 11,
    minHeight: 0,
  },
  bubble: {
    backgroundColor: onboardingBrand.balão,
    paddingHorizontal: 26,
    paddingVertical: 16,
    borderRadius: 28,
    maxWidth: '92%',
    alignItems: 'center',
    gap: 4,
    zIndex: 20,
    shadowColor: '#9B6BFF',
    shadowOpacity: 0.14,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  bubbleEyebrow: {
    fontFamily: fontFamily.titulo,
    color: onboardingBrand.roxo,
    fontSize: 20,
    textAlign: 'center',
  },
  bubbleText: {
    fontFamily: fontFamily.titulo,
    color: onboardingBrand.tinta,
    fontSize: 28,
    textAlign: 'center',
    lineHeight: 34,
  },
  bottom: {
    width: '100%',
    alignItems: 'center',
    gap: 14,
    flexShrink: 0,
    paddingBottom: 8,
    zIndex: 20,
  },

  input: {
    backgroundColor: onboardingBrand.campo,
    color: onboardingBrand.tinta,
    fontFamily: fontFamily.titulo,
    fontSize: 26,
    textAlign: 'center',
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 28,
    width: '88%',
    borderWidth: 2,
    borderColor: onboardingBrand.campoBorda,
    overflow: 'hidden',
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
