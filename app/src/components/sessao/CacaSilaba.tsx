import React, { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { WordArt } from '@/components/WordArt';
import { SilabaRow } from '@/components/sessao/SilabaRow';
import { fontFamily } from '@/theme/colors';
import { worldBrand } from '@/theme/worldBrand';
import { speakChico, speakModel } from '@/lib/voice';
import { pulseSilabasOnce } from '@/lib/silabaPulse';
import { useShake } from '@/lib/motion';
import { hapticSucesso, hapticLeve } from '@/lib/haptics';
import type { ChicoPose } from '@/components/ChicoSprite';
import type { Word } from '@/data/modelWords';

const repeatAudioSource = require('../../../assets/ui/btn-repetir-audio.png');
const REPEAT_BTN = 72;

export function CacaSilaba({
  words,
  onPoseChange,
  onEstrela,
  onCompleta,
  onProgressoPalavra,
  onErro,
}: {
  words: Word[];
  onPoseChange: (p: ChicoPose) => void;
  onEstrela: () => void;
  onCompleta: () => void;
  onProgressoPalavra?: (atual: number, total: number) => void;
  onErro?: (wordId: string) => void;
}) {
  const [indice, setIndice] = useState(0);
  const [tremendoIndex, setTremendoIndex] = useState<number | null>(null);
  const [acertoIndex, setAcertoIndex] = useState<number | null>(null);
  const [falandoIndex, setFalandoIndex] = useState<number | null>(null);
  const [bloqueado, setBloqueado] = useState(false);
  const { style: tremorStyle, trigger: triggerTremor } = useShake();

  const word = words[indice];

  /**
   * Palavra de 1 sílaba (ex.: "chá") não dá pra "caçar" — não há onde mais
   * o som poderia morar. Em vez de deixar a criança sem saber o que tocar,
   * conta como achado automaticamente (com a mesma festa de acerto).
   */
  async function avancarComoAcerto(i: number) {
    setBloqueado(true);
    hapticSucesso();
    setAcertoIndex(i);
    onPoseChange('celebrating');
    await speakChico('isso');
    onEstrela();
    onPoseChange('idle');
    if (indice + 1 >= words.length) {
      onCompleta();
    } else {
      setIndice((v) => v + 1);
    }
  }

  useEffect(() => {
    if (!word) {
      onCompleta();
      return;
    }
    onProgressoPalavra?.(indice + 1, words.length);
    setAcertoIndex(null);
    setTremendoIndex(null);
    setBloqueado(false);
    let cancelled = false;
    let pulse: { cancel: () => void } | null = null;
    (async () => {
      await new Promise((r) => setTimeout(r, 300));
      if (cancelled) return;
      onPoseChange('talking');
      pulse = pulseSilabasOnce(word.silabas.length, setFalandoIndex);
      await speakModel(word.palavra);
      pulse.cancel();
      if (cancelled) return;
      onPoseChange('idle');
      if (word.silabas.length <= 1) {
        await new Promise((r) => setTimeout(r, 400));
        if (!cancelled) await avancarComoAcerto(0);
      }
    })();
    return () => {
      cancelled = true;
      pulse?.cancel();
    };
  }, [indice]);

  async function tocarSilaba(i: number) {
    if (bloqueado || !word) return;
    if (i === word.alvo) {
      await avancarComoAcerto(i);
    } else {
      hapticLeve();
      onErro?.(word.id);
      setTremendoIndex(i);
      triggerTremor();
      setBloqueado(true);
      await new Promise((r) => setTimeout(r, 300));
      onPoseChange('talking');
      const pulse = pulseSilabasOnce(word.silabas.length, setFalandoIndex, 520);
      await speakModel(word.palavra);
      pulse.cancel();
      onPoseChange('idle');
      setTremendoIndex(null);
      setBloqueado(false);
    }
  }

  if (!word) return null;

  return (
    <View style={styles.wrap}>
      <View style={styles.bubble}>
        <Text style={styles.bubbleEyebrow}>Caça-sílaba</Text>
        <Text style={styles.bubbleText}>Onde mora o som do CHIU?</Text>
      </View>

      <View style={styles.wordCard}>
        <WordArt wordId={word.id} size={118} />
        <Text style={styles.palavra}>{word.palavra}</Text>
      </View>

      <SilabaRow
        silabas={word.silabas}
        alvo={word.alvo}
        mostrarAlvo={false}
        onPressSilaba={tocarSilaba}
        tremendoIndex={tremendoIndex}
        tremorStyle={tremorStyle}
        acertoIndex={acertoIndex}
        falandoIndex={falandoIndex}
      />

      <RepeatAudioButton
        onPress={() => {
          const pulse = pulseSilabasOnce(word.silabas.length, setFalandoIndex);
          void speakModel(word.palavra).finally(() => pulse.cancel());
        }}
      />
    </View>
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
    gap: 28,
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
  wordCard: {
    alignItems: 'center',
    gap: 6,
    backgroundColor: worldBrand.balão,
    borderRadius: 28,
    paddingHorizontal: 28,
    paddingVertical: 16,
    minWidth: 230,
    shadowColor: worldBrand.balãoSombra,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  palavra: {
    fontFamily: fontFamily.titulo,
    color: worldBrand.tinta,
    fontSize: 30,
  },
});
