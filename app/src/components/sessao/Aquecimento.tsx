import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WordArt } from '@/components/WordArt';
import { SilabaRow } from '@/components/sessao/SilabaRow';
import { fontFamily } from '@/theme/colors';
import { worldBrand } from '@/theme/worldBrand';
import type { Word } from '@/data/modelWords';
import { speakChico, speakModel } from '@/lib/voice';
import { pulseSilabasOnce } from '@/lib/silabaPulse';
import type { ChicoPose } from '@/components/ChicoSprite';

export function Aquecimento({
  words,
  onPoseChange,
  onCompleta,
  onProgressoPalavra,
}: {
  words: Word[];
  onPoseChange: (p: ChicoPose) => void;
  onCompleta: () => void;
  onProgressoPalavra?: (atual: number, total: number) => void;
}) {
  const [indice, setIndice] = useState(-1);
  const [falandoIndex, setFalandoIndex] = useState<number | null>(null);

  useEffect(() => {
    onProgressoPalavra?.(1, words.length);
    (async () => {
      onPoseChange('talking');
      await speakChico('ouvidos');
      onPoseChange('idle');
      setIndice(0);
    })();
  }, []);

  useEffect(() => {
    if (indice < 0) return;
    if (indice >= words.length) {
      onCompleta();
      return;
    }
    onProgressoPalavra?.(indice + 1, words.length);
    const word = words[indice];
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
      await new Promise((r) => setTimeout(r, 700));
      if (!cancelled) setIndice((i) => i + 1);
    })();
    return () => {
      cancelled = true;
      pulse?.cancel();
    };
  }, [indice]);

  const word = indice >= 0 && indice < words.length ? words[indice] : null;

  return (
    <View style={styles.wrap}>
      <View style={styles.bubble}>
        <Text style={styles.bubbleEyebrow}>Aquecimento</Text>
        <Text style={styles.bubbleText}>Ouvidos mágicos: só escuta!</Text>
      </View>

      {word ? (
        <>
          <View style={styles.wordCard}>
            <WordArt wordId={word.id} size={118} />
            <Text style={styles.palavra}>{word.palavra}</Text>
          </View>
          <SilabaRow silabas={word.silabas} alvo={word.alvo} falandoIndex={falandoIndex} />
        </>
      ) : null}
    </View>
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
