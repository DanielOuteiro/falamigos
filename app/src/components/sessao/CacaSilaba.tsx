import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { WordArt } from '@/components/WordArt';
import { SilabaRow } from '@/components/sessao/SilabaRow';
import { SpeechBubble } from '@/components/ui/SpeechBubble';
import { BubbleButton } from '@/components/ui/BubbleButton';
import { colors, fontFamily } from '@/theme/colors';
import { speakChico, speakSlow, speakSyllables } from '@/lib/voice';
import { useShake } from '@/lib/motion';
import { hapticSucesso, hapticLeve } from '@/lib/haptics';
import type { ChicoPose } from '@/components/ChicoSprite';
import wordsData from '@/data/words.json';

type Word = { id: string; palavra: string; emoji: string; silabas: string[]; alvo: number };
const CACA_WORDS = (wordsData as Word[]).slice(3, 8);

export function CacaSilaba({
  onPoseChange,
  onEstrela,
  onCompleta,
}: {
  onPoseChange: (p: ChicoPose) => void;
  onEstrela: () => void;
  onCompleta: () => void;
}) {
  const [indice, setIndice] = useState(0);
  const [tremendoIndex, setTremendoIndex] = useState<number | null>(null);
  const [acertoIndex, setAcertoIndex] = useState<number | null>(null);
  const [falandoIndex, setFalandoIndex] = useState<number | null>(null);
  const [bloqueado, setBloqueado] = useState(false);
  const { style: tremorStyle, trigger: triggerTremor } = useShake();

  const word = CACA_WORDS[indice];

  useEffect(() => {
    if (!word) {
      onCompleta();
      return;
    }
    setAcertoIndex(null);
    setTremendoIndex(null);
    setBloqueado(false);
    (async () => {
      await new Promise((r) => setTimeout(r, 300));
      onPoseChange('talking');
      await speakSyllables(word.silabas, setFalandoIndex);
      onPoseChange('idle');
    })();
  }, [indice]);

  async function tocarSilaba(i: number) {
    if (bloqueado || !word) return;
    if (i === word.alvo) {
      setBloqueado(true);
      hapticSucesso();
      setAcertoIndex(i);
      onPoseChange('celebrating');
      await speakChico('isso');
      onEstrela();
      onPoseChange('idle');
      if (indice + 1 >= CACA_WORDS.length) {
        onCompleta();
      } else {
        setIndice((v) => v + 1);
      }
    } else {
      hapticLeve();
      setTremendoIndex(i);
      triggerTremor();
      setBloqueado(true);
      await new Promise((r) => setTimeout(r, 300));
      onPoseChange('talking');
      await speakSlow(word.silabas, setFalandoIndex);
      onPoseChange('idle');
      setTremendoIndex(null);
      setBloqueado(false);
    }
  }

  if (!word) return null;

  return (
    <View style={styles.wrap}>
      <SpeechBubble>Onde mora o som do CHIU?</SpeechBubble>
      <WordArt wordId={word.id} size={100} />
      <Text style={styles.palavra}>{word.palavra}</Text>
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
      <BubbleButton emoji="🔊" size={54} onPress={() => speakSyllables(word.silabas, setFalandoIndex)} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 18 },
  palavra: { fontFamily: fontFamily.titulo, color: colors.areia, fontSize: 22 },
});
