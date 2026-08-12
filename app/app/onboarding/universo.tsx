import React, { useEffect, useRef } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Lock } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import Animated from 'react-native-reanimated';
import { usePicoFlow } from '@/components/onboarding/PicoFlowChrome';
import { fontFamily } from '@/theme/colors';
import { onboardingBrand, PICO_INSTRUCTION_TOP } from '@/theme/onboardingBrand';
import { onboardingDraft } from '@/lib/onboardingDraft';
import { universos } from '@/data/universos';
import { hapticSelecao, hapticLeve } from '@/lib/haptics';
import { useParallaxStyle } from '@/lib/parallax';

const picoUniversoSource = require('../../assets/pico-universo.mp3');

export default function UniversoScreen() {
  const router = useRouter();
  const { tilt, setPicoTapHandler } = usePicoFlow();
  const bubbleStyle = useParallaxStyle(tilt, { px: 12, py: 9, rotate: 1.5 });

  const soundRef = useRef<Audio.Sound | null>(null);
  const playRef = useRef<() => Promise<void>>(async () => {});

  useEffect(() => {
    let cancelled = false;

    async function playPrompt() {
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
        const { sound } = await Audio.Sound.createAsync(picoUniversoSource, { shouldPlay: true });
        if (cancelled) {
          await sound.unloadAsync();
          return;
        }
        soundRef.current = sound;
      } catch {
        // áudio não deve bloquear o ecrã
      }
    }

    playRef.current = playPrompt;
    setPicoTapHandler(() => {
      void playRef.current();
    });
    void playPrompt();

    return () => {
      cancelled = true;
      setPicoTapHandler(null);
      const s = soundRef.current;
      soundRef.current = null;
      void s?.stopAsync().then(() => s.unloadAsync());
    };
  }, [setPicoTapHandler]);

  async function escolher(id: string, ativo: boolean) {
    if (!ativo) {
      hapticLeve();
      return;
    }
    hapticSelecao();
    try {
      await soundRef.current?.stopAsync();
    } catch {
      // ignore
    }
    onboardingDraft.universo = id;
    router.push('/onboarding/permissao');
  }

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.content}>
        <Animated.View style={[styles.titleWrap, bubbleStyle]}>
          <Text style={styles.title}>Escolha seu mundo!</Text>
        </Animated.View>

        <View style={styles.grid}>
          {universos.map((u) => (
            <Pressable
              key={u.id}
              onPress={() => escolher(u.id, u.ativo)}
              style={[
                styles.card,
                {
                  backgroundColor: u.ativo ? u.corSuave : '#F0F1F5',
                  borderColor: u.ativo ? u.corPrincipal : 'rgba(42,51,80,0.08)',
                },
                !u.ativo && styles.cardLocked,
              ]}
            >
              <View style={styles.artWrap}>
                <Image
                  source={u.arte}
                  style={[styles.art, !u.ativo && styles.artLocked]}
                  resizeMode="contain"
                />
                {!u.ativo && (
                  <View style={styles.lockOverlay}>
                    <Lock color={onboardingBrand.tinta} size={18} strokeWidth={2.5} />
                  </View>
                )}
              </View>
              <Text style={[styles.mundo, { color: u.ativo ? u.corPrincipal : 'rgba(42,51,80,0.45)' }]}>
                {u.nome}
              </Text>
              <Text style={[styles.personagem, !u.ativo && styles.personagemLocked]}>{u.personagem}</Text>
              {!u.ativo && <Text style={styles.emBreve}>em breve</Text>}
            </Pressable>
          ))}
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
    paddingHorizontal: 20,
    paddingTop: PICO_INSTRUCTION_TOP,
    paddingBottom: 20,
    minHeight: 0,
    zIndex: 10,
  },
  titleWrap: {
    alignItems: 'center',
    flexShrink: 0,
    zIndex: 20,
    marginBottom: 14,
    paddingHorizontal: 12,
  },
  title: {
    fontFamily: fontFamily.titulo,
    color: onboardingBrand.tinta,
    fontSize: 30,
    textAlign: 'center',
    lineHeight: 36,
  },
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'flex-start',
    gap: 10,
    width: '100%',
    maxWidth: 360,
    minHeight: 0,
  },
  card: {
    width: '46%',
    maxWidth: 160,
    aspectRatio: 0.95,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    paddingBottom: 10,
    paddingHorizontal: 8,
    gap: 2,
  },
  cardLocked: {
    opacity: 0.92,
  },
  artWrap: {
    width: '78%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  art: {
    width: '100%',
    height: '100%',
  },
  artLocked: {
    opacity: 0.4,
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mundo: {
    fontFamily: fontFamily.titulo,
    fontSize: 15,
    textAlign: 'center',
  },
  personagem: {
    fontFamily: fontFamily.corpoSemi,
    color: onboardingBrand.tinta,
    fontSize: 13,
    textAlign: 'center',
    opacity: 0.7,
  },
  personagemLocked: {
    opacity: 0.4,
  },
  emBreve: {
    fontFamily: fontFamily.corpoSemi,
    color: 'rgba(42,51,80,0.4)',
    fontSize: 11,
    marginTop: 2,
  },
});
