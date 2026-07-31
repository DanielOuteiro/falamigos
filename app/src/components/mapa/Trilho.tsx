import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient, Path, Polygon, Stop } from 'react-native-svg';
import { colors } from '@/theme/colors';
import { useBob, usePulse, useRingOut } from '@/lib/motion';
import type { NoTrilho } from './trilhoLayout';

function NoCompleto({ pos, delay }: { pos: NoTrilho; delay: number }) {
  const style = useBob(6500, 6, delay, 3);
  return (
    <Animated.View style={[styles.noBase, { left: pos.x - 32, top: pos.y - 32 }, style]}>
      <Svg width={64} height={64} viewBox="0 0 80 80">
        <Circle cx={40} cy={40} r={34} fill={colors.turquesa} />
        <Circle cx={40} cy={40} r={34} fill="none" stroke={colors.turquesaSuave} strokeWidth={3} />
        <Path
          d="M40,20 l6.4,13.4 14.6,2.1 -10.5,10.3 2.5,14.5 -13,-7 -13,7 2.5,-14.5 -10.5,-10.3 14.6,-2.1 Z"
          fill={colors.estrela}
          stroke={colors.estrelaEscura}
          strokeWidth={2}
        />
      </Svg>
    </Animated.View>
  );
}

function NoFuturo({ pos, delay, opacidade }: { pos: NoTrilho; delay: number; opacidade: number }) {
  const style = useBob(8000, 6, delay, 3);
  return (
    <Animated.View style={[styles.noBase, { left: pos.x - 30, top: pos.y - 30, opacity: opacidade }, style]}>
      <Svg width={60} height={60} viewBox="0 0 80 80">
        <Circle cx={40} cy={40} r={33} fill="#0a3d54" />
        <Circle cx={40} cy={40} r={33} fill="none" stroke={colors.turquesaClaro} strokeWidth={3} opacity={0.5} />
      </Svg>
    </Animated.View>
  );
}

export function NoHoje({ pos, onPress, size = 172 }: { pos: NoTrilho; onPress: () => void; size?: number }) {
  const pulse = usePulse(1900, 1, 1.07, 0);
  const ringA = useRingOut(2600, 0);
  const ringB = useRingOut(2600, 1300);
  const half = size / 2;

  return (
    <View style={[styles.noBase, { left: pos.x - half, top: pos.y - half, width: size, height: size }]}>
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: 0.15 }]} pointerEvents="none">
        <Svg width={size} height={size} viewBox="0 0 230 230">
          <Circle cx={115} cy={115} r={106} fill={colors.turquesaClaro} />
        </Svg>
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, ringA]} pointerEvents="none">
        <Svg width={size} height={size} viewBox="0 0 230 230">
          <Circle cx={115} cy={115} r={88} fill="none" stroke={colors.turquesaClaro} strokeWidth={6} />
        </Svg>
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, ringB]} pointerEvents="none">
        <Svg width={size} height={size} viewBox="0 0 230 230">
          <Circle cx={115} cy={115} r={88} fill="none" stroke={colors.estrela} strokeWidth={5} />
        </Svg>
      </Animated.View>

      <Pressable onPress={onPress} style={[StyleSheet.absoluteFill, styles.centro]}>
        <Animated.View style={pulse}>
          <Svg width={size * 0.87} height={size * 0.87} viewBox="0 0 150 150">
            <Circle cx={75} cy={75} r={70} fill={colors.turquesaClaro} />
            <Circle cx={75} cy={75} r={70} fill="none" stroke={colors.branco} strokeWidth={5} />
            <Circle cx={75} cy={78} r={55} fill={colors.turquesa} />
            <Path
              d="M75,36 l12.5,26 28.5,4.2 -20.5,20 4.8,28.3 -25.3,-13.5 -25.3,13.5 4.8,-28.3 -20.5,-20 28.5,-4.2 Z"
              fill={colors.estrela}
              stroke={colors.estrelaEscura}
              strokeWidth={3}
            />
          </Svg>
        </Animated.View>
      </Pressable>
    </View>
  );
}

export function CaminhoTrilho({ pontos, width, height }: { pontos: NoTrilho[]; width: number; height: number }) {
  const d = pontos.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
      <Defs>
        <LinearGradient id="trilhoGrad" x1="0" y1="1" x2="0" y2="0">
          <Stop offset="0%" stopColor={colors.turquesaClaro} stopOpacity={0.75} />
          <Stop offset="55%" stopColor={colors.turquesa} stopOpacity={0.4} />
          <Stop offset="100%" stopColor={colors.turquesa} stopOpacity={0.12} />
        </LinearGradient>
      </Defs>
      <Path d={d} fill="none" stroke="url(#trilhoGrad)" strokeWidth={7} strokeLinecap="round" strokeDasharray="2 20" />
    </Svg>
  );
}

export { NoCompleto, NoFuturo };

const styles = StyleSheet.create({
  noBase: { position: 'absolute' },
  centro: { alignItems: 'center', justifyContent: 'center' },
});
