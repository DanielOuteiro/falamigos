import React from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import wordsData from '@/data/words.json';
import { useBob } from '@/lib/motion';

type Word = { id: string; palavra: string; emoji: string; silabas: string[]; alvo: number };
const words = wordsData as Word[];

export function getWord(wordId: string): Word | undefined {
  return words.find((w) => w.id === wordId);
}

type Props = {
  wordId: string;
  size?: number;
  animated?: boolean;
};

/**
 * PONTO DE TROCA: hoje devolve o emoji gigante da palavra. Amanhã, quando
 * houver ilustração própria, troque o <Text>{emoji}</Text> por
 * <Image source={artPipeline[wordId]} /> sem mexer em nenhum ecrã que usa
 * WordArt.
 */
export function WordArt({ wordId, size = 120, animated = true }: Props) {
  const word = getWord(wordId);
  const style = useBob(3800, 8, 0, 2);
  const content = <Text style={[styles.emoji, { fontSize: size, lineHeight: size * 1.15 }]}>{word?.emoji ?? '❓'}</Text>;
  if (!animated) return content;
  return <Animated.View style={style}>{content}</Animated.View>;
}

const styles = StyleSheet.create({
  emoji: {
    textAlign: 'center',
  },
});
