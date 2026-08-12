import React, { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { WordArt, getWord } from '@/components/WordArt';
import { fontFamily } from '@/theme/colors';
import { worldBrand } from '@/theme/worldBrand';
import { speakChico, speakModel } from '@/lib/voice';
import { useGlow, useShake } from '@/lib/motion';
import { hapticSucesso, hapticLeve } from '@/lib/haptics';
import type { ParQualEQual } from '@/data/qualEQualPares';
import type { ChicoPose } from '@/components/ChicoSprite';

const repeatAudioSource = require('../../../assets/ui/btn-repetir-audio.png');
const REPEAT_BTN = 64;

type Opcao = { wordId: string; certa: boolean };

function embaralharOpcoes(certaId: string, erradaId: string): Opcao[] {
  const opcoes: Opcao[] = [
    { wordId: certaId, certa: true },
    { wordId: erradaId, certa: false },
  ];
  return Math.random() < 0.5 ? opcoes : [opcoes[1], opcoes[0]];
}

export function QualEQual({
  pares,
  onPoseChange,
  onEstrela,
  onCompleta,
  onProgressoPalavra,
  onErro,
}: {
  pares: ParQualEQual[];
  onPoseChange: (p: ChicoPose) => void;
  onEstrela: () => void;
  onCompleta: () => void;
  onProgressoPalavra?: (atual: number, total: number) => void;
  onErro?: (wordId: string) => void;
}) {
  const [indice, setIndice] = useState(0);
  const [opcoes, setOpcoes] = useState<Opcao[]>([]);
  const [tremendoSlot, setTremendoSlot] = useState<0 | 1 | null>(null);
  const [acertoSlot, setAcertoSlot] = useState<0 | 1 | null>(null);
  const [bloqueado, setBloqueado] = useState(false);

  const shakeA = useShake();
  const shakeB = useShake();
  const shakes = [shakeA, shakeB];

  const par = pares[indice];
  const alvo = useMemo(() => (par ? getWord(par.certaId) : undefined), [par]);

  useEffect(() => {
    if (!par) {
      onCompleta();
      return;
    }
    onProgressoPalavra?.(indice + 1, pares.length);
    setOpcoes(embaralharOpcoes(par.certaId, par.erradaId));
    setAcertoSlot(null);
    setTremendoSlot(null);
    setBloqueado(false);
    let cancelled = false;
    (async () => {
      await new Promise((r) => setTimeout(r, 300));
      if (cancelled || !alvo) return;
      onPoseChange('talking');
      await speakModel(alvo.palavra);
      if (!cancelled) onPoseChange('idle');
    })();
    return () => {
      cancelled = true;
    };
  }, [indice]);

  async function repetirAudio() {
    if (!alvo) return;
    onPoseChange('talking');
    await speakModel(alvo.palavra);
    onPoseChange('idle');
  }

  async function tocarOpcao(slot: 0 | 1) {
    if (bloqueado || !opcoes[slot]) return;
    const opcao = opcoes[slot];
    if (opcao.certa) {
      setBloqueado(true);
      hapticSucesso();
      setAcertoSlot(slot);
      onPoseChange('celebrating');
      await speakChico('isso');
      onEstrela();
      onPoseChange('idle');
      await new Promise((r) => setTimeout(r, 450));
      if (indice + 1 >= pares.length) {
        onCompleta();
      } else {
        setIndice((v) => v + 1);
      }
    } else {
      hapticLeve();
      onErro?.(par.certaId);
      setTremendoSlot(slot);
      shakes[slot].trigger();
      setBloqueado(true);
      await new Promise((r) => setTimeout(r, 300));
      await repetirAudio();
      setTremendoSlot(null);
      setBloqueado(false);
    }
  }

  if (!par || !alvo) return null;

  return (
    <View style={styles.wrap}>
      <View style={styles.bubble}>
        <Text style={styles.bubbleEyebrow}>Qual é qual?</Text>
        <Text style={styles.bubbleText}>Toca na imagem certa!</Text>
      </View>

      <View style={styles.opcoesRow}>
        {opcoes.map((opcao, slot) => (
          <OpcaoCard
            key={`${par.id}_${slot}`}
            wordId={opcao.wordId}
            onPress={() => tocarOpcao(slot as 0 | 1)}
            tremendo={tremendoSlot === slot}
            tremorStyle={shakes[slot].style}
            acerto={acertoSlot === slot}
          />
        ))}
      </View>

      <RepeatAudioButton onPress={repetirAudio} />
    </View>
  );
}

function OpcaoCard({
  wordId,
  onPress,
  tremendo,
  tremorStyle,
  acerto,
}: {
  wordId: string;
  onPress: () => void;
  tremendo?: boolean;
  tremorStyle?: any;
  acerto?: boolean;
}) {
  const glow = useGlow(1600, 0);
  const scale = useSharedValue(1);
  const pressStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={tremendo ? tremorStyle : undefined}>
      <Pressable
        accessibilityRole="button"
        onPressIn={() => {
          scale.value = withSpring(0.94, { damping: 14 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 10 });
        }}
        onPress={onPress}
      >
        <Animated.View style={[styles.opcaoCard, acerto && styles.opcaoCardAcerto, pressStyle]}>
          {acerto && (
            <Animated.View style={[styles.opcaoGlow, glow]} pointerEvents="none" />
          )}
          <WordArt wordId={wordId} size={100} />
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

function RepeatAudioButton({ onPress }: { onPress: () => void }) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Ouvir de novo"
      hitSlop={8}
      onPressIn={() => {
        scale.value = withSpring(0.9, { damping: 12 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 10 });
      }}
      onPress={() => {
        hapticLeve();
        onPress();
      }}
    >
      <Animated.View style={style}>
        <Image
          source={repeatAudioSource}
          style={{ width: REPEAT_BTN, height: REPEAT_BTN }}
          resizeMode="contain"
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    gap: 30,
    paddingTop: 8,
  },
  bubble: {
    backgroundColor: worldBrand.balão,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 28,
    maxWidth: '94%',
    alignItems: 'center',
    gap: 4,
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
    fontSize: 18,
    textAlign: 'center',
  },
  bubbleText: {
    fontFamily: fontFamily.titulo,
    color: worldBrand.tinta,
    fontSize: 24,
    textAlign: 'center',
    lineHeight: 30,
  },
  opcoesRow: {
    flexDirection: 'row',
    gap: 22,
    justifyContent: 'center',
  },
  opcaoCard: {
    width: 140,
    height: 140,
    borderRadius: 28,
    backgroundColor: worldBrand.balão,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: worldBrand.balãoSombra,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  opcaoCardAcerto: {
    backgroundColor: '#FFF6DF',
  },
  opcaoGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 28,
    backgroundColor: '#FFD166',
    opacity: 0.35,
  },
});
