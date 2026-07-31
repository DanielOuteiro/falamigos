import React, { useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated from 'react-native-reanimated';
import Svg, {
  Defs,
  Ellipse,
  LinearGradient,
  Path,
  Polygon,
  Stop,
} from 'react-native-svg';
import { colors } from '@/theme/colors';
import { useRise, useSway } from '@/lib/motion';

type Props = {
  /** 'fundo' = cena padrão do mapa/sessão; 'premio' = feixe dourado da recompensa. */
  variant?: 'fundo' | 'premio';
  bubbles?: number;
  children?: React.ReactNode;
};

function RisingBubble({ x, size, duration, delay }: { x: number; size: number; duration: number; delay: number }) {
  const style = useRise(duration, delay, 700);
  return (
    <Animated.View style={[styles.bubbleDot, { left: x, width: size, height: size, borderRadius: size / 2 }, style]} />
  );
}

function Weed({ x, color, delay }: { x: number; color: string; delay: number }) {
  const style = useSway(7000, 4, delay);
  return (
    <Animated.View style={[styles.weedWrap, { left: x }, style]} pointerEvents="none">
      <Svg width={64} height={110} viewBox="0 0 64 110">
        <Path
          d="M28,106 C16,74 30,58 20,26 C42,52 44,80 48,106 Z"
          fill={color}
        />
      </Svg>
    </Animated.View>
  );
}

export function OceanBackground({ variant = 'fundo', bubbles = 6, children }: Props) {
  const { width, height } = useWindowDimensions();

  const bubbleSeeds = useMemo(
    () =>
      Array.from({ length: bubbles }, (_, i) => ({
        x: 20 + ((i * 137) % (width - 40)),
        size: 4 + (i % 4) * 2,
        duration: 8000 + (i % 5) * 1200,
        delay: i * 900,
      })),
    [bubbles, width]
  );

  const rayColor = variant === 'premio' ? colors.estrela : colors.turquesaClaro;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="ceu" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={colors.fundoClaro} />
            <Stop offset="45%" stopColor={colors.fundo} />
            <Stop offset="100%" stopColor={colors.fundoProfundo} />
          </LinearGradient>
          <LinearGradient id="raio" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={rayColor} stopOpacity={variant === 'premio' ? 0.35 : 0.22} />
            <Stop offset="100%" stopColor={rayColor} stopOpacity={0} />
          </LinearGradient>
        </Defs>

        <Path d={`M0,0 H${width} V${height} H0 Z`} fill="url(#ceu)" />

        <Polygon
          points={`${width * 0.1},-40 ${width * 0.4},-40 ${width * 0.28},${height * 0.55} ${width * 0.06},${height * 0.55}`}
          fill="url(#raio)"
        />
        <Polygon
          points={`${width * 0.62},-40 ${width * 0.88},-40 ${width * 0.9},${height * 0.5} ${width * 0.66},${height * 0.5}`}
          fill="url(#raio)"
        />

        {/* corais de fundo, borrados visualmente pela opacidade em camadas */}
        <Ellipse cx={width * 0.12} cy={height * 0.78} rx={width * 0.22} ry={70} fill={colors.algaEscura} opacity={0.55} />
        <Ellipse cx={width * 0.88} cy={height * 0.72} rx={width * 0.26} ry={80} fill={colors.algaMedia} opacity={0.5} />
        <Ellipse cx={width * 0.5} cy={height * 0.5} rx={width * 0.3} ry={60} fill={colors.algaEscura} opacity={0.25} />

        {/* areia no rodapé */}
        <Path
          d={`M0,${height * 0.94} C${width * 0.25},${height * 0.9} ${width * 0.4},${height * 0.98} ${width * 0.62},${height * 0.93} C${width * 0.8},${height * 0.89} ${width * 0.9},${height * 0.96} ${width},${height * 0.92} L${width},${height} L0,${height} Z`}
          fill={colors.areia}
          opacity={0.95}
        />
      </Svg>

      <Weed x={width * 0.06} color={colors.coral} delay={0} />
      <Weed x={width * 0.82} color={colors.coralEscuro} delay={1200} />

      {bubbleSeeds.map((b, i) => (
        <RisingBubble key={i} x={b.x} size={b.size} duration={b.duration} delay={b.delay} />
      ))}

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  bubbleDot: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: 'rgba(207,246,251,0.45)',
  },
  weedWrap: {
    position: 'absolute',
    bottom: 0,
  },
});
