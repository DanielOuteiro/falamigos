import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import wordsData from '@/data/words.json';
import { useBob } from '@/lib/motion';

type Word = { id: string; palavra: string; emoji: string; silabas: string[]; alvo: number };
const words = wordsData as Word[];

/** Ilustrações próprias — se existir, substitui o emoji. */
const artPipeline: Record<string, number> = {
  chave: require('../../assets/palavras/chave.png'),
  peixe: require('../../assets/palavras/peixe.png'),
  bruxa: require('../../assets/palavras/bruxa.png'),
  cha: require('../../assets/palavras/cha.png'),
  cachorro: require('../../assets/palavras/cachorro.png'),
  chupeta: require('../../assets/palavras/chupeta.png'),
  chaleira: require('../../assets/palavras/chaleira.png'),
  guarda_chuva: require('../../assets/palavras/guarda_chuva.png'),
  bexiga: require('../../assets/palavras/bexiga.png'),
  abacaxi: require('../../assets/palavras/abacaxi.png'),
  mochila: require('../../assets/palavras/mochila.png'),
  machucado: require('../../assets/palavras/machucado.png'),
  enxada: require('../../assets/palavras/enxada.png'),
};

export function getWord(wordId: string): Word | undefined {
  return words.find((w) => w.id === wordId);
}

type Props = {
  wordId: string;
  size?: number;
  animated?: boolean;
};

export function WordArt({ wordId, size = 120, animated = true }: Props) {
  const word = getWord(wordId);
  const style = useBob(3800, 8, 0, 2);
  const art = artPipeline[wordId];

  const content = art ? (
    <View style={{ width: size, height: size }}>
      <Image source={art} style={styles.art} resizeMode="contain" accessibilityLabel={word?.palavra ?? wordId} />
    </View>
  ) : (
    <Text style={[styles.emoji, { fontSize: size, lineHeight: size * 1.15 }]}>{word?.emoji ?? '❓'}</Text>
  );

  if (!animated) return content;
  return <Animated.View style={style}>{content}</Animated.View>;
}

const styles = StyleSheet.create({
  emoji: {
    textAlign: 'center',
  },
  art: {
    width: '100%',
    height: '100%',
  },
});
