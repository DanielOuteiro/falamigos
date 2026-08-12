import React, { useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, { useSharedValue } from 'react-native-reanimated';
import Svg, { Defs, Ellipse, LinearGradient, Path, Stop } from 'react-native-svg';
import { useGlow, useBob } from '@/lib/motion';
import { DeviceTilt, useParallaxStyle } from '@/lib/parallax';

/**
 * Espaço liminar — antes do mundo escolhido.
 * Atmosfera de marca (névoa clara + estrelas), sem fundo do mar.
 */
function Twinkle({
  x,
  y,
  size,
  color,
  delay,
}: {
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
}) {
  const glow = useGlow(2800 + delay * 0.2, delay);
  const bob = useBob(5000 + delay, 3, delay, 0);

  return (
    <Animated.View
      style={[styles.twinkle, { left: x, top: y, width: size, height: size }, glow, bob]}
      pointerEvents="none"
    >
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path
          d="M12 1.5 L13.8 9.2 L21.5 11 L13.8 12.8 L12 20.5 L10.2 12.8 L2.5 11 L10.2 9.2 Z"
          fill={color}
        />
      </Svg>
    </Animated.View>
  );
}

type Props = {
  tilt?: DeviceTilt;
};

export function ThresholdBackground({ tilt }: Props) {
  const { width, height } = useWindowDimensions();
  const fallbackX = useSharedValue(0);
  const fallbackY = useSharedValue(0);
  const effective = tilt ?? { x: fallbackX, y: fallbackY };

  // Camada longe: move ao contrário do Pico → profundidade.
  const farStyle = useParallaxStyle(effective, { px: -28, py: -20 });

  const stars = useMemo(
    () => [
      { x: width * 0.06, y: height * 0.1, size: 16, color: '#FFD166', delay: 0 },
      { x: width * 0.9, y: height * 0.12, size: 13, color: '#9B6BFF', delay: 400 },
      { x: width * 0.92, y: height * 0.55, size: 12, color: '#6ED3C0', delay: 900 },
      { x: width * 0.04, y: height * 0.52, size: 11, color: '#FF7A59', delay: 1300 },
      { x: width * 0.78, y: height * 0.78, size: 15, color: '#FFD166', delay: 700 },
      { x: width * 0.14, y: height * 0.82, size: 10, color: '#9B6BFF', delay: 1100 },
    ],
    [width, height]
  );

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="thresholdSky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#FFFFFF" />
            <Stop offset="62%" stopColor="#FFFFFF" />
            <Stop offset="100%" stopColor="#F5F0FF" />
          </LinearGradient>
        </Defs>
        <Path d={`M0,0 H${width} V${height} H0 Z`} fill="url(#thresholdSky)" />
      </Svg>

      <Animated.View style={[StyleSheet.absoluteFill, farStyle]}>
        <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
          <Ellipse cx={width * 0.5} cy={height * 0.95} rx={width * 0.75} ry={height * 0.2} fill="#EDE4FF" opacity={0.55} />
          <Ellipse cx={width * 0.1} cy={height * 0.88} rx={width * 0.35} ry={height * 0.12} fill="#DFF7F2" opacity={0.4} />
          <Ellipse cx={width * 0.92} cy={height * 0.86} rx={width * 0.32} ry={height * 0.12} fill="#FFE4DA" opacity={0.35} />
        </Svg>
        {stars.map((s, i) => (
          <Twinkle key={i} {...s} />
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  twinkle: { position: 'absolute' },
});
