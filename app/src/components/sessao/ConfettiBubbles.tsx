import React, { useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated from 'react-native-reanimated';
import { colors } from '@/theme/colors';
import { useRise } from '@/lib/motion';

const CORES = [colors.turquesaClaro, colors.estrela, colors.coral, colors.areia, colors.branco];

function Confete({ x, size, cor, duration, delay }: { x: number; size: number; cor: string; duration: number; delay: number }) {
  const style = useRise(duration, delay, 620);
  return (
    <Animated.View
      style={[styles.dot, { left: x, width: size, height: size, borderRadius: size / 2, backgroundColor: cor }, style]}
    />
  );
}

export function ConfettiBubbles({ count = 14 }: { count?: number }) {
  const { width } = useWindowDimensions();
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: 10 + ((i * 173) % (width - 30)),
        size: 6 + (i % 4) * 3,
        cor: CORES[i % CORES.length],
        duration: 2200 + (i % 5) * 500,
        delay: (i % 7) * 220,
      })),
    [count, width]
  );

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {items.map((c, i) => (
        <Confete key={i} {...c} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  dot: { position: 'absolute', bottom: 60, opacity: 0.85 },
});
