import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Mic } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useWorldFlow } from '@/components/onboarding/WorldFlowChrome';
import { fontFamily } from '@/theme/colors';
import { WORLD_INSTRUCTION_TOP, worldBrand } from '@/theme/worldBrand';
import { ensureMicPermission } from '@/lib/recorder';
import { onboardingDraft } from '@/lib/onboardingDraft';
import { hapticMedio, hapticLeve } from '@/lib/haptics';

const chicoMicSource = require('../../assets/chico-microfone.mp3');

export default function PermissaoScreen() {
  const router = useRouter();
  const [negado, setNegado] = useState(false);
  const scale = useSharedValue(1);
  const pressStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const { setPersonagemTapHandler, setDebugChestHandler } = useWorldFlow();
  const soundRef = useRef<Audio.Sound | null>(null);
  const playRef = useRef<() => Promise<void>>(async () => {});

  const nome = onboardingDraft.nome.trim() || 'amigo';

  useEffect(() => {
    let cancelled = false;

    async function playVoz() {
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
        const { sound } = await Audio.Sound.createAsync(chicoMicSource, { shouldPlay: true });
        if (cancelled) {
          await sound.unloadAsync();
          return;
        }
        soundRef.current = sound;
      } catch {
        // áudio não deve bloquear o ecrã
      }
    }

    playRef.current = playVoz;
    setPersonagemTapHandler(() => {
      void playRef.current();
    });
    setDebugChestHandler(() => {
      router.push({ pathname: '/onboarding/capsula', params: { debugChest: '1' } });
    });
    void playVoz();

    return () => {
      cancelled = true;
      setPersonagemTapHandler(null);
      setDebugChestHandler(null);
      const s = soundRef.current;
      soundRef.current = null;
      void s?.stopAsync().then(() => s.unloadAsync());
    };
  }, [setPersonagemTapHandler, setDebugChestHandler, router]);

  async function pedirPermissao() {
    hapticMedio();
    try {
      await soundRef.current?.stopAsync();
    } catch {
      // ignore
    }
    const ok = await ensureMicPermission();
    if (ok) {
      router.push('/onboarding/capsula');
    } else {
      hapticLeve();
      setNegado(true);
    }
  }

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.content}>
        <View style={styles.upper}>
          <View style={styles.bubble}>
            <Text style={styles.bubbleEyebrow}>Oi, {nome}!</Text>
            <Text style={styles.bubbleText}>
              Eu sou o Chico e vivo no fundo do mar. Eu preciso ouvir sua voz para brincarmos.
              Posso usar o microfone?
            </Text>
          </View>

          {negado ? (
            <Text style={styles.aviso}>
              Sem o microfone eu não consigo te ouvir.{'\n'}
              Ative nas configurações do telemóvel e tente de novo.
            </Text>
          ) : null}
        </View>

        <View style={styles.footer}>
          {!negado ? (
            <Text style={styles.hint}>Só usamos o microfone durante as brincadeiras</Text>
          ) : null}
          <Pressable
            onPressIn={() => {
              scale.value = withSpring(0.94, { damping: 12 });
            }}
            onPressOut={() => {
              scale.value = withSpring(1, { damping: 9 });
            }}
            onPress={pedirPermissao}
          >
            <Animated.View style={[styles.cta, pressStyle]}>
              <Mic color="#FFFFFF" size={22} strokeWidth={2.6} />
              <Text style={styles.ctaLabel}>{negado ? 'Tentar de novo' : 'Permitir microfone'}</Text>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingTop: WORLD_INSTRUCTION_TOP,
    paddingBottom: 28,
    minHeight: 0,
    zIndex: 10,
  },
  upper: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    gap: 22,
    paddingTop: 0,
    minHeight: 0,
    zIndex: 11,
  },
  bubble: {
    backgroundColor: worldBrand.balão,
    paddingHorizontal: 26,
    paddingVertical: 16,
    borderRadius: 28,
    maxWidth: '94%',
    alignItems: 'center',
    gap: 6,
    zIndex: 20,
    shadowColor: worldBrand.balãoSombra,
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  bubbleEyebrow: {
    fontFamily: fontFamily.titulo,
    color: worldBrand.accent,
    fontSize: 22,
    textAlign: 'center',
  },
  bubbleText: {
    fontFamily: fontFamily.titulo,
    color: worldBrand.tinta,
    fontSize: 24,
    textAlign: 'center',
    lineHeight: 32,
  },
  hint: {
    fontFamily: fontFamily.corpoSemi,
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 16,
    marginBottom: 10,
    opacity: 0.9,
  },
  aviso: {
    fontFamily: fontFamily.corpoSemi,
    color: '#FFE8C2',
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
  },
  footer: { alignItems: 'center', width: '100%', flexShrink: 0, gap: 0 },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: worldBrand.cta,
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 26,
    minWidth: 240,
    shadowColor: worldBrand.accentEscuro,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  ctaLabel: {
    fontFamily: fontFamily.titulo,
    color: worldBrand.ctaTexto,
    fontSize: 20,
  },
});
