import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { colors, fontFamily } from '@/theme/colors';
import { useBob } from '@/lib/motion';

type Props = {
  children: React.ReactNode;
  align?: 'left' | 'right' | 'center';
};

/** Balão de fala orgânico do Chico. */
export function SpeechBubble({ children, align = 'center' }: Props) {
  const style = useBob(5500, 5, 0, 1);
  return (
    <Animated.View
      style={[
        styles.bubble,
        style,
        align === 'left' && { alignSelf: 'flex-start' },
        align === 'right' && { alignSelf: 'flex-end' },
        align === 'center' && { alignSelf: 'center' },
      ]}
    >
      <Text style={styles.text}>{children}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    backgroundColor: colors.areia,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 32,
    maxWidth: '82%',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  text: {
    fontFamily: fontFamily.titulo,
    color: colors.fundo,
    fontSize: 19,
    textAlign: 'center',
  },
});
