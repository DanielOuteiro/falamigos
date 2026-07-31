import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WordArt } from '@/components/WordArt';
import { SilabaRow } from '@/components/sessao/SilabaRow';
import { SpeechBubble } from '@/components/ui/SpeechBubble';
import { colors, fontFamily } from '@/theme/colors';
import { speakChico, speakSyllables } from '@/lib/voice';
import type { ChicoPose } from '@/components/ChicoSprite';
import wordsData from '@/data/words.json';

type Word = { id: string; palavra: string; emoji: string; silabas: string[]; alvo: number };
const AQUECIMENTO_WORDS = (wordsData as Word[]).slice(0, 5);

export function Aquecimento({
  onPoseChange,
  onCompleta,
}: {
  onPoseChange: (p: ChicoPose) => void;
  onCompleta: () => void;
}) {
  const [indice, setIndice] = useState(-1);
  const [falandoIndex, setFalandoIndex] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      onPoseChange('talking');
      await speakChico('ouvidos');
      onPoseChange('idle');
      setIndice(0);
    })();
  }, []);

  useEffect(() => {
    if (indice < 0) return;
    if (indice >= AQUECIMENTO_WORDS.length) {
      onCompleta();
      return;
    }
    (async () => {
      await new Promise((r) => setTimeout(r, 300));
      onPoseChange('talking');
      await speakSyllables(AQUECIMENTO_WORDS[indice].silabas, setFalandoIndex);
      onPoseChange('idle');
      await new Promise((r) => setTimeout(r, 700));
      setIndice((i) => i + 1);
    })();
  }, [indice]);

  const word = indice >= 0 && indice < AQUECIMENTO_WORDS.length ? AQUECIMENTO_WORDS[indice] : null;

  return (
    <View style={styles.wrap}>
      <SpeechBubble>Ouvidos mágicos: só escuta!</SpeechBubble>
      {word && (
        <>
          <WordArt wordId={word.id} size={110} />
          <Text style={styles.palavra}>{word.palavra}</Text>
          <SilabaRow silabas={word.silabas} alvo={word.alvo} falandoIndex={falandoIndex} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 20 },
  palavra: { fontFamily: fontFamily.titulo, color: colors.areia, fontSize: 24 },
});
