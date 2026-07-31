import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WordArt } from '@/components/WordArt';
import { SilabaRow } from '@/components/sessao/SilabaRow';
import { MicButton } from '@/components/MicButton';
import { SpeechBubble } from '@/components/ui/SpeechBubble';
import { colors, fontFamily } from '@/theme/colors';
import { speakSyllables } from '@/lib/voice';
import { storage } from '@/lib/storage';
import type { ChicoPose } from '@/components/ChicoSprite';
import wordsData from '@/data/words.json';

type Word = { id: string; palavra: string; emoji: string; silabas: string[]; alvo: number };
const PRODUCAO_WORDS = (wordsData as Word[]).slice(0, 8);

export function Producao({
  onPoseChange,
  onEstrela,
  onCompleta,
}: {
  onPoseChange: (p: ChicoPose) => void;
  onEstrela: () => void;
  onCompleta: () => void;
}) {
  const [indice, setIndice] = useState(0);
  const [falandoIndex, setFalandoIndex] = useState<number | null>(null);

  useEffect(() => {
    const word = PRODUCAO_WORDS[indice];
    if (!word) return;
    (async () => {
      await new Promise((r) => setTimeout(r, 250));
      onPoseChange('talking');
      await speakSyllables(word.silabas, setFalandoIndex);
      onPoseChange('idle');
    })();
  }, [indice]);

  async function onPalavraGravada(uri: string) {
    await storage.adicionarGravacao({
      id: `${PRODUCAO_WORDS[indice].id}_${Date.now()}`,
      wordId: PRODUCAO_WORDS[indice].id,
      palavra: PRODUCAO_WORDS[indice].palavra,
      uri,
      criadoEm: Date.now(),
    });
    onEstrela();
    if (indice + 1 >= PRODUCAO_WORDS.length) {
      onCompleta();
    } else {
      setIndice((i) => i + 1);
    }
  }

  const word = PRODUCAO_WORDS[indice];
  if (!word) return null;

  return (
    <View style={styles.wrap}>
      <SpeechBubble>Segura a pérola e fala!</SpeechBubble>
      <WordArt wordId={word.id} size={100} />
      <Text style={styles.palavra}>{word.palavra}</Text>
      <SilabaRow silabas={word.silabas} alvo={word.alvo} falandoIndex={falandoIndex} />
      <View style={styles.micZone}>
        <MicButton
          key={word.id}
          wordId={word.id}
          palavra={word.palavra}
          silabas={word.silabas}
          onSilabaFalando={setFalandoIndex}
          size={200}
          onPoseChange={onPoseChange}
          onCompleted={onPalavraGravada}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 16 },
  palavra: { fontFamily: fontFamily.titulo, color: colors.areia, fontSize: 22 },
  micZone: { marginTop: 8, minHeight: 260, alignItems: 'center', justifyContent: 'center' },
});
