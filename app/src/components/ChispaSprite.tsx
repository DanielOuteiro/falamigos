import React from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';
import { colors } from '@/theme/colors';
import { useBob, useTwinkle } from '@/lib/motion';

/**
 * Chispa — a criatura que nasce do ovo. SVG próprio e fofo, no mesmo
 * espírito do Chico. Ponto de troca: substituir por arte ilustrada futura.
 */
export function ChispaSprite({ size = 150 }: { size?: number }) {
  const bob = useBob(3600, 8, 0, 3);
  const twinkleA = useTwinkle(2000, 0);
  const twinkleB = useTwinkle(2400, 500);

  return (
    <Animated.View style={[{ width: size, height: size }, bob]}>
      <Svg width={size} height={size} viewBox="0 0 150 150">
        <Ellipse cx={75} cy={84} rx={58} ry={62} fill={colors.turquesaClaro} />
        <Ellipse cx={75} cy={78} rx={50} ry={54} fill={colors.turquesa} />
        <Ellipse cx={54} cy={56} rx={16} ry={22} fill="#FFFFFF" opacity={0.35} rotation={-15} originX={54} originY={56} />
        <Circle cx={54} cy={90} r={9} fill={colors.coral} opacity={0.85} />
        <Circle cx={96} cy={100} r={7} fill={colors.estrela} opacity={0.85} />
        <Circle cx={62} cy={72} r={11} fill="#FFFFFF" stroke={colors.fundo} strokeWidth={3} />
        <Circle cx={92} cy={72} r={11} fill="#FFFFFF" stroke={colors.fundo} strokeWidth={3} />
        <Circle cx={64} cy={75} r={5} fill={colors.fundo} />
        <Circle cx={94} cy={75} r={5} fill={colors.fundo} />
        <Path d="M64,98 C70,106 80,106 86,98 C80,102 70,102 64,98 Z" fill={colors.fundo} opacity={0.8} />
      </Svg>
      <Animated.View style={[{ position: 'absolute', top: -6, left: 6 }, twinkleA]}>
        <Svg width={20} height={20} viewBox="0 0 20 20">
          <Path d="M10,0 l3,7 7,3 -7,3 -3,7 -3,-7 -7,-3 7,-3 Z" fill={colors.estrela} />
        </Svg>
      </Animated.View>
      <Animated.View style={[{ position: 'absolute', top: 10, right: -4 }, twinkleB]}>
        <Svg width={16} height={16} viewBox="0 0 20 20">
          <Path d="M10,0 l3,7 7,3 -7,3 -3,7 -3,-7 -7,-3 7,-3 Z" fill={colors.branco} />
        </Svg>
      </Animated.View>
    </Animated.View>
  );
}
